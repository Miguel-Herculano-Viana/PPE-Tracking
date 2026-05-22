<template>
    <header class="Utility_bar">
        <form @submit.prevent class="Search">
            <label for="SearchUser">search: </label>
            <input v-model="pesquisa" type="text" id="SearchUser" class="search-input" placeholder="Type to search user...">
        </form>
        <span class="separator">|</span>
        <button class="button" @click="iniciarCriacaoInline">create new</button>
    </header>

    <section v-if="criandoNovo" class="insertion-box">
        <div class="insertion-grid">
            <div class="input-cell">
                <label>User Name:</label>
                <input v-model="form.nome_usuario" type="text" placeholder="Insert user name" required>
            </div>
            <div class="input-cell">
                <label>Register Number:</label>
                <input v-model="form.numero_registro_usuario" type="number" placeholder="Insert register number" required>
            </div>
            <div class="input-cell">
                <label>Function:</label>
                <select v-model="form.funcao" required>
                    <option value="" disabled selected>Select function...</option>
                    <option value="Employee">Employee</option>
                    <option value="Student">Student</option>
                    <option value="Visitor">Visitor</option>
                    <option value="ADM">ADM</option>
                    <option value="MOD">MOD</option>
                    <option value="ALMOX">ALMOX</option>
                </select>
            </div>
            <div class="action-cell">
                <button @click="salvar" class="btn-save">Save New User</button>
                <button @click="cancelarEdicao" class="btn-cancel">Cancel</button>
            </div>
        </div>
    </section>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 35%;">Name</th>
                    <th style="width: 25%;">Register Number</th>
                    <th style="width: 25%;">Function</th>
                    <th style="width: 15%;"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="u in usuariosFiltrados" :key="u.id_usuarios">
                    
                    <template v-if="editandoID === u.id_usuarios">
                        <td><input v-model="form.nome_usuario" type="text" class="table-input"></td>
                        <td><input v-model="form.numero_registro_usuario" type="number" class="table-input"></td>
                        <td>
                            <select v-model="form.funcao" class="table-select">
                                <option value="Employee">Employee</option>
                                <option value="Student">Student</option>
                                <option value="Visitor">Visitor</option>
                                <option value="ADM">ADM</option>
                                <option value="MOD">MOD</option>
                                <option value="ALMOX">ALMOX</option>
                            </select>
                        </td>
                        <td class="action-buttons-cell">
                            <button @click="salvar" class="btn-table-action edit-text">Save</button>
                            <div class="button-divider"></div>
                            <button @click="cancelarEdicao" class="btn-table-action delete-text">Cancel</button>
                        </td>
                    </template>

                    <template v-else>
                        <td>{{ u.nome_usuario }}</td>
                        <td>{{ u.numero_registro_usuario }}</td>
                        <td>{{ u.funcao }}</td>
                        <td class="action-buttons-cell">
                            <button @click="prepararEdicao(u)" class="btn-table-action edit-text">Edit</button>
                            <div class="button-divider"></div>
                            <button @click="excluir(u.id_usuarios)" class="btn-table-action delete-text">Delete</button>
                        </td>
                    </template>

                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const usuarios = ref([]);
const editandoID = ref(null);
const criandoNovo = ref(false);
const pesquisa = ref('');

const form = reactive({
    nome_usuario: '',
    numero_registro_usuario: '',
    funcao: ''
});

const carregar = async () => {
    const { data, error } = await supabase.from('usuarios').select('*').order('nome_usuario');
    if (error) {
        console.error('Error to load users:', error.message);
    } else {
        usuarios.value = data || [];
    }
};

const iniciarCriacaoInline = () => {
    cancelarEdicao();
    criandoNovo.value = true;
};

const salvar = async () => {
    if (!form.nome_usuario || !form.numero_registro_usuario || !form.funcao) {
        alert("Please fill all fields before saving.");
        return;
    }

    const dadosUsuario = {
        nome_usuario: form.nome_usuario,
        numero_registro_usuario: parseInt(form.numero_registro_usuario),
        funcao: form.funcao
    };

    if (editandoID.value) {
        const { error } = await supabase
            .from('usuarios')
            .update(dadosUsuario)
            .eq('id_usuarios', editandoID.value);
            
        if (error) console.error('Error updating user:', error.message);
    } else if (criandoNovo.value) {
        const { error } = await supabase
            .from('usuarios')
            .insert([dadosUsuario]);
            
        if (error) console.error('Error inserting user:', error.message);
    }

    cancelarEdicao();
    carregar();
};

const prepararEdicao = (u) => {
    criandoNovo.value = false;
    editandoID.value = u.id_usuarios;
    
    Object.assign(form, {
        nome_usuario: u.nome_usuario,
        numero_registro_usuario: u.numero_registro_usuario,
        funcao: u.funcao
    });
};

const excluir = async (id_enviado) => {
    if (confirm('Are you sure you want to delete this user?')) {
        await supabase.from('usuarios').delete().eq('id_usuarios', id_enviado);
        carregar();
    }
};

const cancelarEdicao = () => {
    editandoID.value = null;
    criandoNovo.value = false;
    Object.assign(form, { nome_usuario: '', numero_registro_usuario: '', funcao: '' });
};

const usuariosFiltrados = computed(() => {
    if (!pesquisa.value.trim()) return usuarios.value;
    const termo = pesquisa.value.toLowerCase().trim();
    
    return usuarios.value.filter(usuario => {
        const nome = usuario.nome_usuario ? usuario.nome_usuario.toLowerCase() : '';
        const registro = usuario.numero_registro_usuario ? usuario.numero_registro_usuario.toString() : '';
        return nome.includes(termo) || registro.includes(termo);
    });
});

onMounted(carregar);
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
}

.Utility_bar {
    display: flex;
    align-items: center;
    background-color: #8B8B8B;
    height: 45px;
    padding: 0 15px;
    border: 1px solid #000000;
    color: #000000;
    width: 100%;
}

.Search {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
}

.search-input {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #7a7a7a;
    padding: 2px 5px;
    height: 25px;
    width: 180px;
}

.separator {
    margin: 0 12px;
    color: #000000;
    font-size: 18px;
}

.button {
    background-color: #DBDBDB;
    color: #000000;
    border: 1px solid #000000;
    padding: 2px 10px;
    height: 25px;
    cursor: pointer;
    font-size: 13px;
}

.insertion-box {
    background-color: #f9f9f9;
    border: 1px solid #000000;
    padding: 15px;
    margin-top: 10px;
    width: 100%;
}

.insertion-grid {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    flex-wrap: wrap;
}

.input-cell {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.input-cell label {
    font-size: 12px;
    font-weight: bold;
    color: #333;
}

.input-cell input, .input-cell select {
    padding: 5px;
    border: 1px solid #000;
    height: 30px;
    min-width: 180px;
}

.btn-save {
    background-color: #4CAF50;
    color: white;
    border: 1px solid #000;
    padding: 5px 15px;
    height: 30px;
    cursor: pointer;
}

.btn-cancel {
    background-color: #f44336;
    color: white;
    border: 1px solid #000;
    padding: 5px 15px;
    height: 30px;
    cursor: pointer;
    margin-left: 5px;
}

.card-table {
    margin-top: 10px;
    width: 100%;
}

/* Evita a lacuna/borda dupla entre o formulário aberto e o cabeçalho */
.insertion-box + .card-table {
    margin-top: 0px;
}

.insertion-box + .card-table .styled-table {
    border-top: none;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #000000;
    table-layout: fixed;
}

.styled-table th {
    background-color: #A6A6A6;
    color: #000000;
    font-weight: normal;
    font-size: 14px;
    height: 45px;
    padding: 0 10px;
    border: 1px solid #000000;
    text-align: center;
    vertical-align: middle;
}

.styled-table td {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #000000;
    font-size: 14px;
    height: 45px;
    padding: 0 10px;
    text-align: center;      /* Centralização horizontal perfeita */
    vertical-align: middle;  /* Centralização vertical perfeita */
    overflow: hidden;
}

.action-buttons-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    height: 43px; 
    width: 100%;
}

.btn-table-action {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-text {
    color: #000000;
}

.delete-text {
    color: #FF0000;
}

.button-divider {
    width: 1px;
    height: 100%;
    background-color: #000000;
}

.table-input, .table-select {
    width: 100%;
    height: 31px;
    padding: 2px 5px;
    border: 1px solid #a6a6a6;
    font-size: 13px;
    display: block;
    text-align: center;
}
</style>