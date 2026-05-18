<template>
    <header class="Utility_bar">
        <form action="" method="get" class="Search">
                <label for="Name">Search: </label>
                <input type="text" class="input">
        </form>
        <button class="button">Create New</button>
    </header>
    <section class="Label_Bar">
        <form @submit.prevent class="form_label">
            <div class="form-group">
                <input v-model="form.nome_usuario" type="text" id="nome" placeholder="Insert the name" required>
            </div>
            <div class="form-group">
                <input v-model="form.numero_registro_usuario" type="number" id="NRU" placeholder="Insert the Negister Number">
            </div>
            <div class="form-group">
                <input v-model="form.funcao" type="checkbox" id="Employee"><label for="Employee">Employee</label>
                <input v-model="form.funcao" type="checkbox" id="Student"><label for="Student">Student</label>
                <input v-model="form.funcao" type="checkbox" id="Visitor"><label for="Visitor">Visitor</label>
            </div>
            <div class="form-group">
                <input v-model="form.funcao" type="checkbox" id="ADM"><label for="ADM">ADM</label>
                <input v-model="form.funcao" type="checkbox" id="MOD"><label for="MOD">MOD</label>
                <input v-model="form.funcao" type="checkbox" id="ALMOX"><label for="ALMOX">ALMOX</label>
            </div>
            <div class="action-bar">
                <button type="submit" class="btn-primary">
                    {{ editandoID ? 'Update Info' : 'End Register' }}
                </button>
                <button v-if="editandoID" type="button" @click="cancelarEdicao" class="btn-outline">
                    Cancel
                </button>
            </div>
        </form>
        <h3>ID</h3>
        <h3>Name</h3>
        <h3>Register Number</h3>
        <h3>Function</h3>
    </section>
    <section class="card-table">
        <table class="styled-table">
            <tbody>
                <tr v-for="f in usuarios":key=f.id_Usuario>
                    <td><span class="text-bold">{{ f.nome }}</span></td>
                    <td>{{ f.numero_registro_usuario }}</td>
                    <td class="badge">{{ f.function }}</td>
                    <td class="text-center">
                        <button @click="prepararEdicao(f)" class="btn-action edit">Edit</button>
                        <button @click="excluir(f.id)" class="btn-action delete">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabase} from '../composables/useSupabase';
const { supabase } = useSupabase();

const usuarios = ref([]);
const editandoID = ref(null);
const form = reactive({
    nome: '',
    numero_registro_usuario: '',
    funcao: ''
});

const carregar = async () => {
    const { data, error } = await supabase.from('usuarios').select('*').order('nome');
    if (error) {
        console.error('Error to load:', error.message);
    } else {
        funcionarios.value = data || []
    }
};

const prepararEdicao = (f) => {
    editandoID.value = f.id;
    Object.assign(form, {
        nome: f.nome,
        numero_registro_usuario: f.numero_registro_usuario,
        funcao: f.funcao
    })
};

const excluir = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
        await supabase.from('usuarios').delete().eq('id', id);
        carregar();
    }
};

const cancelarEdicao = () => {
    editandoID.value = null;
    Object.assign(form, { nome: '', matricula: '', funcao: '' });
};

onMounted(carregar);

</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.Utility_bar {
    display: flex;
    background-color: #8B8B8B;
    height: 5vh;
    padding: 1%;
    outline-color: #000000;
    outline-width: 1px;
    outline-style: solid;
    color: #000000;
}
.Label_Bar {
    display: flex;
    background-color: #8B8B8B;
    outline-color: #000000;
    outline-width: 1px;
    outline-style: solid;
    justify-content: space-between;
    padding-left: 2%;
    padding-right: 10%;
    color: #000000;
}
.input {
    background-color: #ffffff;
    color:#000000;
}
.button {
    margin-left: 1%;
    width: 80px;
    height: 25px;
    background-color: #DBDBDB;
    color: #000000;
    outline-color: #B7B3B3;
    outline-width: 1px;
    outline-style: solid;
}
</style>