<script>
import { useRouter } from 'vue-router'
export default {
    name: "AboutUs"
}
</script>
<template>
    <h1>About Us</h1>
    <h2>
        This system was developed by Miguel Herculano Viana, as an Academic Project for the University “SENAI Roberto Mange”, Located in Brazil.
    </h2>
    <img src="../assets/Rectangle 5.png">
</template>

<style scoped>
h1 {
    font-family: sans-serif;
    font-size: 32px;
    font-style: italic;
    font-weight: bold;
    color: #000000;
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
}

h2 {
    font-family: sans-serif;
    font-size: 15px;
    font-weight: normal;
    color: #000000;
    line-height: 1.5;
    text-align: center;
    margin: 20px 0 40px 0;
}

img {
    width: 100%;
    max-width: 600px;
    height: auto;
    display: block;
    margin: 0 auto;
    border: 1px solid #ccc; /* Detalhe suave para separar do fundo */
}
</style>