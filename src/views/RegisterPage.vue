<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">用户注册</h1>
        <p class="text-sm text-gray-600">创建账号以开始您的学习之旅</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
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
          <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          <input
            v-model="formData.nickname"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入昵称（可选）"
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
            @input="validatePassword"
          />
          <div v-if="formData.password && formData.password.length < 6" class="mt-1 text-xs text-red-600">
            密码长度不足6位
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            minlength="6"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请再次输入密码"
            @input="validatePassword"
          />
          <div v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="mt-1 text-xs text-red-600">
            两次输入的密码不一致
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
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-blue-600 hover:underline text-sm">
          已有账号？立即登录
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
  nickname: '',
  password: '',
  confirmPassword: ''
})

// 实时密码验证
function validatePassword() {
  // 清除之前的密码相关错误信息
  if (formData.password.length >= 6 && formData.confirmPassword && formData.password === formData.confirmPassword) {
    message.value = ''
  }
}

// 简单的密码哈希函数（实际项目中应该使用更安全的哈希算法）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleRegister() {
  // 验证表单
  if (!formData.username || !formData.password) {
    message.value = '请填写用户名和密码'
    messageType.value = 'error'
    return
  }

  if (formData.password !== formData.confirmPassword) {
    message.value = '两次输入的密码不一致'
    messageType.value = 'error'
    return
  }

  if (formData.password.length < 6) {
    message.value = '密码长度至少为6位'
    messageType.value = 'error'
    return
  }

  if (formData.username.length < 3) {
    message.value = '用户名长度至少为3位'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    // 检查用户名是否已存在
    const existingUser = await dbStore.getUserByUsername(formData.username)
    if (existingUser) {
      message.value = '该用户名已被注册'
      messageType.value = 'error'
      return
    }

    // 哈希密码
    const passwordHash = await hashPassword(formData.password)

    // 创建用户（移除 email 和 nickname 字段）
    await dbStore.createUser({
      username: formData.username,
      // email: `${formData.username}@edumatch.local`, // 移除 email 字段
      // nickname: formData.nickname || formData.username, // 暂时移除，解决 PGRST204 错误
      password_hash: passwordHash
    })

    message.value = '注册成功！正在为您自动登录...'
    messageType.value = 'success'

    // 注册成功后直接登录
    try {
      // 使用数据库服务验证登录
      const { useDatabaseStore } = await import('@/stores/database')
      const dbStore = useDatabaseStore()
      
      // 获取刚创建的用户
      const user = await dbStore.getUserByUsername(formData.username)
      
      if (user) {
        // 设置登录状态
        await import('@/stores/auth')
        
        // 手动设置认证状态
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        message.value = '注册成功！已自动登录'
        messageType.value = 'success'

        // 1秒后跳转到首页
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        throw new Error('无法获取刚创建的用户信息')
      }
      
    } catch (loginError) {
      console.error('自动登录失败:', loginError)
      // 如果自动登录失败，仍然跳转到登录页面
      message.value = '注册成功，请手动登录'
      messageType.value = 'success'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }

  } catch (error) {
    console.error('注册失败:', error)
    
    // 类型安全的错误处理
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    const errorCode = (error as any)?.code
    const errorDetails = (error as any)?.details
    const errorHint = (error as any)?.hint
    
    console.error('错误详情:', {
      message: errorMsg,
      code: errorCode,
      details: errorDetails,
      hint: errorHint
    })
    
    // 提供更具体的错误信息
    if (errorMsg?.includes('duplicate key') || errorCode === '23505') {
      message.value = '用户名已存在，请选择其他用户名'
    } else if (errorMsg?.includes('connection') || errorCode === 'PGRST301') {
      message.value = '数据库连接失败，请检查网络连接'
    } else if (errorMsg?.includes('validation') || errorCode === 'PGRST116') {
      message.value = '数据格式错误，请检查输入信息'
    } else {
      message.value = `注册失败: ${errorMsg || '请稍后重试'}`
    }
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>