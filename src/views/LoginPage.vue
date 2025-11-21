<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">用户登录</h1>
        <p class="text-sm text-gray-600">请登录以访问学习平台</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="formData.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            v-model="formData.password"
            type="password"
            minlength="6"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入密码（至少6位）"
          />
          <div v-if="formData.password && formData.password.length < 6" class="mt-1 text-xs text-red-600">
            密码不能少于6位
          </div>
        </div>

        <div
          v-if="message"
          :class="[
            'p-3 rounded-md text-sm',
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          ]"
        >
          {{ message }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/register" class="text-blue-600 hover:underline text-sm">
          还没有账号？立即注册
        </router-link>
      </div>

      <div class="mt-4 text-center">
        <router-link to="/" class="text-gray-600 hover:underline text-sm">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useRouter } from 'vue-router'

const router = useRouter()
const dbStore = useDatabaseStore()

const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const formData = reactive({
  username: '',
  password: ''
})

// 简单的密码哈希函数（实际项目中应该使用更安全的哈希算法）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleLogin() {
  if (!formData.username || !formData.password) {
    message.value = '请填写用户名和密码'
    messageType.value = 'error'
    return
  }

  if (formData.password.length < 6) {
    message.value = '密码不能少于6位'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    // 根据用户名获取用户
    const user = await dbStore.getUserByUsername(formData.username)
    if (!user) {
      message.value = '用户不存在'
      messageType.value = 'error'
      return
    }

    // 验证密码
    const inputPasswordHash = await hashPassword(formData.password)
    if (user.password_hash !== inputPasswordHash) {
      message.value = '密码错误'
      messageType.value = 'error'
      return
    }

    // 登录成功，将用户信息存储到 localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar_url: user.avatar_url
    }))

    message.value = '登录成功！正在跳转...'
    messageType.value = 'success'

    // 获取重定向目标，如果没有则跳转到首页
    const redirectTo = router.currentRoute.value.query.redirect as string || '/'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1000)

  } catch (error) {
    console.error('登录失败:', error)
    message.value = '登录失败，请稍后重试'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>