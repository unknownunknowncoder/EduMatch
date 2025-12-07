<template>
  <div class="min-h-screen flex font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3]">
    
    <!-- 左侧：意境图 (Deep Forest / Library) -->
    <!-- 在大屏幕上显示，营造氛围 -->
    <div class="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0f281f]">
      <img 
        src="https://images.unsplash.com/photo-1507842217121-ad5864104f10?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale-[30%]"
        alt="Library Mood"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0f281f] via-transparent to-[#0f281f]/50"></div>
      
      <div class="relative z-10 m-auto text-center px-12">
         <div class="w-16 h-16 bg-[#d4c5a3] rounded-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BookOpen class="w-8 h-8 text-[#0f281f]" />
         </div>
         <h2 class="text-4xl font-serif font-bold text-[#f4f1ea] mb-4 tracking-wide">知识在等待</h2>
         <p class="text-[#d4c5a3]/80 text-lg font-serif italic">"进入您的个人智慧档案"</p>
      </div>
    </div>

    <!-- 右侧：登录表单 (Paper Style) -->
    <div class="w-full lg:w-1/2 bg-[#f4f1ea] flex items-center justify-center p-8 relative">
      <!-- 移动端顶部装饰 -->
      <div class="lg:hidden absolute top-0 left-0 w-full h-2 bg-[#0f281f]"></div>

      <div class="w-full max-w-md space-y-12">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-serif font-bold text-[#0f281f]">成员登录</h1>
          <p class="text-slate-500 text-sm tracking-wide uppercase">验证身份以访问系统</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-8">
          <div class="space-y-6">
            <!-- Username Input -->
            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">用户名</label>
              <input
                v-model="formData.username"
                type="text"
                required
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-3 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="输入您的账号"
              />
            </div>

            <!-- Password Input -->
            <div class="group relative">
              <label class="block text-xs font-bold text-[#0f281f] uppercase tracking-widest mb-2">密码</label>
              <input
                v-model="formData.password"
                type="password"
                minlength="6"
                required
                class="w-full bg-transparent border-b-2 border-[#d4c5a3] px-0 py-3 text-[#0f281f] placeholder-slate-400 focus:outline-none focus:border-[#0f281f] transition-colors font-serif text-lg"
                placeholder="输入密码"
              />
              <div v-if="formData.password && formData.password.length < 6" class="absolute -bottom-5 right-0 text-xs text-red-600 font-mono">
                至少需要6个字符
              </div>
            </div>
          </div>

          <!-- Message Box -->
          <transition name="fade">
            <div
              v-if="message"
              :class="[
                'p-4 border-l-4 text-sm font-medium flex items-center gap-3',
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-600' 
                  : 'bg-red-50 text-red-800 border-red-600'
              ]"
            >
              <span v-if="messageType === 'error'" class="text-lg">!</span>
              {{ message }}
            </div>
          </transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#0f281f] text-[#d4c5a3] py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a4533] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-[#d4c5a3] border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isLoading ? '验证中...' : '访问档案' }}</span>
            <ArrowRight v-if="!isLoading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <!-- Footer Links -->
        <div class="space-y-4 text-center border-t border-[#0f281f]/10 pt-8">
          <p class="text-slate-600 text-sm">
            新学者？ 
            <router-link to="/register" class="text-[#0f281f] font-bold hover:underline decoration-[#d4c5a3] decoration-2 underline-offset-4">
              申请注册
            </router-link>
          </p>
          <div>
            <router-link to="/" class="text-xs text-slate-400 hover:text-[#0f281f] transition-colors font-mono">
              ← 返回首页
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useRouter } from 'vue-router'
import { BookOpen, ArrowRight } from 'lucide-vue-next' // 引入与首页风格一致的图标

const router = useRouter()
const dbStore = useDatabaseStore()

const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const formData = reactive({
  username: '',
  password: ''
})

// 简单的密码哈希函数
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function handleLogin() {
  if (!formData.username || !formData.password) {
    message.value = 'Identity credentials required.'
    messageType.value = 'error'
    return
  }

  if (formData.password.length < 6) {
    message.value = 'Passkey invalid (min 6 chars).'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const user = await dbStore.getUserByUsername(formData.username)
    if (!user) {
      message.value = 'Scholar identity not found.'
      messageType.value = 'error'
      return
    }

    const inputPasswordHash = await hashPassword(formData.password)
    if (user.password_hash !== inputPasswordHash) {
      message.value = 'Credentials mismatch.'
      messageType.value = 'error'
      return
    }

    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar_url: user.avatar_url
    }))

    message.value = 'Access Granted. Redirecting...'
    messageType.value = 'success'

    const redirectTo = router.currentRoute.value.query.redirect as string || '/'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1000)

  } catch (error) {
    console.error('Login Error:', error)
    message.value = 'System Error. Please retry.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 简单的淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>