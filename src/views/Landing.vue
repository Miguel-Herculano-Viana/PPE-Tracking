<script>
import { useRouter } from 'vue-router'
export default {
    name: "Landing"
}
</script>

<template>
    <body>
        <header class="gray_stripe">
            <RouterLink to="/Login">Login</RouterLink>
        </header>
        <main>
            <img src="../assets/Gemini_Generated_Image_zi29uhzi29uhzi29 1.png">
            <nav class="Selection">
                <img src="../assets/Group 2.png" alt=""> 
                <RouterLink to="/Our_Product"> Our Product </RouterLink>
                <RouterLink to="/About_Us"> About Us </RouterLink>
                <RouterLink to="/Contacts"> Contacts </RouterLink>
            </nav>
            <main class="content">
                <RouterView />
            </main>
        </main>
    </body>
</template>

<style scoped>
/* Reset básico para garantir o alinhamento */
body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background-color: #f4f4f4; /* Fundo geral da página para destacar o container */
}

/* Barra superior cinza */
.gray_stripe {
    background-color: #8B8B8B;
    height: 35px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}

.gray_stripe a {
    color: #0000EE; /* Azul padrão de link */
    text-decoration: underline;
    font-size: 14px;
}

/* Container principal - usando Flexbox para quebrar a linha após a imagem */
main {
    max-width: 1200px;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-wrap: wrap;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1); /* Sombra opcional para dar profundidade */
}

/* Imagem gigante (Hero) */
main > img {
    width: 100%;
    height: auto;
    object-fit: cover;
    max-height: 450px;
    display: block;
}

/* Menu Lateral (Esquerda) */
.Selection {
    width: 250px;
    background-color: #E0E0E0; /* Fundo cinza claro */
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    align-items: center;
}

.Selection img {
    width: 140px;
    margin-bottom: 40px;
}

.Selection a {
    width: 100%;
    text-align: left;
    padding: 12px 20px;
    text-decoration: none;
    color: #000000;
    font-size: 14px;
    border-bottom: 1px solid #d0d0d0;
    border-top: 1px solid transparent;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.Selection a:first-of-type {
    border-top: 1px solid #d0d0d0;
}

.Selection a:hover {
    background-color: #d5d5d5;
}

/* O segredo da setinha no menu lateral sem mexer no HTML */
.Selection a::after {
    content: "►";
    font-size: 10px;
    color: #000;
}

/* Área de Conteúdo Central (Direita) */
.content {
    flex: 1; /* Ocupa o restante do espaço ao lado do menu */
    background-color: #ffffff;
    border: 1px solid #000000; /* Borda preta em destaque no Figma */
    padding: 40px;
    min-height: 500px;
    box-sizing: border-box;
    margin: 0; 
    display: block; 
}
</style>