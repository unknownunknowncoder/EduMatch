<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">EduMatch 后台管理系统</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
              Admin Panel
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              管理员：{{ currentUser?.nickname || currentUser?.email || 'Admin' }}
            </div>
            <div class="text-sm text-gray-500">
              {{ currentTime }}
            </div>
            <button
              @click="logout"
              class="px-3 py-2 text-sm text-red-600 hover:text-red-900 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0v-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 01-6 0v1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">总用户数</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">总帖子数</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalPosts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">学习计划</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalPlans }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">学习资源</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalResources }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理功能区 -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <span class="w-4 h-4 mr-2 inline-flex items-center justify-center">
                  <!-- 用户管理图标 -->
                  <svg v-if="tab.id === 'users'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0V-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 01-6 0v1"></path>
                  </svg>
                  <!-- 内容管理图标 -->
                  <svg v-else-if="tab.id === 'content'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <!-- 学习计划图标 -->
                  <svg v-else-if="tab.id === 'plans'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <!-- 资源管理图标 -->
                  <svg v-else-if="tab.id === 'resources'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </span>
                {{ tab.name }}
              </div>
            </button>
          </nav>
        </div>

        <!-- 标签页内容 -->
        <div class="p-6">
          <!-- 用户管理内容 -->
          <div v-if="activeTab === 'users'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">用户管理</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="font-medium text-blue-900">用户列表</h4>
                <p class="text-sm text-blue-700 mt-1">查看和管理所有用户</p>
              </div>
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="font-medium text-green-900">用户审核</h4>
                <p class="text-sm text-green-700 mt-1">审核新注册用户</p>
              </div>
              <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 class="font-medium text-purple-900">权限管理</h4>
                <p class="text-sm text-purple-700 mt-1">管理用户权限</p>
              </div>
            </div>
          </div>

          <!-- 内容管理内容 -->
          <div v-if="activeTab === 'content'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">内容管理</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 class="font-medium text-green-900">帖子管理</h4>
                <p class="text-sm text-green-700 mt-1">管理社区帖子</p>
              </div>
              <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 class="font-medium text-yellow-900">内容审核</h4>
                <p class="text-sm text-yellow-700 mt-1">审核待发布内容</p>
              </div>
              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 class="font-medium text-red-900">内容删除</h4>
                <p class="text-sm text-red-700 mt-1">删除违规内容</p>
              </div>
            </div>
          </div>

          <!-- 学习计划管理内容 -->
          <div v-if="activeTab === 'plans'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">学习计划管理</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 class="font-medium text-purple-900">计划列表</h4>
                <p class="text-sm text-purple-700 mt-1">查看所有学习计划</p>
              </div>
              <div class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 class="font-medium text-indigo-900">进度统计</h4>
                <p class="text-sm text-indigo-700 mt-1">学习计划完成情况</p>
              </div>
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 class="font-medium text-blue-900">计划审核</h4>
                <p class="text-sm text-blue-700 mt-1">审核学习计划</p>
              </div>
            </div>
          </div>

          <!-- 资源管理内容 -->
          <div v-if="activeTab === 'resources'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">资源管理</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 class="font-medium text-orange-900">资源列表</h4>
                <p class="text-sm text-orange-700 mt-1">管理学习资源</p>
              </div>
              <div class="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <h4 class="font-medium text-teal-900">添加资源</h4>
                <p class="text-sm text-teal-700 mt-1">添加新学习资源</p>
              </div>
              <div class="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <h4 class="font-medium text-cyan-900">资源分类</h4>
                <p class="text-sm text-cyan-700 mt-1">管理资源分类</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'

interface User {
  id: string
  nickname?: string
  email?: string
}

interface Stats {
  totalUsers: number
  totalPosts: number
  totalPlans: number
  totalResources: number
}

interface Tab {
  id: string
  name: string
}

const router = useRouter()
const activeTab = ref('users')
const currentTime = ref('')
const stats = ref<Stats>({
  totalUsers: 0,
  totalPosts: 0,
  totalPlans: 0,
  totalResources: 0
})

const currentUser = ref<User | null>(null)

const tabs = ref<Tab[]>([
  { id: 'users', name: '用户管理' },
  { id: 'content', name: '内容管理' },
  { id: 'plans', name: '学习计划' },
  { id: 'resources', name: '资源管理' }
])

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取当前用户信息
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      currentUser.value = JSON.parse(userStr)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 模拟加载统计数据
const loadStats = () => {
  stats.value = {
    totalUsers: 156,
    totalPosts: 89,
    totalPlans: 234,
    totalResources: 67
  }
}

// 退出登录
const logout = () => {
  showToast('正在退出登录...', 'info')
  localStorage.removeItem('currentUser')
  window.location.href = '/login'
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(() => {
  getCurrentUser()
  updateTime()
  loadStats()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style>
/* 完全移除前端侧边栏和导航 */
.sidebar-navigation,
.bottom-navigation,
nav {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
}

/* 确保body没有前端相关的样式 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 移除所有可能的侧边栏元素 */
div[class*="sidebar"],
div[class*="navigation"],
aside {
  display: none !important;
  visibility: hidden !important;
}

/* 确保主容器是全屏的 */
#app {
  width: 100%;
  height: 100%;
}

/* 移除Vue Router Link可能造成的前端导航 */
a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>