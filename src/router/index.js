import { createRouter, createWebHistory } from 'vue-router'

import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import About_Us from '../views/About_Us.vue'
import Contacts from '../views/Contacts.vue'
import Our_Product from '../views/Our_Product.vue'
import Borrow_req from '../views/Borrow_req.vue'
import Borrow from '../views/Borrow.vue'
import PPE from '../views/PPE.vue'
import Report from '../views/Report.vue'
import User from '../views/User.vue'
import { useSupabase } from '../composables/useSupabase.js'

const routes = [
    {path: '/', 
        component: Landing,
        children: [
            {path: '/About_Us', component: About_Us},
            {path: '/Contacts', component: Contacts},
            {path: '/Our_Product', component: Our_Product}
        ]
    },
    {path: '/Dashboard',
        component: Dashboard,
        children: [
            {path: '/User', component: User},
            {path: '/Borrow_req', component: Borrow_req},
            {path: '/Borrow', component: Borrow},
            {path: '/PPE', component: PPE},
            {path: '/Report', component: Report}
        ]
    },
    {path: '/Login', component: Login},
    {path: '/Dashboard', component: Dashboard},
    {path: '/Borrow_req', component: Borrow_req},
    {path: '/Borrow', component: Borrow},
    {path: '/PPE', component: PPE},
    {path: '/Report', component: Report},
    {path: '/User', component: User}
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router