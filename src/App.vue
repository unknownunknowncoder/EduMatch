<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- 检查是否为认证页面 -->
    <div v-if="isAuthPage">
      <!-- 认证页面独立布局 -->
      <main class="min-h-screen w-full">
        <RouterView />
      </main>
    </div>
    
    <!-- 主应用布局 -->
    <div v-else>
      <!-- 桌面端布局 -->
      <div class="hidden md:flex">
        <!-- 侧边导航栏（桌面端） -->
        <SidebarNavigation />
        
        <!-- 主内容区域 -->
        <main class="flex-1 ml-64">
          <RouterView />
        </main>
      </div>
      
      <!-- 移动端布局 -->
      <div class="md:hidden">
        <!-- 主内容区域 -->
        <main class="pb-16">
          <RouterView />
        </main>
      </div>
      
      <!-- 底部导航栏（移动端） -->
      <BottomNavigation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import SidebarNavigation from '@/components/SidebarNavigation.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

// 获取当前路由
const route = useRoute()

// 初始化主题
const themeStore = useThemeStore()

// 检查是否为认证相关页面
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/register']
  return authRoutes.includes(route.path)
})

onMounted(() => {
  themeStore.initTheme()
})
</script>