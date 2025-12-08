<template>
  <!-- 
    全局顶部导航 
    背景色：墨绿 (#1a3c34)
    文字色：羊皮纸白 (#f2f0e9) & 黄铜金 (#d4c5a3)
    边框：底部金色细线
  -->
  <header class="sticky top-0 z-50 w-full bg-[#1a3c34] border-b border-[#d4c5a3]/20 shadow-xl transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      
      <!-- 1. Logo (Gold Seal Style) -->
      <router-link to="/" class="flex items-center gap-3 group cursor-pointer">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <!-- 背景装饰：旋转的正方形 -->
          <div class="absolute inset-0 bg-[#d4c5a3] rotate-3 rounded-sm opacity-20 group-hover:rotate-12 transition-transform duration-500"></div>
          <div class="absolute inset-0 bg-[#1a3c34] border border-[#d4c5a3] rounded-sm z-10 flex items-center justify-center group-hover:bg-[#d4c5a3] transition-colors duration-500">
            <BookOpen class="w-5 h-5 text-[#d4c5a3] group-hover:text-[#1a3c34] transition-colors duration-500" />
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-serif font-bold text-[#f2f0e9] tracking-wide leading-none group-hover:text-[#d4c5a3] transition-colors">
            EduMatch
          </span>
          <span class="text-[10px] text-[#d4c5a3]/60 uppercase tracking-[0.2em] font-medium group-hover:text-[#d4c5a3] transition-colors">
            学术档案
          </span>
        </div>
      </router-link>

      <!-- 2. Desktop Navigation (The Shelf) -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="relative group py-2 px-1 transition-all duration-200"
          :class="isActiveRoute(item.path) ? 'text-[#d4c5a3]' : 'text-[#f2f0e9]/70 hover:text-[#f2f0e9]'"
          @click="handleNavClick"
        >
          <div class="flex items-center gap-2 text-sm font-serif font-medium tracking-wide">
            <component 
              :is="item.icon" 
              class="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" 
              :class="isActiveRoute(item.path) ? 'text-[#d4c5a3]' : 'text-[#d4c5a3]/50 group-hover:text-[#d4c5a3]'"
            />
            <span>{{ item.name }}</span>
          </div>
          
          <!-- Active/Hover Indicator (Underline) -->
          <span 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4c5a3] transform origin-left transition-transform duration-300"
            :class="isActiveRoute(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
          ></span>
        </router-link>
      </nav>

      <!-- 3. User Status & Actions -->
      <div class="flex items-center gap-6">
        <!-- Help Link -->
        <router-link
          to="/help"
          class="hidden sm:inline-flex items-center text-xs font-bold text-[#d4c5a3]/60 hover:text-[#d4c5a3] uppercase tracking-widest transition-colors"
        >
          <HelpCircle class="w-3.5 h-3.5 mr-1.5" />
          帮助
        </router-link>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-8 bg-[#d4c5a3]/20"></div>

        <template v-if="currentUser">
          <!-- User Profile (Clickable Badge) -->
          <router-link 
            to="/profile"
            class="hidden md:flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-transparent hover:border-[#d4c5a3]/30 hover:bg-[#d4c5a3]/10 transition-all cursor-pointer group"
          >
            <div class="flex flex-col items-end">
              <span class="text-sm font-serif text-[#f2f0e9] group-hover:text-[#d4c5a3] transition-colors">
                {{ currentUser.nickname || currentUser.username || '学者' }}
              </span>
              <span class="text-[10px] text-[#d4c5a3]/50 font-mono uppercase">在线</span>
            </div>
            <div class="w-9 h-9 rounded-sm bg-[#d4c5a3] flex items-center justify-center text-[#1a3c34] font-bold font-serif border-2 border-[#1a3c34] group-hover:scale-105 transition-transform">
              {{ (currentUser.nickname || currentUser.username || 'U').charAt(0).toUpperCase() }}
            </div>
          </router-link>

          <!-- Mobile User Icon (Simple) -->
          <router-link to="/profile" class="md:hidden text-[#d4c5a3]">
            <User class="w-6 h-6" />
          </router-link>

          <!-- Logout Button (Icon only) -->
          <button 
            @click="logout" 
            class="text-[#f2f0e9]/40 hover:text-[#b03e3e] transition-colors p-2" 
            title="登出"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </template>

        <template v-else>
          <div class="flex items-center gap-4">
            <button 
              @click="openAuthModal('login')" 
              class="text-sm font-bold text-[#f2f0e9] hover:text-[#d4c5a3] transition-colors font-serif tracking-wide"
            >
              登录
            </button>
            <button 
              @click="openAuthModal('register')" 
              class="px-5 py-2 text-xs font-bold text-[#1a3c34] bg-[#d4c5a3] hover:bg-[#f2f0e9] transition-all rounded-sm uppercase tracking-widest shadow-[0_0_15px_rgba(212,197,163,0.2)] hover:shadow-[0_0_20px_rgba(212,197,163,0.4)]"
            >
              注册账号
            </button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  BookOpen, 
  Home, 
  PlusCircle, 
  Users, 
  Calendar,
  User,
  LogOut,
  HelpCircle
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 导航项配置
const navigationItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '创建资源', path: '/create-resource', icon: PlusCircle }, // 改名为更学术的 "New Entry"
  { name: '社区研讨', path: '/community', icon: Users }, // 社区 -> 研讨会
  { name: '学习计划', path: '/study-plan', icon: Calendar }, // 计划 -> 日程
  { name: '个人档案', path: '/profile', icon: User } // 个人中心 -> 档案
]

// 检查路由是否激活
const isActiveRoute = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// 获取当前用户
const currentUser = ref<any>(null)

const loadUser = () => {
  const userStr = localStorage.getItem('currentUser')
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch (error) {
      console.error('User parse error:', error)
      currentUser.value = null
    }
  } else {
    currentUser.value = null
  }
}

const logout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/login')
}

const openAuthModal = (type: 'login' | 'register') => {
  router.push(`/${type}`)
}

const handleNavClick = (event: MouseEvent) => {
  // 添加触觉反馈（如果设备支持）
  if (navigator.vibrate) {
    navigator.vibrate(10)
  }
}

onMounted(() => {
  loadUser()
  window.addEventListener('storage', loadUser)
})

router.afterEach(() => {
  loadUser()
})
</script>

<style scoped>
/* 可选：为导航栏添加更细腻的阴影效果 */
header {
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.3);
}
</style>

