<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin System (Simple)</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">系统状态</h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-blue-100 rounded">
          <h3 class="font-medium text-blue-800">✅ 管理员系统加载成功</h3>
        </div>
        
        <div class="p-4 bg-green-100 rounded">
          <h3 class="font-medium text-green-800">🔧 正在检查各个模块...</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div class="bg-white p-6 border rounded-lg shadow-sm">
            <div class="text-sm font-medium text-gray-600">用户管理</div>
            <div class="text-2xl font-bold text-gray-900">{{ stats.users }}</div>
          </div>
          
          <div class="bg-white p-6 border rounded-lg shadow-sm">
            <div class="text-sm font-medium text-gray-600">帖子管理</div>
            <div class="text-2xl font-bold text-gray-900">{{ stats.posts }}</div>
          </div>
          
          <div class="bg-white p-6 border rounded-lg shadow-sm">
            <div class="text-sm font-medium text-gray-600">学习计划</div>
            <div class="text-2xl font-bold text-gray-900">{{ stats.plans }}</div>
          </div>
          
          <div class="bg-white p-6 border rounded-lg shadow-sm">
            <div class="text-sm font-medium text-gray-600">资源管理</div>
            <div class="text-2xl font-bold text-gray-900">{{ stats.resources }}</div>
          </div>
        </div>
        
        <div class="mt-8 space-y-4">
          <h3 class="text-lg font-medium">快速操作</h3>
          <div class="flex flex-wrap gap-4">
            <button 
              @click="loadStats"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              刷新统计数据
            </button>
            
            <button 
              @click="testDatabase"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              测试数据库连接
            </button>
            
            <button 
              @click="$router.push('/admin/test')"
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              组件测试页面
            </button>
            
            <button 
              @click="$router.push('/')"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              返回主页
            </button>
          </div>
        </div>
        
        <div v-if="message" :class="[
          'p-4 rounded mt-4',
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          messageType === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        ]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { showToast } from '@/utils/message'

const dbStore = useDatabaseStore()
const message = ref('')
const messageType = ref<'success' | 'error' | 'warning' | 'info'>('info')

const stats = ref({
  users: 0,
  posts: 0,
  plans: 0,
  resources: 0
})

const showMessage = (text: string, type: typeof messageType.value = 'info') => {
  message.value = text
  messageType.value = type
  
  // 3秒后自动清除消息
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const loadStats = async () => {
  try {
    showMessage('正在加载统计数据...', 'info')
    
    const client = await dbStore.getClient()
    if (!client) {
      showMessage('数据库连接失败', 'error')
      return
    }
    
    // 并行获取所有统计数据
    const [usersResult, postsResult, plansResult, resourcesResult] = await Promise.all([
      client.from('users').select('*', { count: 'exact', head: true }),
      client.from('community_posts').select('*', { count: 'exact', head: true }),
      client.from('study_plans').select('*', { count: 'exact', head: true }),
      client.from('resources').select('*', { count: 'exact', head: true })
    ])
    
    stats.value = {
      users: usersResult.count || 0,
      posts: postsResult.count || 0,
      plans: plansResult.count || 0,
      resources: resourcesResult.count || 0
    }
    
    showMessage('统计数据加载完成', 'success')
    
  } catch (error) {
    console.error('加载统计数据失败:', error)
    showMessage(`加载失败: ${error.message}`, 'error')
  }
}

const testDatabase = async () => {
  try {
    showMessage('测试数据库连接...', 'info')
    
    const client = await dbStore.getClient()
    if (!client) {
      showMessage('无法获取数据库客户端', 'error')
      return
    }
    
    // 简单的连接测试
    const { data, error } = await client.from('users').select('id').limit(1)
    
    if (error) {
      showMessage(`数据库连接失败: ${error.message}`, 'error')
    } else {
      showMessage('数据库连接正常', 'success')
      
      // 使用 toast 测试消息系统
      showToast({
        text: '数据库连接测试成功！',
        type: 'success'
      })
    }
    
  } catch (error) {
    console.error('数据库测试失败:', error)
    showMessage(`数据库测试异常: ${error.message}`, 'error')
  }
}

onMounted(() => {
  loadStats()
})
</script>