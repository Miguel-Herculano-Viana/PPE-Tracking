<template>
    <header class="Utility_bar">
        <div class="Search">
            <span style="font-weight: bold; font-size: 16px; margin-left: 10px;">PPE Loan Request (Almox)</span>
        </div>
    </header>

    <section class="insertion-box">
        <form @submit.prevent="adicionarAoCarrinho" class="insertion-grid">
            <div class="input-cell cell-large">
                <label>Recipient (Destinatário):</label>
                <select v-model="formRequisicao.id_usuario" required :disabled="carrinho.length > 0">
                    <option value="" disabled>Select User...</option>
                    <option v-for="user in listaUsuarios" :key="user.id_usuarios" :value="user.id_usuarios">
                        {{ user.nome_usuario }}
                    </option>
                </select>
            </div>
            <div class="input-cell cell-large">
                <label>Select PPE:</label>
                <select v-model="itemAtual.epi" required>
                    <option value="" disabled>Select Equipment...</option>
                    <option v-for="epi in episDisponiveis" :key="epi.id_epi" :value="epi">
                        {{ epi.nome_epi }} (Avail: {{ getQuantidade(epi) }})
                    </option>
                </select>
            </div>

            <div class="input-cell cell-small">
                <label>Qty:</label>
                <input v-model="itemAtual.quantidade" type="number" min="1" :max="getMaxQuantidade()" required placeholder="1">
            </div>

            <div class="action-cell">
                <button type="submit" class="btn-save">+ Add to Request</button>
            </div>
        </form>
    </section>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 40%;">Requested PPE</th>
                    <th style="width: 15%;">Qty</th>
                    <th style="width: 30%;">Expiration / Status</th>
                    <th style="width: 15%;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in carrinho" :key="index">
                    <td style="text-align: left; padding-left: 15px;">{{ item.epi.nome_epi }}</td>
                    <td style="font-weight: bold;">{{ item.quantidade }} un</td>
                    <td>
                        <span :class="item.epi.is_perecivel ? 'badge-warning' : 'badge-success'">
                            {{ gerarStatusValidade(item.epi) }}
                        </span>
                    </td>
                    <td>
                        <button class="btn-table-delete" @click="removerDoCarrinho(index)">Remove</button>
                    </td>
                </tr>
                <tr v-if="!carrinho || carrinho.length === 0">
                    <td colspan="4" class="badge-info">No PPE added to this request yet.</td>
                </tr>
            </tbody>
        </table>
    </section>

    <div v-if="carrinho && carrinho.length > 0" class="action-footer">
        <button class="btn-save-large" @click="finalizarSolicitacao" :disabled="isSubmitting">
            {{ isSubmitting ? 'Processing...' : 'Submit Full Request' }}
        </button>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const listaUsuarios = ref([]);
const episDisponiveis = ref([]);
const carrinho = ref([]);
const isSubmitting = ref(false);

const formRequisicao = reactive({ id_usuario: '' });
const itemAtual = reactive({ epi: '', quantidade: 1 });

const carregarUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id_usuarios, nome_usuario')
        .order('nome_usuario'); // Ordenar por ordem alfabética do nome

    if (error) {
        console.error("Erro ao carregar utilizadores:", error.message);
    } else {
        listaUsuarios.value = data || [];
    }
};
const carregarEpisDisponiveis = async () => {
    const { data, error } = await supabase
        .from('epi')
        .select(`
            id_epi, nome_epi, validade, is_perecivel, epi_disponivel, ativo,
            estoque!estoque_id_epi_fkey ( quantidade_disponivel )
        `)
        .eq('epi_disponivel', true)
        .eq('ativo', true) // <-- Filtro adicionado para carregar apenas os EPIs ativos
        .order('nome_epi');

    if (error) {
        console.error("Erro ao carregar EPIs:", error.message);
    } else {
        episDisponiveis.value = (data || []).filter(e => 
            e.estoque && e.estoque.length > 0 && e.estoque[0].quantidade_disponivel > 0
        );
    }
};
const getQuantidade = (epi) => {
    if (!epi || !epi.estoque || epi.estoque.length === 0) return 0;
    return epi.estoque[0].quantidade_disponivel;
};

const getMaxQuantidade = () => {
    if (!itemAtual.epi) return 1;
    return getQuantidade(itemAtual.epi);
};

// 3. Regra de Negócio: Perecível vs Não Perecível
const gerarStatusValidade = (epi) => {
    if (epi.is_perecivel && epi.validade) {
        // Retorna a data formatada no padrão português
        return new Date(epi.validade).toLocaleDateString('pt-PT');
    } else {
        return "Não Perecível";
    }
};

const adicionarAoCarrinho = () => {
    if (!itemAtual.epi || itemAtual.quantidade < 1) return;
    
    const indexExistente = carrinho.value.findIndex(i => i.epi.id_epi === itemAtual.epi.id_epi);
    
    if (indexExistente >= 0) {
        const novaQtd = carrinho.value[indexExistente].quantidade + itemAtual.quantidade;
        if (novaQtd > getQuantidade(itemAtual.epi)) {
            alert("A quantidade excede o stock disponível!");
            return;
        }
        carrinho.value[indexExistente].quantidade = novaQtd;
    } else {
        carrinho.value.push({ 
            epi: itemAtual.epi, 
            quantidade: itemAtual.quantidade 
        });
    }

    itemAtual.epi = '';
    itemAtual.quantidade = 1;
};

const removerDoCarrinho = (index) => {
    carrinho.value.splice(index, 1);
};

const finalizarSolicitacao = async () => {
    if (!formRequisicao.id_usuario || carrinho.value.length === 0) return;
    isSubmitting.value = true;

    try {
        for (const item of carrinho.value) {
            
            const textoValidade = gerarStatusValidade(item.epi);

            // PASSO ÚNICO: Apenas gerar a Solicitação (Status Null = Pendente)
            const { error: solError } = await supabase
                .from('solicitacao')
                .insert([{
                    data_solicitacao: new Date().toISOString(),
                    quantidade_solicitada: item.quantidade,
                    status_solicitacao: null, // Fica nulo para aparecer no ecrã do Moderador
                    id_epi: item.epi.id_epi,
                    id_usuario: formRequisicao.id_usuario,
                    observacao_validade: textoValidade
                }]);

            if (solError) throw new Error("Erro na solicitação: " + solError.message);
        }

        alert("Solicitação enviada para aprovação dos Moderadores com sucesso!");
        
        carrinho.value = [];
        formRequisicao.id_usuario = '';
        await carregarEpisDisponiveis();

    } catch (error) {
        alert(error.message);
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    carregarUsuarios();
    carregarEpisDisponiveis();
});
</script>

<style scoped>
/* Aproveitando as classes do padrão global já estabelecido */
* { margin: 0; padding: 0; box-sizing: border-box; font-family: sans-serif; }
.Utility_bar { display: flex; align-items: center; background-color: #8B8B8B; height: 45px; border: 1px solid #000; width: 100%; }
.insertion-box { background-color: #f9f9f9; border: 1px solid #000; padding: 15px; margin-top: 10px; width: 100%; }
.insertion-grid { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 15px; }
.input-cell { display: flex; flex-direction: column; gap: 5px; }
.input-cell label { font-size: 12px; font-weight: bold; color: #000; }
.input-cell input, .input-cell select { padding: 5px; border: 1px solid #000; background-color: #2D2D2D; color: #fff; height: 30px; }
.input-cell select:disabled { background-color: #666; cursor: not-allowed; }
.cell-large { width: 250px; }
.cell-small { width: 100px; }
.action-cell { display: flex; gap: 5px; height: 30px; }
.btn-save { background-color: #4CAF50; color: white; border: 1px solid #000; padding: 0 15px; font-weight: bold; cursor: pointer; }
.card-table { margin-top: 10px; width: 100%; }
.styled-table { width: 100%; border-collapse: collapse; border: 1px solid #000; table-layout: fixed; }
.styled-table th { background-color: #A6A6A6; font-weight: bold; font-size: 14px; height: 45px; border: 1px solid #000; text-align: center; }
.styled-table td { background-color: #ffffff; font-size: 14px; height: 45px; border: 1px solid #000; text-align: center; vertical-align: middle; }
.btn-table-delete { background-color: #ffffff; color: #f44336; border: 1px solid #000; padding: 2px 8px; cursor: pointer; font-size: 12px; }
.badge-warning { color: #d84315; font-weight: bold; }
.badge-success { color: #2e7d32; font-weight: bold; }
.badge-info { color: #555; font-style: italic; }
.action-footer { margin-top: 15px; display: flex; justify-content: flex-end; width: 100%; }
.btn-save-large { background-color: #4CAF50; color: white; border: 1px solid #000; padding: 10px 30px; font-size: 16px; font-weight: bold; cursor: pointer; }
.btn-save-large:disabled { background-color: #888; cursor: not-allowed; }
</style>