<template>
    <div class="Shell">
        <aside class="Sidebar">
            <img class="logo" src="../assets/Group 2.png" alt="">
            <nav class="Menu">
                <RouterLink to="/User"> User </RouterLink>
                <RouterLink to="/Borrow_req"> Borrow Req</RouterLink>
                <RouterLink to="/Borrow"> Borrow </RouterLink>
                <RouterLink to="/PPE"> PPE </RouterLink>
                <RouterLink to="/Report"> Report </RouterLink>
            </nav>
            <button @click="sair" class="botaoSair">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            </button>
        </aside>
        
        <main class="content">
            <div class="router-container">
                <RouterView />
            </div>
        </main>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'
    export default {
        name: "Dashboard",
        setup() {
            const router = useRouter()
            const sair = () => {
                router.push('/') 
            }
            return { sair }
        }
    }
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.Shell {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #ffffff;
    overflow-x: hidden; /* Evita qualquer barra de rolagem horizontal esquisita */
}
.Sidebar {
    padding: 30px 20px;
    width: 12%;
    height: 80vh;
    margin-left: 15%;
    margin-top: 5%;
    background-color: #D9D9D9;
    color: #000000;
    display: flex;
    flex-direction: column;
    position: fixed;
    outline-color: #E8E8E8;
    outline-width: 1px;
    outline-style: solid;
    z-index: 10;
}
.logo {
    width: 40%;
    display: flex;
    margin-left: 30%;
    padding-bottom: 30%;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.Menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.Menu-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    outline-color: #E8E8E8;
    outline-width: 1px;
    outline-style: solid;
    color: #000000; 
    text-decoration: none;
}

/* --- AJUSTES DA ÁREA DE CONTEÚDO --- */

.content {
    /* Começa logo após a sidebar (15% margem + 12% largura = 27%) */
    margin-left: 27%; 
    margin-top: 5%;
    /* Garante que a área total disponível termine com a mesma margem de 15% na direita */
    width: 58%; /* 100% - 27% (esquerda) - 15% (direita) = 58% */
}

/* O container que engloba as tabelas e impede que elas estiquem demais */
.router-container {
    width: 100%;
    /* O valor abaixo impede que em monitores gigantes a tabela fique esticada ao infinito */
    max-width: 1100px; 
    margin: 0 auto;
}

/* Estilo básico para o botão de sair que estava faltando */
.botaoSair {
    margin-top: auto;
    background-color: #8B8B8B;
    color: white;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
</style>