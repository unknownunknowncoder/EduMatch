import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import { dbService } from './services/database'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化数据库连接 (延迟执行，避免阻塞应用启动)
setTimeout(() => {
  dbService.init().catch(error => {
    console.warn('数据库初始化失败，应用仍可正常使用:', error.message)
  })
}, 1000)

app.mount('#app')