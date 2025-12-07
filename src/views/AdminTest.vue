<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Admin System Test Page</h1>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Component Import Test</h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-green-100 rounded">
          <h3 class="font-medium text-green-800">✅ 基础 Vue 组件正常</h3>
        </div>
        
        <div class="p-4 bg-blue-100 rounded">
          <h3 class="font-medium text-blue-800">🔧 测试各个功能模块</h3>
        </div>
        
        <button 
          @click="testDatabase"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          测试数据库连接
        </button>
        
        <button 
          @click="testAuth"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          测试认证系统
        </button>
        
        <div v-if="testResults.length > 0" class="mt-4">
          <h3 class="font-medium mb-2">测试结果：</h3>
          <div class="space-y-2">
            <div 
              v-for="result in testResults" 
              :key="result.id"
              :class="[
                'p-3 rounded',
                result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ result.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">快速导航</h2>
      <div class="space-y-2">
        <router-link to="/admin" class="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          返回管理员主页
        </router-link>
        <router-link to="/" class="block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          返回主页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { showToast } from '@/utils/message'
import { getCurrentAdmin, isAdminLoggedIn } from '@/utils/adminAuth'

const router = useRouter()
const dbStore = useDatabaseStore()
const testResults = ref<Array<{id: string, message: string, success: boolean}>>([])

const addResult = (message: string, success: boolean) => {
  testResults.value.push({
    id: Date.now().toString(),
    message,
    success
  })
}

const testDatabase = async () => {
  try {
    addResult('开始测试数据库连接...', true)
    
    const client = await dbStore.getClient()
    if (client) {
      addResult('✅ 数据库客户端获取成功', true)
      
      // 测试查询
      const { data, error } = await client.from('users').select('count').limit(1)
      if (error) {
        addResult(`❌ 数据库查询失败: ${error.message}`, false)
      } else {
        addResult('✅ 数据库查询测试成功', true)
      }
    } else {
      addResult('❌ 数据库客户端获取失败', false)
    }
  } catch (error) {
    addResult(`❌ 数据库测试异常: ${error.message}`, false)
  }
}

const testAuth = () => {
  try {
    addResult('开始测试认证系统...', true)
    
    const isLoggedIn = isAdminLoggedIn()
    addResult(`管理员登录状态: ${isLoggedIn ? '已登录' : '未登录'}`, true)
    
    const currentAdmin = getCurrentAdmin()
    if (currentAdmin) {
      addResult(`当前管理员: ${currentAdmin.nickname || currentAdmin.username || 'Unknown'}`, true)
    } else {
      addResult('未获取到当前管理员信息', false)
    }
    
    // 测试消息系统
    showToast({
      text: '消息系统测试成功',
      type: 'success',
      duration: 2000
    })
    addResult('✅ 消息提示系统测试成功', true)
    
  } catch (error) {
    addResult(`❌ 认证系统测试异常: ${error.message}`, false)
  }
}
</script>