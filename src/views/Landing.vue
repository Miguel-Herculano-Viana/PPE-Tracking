<script>
import { useRouter } from 'vue-router'
export default {
    name: "Landing"
}

</script>

<template>
    <div class = "body">
        <div class="top_stripe">
            <div class="buttons">
                <router-link class="login" to="/Login">
                    <button class="botao_login"> Login </button>
                </router-link>
                <router-link class="logon" to="/Logon">
                    <button class="botao_logon"> Logon </button>
                </router-link>
            </div>
        </div>
        <section id="Landing" class="landing">
            <img src="../assets/Gemini_Generated_Image_zi29uhzi29uhzi29 1.png" class="banner_image"> <img/>
            <div class="information_esq">
                <div class="selector">
                    <img src="../assets/Group 2.png" class="logo"></img>
                    <div src="product_info">
                        <button class="Our_P">
                        <h1 class="Texto_opcao1">
                            Our Product
                        </h1>
                        </button>
                    </div>
                    <div class="about_us">
                        <button class="Abt_us">
                            <h1 class="Texto_opcao2">
                                About Us
                            </h1>
                        </button>
                    </div>
                    <div class="contacts">
                        <button class="cont">
                            <h1 class="Texto_opcao3">
                                Contacts
                            </h1>
                        </button>
                    </div>
                </div>
            </div>
            <div class="information_dir">
            </div>
        </section>
    </div>
</template>

<style>

body {
    background-color: white;
    width: 100%;
    height: 100%;
}

.top_stripe {
    background-color: #8B8B8B;
    width: 100vw;
    height: 3vh;
    z-index: 1;
}


.banner_image{
    z-index: 0;
    width: 50%;
    height: 50%;
}

.information_esq {
    background-color: #D9D9D9FF;
    width: 10%;
    height: 55vh;
    margin-left: 20%;
}

.logo {
    width: 50%;
    height: 50%;
    margin-top: 20%;
    margin-bottom: 20%;
}

.information_dir {
    background-color: #D9D9D9FF;
    width: 10%;
    height: 10%;
    z-index: 10;
    margin-right: auto;
}

.Product_info{
    height: 10px%;
}

.Our_P {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D9D9D9FF;
    width: 100%;
    height: 50px;
}

.Texto_opcao1 {
    font-size: 24px;
    color: black;
}

.Abt_us {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D9D9D9FF;
    width: 100%;
    height: 50px;
}

.Texto_opcao2 {
    font-size: 24px;
    color: black;
}

.cont {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #D9D9D9FF;
    width: 100%;
    height: 50px;
}

.Texto_opcao3 {
    font-size: 24px;
    color: black;
}

.buttons {
    padding-left: 90%;
}
</style>