<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">管理员控制台</h1>
        <div class="text-green-600">
          <p>✅ 管理员页面访问成功！</p>
          <p class="mt-2">当前用户状态: {{ isLoggedIn ? '已登录' : '未登录' }}</p>
          <p class="mt-2">当前时间: {{ currentTime }}</p>
        </div>
        
        <div class="mt-6 space-x-4">
          <button 
            @click="$router.push('/admin/login')" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            前往管理员登录
          </button>
          <button 
            @click="$router.push('/')" 
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 检查管理员登录状态
const isLoggedIn = ref(false)
const currentTime = ref('')

// 简单的登录状态检查
const checkLoginStatus = () => {
  const token = localStorage.getItem('adminToken')
  const userInfo = localStorage.getItem('adminUserInfo')
  isLoggedIn.value = !!(token && userInfo)
}

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

let timeInterval: NodeJS.Timeout

onMounted(() => {
  checkLoginStatus()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  console.log('✅ AdminDatabase page loaded successfully')
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>