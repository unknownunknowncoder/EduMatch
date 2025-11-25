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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
    </div>

    <!-- 当前学习计划 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            当前学习计划
          </h2>
          <button 
            @click="showCreatePlanModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            创建新的学习计划
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <!-- 学习计划列表 -->
        <div v-if="currentPlans.length === 0" class="text-center py-12">
          <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无学习计划</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有创建任何学习计划</p>
          <button 
            @click="showCreatePlanModal = true"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            创建第一个计划
          </button>
        </div>

        <div v-else class="space-y-4">
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

            <!-- 关联资源信息 -->
            <div v-if="plan.resourceName || plan.resourceUrl" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {{ plan.resourceName || '关联资源' }}
                  </p>
                  <a 
                    v-if="plan.resourceUrl && plan.resourceUrl.trim() !== ''"
                    :href="plan.resourceUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    访问资源
                  </a>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                    无资源链接
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">开始时间</span>
                <div class="font-medium">{{ plan.startDate }}</div>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">目标时间</span>
                <div class="font-medium">{{ plan.targetDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建学习计划弹窗 -->
    <div v-if="showCreatePlanModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">创建学习计划</h2>
          <button 
            @click="showCreatePlanModal = false"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 表单内容 -->
        <form @submit.prevent="handleCreatePlan" class="p-6 space-y-4">
          <!-- 计划标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              计划标题 *
            </label>
            <input
              v-model="newPlan.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="例如：前端开发进阶"
            />
          </div>

          <!-- 计划描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              计划描述
            </label>
            <textarea
              v-model="newPlan.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="描述你的学习目标和内容（选填）"
            ></textarea>
          </div>



          <!-- 关联学习资源 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              关联学习资源
            </label>
            <div class="space-y-3">
              <!-- 资源名称 -->
              <div>
                <input
                  v-model="newPlan.resourceName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入关联的学习资源名称（选填）"
                />
              </div>
              <!-- 资源链接 -->
              <div>
                <input
                  v-model="newPlan.resourceUrl"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入资源链接（选填）"
                />
              </div>
            </div>
          </div>

          <!-- 开始和目标日期 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                开始日期 *
              </label>
              <input
                v-model="newPlan.startDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标日期 *
              </label>
              <input
                v-model="newPlan.targetDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreatePlanModal"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              创建计划
            </button>
          </div>
        </form>
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
const showCreatePlanModal = ref(false)

const plans = ref({
  inProgress: 0,
  completed: 0
})

// 新建学习计划表单数据
const newPlan = ref({
  title: '',
  description: '',
  startDate: '',
  targetDate: '',
  resourceName: '',
  resourceUrl: ''
})

// 学习计划数据（从数据库动态加载）
const currentPlans = ref<StudyPlan[]>([])

// 从数据库加载学习计划
const loadDatabasePlans = async () => {
  try {
    console.log('🔄 从数据库加载学习计划...')
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    // 如果没有登录用户，显示空列表
    if (!currentUser || !currentUser.id) {
      console.log('用户未登录，显示空学习计划列表')
      currentPlans.value = []
      updateStats()
      return
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
        resourceName: plan.resource_name || '',
        resourceUrl: plan.resource_url || ''
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
  
  plans.value = {
    inProgress: inProgress,
    completed: completed
  }
}

// 创建学习计划
const handleCreatePlan = async () => {
  // 验证表单数据
  if (!newPlan.value.title || newPlan.value.title.trim() === '') {
    alert('请填写计划标题')
    return
  }

  if (!newPlan.value.startDate || newPlan.value.startDate.trim() === '') {
    alert('请选择开始日期')
    return
  }

  if (!newPlan.value.targetDate || newPlan.value.targetDate.trim() === '') {
    alert('请选择目标日期')
    return
  }

  // 验证日期逻辑
  const start = new Date(newPlan.value.startDate)
  const target = new Date(newPlan.value.targetDate)
  
  if (isNaN(start.getTime())) {
    alert('开始日期格式不正确')
    return
  }

  if (isNaN(target.getTime())) {
    alert('目标日期格式不正确')
    return
  }

  if (target <= start) {
    alert('目标日期必须晚于开始日期')
    return
  }

  try {
    console.log('🔄 准备创建学习计划...')
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    // 如果没有登录用户，显示错误信息
    if (!currentUser || !currentUser.id) {
      alert('请先登录后再创建学习计划')
      return
    }
    
    // 动态导入 Supabase
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(
      'https://aonlahundnkxuyxfsmcy.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'
    )
    
    // 准备数据库插入数据
    const dbPlanData = {
      user_id: currentUser.id,
      title: newPlan.value.title,
      description: newPlan.value.description,
      progress: 0,
      status: 'in_progress',
      start_date: newPlan.value.startDate,
      target_date: newPlan.value.targetDate,
      resource_name: newPlan.value.resourceName,
      resource_url: newPlan.value.resourceUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('📝 插入数据:', dbPlanData)
    
    // 保存到数据库
    const { data, error } = await supabase
      .from('study_plans')
      .insert([dbPlanData])
      .select()
    
    if (error) {
      console.error('❌ 数据库插入失败:', error)
      throw new Error(`数据库保存失败: ${error.message}`)
    }
    
    console.log('✅ 数据库保存成功:', data)
    
    // 使用数据库返回的数据
    const createdPlan = Array.isArray(data) ? data[0] : data
    
    if (!createdPlan || !createdPlan.id) {
      throw new Error('创建计划失败：返回数据无效')
    }

    // 转换为前端格式
    const planData = {
      id: createdPlan.id,
      title: createdPlan.title || newPlan.value.title,
      description: createdPlan.description || newPlan.value.description,
      progress: createdPlan.progress || 0,
      status: createdPlan.status || 'in_progress',
      startDate: createdPlan.start_date || newPlan.value.startDate,
      targetDate: createdPlan.target_date || newPlan.value.targetDate,
      resourceName: createdPlan.resource_name || newPlan.value.resourceName,
      resourceUrl: createdPlan.resource_url || newPlan.value.resourceUrl
    }

    // 添加到当前计划列表
    currentPlans.value.unshift(planData)
    
    // 更新统计
    updateStats()
    
    // 关闭弹窗
    showCreatePlanModal.value = false
    
    // 显示成功提示
    successMessage.value = '学习计划创建成功！'
    showSuccessMessage.value = true
    
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    // 重置表单
    newPlan.value = {
      title: '',
      description: '',
      startDate: '',
      targetDate: '',
      resourceName: '',
      resourceUrl: ''
    }
    
  } catch (error) {
    console.error('❌ 创建学习计划失败:', error)
    alert('创建学习计划失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 关闭创建计划弹窗
const closeCreatePlanModal = () => {
  showCreatePlanModal.value = false
  
  // 重置表单
  newPlan.value = {
    title: '',
    description: '',
    startDate: '',
    targetDate: '',
    resourceName: '',
    resourceUrl: ''
  }
}

onMounted(() => {
  updateStats()
  // 自动从数据库加载
  loadDatabasePlans()
})
</script>