<script>
import { useRouter } from 'vue-router'
export default {
    name: "User"
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
        <h3>Name</h3>
        <h3>Register Number</h3>
        <h3>Function</h3>
    </section>
    <tr>
        <th>00000</th>
        <th>0000000000000000000000000000000000000</th>
        <th>0000000000000000000000000000000000000</th>
        <th>
            <form>
                <input type="checkbox" id="Employee">
                <label for="Employee">Employee</label><br>
                <input type="checkbox" id="Student">
                <label for="Student">Student</label><br>
                <input type="checkbox" id="Visitor">
                <label for="Visitor">Visitor</label><br>
                <input type="checkbox" id="ADM">
                <label for="ADM">ADM</label><br>
                <input type="checkbox" id="MOD">
                <label for="MOD">MOD</label><br>
                <input type="checkbox" id="ALMOX">
                <label for="ALMOX">ALMOX</label><br>
            </form>
        </th>
        <th>
            <button>Edit</button>
            <button>Delete</button>
        </th>
    </tr>
</template>