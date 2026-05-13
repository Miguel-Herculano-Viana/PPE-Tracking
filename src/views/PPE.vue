<script>
import { useRouter } from 'vue-router'
export default {
    name: "PPE"
}
</script>

<template>
    <header class="Utility_bar">
        <form action="" method="get" class="Search">
                <label for="Name">Search: </label>
                <input type="text">
        </form>
        <button>Create New</button>
    </header>
    <section class="Label_Bar">
        <h3>ID</h3>
        <h3>Name</h3>
        <h3>Register Number</h3>
        <h3>Infos</h3>
    </section>
    <tr>
        <th>00000</th>
        <th>0000000000000000000000000000000000000</th>
        <th>0000000000000000000000000000000000000</th>
        <th>
            <form>
                <input type="checkbox" id="Date">
                <label for="Date">dd/mm/yyyy</label><br>
                <input type="checkbox" id="Non_perishable">
                <label for="Non_perishable">Non-Perishable</label><br>
            </form>
        </th>
        <th>
            <button>Edit</button>
            <button>Delete</button>
        </th>
    </tr>
</template>