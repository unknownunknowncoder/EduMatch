<template>
  <!-- 
    移动端底部导航
    背景：深墨绿 (#1a3c34)
    边框：顶部微光金线
    布局：固定底部，增加 safe-area-padding 适配全面屏
  -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#1a3c34] border-t border-[#d4c5a3]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)] transition-all duration-300">
    <div class="grid grid-cols-5 h-16">
      
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative flex flex-col items-center justify-center gap-1 group transition-colors"
        :class="isActive(item.path) ? 'text-[#d4c5a3]' : 'text-[#d4c5a3]/40 hover:text-[#d4c5a3]/70'"
      >
        <!-- 激活时的顶部光标 (Glowing Indicator) -->
        <span 
          class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#d4c5a3] shadow-[0_0_8px_#d4c5a3] rounded-b-sm transition-all duration-300"
          :class="isActive(item.path) ? 'opacity-100' : 'opacity-0'"
        ></span>

        <!-- 图标 -->
        <component 
          :is="item.icon" 
          class="w-6 h-6 transition-transform duration-300"
          :class="isActive(item.path) ? '-translate-y-0.5' : 'group-hover:-translate-y-0.5'" 
        />
        
        <!-- 标签 (学术风微型字体) -->
        <span class="text-[9px] font-serif font-bold uppercase tracking-widest leading-none">
          {{ item.label }}
        </span>
      </router-link>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { 
  Home, 
  Search, 
  PlusSquare, // 替换为更像"记录"的图标
  Users, 
  User 
} from 'lucide-vue-next'

const route = useRoute()

// 导航配置 (使用更简练的学术隐喻)
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Find', icon: Search },
  { path: '/create-resource', label: 'Entry', icon: PlusSquare },
  { path: '/community', label: 'Hall', icon: Users },
  { path: '/profile', label: 'Me', icon: User }
]

// 简单的路由激活判断
const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* 适配 iPhone 底部黑条的内边距 */
nav {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>