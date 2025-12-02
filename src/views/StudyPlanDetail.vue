<template>
  <div class="p-6 md:p-8">
    <!-- 弹窗提示 -->
    <div v-if="notification.show" 
         :class="[
           'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse',
           notification.type === 'success' ? 'bg-green-600 text-white' : 
           notification.type === 'error' ? 'bg-red-600 text-white' : 
           'bg-blue-600 text-white'
         ]">
      {{ notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️' }}
      {{ notification.message }}
    </div>
    <!-- 返回按钮 -->
    <button 
      @click="$router.back()"
      class="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      返回学习计划
    </button>

    <!-- 计划详情 -->
    <div v-if="plan" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <!-- 计划头部 -->
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ plan.title }}</h1>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>创建时间：{{ formatDate(plan.created_at) }}</span>
                <span class="mx-2">•</span>
                <span>目标时间：{{ formatDate(plan.target_date) }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                :class="`px-3 py-1 rounded-full text-sm font-medium ${
                  plan.status === 'in_progress' 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`"
              >
                {{ plan.status === 'in_progress' ? '进行中' : '已完成' }}
              </span>
            </div>
          </div>

          <!-- 进度统计 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="ml-1 font-semibold text-lg">{{ plan.total_hours || 0 }}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">总学时(小时)</div>
            </div>
            
            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke="joinround" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="ml-1 font-semibold text-lg">{{ completedHours }}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">已完成学时</div>
            </div>
            
            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <svg class="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="ml-1 font-semibold text-lg">{{ progressPercentage }}%</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">完成进度</div>
            </div>
            
            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="ml-1 font-semibold text-lg">{{ remainingDays }}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">剩余天数</div>
            </div>
          </div>
        </div>

        <!-- 计划内容 -->
        <div class="p-6">
          <!-- 描述 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">计划描述</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ plan.description }}</p>
          </div>

          <!-- 学习目标 -->
          <div v-if="plan.goals && plan.goals.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">学习目标</h3>
            <ul class="space-y-2">
              <li 
                v-for="(goal, index) in plan.goals" 
                :key="index"
                class="flex items-start"
              >
                <span class="text-blue-500 mr-3 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300">{{ goal }}</span>
              </li>
            </ul>
          </div>

          <!-- 进度条 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">学习进度</h3>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              已完成 {{ completedHours }} / {{ plan.total_hours || 0 }} 小时
            </p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              v-if="plan.status === 'in_progress'"
              @click="handleCheckIn"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              学习打卡
            </button>
            
            <button
              v-if="plan.status === 'in_progress'"
              @click="completePlan"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              完成计划
            </button>
            
            <button
              @click="editPlan"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              编辑计划
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="text-center py-16">
      <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h3 class="text-lg font-medium mb-2">正在加载计划信息</h3>
      <p class="text-gray-500 dark:text-gray-400">请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface StudyPlan {
  id: string
  title: string
  description: string
  status: 'in_progress' | 'completed'
  total_hours: number
  target_date: string
  created_at: string
  goals?: string[]
  checkins?: Array<{
    date: string
    hours: number
    notes?: string
  }>
}

const plan = ref<StudyPlan | null>(null)

// 弹窗提示系统
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
})

// 显示弹窗提示
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  // 3秒后自动隐藏
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 计算属性
const completedHours = computed(() => {
  if (!plan.value?.checkins) return 0
  return plan.value.checkins.reduce((total, checkin) => total + checkin.hours, 0)
})

const progressPercentage = computed(() => {
  if (!plan.value?.total_hours || plan.value.total_hours === 0) return 0
  return Math.round((completedHours.value / plan.value.total_hours) * 100)
})

const remainingDays = computed(() => {
  if (!plan.value?.target_date) return 0
  const target = new Date(plan.value.target_date)
  const today = new Date()
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 从数据库加载计划数据
const loadPlan = async (id: string) => {
  try {
    const { supabaseService } = await import('@/services/supabase')
    const planData = await supabaseService.getStudyPlanById(id)
    
    if (planData) {
      plan.value = {
        ...planData,
        total_hours: planData.total_hours || 0,
        goals: planData.goals || [],
        checkins: planData.checkins || []
      }
    } else {
      console.error('计划未找到:', id)
    }
  } catch (error) {
    console.error('加载计划失败:', error)
  }
}

const handleCheckIn = () => {
  // 跳转到学习打卡页面或打开打卡模态框
  router.push(`/study-plan/${plan.value?.id}/checkin`)
}

const completePlan = async () => {
  if (!plan.value) return
  
  try {
    const { supabaseService } = await import('@/services/supabase')
    await supabaseService.updateStudyPlan(plan.value.id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    
    if (plan.value) {
      plan.value.status = 'completed'
    }
    
    // 显示成功消息
    showNotification('计划已标记为完成！', 'success')
  } catch (error) {
    console.error('完成计划失败:', error)
    showNotification('操作失败，请稍后重试', 'error')
  }
}

const editPlan = () => {
  router.push(`/study-plan/${plan.value?.id}/edit`)
}

onMounted(() => {
  const planId = route.params.id as string
  loadPlan(planId)
})
</script>