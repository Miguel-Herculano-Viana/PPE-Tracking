<script>
import { useRouter } from 'vue-router'
export default {
    name: "Report"
}
</script>

<template>
        <img src="../assets/Group 2.png">
    <header class="Utility_bar">
        <form action="" method="get" class="Search">
                <label for="Name">Search: </label>
                <input type="text">
        </form>
        <button>Create New</button>
    </header>
    <section class="Label_Bar">
        <h3>ID</h3>
        <h3>Generation Date</h3>
        <h3>Report Month</h3>
    </section>
    <tr>
        <th>00000</th>
        <th>dd/mm/yyyy</th>
        <th>mm/yyyy</th>
        <th>
            <button>View</button>
        </th>
    </tr>
</template>