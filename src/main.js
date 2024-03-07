/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
console.log(123)
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

import { ElMessage, ElMessageBox } from 'element-plus'
import router from './router/index'
import App from './App.vue'

import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/main.css'
import 'uno.css'
app.use(router)
app.use(ElMessage).use(ElMessageBox)
app.mount('#app')
