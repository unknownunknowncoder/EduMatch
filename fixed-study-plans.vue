<template>
  <div class="p-6 md:p-8">
    <!-- 成功提示 -->
    <div 
      v-if="showSuccessMessage" 
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transition-all duration-300"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- 学习计划概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
            <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">进行中</h3>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ plans.inProgress }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">个学习计划</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
            <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">已完成</h3>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ plans.completed }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">个学习计划</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
            <svg class="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">学习时长</h3>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ plans.totalHours }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">累计小时</p>
      </div>
    </div>

    <!-- 当前学习计划 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          当前学习计划
        </h2>
      </div>
      
      <div class="p-6">
        <!-- 调试信息 -->
        <div class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔍 调试信息:</h4>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            计划数量: {{ currentPlans.length }} | 
            数据来源: 硬编码 + 数据库
          </p>
          <button @click="loadDatabasePlans()" class="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
            从数据库重新加载
          </button>
        </div>

        <!-- 始终显示所有学习计划 -->
        <div class="space-y-4">
          <div 
            v-for="plan in currentPlans"
            :key="plan.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ plan.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ plan.description }}</p>
              </div>
              <span :class="`px-3 py-1 rounded-full text-xs font-medium ${
                plan.status === 'in_progress' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`">
                {{ plan.status === 'in_progress' ? '进行中' : '已完成' }}
              </span>
            </div>

            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">进度</span>
                <span class="font-medium">{{ plan.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${plan.progress}%` }"
                ></div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">开始时间</span>
                <div class="font-medium">{{ plan.startDate }}</div>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">目标时间</span>
                <div class="font-medium">{{ plan.targetDate }}</div>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">每日时长</span>
                <div class="font-medium">{{ plan.dailyHours }}小时</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface StudyPlan {
  id: string
  title: string
  description: string
  progress: number
  status: 'in_progress' | 'completed'
  startDate: string
  targetDate: string
  dailyHours: number
  resourceName?: string
  resourceUrl?: string
}

const showSuccessMessage = ref(false)
const successMessage = ref('')

const plans = ref({
  inProgress: 0,
  completed: 0,
  totalHours: 0
})

// 硬编码的学习计划数据（基于数据库中的实际数据）
const currentPlans = ref<StudyPlan[]>([
  {
    id: 'bd7ceda8-55b6-4435-91cc-73440245f7b1',
    title: 'c语言',
    description: 'C语言学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: 'c语言零基础',
    resourceUrl: ''
  },
  {
    id: 'c1e78b13-f9cf-4b53-8437-872d14fde775',
    title: 'c语言零基础',
    description: 'C语言零基础学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: 'fde8c544-2f36-47b1-82b9-556c433ab9e0',
    title: 'java初级',
    description: 'Java初级学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: '4ea70f7f-ef69-4c1d-b038-82982ce247af',
    title: 'java企业级开发',
    description: 'Java企业级开发学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: 'plan-5',
    title: 'java进阶',
    description: 'Java进阶学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: 'plan-6',
    title: 'c语言进阶',
    description: 'C语言进阶学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  },
  {
    id: 'plan-7',
    title: 'java高级',
    description: 'Java高级学习计划',
    progress: 0,
    status: 'in_progress',
    startDate: '2025-11-20',
    targetDate: '2025-11-28',
    dailyHours: 2,
    resourceName: '',
    resourceUrl: ''
  }
])

// 从数据库加载学习计划
const loadDatabasePlans = async () => {
  try {
    console.log('🔄 从数据库加载学习计划...')
    
    // 设置用户信息
    const currentUser = {
      id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
      username: 'admin',
      email: 'admin@edumatch.com',
      nickname: '管理员'
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
    
    // 动态导入 Supabase
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(
      'https://aonlahundnkxuyxfsmcy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'
    )
    
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 数据库加载失败:', error)
      successMessage.value = '数据库加载失败，显示默认数据'
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      return
    }
    
    if (data && data.length > 0) {
      // 转换数据格式
      currentPlans.value = data.map((plan: any) => ({
        id: plan.id,
        title: plan.title,
        description: plan.description || '',
        progress: plan.progress || 0,
        status: plan.status,
        startDate: plan.start_date,
        targetDate: plan.target_date,
        dailyHours: plan.daily_hours || 2,
        resourceName: plan.resource_name,
        resourceUrl: plan.resource_url
      }))
      
      successMessage.value = `成功从数据库加载 ${data.length} 个学习计划！`
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }
    
    updateStats()
    
  } catch (error) {
    console.error('❌ 加载失败:', error)
    successMessage.value = '加载失败，使用硬编码数据'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}

// 更新统计信息
const updateStats = () => {
  const inProgress = currentPlans.value.filter(p => p.status === 'in_progress').length
  const completed = currentPlans.value.filter(p => p.status === 'completed').length
  const totalHours = currentPlans.value.reduce((sum, p) => sum + (p.dailyHours || 0), 0)
  
  plans.value = {
    inProgress: inProgress,
    completed: completed,
    totalHours: totalHours
  }
}

onMounted(() => {
  updateStats()
  // 自动从数据库加载
  loadDatabasePlans()
})
</script>