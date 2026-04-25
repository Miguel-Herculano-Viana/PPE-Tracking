<script>
import { useRouter } from 'vue-router'
export default {
    name: "Login"
}
</script>

<template>
    <body>
        <section>
            <img src="../assets/Group 2.png">
            <form action="" method="get" class="Username">
                <label for="Name">Username</label>
                <input type="text">
            </form>
            <form action="" method="get" class="Password">
                <label for="Password">Password</label>
                <input type="text">
            </form>
            <button class="Login"><p>Login</p></button>
        </section>
    </body>
</template>