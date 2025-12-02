<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      :style="getMessageStyles()"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">EduMatch 后台管理系统</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
              Admin Panel
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              管理员：{{ currentUser?.nickname || currentUser?.email || 'Admin' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentTime }}
            </div>
            <button
              @click="logout"
              class="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
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
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0v-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 10-6 0v1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总用户数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总帖子数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPosts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">学习计划</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPlans }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">学习资源</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalResources }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理功能区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 用户管理区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">用户管理</h2>
          <div class="space-y-4">
            <button
              @click="manageUsers"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              查看所有用户
            </button>
            <button
              @click="searchUsers"
              class="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              搜索用户
            </button>
          </div>
        </div>

        <!-- 内容管理区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">内容管理</h2>
          <div class="space-y-4">
            <button
              @click="manageContent"
              class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              管理社区帖子
            </button>
            <button
              @click="reviewContent"
              class="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              审核待发布内容
            </button>
          </div>
        </div>

        <!-- 学习计划管理区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">学习计划管理</h2>
          <div class="space-y-4">
            <button
              @click="managePlans"
              class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              查看所有学习计划
            </button>
            <button
              @click="planStats"
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              学习计划统计
            </button>
          </div>
        </div>

        <!-- 资源管理区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">资源管理</h2>
          <div class="space-y-4">
            <button
              @click="manageResources"
              class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              管理学习资源
            </button>
            <button
              @click="addResource"
              class="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              添加新资源
            </button>
          </div>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p class="text-sm text-gray-600 dark:text-gray-400">系统状态</p>
            <p class="text-lg font-medium text-green-600 dark:text-green-400">正常运行</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p class="text-sm text-gray-600 dark:text-gray-400">数据库连接</p>
            <p class="text-lg font-medium text-green-600 dark:text-green-400">连接正常</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p class="text-sm text-gray-600 dark:text-gray-400">最后更新</p>
            <p class="text-lg font-medium text-blue-600 dark:text-blue-400">{{ currentTime }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'
import { getAdminUserInfo, adminLogout } from '@/utils/adminAuth'

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

const router = useRouter()
const currentTime = ref('')
const stats = ref<Stats>({
  totalUsers: 0,
  totalPosts: 0,
  totalPlans: 0,
  totalResources: 0
})

const currentAdminUser = ref<any>(null)

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

// 获取当前管理员用户信息
const getCurrentAdminUser = () => {
  try {
    const adminInfo = getAdminUserInfo()
    if (adminInfo) {
      currentUser.value = JSON.parse(userStr)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 模拟加载统计数据
const loadStats = () => {
  // 这里应该是真实的数据库查询，现在用模拟数据
  stats.value = {
    totalUsers: 156,
    totalPosts: 89,
    totalPlans: 234,
    totalResources: 67
  }
}

// 管理功能方法
const manageUsers = () => {
  showToast('用户管理功能 - 这里将显示所有用户列表和管理操作', 'info')
}

const searchUsers = () => {
  const searchTerm = prompt('请输入搜索关键词:')
  if (searchTerm) {
    showToast(`搜索用户: ${searchTerm}`, 'success')
  }
}

const manageContent = () => {
  showToast('内容管理功能 - 这里将显示所有社区帖子', 'info')
}

const reviewContent = () => {
  showToast('审核功能 - 这里将显示待审核的内容', 'info')
}

const managePlans = () => {
  showToast('学习计划管理 - 这里将显示所有学习计划', 'info')
}

const planStats = () => {
  showToast('学习计划统计 - 这里将显示详细的统计数据', 'info')
}

const manageResources = () => {
  showToast('资源管理功能 - 这里将显示所有学习资源', 'info')
}

const addResource = () => {
  showToast('添加新资源功能 - 这里将打开资源添加表单', 'info')
}

// 退出登录
const logout = () => {
  showToast('正在退出登录...', 'info')
  localStorage.removeItem('currentUser')
  router.push('/login')
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

<style scoped>
/* 确保所有数字输入框都移除上下箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 移除前端导航元素 */
.sidebar-navigation,
.bottom-navigation {
  display: none !important;
}

/* 确保后台页面占据整个屏幕 */
body {
  margin: 0;
  padding: 0;
}

/* 移除任何可能的导航栏 */
nav {
  display: none !important;
}
</style>