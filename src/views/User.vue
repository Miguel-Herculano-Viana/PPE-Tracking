<script>
import { useRouter } from 'vue-router'
export default {
    name: "User"
}
</script>
<template>
    <header class="Utility_bar">
        <form action="" method="get" class="Search">
                <label for="Name">Search: </label>
                <input type="text" class="input">
        </form>
        <button class="button">Create New</button>
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
<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.Utility_bar {
    display: flex;
    background-color: #8B8B8B;
    height: 5vh;
    padding: 1%;
    outline-color: #000000;
    outline-width: 1px;
    outline-style: solid;
    color: #000000;
}
.Label_Bar {
    display: flex;
    background-color: #8B8B8B;
    outline-color: #000000;
    outline-width: 1px;
    outline-style: solid;
    justify-content: space-between;
    padding-left: 2%;
    padding-right: 10%;
    color: #000000;
}
.input {
    background-color: #ffffff;
    color:#000000;
}
.button {
    margin-left: 1%;
    width: 80px;
    height: 25px;
    background-color: #DBDBDB;
    color: #000000;
    outline-color: #B7B3B3;
    outline-width: 1px;
    outline-style: solid;
}
</style>