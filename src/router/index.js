import { createRouter, createWebHistory } from 'vue-router'

import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Logon from '../views/Logon.vue'
import Dashboard from '../views/Dashboard.vue'
import About_Us from '../views/About_Us.vue'
import Contacts from '../views/Contacts.vue'
import Our_Product from '../views/Our_Product.vue'
import Borrow from '../views/Borrow_req.vue'
import Integrity from '../views/Integrity.vue'
import PPE from '../views/PPE.vue'
import Report from '../views/Report.vue'
import Reposition from '../views/Reposition_req.vue'
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
            {path: '/Borrow', component: Borrow},
            {path: '/Integrity', component: Integrity},
            {path: '/PPE', component: PPE},
            {path: '/Report', component: Report}
        ]
    },
    {path: '/Login', component: Login},
    {path: '/Logon', component: Logon},
    {path: '/Dashboard', component: Dashboard},
    {path: '/Borrow', component: Borrow},
    {path: '/Integrity', component: Integrity},
    {path: '/PPE', component: PPE},
    {path: '/Report', component: Report},
    {path: '/Reposition', component: Reposition},
    {path: '/User', component: User}
]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router