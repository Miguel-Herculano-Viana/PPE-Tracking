<script>
import { useRouter } from 'vue-router'
export default {
    name: "Contacts"
}
</script>
<template>
    <h1>Contacts</h1>
    <h2>You can contact me via E-mail in case of any issues, please, send your request to this address:</h2>
    <h2>miguel.herculanoviana@gmail.com</h2>
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
    margin-bottom: 30px;
}

h2 {
    font-family: sans-serif;
    font-size: 16px;
    font-weight: normal;
    color: #000000;
    line-height: 1.5;
    text-align: center;
    margin: 15px 0;
}

/* Destaca especificamente o e-mail (o último h2) */
h2:last-of-type {
    font-weight: bold;
    font-size: 18px;
    text-decoration: underline;
}
</style>