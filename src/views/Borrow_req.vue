<template>
    <header class="Utility_bar">
        <div class="Search">
            <label for="SearchReq">search: </label>
            <input v-model="pesquisa" type="text" id="SearchReq" class="search-input" placeholder="Audit requests...">
        </div>
    </header>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Date / Time</th>
                    <th style="width: 25%;">User (Requester)</th>
                    <th style="width: 25%;">PPE Equipment</th>
                    <th style="width: 10%;">Qty</th>
                    <th style="width: 20%;">Released By (Almox)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="req in requisicoesFiltradas" :key="req.id_solicitacao">
                    <td>{{ formatarData(req.data_solicitacao) }}</td>
                    <td>{{ req.usuarios?.nome_usuario || 'Unknown' }}</td>
                    <td>{{ req.epi?.nome_epi || 'Unknown' }}</td>
                    <td>{{ req.quantidade_solicitada }} un</td>
                    <td>{{ req.almoxarife?.nome_almoxarife || 'System / Direct' }}</td>
                </tr>
                <tr v-if="requisicoesFiltradas.length === 0">
                    <td colspan="5" class="badge-info">No operations recorded in the log.</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const requisicoes = ref([]);
const pesquisa = ref('');

const carregarTodasRequisicoes = async () => {
    // Esse join triplo traz o Usuário que pediu, o EPI e o Almoxarife que fez o lançamento
    const { data, error } = await supabase
        .from('solicitacao')
        .select(`
            id_solicitacao,
            data_solicitacao,
            quantidade_solicitada,
            usuarios!solicitacao_id_usuario_fkey ( nome_usuario ),
            epi ( nome_epi ),
            almoxarife ( nome_almoxarife )
        `)
        .order('data_solicitacao', { ascending: false });

    if (!error) requisicoes.value = data || [];
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
        const nomeAlmox = r.almoxarife?.nome_almoxarife?.toLowerCase() || '';
        return nomeUser.includes(termo) || nomeEpi.includes(termo) || nomeAlmox.includes(termo);
    });
});

onMounted(carregarTodasRequisicoes);
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
.Utility_bar { 
    display: flex; 
    align-items: center; 
    background-color: #8B8B8B; 
    height: 45px; 
    padding: 0 15px; 
    border: 1px solid #000000; 
    color: #000000; width: 100%;
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
.card-table { 
    margin-top: 10px; 
    width: 100%; 
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
    text-align: center; 
    vertical-align: middle; 
    overflow: hidden; 
}
.badge-info { 
    color: #555; 
    font-style: italic; 
    }
</style>