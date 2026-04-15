import { createRouter, createWebHistory } from 'vue-router'

import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Logon from '../views/Logon.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
    {path: '/', component: Landing},
    {path: '/Login', component: Login},
    {path: '/Logon', component: Logon},
    {path: '/Dashboard', component: Dashboard}
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router