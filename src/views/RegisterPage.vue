<template>
  <div class="min-h-screen flex font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3]">
    
    <!-- 左侧：意境图 (Deep Forest / Archive) -->
    <!-- 选择一张书架/阶梯的图片，寓意“开始旅程” -->
    <div class="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0f281f]">
      <img 
        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale-[20%]"
        alt="Library Archive"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f281f] via-transparent to-[#0f281f]/40"></div>
      
      <div class="relative z-10 m-auto text-center px-16">
         <div class="w-16 h-16 bg-[#d4c5a3] rounded-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
            <UserPlus class="w-8 h-8 text-[#0f281f]" />
         </div>
         <h2 class="text-4xl font-serif font-bold text-[#f4f1ea] mb-4 tracking-wide">加入注册</h2>
         <p class="text-[#d4c5a3]/80 text-lg font-serif italic">"开始您进入无限档案的旅程"</p>
      </div>
    </div>

    <!-- 右侧：注册表单 (Paper Style) -->
    <div class="w-full lg:w-1/2 bg-[#f4f1ea] flex items-center justify-center p-8 relative overflow-y-auto">
      <!-- 移动端顶部装饰 -->
      <div class="lg:hidden absolute top-0 left-0 w-full h-2 bg-[#0f281f]"></div>

      <div class="w-full max-w-md space-y-10 py-10">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-serif font-bold text-[#0f281f]">学者注册</h1>
          <p class="text-slate-500 text-sm tracking-wide uppercase">创建您的永久档案</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-8">
          
          <!-- Username & Nickname -->
          <div class="space-y-6">
            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">用户名 *</label>
              <input
                v-model="formData.username"
                type="text"
                required
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-2 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="选择一个唯一账号"
              />
              <div v-if="formData.username && formData.username.length < 3" class="absolute -bottom-5 right-0 text-xs text-red-600 font-mono">
                最少3个字符
              </div>
            </div>

            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">显示名称</label>
              <input
                v-model="formData.nickname"
                type="text"
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-2 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="我们应该如何称呼您？（可选）"
              />
            </div>
          </div>

          <!-- Passwords (Grid Layout for Desktop) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">密码 *</label>
              <input
                v-model="formData.password"
                type="password"
                minlength="6"
                required
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-2 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="最少6个字符"
                @input="validatePassword"
              />
            </div>

            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">确认密码 *</label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                minlength="6"
                required
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-2 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="再次输入密码"
                @input="validatePassword"
              />
            </div>
          </div>

          <!-- Validation Errors (Inline) -->
          <div class="space-y-1">
             <div v-if="formData.password && formData.password.length < 6" class="text-xs text-red-600 font-mono text-right">
                • 密码至少需要6个字符
             </div>
             <div v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="text-xs text-red-600 font-mono text-right">
                • 两次密码输入不一致
             </div>
          </div>

          <!-- Message Box -->
          <transition name="fade">
            <div
              v-if="message"
              :class="[
                'p-4 border-l-4 text-sm font-medium flex items-start gap-3',
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-600' 
                  : 'bg-red-50 text-red-800 border-red-600'
              ]"
            >
              <span v-if="messageType === 'error'" class="text-lg leading-none">!</span>
              <span>{{ message }}</span>
            </div>
          </transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#0f281f] text-[#d4c5a3] py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a4533] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-[#d4c5a3] border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isLoading ? '处理中...' : '完成注册' }}</span>
            <ArrowRight v-if="!isLoading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <!-- Footer Links -->
        <div class="space-y-4 text-center border-t border-[#0f281f]/10 pt-8">
          <p class="text-slate-600 text-sm">
            已经注册？ 
            <router-link to="/login" class="text-[#0f281f] font-bold hover:underline decoration-[#d4c5a3] decoration-2 underline-offset-4">
              访问您的账户
            </router-link>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useRouter } from 'vue-router'
import { UserPlus, ArrowRight } from 'lucide-vue-next'

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
  if (formData.password.length >= 6 && formData.confirmPassword && formData.password === formData.confirmPassword) {
    message.value = ''
  }
}

// 简单的密码哈希函数
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
    message.value = 'Required fields missing.'
    messageType.value = 'error'
    return
  }

  if (formData.password !== formData.confirmPassword) {
    message.value = 'Passwords do not match.'
    messageType.value = 'error'
    return
  }

  if (formData.password.length < 6) {
    message.value = 'Password length insufficient (min 6).'
    messageType.value = 'error'
    return
  }

  if (formData.username.length < 3) {
    message.value = 'Username too short (min 3).'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    // 检查用户名是否已存在
    const existingUser = await dbStore.getUserByUsername(formData.username)
    if (existingUser) {
      message.value = 'Username already registered.'
      messageType.value = 'error'
      return
    }

    // 哈希密码
    const passwordHash = await hashPassword(formData.password)

    // 创建用户
    await dbStore.createUser({
      username: formData.username,
      // email: `${formData.username}@edumatch.local`,
      // nickname: formData.nickname || formData.username, // 暂时移除
      password_hash: passwordHash
    })

    message.value = 'Registration successful. Initializing session...'
    messageType.value = 'success'

    // 注册成功后直接登录
    try {
      const { useDatabaseStore } = await import('@/stores/database')
      const dbStore = useDatabaseStore()
      const user = await dbStore.getUserByUsername(formData.username)
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        
        message.value = 'Session initialized. Redirecting...'
        messageType.value = 'success'

        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        throw new Error('User retrieval failed')
      }
      
    } catch (loginError) {
      console.error('Auto-login failed:', loginError)
      message.value = 'Registration complete. Please log in manually.'
      messageType.value = 'success'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }

  } catch (error) {
    console.error('Registration failed:', error)
    
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as any)?.code
    
    if (errorMsg?.includes('duplicate key') || errorCode === '23505') {
      message.value = 'Username already taken.'
    } else if (errorMsg?.includes('connection') || errorCode === 'PGRST301') {
      message.value = 'Network error. Please check connection.'
    } else {
      message.value = `Registration failed: ${errorMsg}`
    }
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>