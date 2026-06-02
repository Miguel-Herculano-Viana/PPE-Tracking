<script>
import { useRouter } from 'vue-router'
export default {
    name: "OurProd"
}
</script>
<template>
    <body>
        <h1>Our Product</h1>
        <h2>PPE Tracking is an HTML based software that keeps track of your Personal Protection Equipment across your
organization (Technician School, Universities, Industries, Labs and so on).
    Our system is simple and easy to use, with intuitive design and easy to understand language, you can check anywhere
and anytime you want by logging into our system and navigating through our dashboards.
        </h2>
        <h2>Within our options, you will find useful tools like:</h2>
        <h2>
            • an automatic report every month with important information ;
        </h2>
        <h2>
            • the CRUD method to manage your Employees and Equipment;
        </h2>
        <h2>
            And more, create an account today and explore all of our functionalities!
        </h2>
        <img src="../assets/Gemini_Generated_Image_5epamn5epamn5epa 1.png">
        <img src="../assets/Gemini_Generated_Image_me9frzme9frzme9f 1.png"
    </body>

</template>

<style scoped>
body {
    margin: 0;
    padding: 0;
}

h1 {
    font-family: sans-serif;
    font-size: 32px;
    font-style: italic;
    font-weight: bold;
    color: #000000;
    text-align: center;
    margin-top: 0;
    margin-bottom: 25px;
}

h2 {
    font-family: sans-serif;
    font-size: 13px;
    font-weight: normal;
    color: #000000;
    line-height: 1.4;
    text-align: left;
    margin: 8px 0;
}

/* Coloca as duas imagens finais lado a lado */
img {
    width: 49%;
    height: 250px;
    object-fit: cover;
    margin-top: 30px;
    display: inline-block;
}

/* Dá um pequeno espaçamento entre a primeira e a segunda imagem */
img:nth-of-type(1) {
    margin-right: 2%;
}
</style>