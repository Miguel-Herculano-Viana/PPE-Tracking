<template>
    <header class="Utility_bar">
        <div class="Search">
            <label for="SearchPPE">search: </label>
            <input v-model="pesquisa" type="text" id="SearchPPE" class="search-input" placeholder="Search PPE...">
        </div>
        <span class="separator">|</span>
        <button class="button" @click="abrirCadastro">Register New PPE</button>
    </header>

    <section v-if="exibirFormulario" class="insertion-box">
        <form v-if="modoAba === 'CADASTRO'" @submit.prevent="salvarNovoEPI" class="insertion-grid">
            <div class="input-cell cell-large">
                <label>PPE Description / Name:</label>
                <input v-model="formEpi.nome_epi" type="text" required placeholder="Insert PPE name">
            </div>
            <div class="input-cell cell-medium">
                <label>Type:</label>
                <select v-model="formEpi.is_perecivel" required>
                    <option :value="true">Perishable</option>
                    <option :value="false">Non-Perishable</option>
                </select>
            </div>
            <div class="input-cell cell-medium">
                <label>Expiration Date:</label>
                <input v-model="formEpi.validade" type="date" required>
            </div>
            <div class="input-cell cell-small">
                <label>Initial Qty:</label>
                <input v-model="formEpi.quantidade_inicial" type="number" min="0" required placeholder="0">
            </div>
            <div class="action-cell">
                <button type="submit" class="btn-save">Save PPE</button>
                <button type="button" @click="fecharFormulario" class="btn-cancel">Cancel</button>
            </div>
        </form>

        <form v-if="modoAba === 'ESTOQUE'" @submit.prevent="salvarAjusteEstoque" class="insertion-grid">
            <div class="input-cell cell-large">
                <label>Selected PPE:</label>
                <input :value="epiSelecionado?.nome_epi" type="text" readonly class="input-readonly">
            </div>
            <div class="input-cell cell-medium">
                <label>Operation Type:</label>
                <select v-model="formEstoque.tipo" required>
                    <option value="ENTRADA">Add Stock (+)</option>
                    <option value="SAIDA">Remove / Adjust (-)</option>
                </select>
            </div>
            <div class="input-cell cell-small">
                <label>Quantity:</label>
                <input v-model="formEstoque.quantidade" type="number" min="1" required placeholder="0">
            </div>
            <div class="action-cell">
                <button type="submit" class="btn-save">Apply Update</button>
                <button type="button" @click="fecharFormulario" class="btn-cancel">Cancel</button>
            </div>
        </form>
    </section>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 30%;">PPE Description</th>
                    <th style="width: 20%;">Expiration Date</th>
                    <th style="width: 15%;">Stock Status</th>
                    <th style="width: 15%;">Available Qty</th>
                    <th style="width: 20%;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="epi in episFiltrados" :key="epi.id_epi">
                    <td style="text-align: left; padding-left: 15px;">{{ epi.nome_epi }}</td>
                    <td>{{ formatarData(epi.validade) }}</td>
                    <td>
                        <span :class="epi.epi_disponivel ? 'txt-disponivel' : 'txt-esgotado'">
                            {{ epi.epi_disponivel ? 'In Stock' : 'Out of Stock' }}
                        </span>
                    </td>
                    <td style="font-weight: bold;">
                        {{ (epi.estoque && epi.estoque.length > 0) ? epi.estoque[0].quantidade_disponivel : 0 }} un
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-table-stock" @click="abrirAjusteEstoque(epi)">+ Stock</button>
                            <button class="btn-table-delete" @click="deletarEPI(epi.id_epi)">Delete</button>
                        </div>
                    </td>
                </tr>
                <tr v-if="!episFiltrados || episFiltrados.length === 0">
                    <td colspan="5" class="badge-info">No PPE registered or found.</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const listaEpis = ref([]);
const pesquisa = ref('');
const exibirFormulario = ref(false);
const modoAba = ref('CADASTRO');
const epiSelecionado = ref(null);

const formEpi = reactive({ nome_epi: '', validade: '', quantidade_inicial: 0, is_perecivel: false });
const formEstoque = reactive({ tipo: 'ENTRADA', quantidade: 1 });

const carregarEpisComEstoque = async () => {
    const { data, error } = await supabase
        .from('epi')
        .select(`
            id_epi,
            nome_epi,
            validade,
            is_perecivel,
            epi_disponivel,
            id_estoque,
            estoque!estoque_id_epi_fkey (
                quantidade_disponivel
            )
        `)
        .order('nome_epi', { ascending: true });
    if (error) {
        console.error("Erro ao carregar EPIs:", error.message);
    } else {
        listaEpis.value = data || [];
    }
};

const abrirCadastro = () => {
    modoAba.value = 'CADASTRO';
    exibirFormulario.value = true;
};

const abrirAjusteEstoque = (epi) => {
    epiSelecionado.value = epi;
    modoAba.value = 'ESTOQUE';
    formEstoque.quantidade = 1;
    formEstoque.tipo = 'ENTRADA';
    exibirFormulario.value = true;
};

const fecharFormulario = () => {
    exibirFormulario.value = false;
    formEpi.nome_epi = '';
    formEpi.validade = '';
    formEpi.quantidade_inicial = 0;
    formEpi.is_perecivel = false;
    epiSelecionado.value = null;
};

const salvarNovoEPI = async () => {
    const { data: novoEpi, error: errEpi } = await supabase
        .from('epi')
        .insert([{
            nome_epi: formEpi.nome_epi,
            validade: formEpi.validade,
            is_perecivel: formEpi.is_perecivel,
            epi_disponivel: formEpi.quantidade_inicial > 0
        }])
        .select()
        .single();

    if (errEpi) {
        alert("Error creating PPE: " + errEpi.message);
        return;
    }

    await supabase.from('estoque').insert([{
        quantidade_disponivel: parseInt(formEpi.quantidade_inicial) || 0,
        quantidade_minima: 2,
        id_epi: novoEpi.id_epi
    }]);

    fecharFormulario();
    carregarEpisComEstoque();
};

const salvarAjusteEstoque = async () => {
    if (!epiSelecionado.value) return;

    // 1. Calcula a nova quantidade disponível
    const quantidadeAtual = (epiSelecionado.value.estoque && epiSelecionado.value.estoque.length > 0) 
        ? epiSelecionado.value.estoque[0].quantidade_disponivel 
        : 0;

    const quantidadeInformada = parseInt(formEstoque.quantidade) || 0;
    let novaQuantidade = quantidadeAtual;

    if (formEstoque.tipo === 'ENTRADA') {
        novaQuantidade += quantidadeInformada;
    } else if (formEstoque.tipo === 'SAIDA') {
        novaQuantidade -= quantidadeInformada;
        if (novaQuantidade < 0) novaQuantidade = 0;
    }

    // 2. Atualiza (UPDATE) a tabela de estoque
    const { error: errEstoque } = await supabase
        .from('estoque')
        .update({ quantidade_disponivel: novaQuantidade })
        .eq('id_epi', epiSelecionado.value.id_epi);

    if (errEstoque) {
        alert("Error updating stock: " + errEstoque.message);
        return;
    }

    // 3. Insere o registro na tabela de movimentação com as colunas corretas (baseado na sua imagem)
    const { error: errMov } = await supabase.from('movimentacao').insert([
        {
            data_movimentecao: new Date().toISOString(),
            quantidade_solicitada: quantidadeInformada, 
            tipo_movimentacao: formEstoque.tipo,
            id_epi: epiSelecionado.value.id_epi
        }
        
    ]);

    if (errMov) {
        console.error("Aviso: Movimentação não registrada:", errMov.message);
    }

    fecharFormulario();
    carregarEpisComEstoque();
};

const deletarEPI = async (id) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;
    
    await supabase.from('estoque').delete().eq('id_epi', id);
    const { error } = await supabase.from('epi').delete().eq('id_epi', id);
    
    if (error) alert("Error deleting: " + error.message);
    else carregarEpisComEstoque();
};

const formatarData = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('pt-BR');
};

// Computado seguro: garante que não retorne undefined e trate string vazia
const episFiltrados = computed(() => {
    const lista = listaEpis.value || [];
    const termo = (pesquisa.value || '').trim().toLowerCase();
    
    if (!termo) return lista;
    
    return lista.filter(e => 
        e.nome_epi && e.nome_epi.toLowerCase().includes(termo)
    );
});

onMounted(() => {
    carregarEpisComEstoque();
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
}

.input-cell input, 
.input-cell select { 
    padding: 5px; 
    border: 1px solid #000000; 
    background-color: #2D2D2D; 
    color: #ffffff; 
    height: 30px; 
}

.cell-large { 
    width: 250px; 
}

.cell-medium { 
    width: 190px; 
}

.cell-small { 
    width: 100px; 
}

.input-readonly { 
    background-color: #3D3D3D !important; 
    color: #bbbbbb !important; 
    cursor: not-allowed; 
}

.action-cell { 
    display: flex; 
    gap: 5px; 
    height: 30px; 
}

.btn-save { 
    background-color: #4CAF50; 
    color: white; 
    border: 1px solid #000000; 
    padding: 0 15px; 
    font-weight: bold; 
    cursor: pointer; 
}

.btn-cancel { 
    background-color: #f44336; 
    color: white; 
    border: 1px solid #000000; 
    padding: 0 15px; 
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
    text-align: center; 
    vertical-align: middle; 
}

.txt-disponivel { 
    color: #4CAF50; 
    font-weight: bold; 
}

.txt-esgotado { 
    color: #f44336; 
    font-weight: bold; 
}

.table-actions { 
    display: flex; 
    justify-content: center; 
    gap: 5px; 
}

.btn-table-stock { 
    background-color: #DBDBDB; 
    border: 1px solid #000000; 
    padding: 2px 8px; 
    cursor: pointer; 
    font-size: 12px; 
}

.btn-table-delete { 
    background-color: #ffffff; 
    color: #f44336; 
    border: 1px solid #000000; 
    padding: 2px 8px; 
    cursor: pointer; 
    font-size: 12px; 
}
</style>