import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import './styles/admin.css'
import { dbService } from './services/database'

// 全局路由加载状态
router.beforeEach((to, from, next) => {
  // 如果不是第一次加载且路由发生变化，显示简单的过渡效果
  if (from.name && to.name !== from.name) {
    // 页面切换时不阻塞，让组件自然加载
  }
  next()
})

router.afterEach(() => {
  // 路由完成后清理任何可能的错误状态
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 立即初始化数据库连接，确保应用启动时连接就绪
const initDatabase = async () => {
  try {
    console.log('🔄 正在初始化数据库连接...')
    await dbService.init()
    console.log('✅ 数据库连接初始化成功')
  } catch (error) {
    console.warn('⚠️ 数据库初始化失败，应用仍可正常使用:', error.message)
    
    // 如果初始化失败，添加重试机制
    setTimeout(() => {
      console.log('🔄 尝试重新连接数据库...')
      dbService.init().catch(console.error)
    }, 5000)
  }
}

// 在应用挂载前初始化数据库
initDatabase()

app.mount('#app')