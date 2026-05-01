<script>
import { useRouter } from 'vue-router'
export default {
    name: "Dashboard"
}
</script>
<template>
    <aside>
        <img src="../assets/Group 2.png">
        <section class="selector">
            <button>Users</button>
            <button>PPEs</button>
            <button>Reports</button>
            <button>Storage</button>
            <button>Requisitions</button>
        </section>
    </aside>
</template>