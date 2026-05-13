<script>
import { useRouter } from 'vue-router'
export default {
    name: "Dashboard"
}
</script>
<template>
    <div class="Shell">
        <aside class="Sidebar">
            <img class="logo" src="../assets/Group 2.png" alt="">
            <nav class="Menu">
                <RouterLink to="/User"> User </RouterLink>
                <RouterLink to="/Borrow"> Borrow </RouterLink>
                <RouterLink to="/Integrity"> Integrity </RouterLink>
                <RouterLink to="/PPE"> PPE </RouterLink>
                <RouterLink to="/Report"> Report </RouterLink>
            </nav>
            <button @click="sair" class="botaoSair">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sair</span>
            </button>
        </aside>
        <main class="content">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.Shell {
    display: flex;
    height: 100vh;
    background-color: #ffffff;
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
    flex-direction:column;
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
.content {
    margin-left: 27.1%;
    margin-top: 5%;
}
</style>