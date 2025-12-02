<template>
  <div class="min-h-screen bg-gray-50">
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
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">学习计划详情管理</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="deletePlan"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              删除计划
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在加载学习计划详情...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600 text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <button @click="loadPlan" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          重新加载
        </button>
      </div>

      <!-- 删除成功提示 -->
      <div v-if="deleteSuccess" class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
        ✅ 学习计划删除成功
      </div>

      <!-- 计划详情 -->
      <div v-else-if="plan" class="space-y-8">
        <!-- 计划基本信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ plan.title }}</h2>
          
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {{ plan.user?.nickname?.charAt(0) || plan.user?.username?.charAt(0) || 'U' }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ plan.user?.nickname || plan.user?.username || '未知用户' }}
                  </p>
                  <p class="text-xs text-gray-500">{{ plan.user_id }}</p>
                </div>
              </div>
              
              <div class="text-sm text-gray-500">
                <span>创建时间：{{ formatTime(plan.created_at) }}</span>
                <span class="mx-2">|</span>
                <span>最后更新：{{ formatTime(plan.updated_at) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {{ getStatusText(plan.status) }}
              </span>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ getDifficultyText(plan.difficulty) }}
              </span>
            </div>
          </div>

          <div v-if="plan.description" class="prose max-w-none mb-6">
            <div class="whitespace-pre-wrap text-gray-700">
              {{ plan.description }}
            </div>
          </div>

          <!-- 时间范围 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">开始时间</h4>
              <p class="text-gray-700">{{ formatDate(plan.start_date) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">结束时间</h4>
              <p class="text-gray-700">{{ formatDate(plan.end_date) }}</p>
            </div>
          </div>

          <!-- 目标 -->
          <div v-if="plan.goals && plan.goals.length > 0">
            <h4 class="text-sm font-medium text-gray-900 mb-3">学习目标</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li v-for="goal in plan.goals" :key="goal">{{ goal }}</li>
            </ul>
          </div>
        </div>

        <!-- 进度统计 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">进度统计</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">完成进度</span>
                <span class="text-sm font-bold text-blue-600">{{ plan.progress || 0 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  :style="{ width: `${plan.progress || 0}%` }"
                ></div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ plan.total_hours || 0 }}</div>
                <div class="text-sm text-gray-600">总学时(小时)</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ completedTasks }}</div>
                <div class="text-sm text-gray-600">已完成任务</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">{{ totalTasks }}</div>
                <div class="text-sm text-gray-600">总任务数</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习资源 -->
        <div v-if="plan.resources && plan.resources.length > 0" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">相关资源</h3>
          <div class="space-y-4">
            <div v-for="resource in plan.resources" :key="resource.id" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ resource.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ resource.description }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {{ resource.type || '文档' }}
                    </span>
                    <a :href="resource.url" target="_blank" 
                       class="text-blue-600 hover:text-blue-800 text-sm">
                      查看资源
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 签到记录 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">签到记录</h3>
          <div v-if="checkins.length === 0" class="text-center py-8 text-gray-500">
            暂无签到记录
          </div>
          <div v-else class="space-y-3">
            <div v-for="checkin in checkins" :key="checkin.id" 
                 class="flex justify-between items-center p-3 border border-gray-200 rounded">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ formatTime(checkin.created_at) }}
                </p>
                <p class="text-xs text-gray-500">{{ checkin.notes || '无备注' }}</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                已签到
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 确认删除对话框 -->
    <div v-if="confirmDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">确认删除</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="confirmDialog.show = false"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDialog.onConfirm"
            class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

interface Plan {
  id: string
  title: string
  description?: string
  user_id: string
  status: string
  difficulty: string
  progress?: number
  total_hours?: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  goals?: string[]
  resources?: Array<{
    id: string
    title: string
    description: string
    url: string
    type?: string
  }>
  user?: {
    id: string
    username: string
    nickname?: string
  }
}

interface Checkin {
  id: string
  plan_id: string
  notes?: string
  created_at: string
}

const route = useRoute()
const router = useRouter()

const planId = route.params.id as string
const userId = route.query.user_id as string || null
const loading = ref(true)
const error = ref('')
const plan = ref<Plan | null>(null)
const checkins = ref<Checkin[]>([])
const deleteSuccess = ref(false)

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})

// 计算任务统计
const completedTasks = computed(() => {
  return checkins.value.filter(c => c.created_at).length
})

const totalTasks = computed(() => {
  return plan.value?.resources?.length || 0
})

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '进行中'
    case 'completed': return '已完成'
    case 'paused': return '已暂停'
    case 'cancelled': return '已取消'
    default: return '未知状态'
  }
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return '初级'
    case 'intermediate': return '中级'
    case 'advanced': return '高级'
    case 'expert': return '专家级'
    default: return '未设置'
  }
}

// 加载学习计划详情
const loadPlan = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔄 加载管理员学习计划详情，ID:', planId)
    
    const { supabaseService } = await import('@/services/supabase')
    
    // 获取计划基本信息
    const planData = await supabaseService.getStudyPlanById(planId)
    
    if (!planData) {
      error.value = '学习计划不存在或已被删除'
      return
    }
    
    // 获取用户信息
    let userInfo = null
    if (planData.user_id) {
      try {
        userInfo = await supabaseService.getUserById(planData.user_id)
      } catch (userError) {
        console.error('获取用户信息失败:', userError)
      }
    }
    
    // 获取签到记录
    const { data: checkinData } = await supabaseService.getClient()
      .from('study_plan_checkins')
      .select('*')
      .eq('plan_id', planId)
      .order('created_at', { ascending: false })
    
    plan.value = {
      ...planData,
      user: userInfo
    }
    
    checkins.value = checkinData || []
    
    console.log('✅ 学习计划详情加载成功:', plan.value)
    
  } catch (err) {
    console.error('❌ 加载学习计划详情失败:', err)
    error.value = '加载学习计划详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  console.log('🔙 点击返回按钮')
  try {
    // 优先返回到对应用户的管理详情页面
    const targetUserId = plan.value?.user_id || userId
    
    if (targetUserId) {
      const userDetailUrl = `/admin/user/${targetUserId}`
      console.log('📍 返回到用户详情页面:', userDetailUrl)
      console.log('📍 使用用户ID:', targetUserId, '(来自计划:', !!plan.value?.user_id, ', 来自URL:', !!userId, ')')
      router.push(userDetailUrl)
      return
    }
    
    // 如果没有用户信息，尝试返回上一页
    if (window.history.length > 1) {
      console.log('📍 使用 history.back() 返回')
      router.back()
    } else {
      // 最后备选：跳转到管理主页
      console.log('📍 跳转到管理主页')
      router.push('/admin')
    }
  } catch (error) {
    console.error('❌ 返回失败，跳转到管理页面:', error)
    router.push('/admin')
  }
}

// 删除计划
const deletePlan = async () => {
  if (!plan.value) return
  
  // 显示确认对话框
  confirmDialog.value = {
    show: true,
    message: '确定要删除这个学习计划吗？此操作不可撤销。',
    onConfirm: () => executeDeletePlan()
  }
}

// 实际执行删除的函数
const executeDeletePlan = async () => {
  try {
    console.log('🗑️ 删除学习计划，ID:', plan.value.id)
    
    const { supabaseService } = await import('@/services/supabase')
    await supabaseService.deleteStudyPlan(plan.value.id)
    
    console.log('✅ 学习计划删除成功')
    
    confirmDialog.value.show = false
    
    // 显示成功提示
    deleteSuccess.value = true
    showToast('学习计划删除成功！', 'success')
    
    // 延迟1.5秒后返回到对应用户的管理详情页面
    setTimeout(() => {
      if (plan.value.user_id) {
        const userDetailUrl = `/admin/user/${plan.value.user_id}`
        console.log('🗑️ 删除成功，返回到用户详情页面:', userDetailUrl)
        router.push(userDetailUrl)
      } else {
        console.log('🗑️ 删除成功，返回到管理主页')
        router.push('/admin')
      }
    }, 1500)
    
  } catch (err) {
    console.error('❌ 删除学习计划失败:', err)
    showNotification('删除学习计划失败，请稍后重试', 'error')
  }
}



onMounted(() => {
  loadPlan()
})
</script>

<style>
/* 移除前端侧边栏和导航 */
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

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

div[class*="sidebar"],
div[class*="navigation"],
aside {
  display: none !important;
  visibility: hidden !important;
}

#app {
  width: 100%;
  height: 100%;
}

a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>