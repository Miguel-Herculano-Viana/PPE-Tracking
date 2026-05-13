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
            <RouterLink to="/Logon">Logon</RouterLink>
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
/*  */
</style>