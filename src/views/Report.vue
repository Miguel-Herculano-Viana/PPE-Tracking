<template>
    <header class="Utility_bar">
        <div class="Search">
            <label>Report Area</label>
        </div>
        <span class="separator">|</span>
        <button class="button btn-pdf" @click="gerarPDF" :disabled="carregando">
            {{ carregando ? 'Loading...' : 'Download PDF Report' }}
        </button>
    </header>

    <section class="card-table">
        <table class="styled-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Date / Time</th>
                    <th style="width: 30%;">User</th>
                    <th style="width: 25%;">PPE</th>
                    <th style="width: 10%;">Type</th>
                    <th style="width: 10%;">Qty</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="m in movimentacoes" :key="m.id_movimentacao">
                    <td>{{ formatarDataHora(m.data_movimentecao) }}</td>
                    <td>{{ m.usuarios?.nome_usuario || 'System' }}</td>
                    <td>{{ m.epi?.nome_epi || 'N/A' }}</td>
                    <td>
                        <span :class="m.tipo_movimentacao === 'ENTRADA' ? 'txt-entrada' : 'txt-saida'">
                            {{ m.tipo_movimentacao }}
                        </span>
                    </td>
                    <td>{{ m.quantidade_solicitada }}</td>
                </tr>
                <tr v-if="movimentacoes.length === 0">
                    <td colspan="5" class="badge-info">No movements recorded yet.</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const { supabase } = useSupabase();
const movimentacoes = ref([]);
const carregando = ref(false);

const carregarMovimentacoes = async () => {
    carregando.value = true;
    
    // Calcula a data de 30 dias atrás
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    const dataIso = trintaDiasAtras.toISOString();

    const { data, error } = await supabase
        .from('movimentacao')
        .select(`
            id_movimentacao,
            data_movimentecao,
            quantidade_solicitada,
            tipo_movimentacao,
            usuarios ( nome_usuario ),
            epi ( nome_epi )
        `)
        .gte('data_movimentecao', dataIso) // Filtra apenas dos últimos 30 dias
        .order('data_movimentecao', { ascending: false });

    if (error) {
        console.error('Erro ao buscar dados do relatório:', error.message);
    } else {
        movimentacoes.value = data || [];
    }
    carregando.value = false;
};

const formatarDataHora = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('pt-BR');
};

const gerarPDF = () => {
    if (movimentacoes.value.length === 0) {
        alert("Não há movimentações nos últimos 30 dias para exportar.");
        return;
    }

    const doc = new jsPDF();
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RELATÓRIO DE MOVIMENTAÇÃO (Últimos 30 Dias)", 14, 20);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 26);
    doc.line(14, 30, 196, 30);

    const linhasTabela = movimentacoes.value.map(m => [
        formatarDataHora(m.data_movimentecao),
        m.usuarios?.nome_usuario || 'System',
        m.epi?.nome_epi || 'N/A',
        m.tipo_movimentacao,
        m.quantidade_solicitada?.toString() || '0'
    ]);

    autoTable(doc, {
        startY: 35,
        head: [['Data / Hora', 'Usuário', 'EPI', 'Tipo', 'Qtd']],
        body: linhasTabela,
        theme: 'striped',
        headStyles: { fillColor: [166, 166, 166], textColor: [0, 0, 0] },
        styles: { fontSize: 9 }
    });

    // O método save() do jsPDF já força o download do arquivo automaticamente no navegador
    doc.save(`Relatorio_Movimentacao_${new Date().toISOString().slice(0,10)}.pdf`);
};

onMounted(carregarMovimentacoes);
</script>

<!-- <script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const { supabase } = useSupabase();
const movimentacoes = ref([]);
const carregando = ref(false);

// 1. BUSCA OS DADOS RESOLVENDO OS JOINS (Puxando os nomes e não UUIDs de outra tabela)
const carregarMovimentacoes = async () => {
    carregando.value = true;
    const { data, error } = await supabase
        .from('movimentacao')
        .select(`
            id_movimentacao,
            data_movimentecao,
            quantidade,
            tipo_movimentacao,
            usuarios ( nome_usuario ),
            epi ( nome_epi )
        `)
        .order('data_movimentecao', { ascending: false });

    if (error) {
        console.error('Error fetching report data:', error.message);
    } else {
        movimentacoes.value = data || [];
    }
    carregando.value = false;
};

// Formatação auxiliar de data e hora para exibição na tela
const formatarDataHora = (isoString) => {
    if (!isoString) return '';
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR');
};

// 2. FUNÇÃO QUE CONSTRÓI E FAZ O DOWNLOAD DO PDF
const gerarPDF = () => {
    if (movimentacoes.value.length === 0) {
        alert("No data available to export.");
        return;
    }

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Cabeçalho estilizado do PDF
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PPE TRACKING - MANAGEMENT REPORT", 14, 20);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString('pt-BR')}`, 14, 26);
    
    // Divisor visual (Linha preta elegante)
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 30, 196, 30);

    // Mapeando a nossa array de objetos para o formato de linhas que o AutoTable exige
    const linhasTabela = movimentacoes.value.map(m => [
        formatarDataHora(m.data_movimentecao),
        m.usuarios?.nome_usuario || 'System',
        m.epi?.nome_epi || 'N/A',
        m.tipo_movimentacao,
        m.quantidade.toString()
    ]);

    // Configurando e desenhando a tabela dentro do PDF
    doc.autoTable({
        startY: 35,
        head: [['Date / Time', 'User Name', 'PPE Description', 'Type', 'Qty']],
        body: linhasTabela,
        theme: 'striped', // Estilo zebrado corporativo nativo do plugin
        headStyles: {
            fillColor: [166, 166, 166], // Mesma cor cinza escuro (#A6A6A6) que usamos no seu CSS
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            halign: 'center'
        },
        bodyStyles: {
            halign: 'center', // Centraliza os textos exatamente igual às regras CSS que criamos
            textColor: [0, 0, 0]
        },
        columnStyles: {
            0: { cellWidth: 40 }, // Coluna Data
            1: { cellWidth: 55 }, // Coluna Usuário
            2: { cellWidth: 50 }, // Coluna EPI
            3: { cellWidth: 22 }, // Coluna Tipo
            4: { cellWidth: 15 }  // Coluna Qtd
        },
        styles: {
            font: "Helvetica",
            fontSize: 9,
            cellPadding: 3
        }
    });

    // Salva o PDF forçando o download imediato no navegador do cliente
    doc.save(`PPE_Movement_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};

onMounted(carregarMovimentacoes);
</script> -->

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
    font-size: 14px;
    font-weight: bold;
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

.btn-pdf {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    height: 28px;
    padding: 0 15px;
    border: 1px solid #000000;
}

.btn-pdf:hover {
    background-color: #45a049;
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

.txt-entrada {
    color: #4CAF50;
    font-weight: bold;
}

.txt-saida {
    color: #f44336;
    font-weight: bold;
}

.badge-info {
    color: #555;
    font-style: italic;
}
</style>