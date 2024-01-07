import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from './router/index'
import App from './App.vue'

import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
app.use(router)
app.use(ElMessage).use(ElMessageBox)
app.use(createPinia())
app.mount('#app')
