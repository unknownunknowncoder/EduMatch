<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">EduMatch 后台管理</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">请使用管理员账号登录</p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-4">
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {{ errorMessage }}
          </div>
          
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入用户名"
              :disabled="isLoading"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="请输入密码"
              :disabled="isLoading"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                记住我
              </label>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
              <span v-else>登录</span>
            </button>
          </div>
        </div>
        
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            默认账号：admin / 123456
          </p>
          <div class="mt-4">
            <router-link 
              to="/" 
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              ← 返回首页
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 默认账号密码
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456'
}

// 检查是否已登录
onMounted(() => {
  if (localStorage.getItem('adminToken')) {
    router.push('/admin')
  }
  
  // 如果有记住的登录信息，自动填充
  const savedUsername = localStorage.getItem('adminUsername')
  if (savedUsername) {
    loginForm.username = savedUsername
    loginForm.rememberMe = true
  }
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 验证登录信息
    if (loginForm.username !== ADMIN_CREDENTIALS.username || 
        loginForm.password !== ADMIN_CREDENTIALS.password) {
      throw new Error('用户名或密码错误')
    }
    
    // 登录成功，保存token和用户信息
    const token = 'admin-token-' + Date.now()
    const userInfo = {
      username: loginForm.username,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUserInfo', JSON.stringify(userInfo))
    
    // 如果选择记住我，保存用户名
    if (loginForm.rememberMe) {
      localStorage.setItem('adminUsername', loginForm.username)
    } else {
      localStorage.removeItem('adminUsername')
    }
    
    // 获取重定向地址
    const redirect = route.query.redirect as string || '/admin'
    
    // 跳转到后台管理页面
    await router.replace(redirect)
    
  } catch (error: any) {
    errorMessage.value = error.message || '登录失败，请重试'
    console.error('Admin login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>