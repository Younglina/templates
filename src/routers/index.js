import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/home.vue'
import Login from '../pages/login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/user', component: () => import('../pages/user.vue') },
  { path: '/role', component: () => import('../pages/role.vue') },
  { path: '/test', component: () => import('../pages/test.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
