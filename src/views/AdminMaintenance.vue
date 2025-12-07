<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="[
        'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse',
        messageType === 'success' ? 'bg-green-600 text-white' : 
        messageType === 'error' ? 'bg-red-600 text-white' : 
        'bg-blue-600 text-white'
      ]"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      {{ messageText }}
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">系统维护</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 系统信息 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">系统信息</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">系统运行时间</p>
                <p class="text-lg font-medium text-gray-900">{{ systemInfo.uptime }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">CPU使用率</p>
                <p class="text-lg font-medium text-gray-900">{{ systemInfo.cpuUsage }}%</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">内存使用率</p>
                <p class="text-lg font-medium text-gray-900">{{ systemInfo.memoryUsage }}%</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">磁盘使用率</p>
                <p class="text-lg font-medium text-gray-900">{{ systemInfo.diskUsage }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据库状态 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">数据库状态</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">连接状态</p>
                <p class="text-lg font-medium" :class="databaseInfo.connected ? 'text-green-600' : 'text-red-600'">
                  {{ databaseInfo.connected ? '已连接' : '未连接' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">活跃连接数</p>
                <p class="text-lg font-medium text-gray-900">{{ databaseInfo.activeConnections }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">数据库大小</p>
                <p class="text-lg font-medium text-gray-900">{{ databaseInfo.size }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">最后备份时间</p>
                <p class="text-lg font-medium text-gray-900">{{ databaseInfo.lastBackup }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 维护工具 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">维护工具</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-3">
              <button
                @click="clearCache"
                :disabled="processing.cache"
                class="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {{ processing.cache ? '清理中...' : '清理缓存' }}
              </button>
              
              <button
                @click="optimizeDatabase"
                :disabled="processing.database"
                class="w-full px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {{ processing.database ? '优化中...' : '优化数据库' }}
              </button>
              
              <button
                @click="backupDatabase"
                :disabled="processing.backup"
                class="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {{ processing.backup ? '备份中...' : '备份数据库' }}
              </button>
              
              <button
                @click="rebuildIndex"
                :disabled="processing.index"
                class="w-full px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {{ processing.index ? '重建中...' : '重建索引' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 日志查看 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">系统日志</h2>
          </div>
          <div class="p-6">
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="log in systemLogs"
                :key="log.id"
                class="flex items-start space-x-2 p-2 rounded text-sm"
                :class="getLogClass(log.level)"
              >
                <span class="flex-shrink-0 w-16">{{ log.time }}</span>
                <span class="flex-shrink-0 w-12 font-medium">{{ log.level }}</span>
                <span class="flex-1">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

const router = useRouter()

// 响应式数据
const processing = ref({
  cache: false,
  database: false,
  backup: false,
  index: false
})

const systemInfo = ref({
  uptime: '15天 8小时 32分钟',
  cpuUsage: 45,
  memoryUsage: 68,
  diskUsage: 72
})

const databaseInfo = ref({
  connected: true,
  activeConnections: 12,
  size: '2.3 GB',
  lastBackup: '2024-01-10 14:30'
})

const systemLogs = ref([
  { id: 1, time: '14:35:22', level: 'INFO', message: '系统启动完成' },
  { id: 2, time: '14:35:25', level: 'INFO', message: '数据库连接成功' },
  { id: 3, time: '14:35:28', level: 'WARNING', message: '缓存清理完成，释放 256MB 内存' },
  { id: 4, time: '14:35:30', level: 'ERROR', message: '邮件服务连接失败' },
  { id: 5, time: '14:35:32', level: 'INFO', message: '用户登录: admin@example.com' }
])

// 返回上一页
const goBack = () => {
  router.push('/admin')
}

// 获取日志样式
const getLogClass = (level: string) => {
  switch (level) {
    case 'ERROR':
      return 'bg-red-50 text-red-800'
    case 'WARNING':
      return 'bg-yellow-50 text-yellow-800'
    case 'INFO':
      return 'bg-blue-50 text-blue-800'
    default:
      return 'bg-gray-50 text-gray-800'
  }
}

// 清理缓存
const clearCache = async () => {
  try {
    processing.value.cache = true
    console.log('开始清理缓存...')
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showToast('缓存清理完成', 'success')
  } catch (error) {
    console.error('清理缓存失败:', error)
    showToast('清理缓存失败', 'error')
  } finally {
    processing.value.cache = false
  }
}

// 优化数据库
const optimizeDatabase = async () => {
  try {
    processing.value.database = true
    console.log('开始优化数据库...')
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    showToast('数据库优化完成', 'success')
  } catch (error) {
    console.error('优化数据库失败:', error)
    showToast('优化数据库失败', 'error')
  } finally {
    processing.value.database = false
  }
}

// 备份数据库
const backupDatabase = async () => {
  try {
    processing.value.backup = true
    console.log('开始备份数据库...')
    
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    showToast('数据库备份完成', 'success')
  } catch (error) {
    console.error('备份数据库失败:', error)
    showToast('备份数据库失败', 'error')
  } finally {
    processing.value.backup = false
  }
}

// 重建索引
const rebuildIndex = async () => {
  try {
    processing.value.index = true
    console.log('开始重建索引...')
    
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    showToast('索引重建完成', 'success')
  } catch (error) {
    console.error('重建索引失败:', error)
    showToast('重建索引失败', 'error')
  } finally {
    processing.value.index = false
  }
}

onMounted(() => {
  console.log('系统维护页面已加载')
})
</script>