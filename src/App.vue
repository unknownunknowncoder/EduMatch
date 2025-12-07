<template>
  <!-- 
    全局容器配置：
    1. bg-[#f2f0e9]: 全局羊皮纸背景，确保没有页面出现突兀的灰/白。
    2. text-[#1a3c34]: 默认文字颜色为深墨绿，比纯黑更柔和、更有书卷气。
    3. selection:...: 定义全局选中文本的颜色（墨绿底、金字），细节决定高级感。
  -->
  <div class="min-h-screen bg-[#f2f0e9] font-sans text-[#1a3c34] selection:bg-[#1a3c34] selection:text-[#d4c5a3] antialiased overflow-x-hidden">
    
    <!-- 检查是否为认证页面 (全屏布局) -->
    <div v-if="isAuthPage">
      <main class="min-h-screen w-full relative">
        <!-- 添加路由过渡动画 -->
        <RouterView v-slot="{ Component, route }">
          <transition name="fade" mode="out-in" appear>
            <div class="w-full h-full">
              <component :is="Component" :key="route.path" v-if="Component" />
            </div>
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- 首页和认证页面使用独立布局 -->
    <div v-if="!shouldUseFullLayout">
      <main class="min-h-screen w-full relative">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- 主应用布局 (带导航栏) -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- 全局顶部导航栏 -->
      <TopNavigation />
      
      <!-- 主内容区域 -->
      <main class="flex-1 pb-20 md:pb-0 relative z-0">
        <!-- 页面切换时的淡入淡出效果 -->
        <RouterView v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in" appear>
            <div class="w-full h-full">
              <component :is="Component" :key="route.path" v-if="Component" />
            </div>
          </transition>
        </RouterView>
      </main>
      
      <!-- 底部导航栏（移动端） -->
      <BottomNavigation />
    </div>
    
    <!-- 全局悬浮球AI助手 -->
    <GlobalFloatingBall />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import TopNavigation from '@/components/TopNavigation.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import GlobalFloatingBall from '@/components/GlobalFloatingBall.vue'

// 预加载关键页面组件
const preloadComponents = () => {
  // 预加载最常用的页面组件
  setTimeout(() => {
    import('@/views/CreateResource.vue').catch(() => {})
    import('@/views/CommunityPage.vue').catch(() => {})
    import('@/views/StudyPlanPage.vue').catch(() => {})
    import('@/views/ProfilePage.vue').catch(() => {})
  }, 1000) // 延迟1秒预加载，避免影响首页加载速度
}

// 获取当前路由
const route = useRoute()

// 初始化主题 (虽然我们锁定了深林风格，但保留 Store 以防未来扩展)
const themeStore = useThemeStore()

// 检查是否为认证相关页面
const isAuthPage = computed(() => {
  const authRoutes = ['/login', '/register']
  return authRoutes.includes(route.path)
})

// 检查是否需要使用完整布局（带导航栏）
const shouldUseFullLayout = computed(() => {
  // 只有认证页面不需要全局导航栏
  // 首页现在也使用全局导航栏
  return !isAuthPage.value
})

onMounted(() => {
  themeStore.initTheme()
  // 强制设置 document 的背景色，防止 iOS 橡皮筋效果露出白色背景
  document.body.style.backgroundColor = '#f2f0e9'
  // 预加载组件
  preloadComponents()
})
</script>

<style>
/* --- 全局样式注入 (Global Styles) --- */

/* 1. 自定义滚动条 (Scrollbar) - 复古墨绿风格 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f2f0e9; /* 轨道颜色与背景一致 */
}

::-webkit-scrollbar-thumb {
  background-color: #1a3c34; /* 滑块颜色：墨绿 */
  border-radius: 4px;
  border: 2px solid #f2f0e9; /* 给滑块加个边框，制造悬浮感 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #235246;
}

/* 2. 页面过渡动画 (Page Transitions) - 缓慢优雅 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px); /* 轻微上浮入场 */
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 3. 字体优化 */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>