<template>
    <header class="Utility_bar">
        <div class="Search">
            <label for="SearchBorrow">search: </label>
            <input v-model="pesquisa" type="text" id="SearchBorrow" class="search-input" placeholder="Search my requests...">
        </div>
        <span class="separator">|</span>
        <button class="button" @click="criandoNovo = !criandoNovo">
            {{ criandoNovo ? 'hide form' : 'create new request' }}
        </button>
    </header>

    <section v-if="criandoNovo" class="insertion-box">
        <form @submit.prevent="salvarRequisicao" class="insertion-grid">
            
            <div class="input-cell cell-large">
                <label>Target User:</label>
                <select v-model="form.id_usuario" required>
                    <option value="" disabled selected>Select the user...</option>
                    <option v-for="u in listaUsuarios" :key="u.id_usuarios" :value="u.id_usuarios">
                        {{ u.nome_usuario }} ({{ u.funcao }})
                    </option>
                </select>
            </div>

            <div class="input-cell cell-large">
                <label>Select PPE:</label>
                <select v-model="form.id_epi" required>
                    <option value="" disabled selected>Select the PPE...</option>
                    <option v-for="e in listaEpis" :key="e.id_epi" :value="e.id_epi" :disabled="!e.epi_disponivel">
                        {{ e.nome_epi }} {{ !e.epi_disponivel ? '(Out of Stock)' : '' }}
                    </option>
                </select>
            </div>

            <div class="input-cell cell-small">
                <label>Quantity:</label>
                <input v-model="form.quantidade_solicitada" type="number" min="1" required placeholder="0">
            </div>

            <div class="input-cell cell-medium">
                <label>Release Date:</label>
                <input v-model="form.data_solicitacao" type="datetime-local" readonly class="input-readonly">
            </div>

            <div class="action-cell">
                <button type="submit" class="btn-save">Submit Request</button>
                <button type="button" @click="fecharCriacao" class="btn-cancel">Cancel</button>
            </div>
        </form>
    </section>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Date / Time</th>
                    <th style="width: 30%;">User (Requester)</th>
                    <th style="width: 25%;">PPE Equipment</th>
                    <th style="width: 20%;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="req in requisicoesFiltradas" :key="req.id_solicitacao">
                    <td>{{ formatarData(req.data_solicitacao) }}</td>
                    <td>{{ req.usuarios?.nome_usuario || 'Unknown' }}</td>
                    <td>{{ req.epi?.nome_epi || 'Unknown' }}</td>
                    <td>{{ req.quantidade_solicitada }} units</td>
                </tr>
                <tr v-if="requisicoesFiltradas.length === 0">
                    <td colspan="4" class="badge-info">No borrow requests submitted yet.</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const requisicoes = ref([]);
const listaUsuarios = ref([]);
const listaEpis = ref([]);
const criandoNovo = ref(true);
const pesquisa = ref('');

const form = reactive({
    id_usuario: '',
    id_epi: '',
    quantidade_solicitada: 1,
    data_solicitacao: ''
});

// FUNÇÃO AUTOMÁTICA DE DATA: Captura o instante exato local do Almoxarife
const atualizarDataAtual = () => {
    const agora = new Date();
    // Ajusta o timezone para o formato aceito pelo input datetime-local
    agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
    form.data_solicitacao = agora.toISOString().slice(0, 16);
};

const carregarRequisicoes = async () => {
    const { data, error } = await supabase
        .from('solicitacao')
        .select(`
            id_solicitacao,
            data_solicitacao,
            quantidade_solicitada,
            usuarios!solicitacao_id_usuario_fkey ( nome_usuario ),
            epi ( nome_epi )
        `)
        .order('data_solicitacao', { ascending: false });

    if (!error) requisicoes.value = data || [];
};

const carregarDadosAuxiliares = async () => {
    const { data: users } = await supabase.from('usuarios').select('id_usuarios, nome_usuario, funcao').order('nome_usuario');
    const { data: ppes } = await supabase.from('epi').select('id_epi, nome_epi, epi_disponivel').order('nome_epi');
    
    listaUsuarios.value = users || [];
    listaEpis.value = ppes || [];
};

const fecharCriacao = () => {
    criandoNovo.value = false;
    form.id_usuario = '';
    form.id_epi = '';
    form.quantidade_solicitada = 1;
};

const salvarRequisicao = async () => {
    // Garante que a data seja gerada exatamente no milissegundo do clique de envio
    atualizarDataAtual();

    const { error } = await supabase.from('solicitacao').insert([
        {
            data_solicitacao: new Date(form.data_solicitacao).toISOString(),
            quantidade_solicitada: parseInt(form.quantidade_solicitada),
            id_usuario: form.id_usuario,
            id_epi: form.id_epi,
            id_almoxarife: idAlmoxarifeLogado.value,
            status_solicitacao: true 
        }
    ]);

    if (error) {
        alert("Error creating request: " + error.message);
    } else {
        form.id_usuario = '';
        form.id_epi = '';
        form.quantidade_solicitada = 1;
        atualizarDataAtual(); // Reseta para o novo horário atual após salvar
        carregarRequisicoes();
    }
};

const formatarData = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('pt-BR');
};

const requisicoesFiltradas = computed(() => {
    if (!pesquisa.value.trim()) return requisicoes.value;
    const termo = pesquisa.value.toLowerCase().trim();
    return requisicoes.value.filter(r => {
        const nomeUser = r.usuarios?.nome_usuario?.toLowerCase() || '';
        const nomeEpi = r.epi?.nome_epi?.toLowerCase() || '';
        return nomeUser.includes(termo) || nomeEpi.includes(termo);
    });
});

onMounted(() => {
    carregarRequisicoes();
    carregarDadosAuxiliares();
    atualizarDataAtual();
});
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
    flex-wrap: wrap;
    align-items: flex-end; 
    gap: 15px; 
}

.input-cell { 
    display: flex; 
    flex-direction: column; 
    gap: 5px; 
}

.input-cell label { 
    font-size: 12px; 
    font-weight: bold; 
    color: #000000; 
    text-align: left;
}

.input-cell input, 
.input-cell select { 
    padding: 5px; 
    border: 1px solid #000000; 
    background-color: #2D2D2D;
    color: #ffffff;
    height: 30px; 
}

.cell-large { width: 220px; }   
.cell-medium { width: 190px; }  
.cell-small { width: 90px; }    

.input-readonly {
    background-color: #3D3D3D !important;
    color: #bbbbbb !important;
    cursor: not-allowed;
}

.action-cell { 
    display: flex; 
    gap: 5px; 
    height: 30px;
    align-items: center;
}

.btn-save { 
    background-color: #4CAF50; 
    color: white; 
    border: 1px solid #000000; 
    padding: 0 12px; 
    height: 30px; 
    font-weight: bold;
    cursor: pointer; 
}

.btn-cancel { 
    background-color: #f44336; 
    color: white; 
    border: 1px solid #000000; 
    padding: 0 12px; 
    height: 30px; 
    font-weight: bold;
    cursor: pointer; 
}

.card-table { 
    margin-top: 10px; 
    width: 100%; 
}

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
    font-weight: bold; 
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
    text-align: center; 
    vertical-align: middle; 
    overflow: hidden; 
}

.badge-info { 
    color: #777777; 
    font-style: italic; 
}
</style>