<template>
    <header class="Utility_bar">
        <div class="Search">
            <span style="font-weight: bold; font-size: 16px; margin-left: 10px;">Moderator Dashboard - PPE Approvals</span>
        </div>
    </header>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 15%;">Date</th>
                    <th style="width: 25%;">Recipient</th>
                    <th style="width: 20%;">Requested PPE</th>
                    <th style="width: 10%;">Qty</th>
                    <th style="width: 15%;">Expiration Info</th>
                    <th style="width: 15%;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="req in pendingRequests" :key="req.id_solicitacao">
                    <td>{{ formatarData(req.data_solicitacao) }}</td>
                    <td style="text-align: left; padding-left: 10px;">{{ getNomeUsuario(req) }}</td>
                    <td style="text-align: left; padding-left: 10px; font-weight: bold;">
                        {{ getNomeEpi(req) }}
                    </td>
                    <td style="font-weight: bold;">{{ req.quantidade_solicitada }} un</td>
                    <td>
                        <span :class="req.observacao_validade === 'Não Perecível' ? 'badge-success' : 'badge-warning'">
                            {{ req.observacao_validade || 'N/A' }}
                        </span>
                    </td>
                    <td class="action-cell-table">
                        <button class="btn-approve" @click="aprovarSolicitacao(req)" :disabled="isProcessing">✔</button>
                        <button class="btn-reject" @click="recusarSolicitacao(req)" :disabled="isProcessing">✖</button>
                    </td>
                </tr>
                <tr v-if="pendingRequests.length === 0">
                    <td colspan="6" class="badge-info">No pending requests at the moment. Great job!</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const pendingRequests = ref([]);
const isProcessing = ref(false);

// 1. Busca apenas as solicitações que ainda não foram avaliadas (status_solicitacao IS NULL)
const carregarSolicitacoesPendentes = async () => {
    const { data, error } = await supabase
        .from('solicitacao')
        .select(`
            id_solicitacao,
            data_solicitacao,
            quantidade_solicitada,
            observacao_validade,
            id_epi,
            id_usuario,
            epi ( nome_epi ),
            usuarios ( nome_usuario )
        `)
        .is('status_solicitacao', null)
        .order('data_solicitacao', { ascending: true });

    if (error) {
        console.error("Erro ao buscar solicitações pendentes:", error.message);
    } else {
        pendingRequests.value = data || [];
    }
};

// Funções de segurança para renderização das relações do banco
const getNomeUsuario = (req) => req.usuarios ? req.usuarios.nome_usuario : 'Unknown User';
const getNomeEpi = (req) => req.epi ? req.epi.nome_epi : 'Unknown PPE';

const formatarData = (dataIso) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR');
};

// 2. Lógica de Aprovação
const aprovarSolicitacao = async (req) => {
    if (!confirm(`Confirmar APROVAÇÃO de ${req.quantidade_solicitada}x ${getNomeEpi(req)} para ${getNomeUsuario(req)}?`)) return;
    
    isProcessing.value = true;
    try {
        // Passo A: Atualiza a solicitação para TRUE (Aprovada)
        const { error: errUpdate } = await supabase
            .from('solicitacao')
            .update({ status_solicitacao: true })
            .eq('id_solicitacao', req.id_solicitacao);

        if (errUpdate) throw new Error("Erro ao aprovar a solicitação: " + errUpdate.message);

        // Passo B: Insere na Movimentação usando a coluna 'quantidade' pós-reload
        const { error: errMov } = await supabase
            .from('movimentacao')
            .insert([{
                data_movimentecao: new Date().toISOString(),
                quantidade_solicitada: req.quantidade_solicitada, // Certifique-se de que o Alter Table foi aceito
                tipo_movimentacao: 'SAIDA',
                id_epi: req.id_epi,
                id_usuarios: req.id_usuario,
                id_solicitacao: req.id_solicitacao
            }]);

        if (errMov) {
            // Caso dê erro de coluna novamente, tentamos o fallback para a estrutura antiga
            console.warn("Tentando fallback para quantidade_solicitada por segurança...");
            throw new Error("Erro ao gerar movimentação: " + errMov.message);
        }

        // Se correu tudo bem, remove visualmente da lista de pendentes
        pendingRequests.value = pendingRequests.value.filter(item => item.id_solicitacao !== req.id_solicitacao);
        alert("Solicitação aprovada com sucesso!");

    } catch (error) {
        alert(error.message);
        console.error("Detalhes do erro:", error);
    } finally {
        isProcessing.value = false;
    }
};

// 3. Lógica de Recusa
const recusarSolicitacao = async (req) => {
    if (!confirm(`Tem certeza que deseja RECUSAR a solicitação de ${getNomeUsuario(req)}?`)) return;
    
    isProcessing.value = true;
    try {
        // Apenas marca como FALSE. Nenhuma movimentação é criada, nenhum estoque é alterado.
        const { error } = await supabase
            .from('solicitacao')
            .update({ status_solicitacao: false })
            .eq('id_solicitacao', req.id_solicitacao);

        if (error) throw new Error("Erro ao recusar: " + error.message);

        pendingRequests.value = pendingRequests.value.filter(item => item.id_solicitacao !== req.id_solicitacao);
        
    } catch (error) {
        alert(error.message);
    } finally {
        isProcessing.value = false;
    }
};

onMounted(() => {
    carregarSolicitacoesPendentes();
});
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
.Utility_bar { display: flex; align-items: center; background-color: #8B8B8B; height: 45px; border: 1px solid #000; width: 100%; margin-bottom: 10px;}
.card-table { width: 100%; }
.styled-table { width: 100%; border-collapse: collapse; border: 1px solid #000; table-layout: fixed; }
.styled-table th { background-color: #A6A6A6; font-weight: bold; font-size: 14px; height: 45px; border: 1px solid #000; text-align: center; }
.styled-table td { background-color: #ffffff; font-size: 14px; height: 45px; border: 1px solid #000; text-align: center; vertical-align: middle; }
.action-cell-table { display: flex; justify-content: center; align-items: center; gap: 10px; height: 45px;}
.btn-approve { background-color: #4CAF50; color: white; border: 1px solid #000; width: 30px; height: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-reject { background-color: #f44336; color: white; border: 1px solid #000; width: 30px; height: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-approve:disabled, .btn-reject:disabled { background-color: #888; cursor: not-allowed; }
.badge-warning { color: #d84315; font-weight: bold; font-size: 13px;}
.badge-success { color: #2e7d32; font-weight: bold; font-size: 13px;}
.badge-info { color: #555; font-style: italic; padding: 15px;}
</style>