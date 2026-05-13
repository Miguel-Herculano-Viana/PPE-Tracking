
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

// export default {
//     name: "Login"
// }
</script>