<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">后台管理系统</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
              Admin Panel
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="goToUserView"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              返回前台
            </button>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentTime }}
            </div>
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

      <!-- 导航标签页 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <div class="flex items-center">
                <span class="w-4 h-4 mr-2 inline-flex items-center justify-center">
                  <!-- 用户管理图标 -->
                  <svg v-if="tab.id === 'users'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0v-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 10-6 0v1"></path>
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
                <span v-if="tab.count" class="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                  {{ tab.count }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <!-- 标签页内容 -->
        <div class="p-6">
          <!-- 用户管理模块 -->
          <UserManagement v-if="activeTab === 'users'" :key="'users'" @refresh="loadStats" />
          
          <!-- 内容管理模块 -->
          <ContentManagement v-if="activeTab === 'content'" :key="'content'" @refresh="loadStats" />
          
          <!-- 学习计划模块 -->
          <PlanManagement v-if="activeTab === 'plans'" :key="'plans'" @refresh="loadStats" />
          
          <!-- 资源管理模块 -->
          <ResourceManagement v-if="activeTab === 'resources'" :key="'resources'" @refresh="loadStats" />
        </div>
      </div>
    </main>

    <!-- 确认对话框 -->
    <ConfirmDialog
      ref="confirmDialog"
      :title="confirmOptions.title"
      :message="confirmOptions.message"
      :confirm-text="confirmOptions.confirmText"
      :cancel-text="confirmOptions.cancelText"
      :type="confirmOptions.type"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { useDatabaseStore } from '@/stores/database'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import UserManagement from '@/components/admin/UserManagement.vue'
import ContentManagement from '@/components/admin/ContentManagement.vue'
import PlanManagement from '@/components/admin/PlanManagement.vue'
import ResourceManagement from '@/components/admin/ResourceManagement.vue'

interface Tab {
  id: string
  name: string
  icon: any
  count?: number
}

interface Stats {
  totalUsers: number
  totalPosts: number
  totalPlans: number
  totalResources: number
}

interface ConfirmOptions {
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: 'danger' | 'warning' | 'info'
  callback: () => void
}

const router = useRouter()
const dbStore = useDatabaseStore()

const activeTab = ref('users')
const currentTime = ref('')
const stats = ref<Stats>({
  totalUsers: 0,
  totalPosts: 0,
  totalPlans: 0,
  totalResources: 0
})

const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()
const confirmOptions = ref<ConfirmOptions>({
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  type: 'info',
  callback: () => {}
})

const tabs = ref<Tab[]>([
  {
    id: 'users',
    name: '用户管理',
    icon: 'UserIcon'
  },
  {
    id: 'content',
    name: '内容管理',
    icon: 'DocumentIcon'
  },
  {
    id: 'plans',
    name: '学习计划',
    icon: 'CalendarIcon'
  },
  {
    id: 'resources',
    name: '资源管理',
    icon: 'BookmarkIcon'
  }
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

// 加载统计数据
const loadStats = async () => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    // 加载用户统计
    const { count: userCount } = await client
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 加载帖子统计
    const { count: postCount } = await client
      .from('community_posts')
      .select('*', { count: 'exact', head: true })

    // 加载学习计划统计
    const { count: planCount } = await client
      .from('study_plans')
      .select('*', { count: 'exact', head: true })

    // 加载资源统计
    const { count: resourceCount } = await client
      .from('resources')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      totalUsers: userCount || 0,
      totalPosts: postCount || 0,
      totalPlans: planCount || 0,
      totalResources: resourceCount || 0
    }

    // 更新标签计数
    tabs.value[0].count = stats.value.totalUsers
    tabs.value[1].count = stats.value.totalPosts
    tabs.value[2].count = stats.value.totalPlans
    tabs.value[3].count = stats.value.totalResources
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 返回前台视图
const goToUserView = () => {
  router.push('/')
}

// 处理确认操作
const handleConfirm = () => {
  confirmOptions.value.callback()
}

// 暴露给子组件调用的方法
const showConfirm = (options: Partial<ConfirmOptions>) => {
  confirmOptions.value = {
    title: options.title || '确认操作',
    message: options.message || '确定要执行此操作吗？',
    confirmText: options.confirmText || '确认',
    cancelText: options.cancelText || '取消',
    type: options.type || 'info',
    callback: options.callback || (() => {})
  }
  confirmDialog.value?.show()
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(() => {
  updateTime()
  loadStats()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 向子组件暴露确认对话框方法
defineExpose({
  showConfirm
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
</style>