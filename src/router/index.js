import { createRouter, createWebHistory } from 'vue-router'

import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Logon from '../views/Logon.vue'
import Dashboard from '../views/Dashboard.vue'
import About_Us from '../views/About_Us.vue'
import Contacts from '../views/Contacts.vue'
import Our_Product from '../views/Our_Product.vue'

const routes = [
    {path: '/', component: Landing},
    {path: '/Login', component: Login},
    {path: '/Logon', component: Logon},
    {path: '/Dashboard', component: Dashboard},
    {path: '/About_Us', component: About_Us},
    {path: '/Contacts', component: Contacts},
    {path: '/Our_Product', component: Our_Product}
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router