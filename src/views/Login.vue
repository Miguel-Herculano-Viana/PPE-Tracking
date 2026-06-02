
<template>
    <div class="Login_page">

            <img src="../assets/Group 2.png">
            <div class="Login_form">

                <form @submit.prevent="fazerLogin" class="formulario">
                    <div action="" class="Email">
                        <label for="Name">Email: </label>
                        <input type="email" v-model="email" class="Email_form" placeholder="Email" required>
                    </div>

                    <div action="" class="Password">
                        <label for="Password">Password: </label>
                        <input type="password" v-model="password" class="Password_form" placeholder="Password" required>
                    </div>


                    <div v-if="erro" class="mensagem-erro">
                        <i class="fas fa-exclamation-circle"></i>
                        {{ erro }}
                    </div>


                    <button type="submit" class="Login" :disabled="Loading"><p>Login</p></button>
                    <p class="tip"><strong>Tip: </strong> Use a registered username and password</p>
                </form>
            </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSupabase } from '../composables/useSupabase'
import { useRouter } from 'vue-router'

const { supabase } = useSupabase()

const email = ref('')
const password = ref('')
const erro = ref('')
const carregando = ref(false)
const router = useRouter()

async function fazerLogin() {
    erro.value = ''
    if (email.value === '' || password.value === '') {
        erro.value = 'Please fill in all fields.'
        carregando.value = true
    }
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) {
            erro.value = 'incorrect Email or Password'
            carregando.value = false
            return
            }
        }
    catch (err) {
        erro.value = "failed to login"
        console.error('failed to login:', err)
    }
    router.push ('/Dashboard')
}

</script>

<style scoped>

.Login_page {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    min-height: 450px;
    background-color: #8B8B8B;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 40px 0;
    box-shadow: 0 0 0 9999px #ffffff; 
}

.Login_page img {
    width: 140px;
    margin-bottom: 50px;
}

.Login_form, .formulario {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

label {
    display: none;
}

.Email, .Password {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

.Email_form, .Password_form {
    width: 320px;
    height: 35px;
    border: none;
    padding: 0 12px;
    font-family: sans-serif;
    font-size: 14px;
    color: #000000;
    background-color: #ffffff;
    box-sizing: border-box;
    outline: none;
}

.Login {
    width: 250px;
    height: 38px;
    background-color: #ffffff;
    border: 3px solid #FFE600; 
    color: #000000;
    font-family: sans-serif;
    font-size: 15px;
    font-weight: normal;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 35px;
    padding: 0;
    transition: background-color 0.2s ease;
}

.Login:hover {
    background-color: #f2f2f2;
}

.Login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.Login p {
    margin: 0;
}

.mensagem-erro {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    width: 320px;
    padding: 8px;
    text-align: center;
    font-size: 13px;
    font-family: sans-serif;
    box-sizing: border-box;
    margin-top: 10px;
}

.tip {
    font-size: 11px;
    color: #333333;
    font-family: sans-serif;
    margin-top: 25px;
    text-align: center;
}
</style>