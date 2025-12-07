<template>
  <div class="space-y-6">
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
    
    <!-- 搜索和筛选栏 -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索计划标题或描述..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="resetAndSearch"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="selectedStatus"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="">全部状态</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="paused">已暂停</option>
          </select>
          <button
            @click="loadPlans"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 学习计划列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                计划信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建者
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                进度
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                时间范围
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ plan.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                    {{ plan.description || '无描述' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ plan.user_id }}
              </td>
              <td class="px-6 py-4">
                <div class="w-full max-w-xs">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ plan.progress || 0 }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${plan.progress || 0}%` }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {{ getStatusText(plan.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(plan.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewPlan(plan)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="查看详情"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

interface StudyPlan {
  id: string
  title: string
  description: string | null
  status: 'in_progress' | 'completed' | 'paused'
  priority: 'high' | 'medium' | 'low' | null
  progress: number
  total_hours: number | null
  completed_hours: number | null
  completed_days: number | null
  start_date: string
  end_date: string
  created_at: string
  user_id: string
  user?: {
    nickname: string | null
    email: string | null
    avatar_url: string | null
  }
}

const emit = defineEmits(['refresh'])
const dbStore = useDatabaseStore()

const plans = ref<StudyPlan[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')

// 加载学习计划列表
const loadPlans = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('study_plans')
      .select('*', { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,description.ilike.%${searchKeyword.value}%`)
    }

    if (selectedStatus.value) {
      query = query.eq('status', selectedStatus.value)
    }

    // 排序
    query = query.order('created_at', { ascending: false })

    // 分页
    query = query.range(0, 19)

    const { data, error, count } = await query

    if (error) {
      console.error('加载学习计划失败:', error)
      return
    }

    plans.value = data || []
  } catch (error) {
    console.error('加载学习计划失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置并搜索
const resetAndSearch = () => {
  loadPlans()
}

// 查看计划
const viewPlan = (plan: StudyPlan) => {
  window.open(`/study-plan/${plan.id}`, '_blank')
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'in_progress':
      return '进行中'
    case 'completed':
      return '已完成'
    case 'paused':
      return '已暂停'
    default:
      return '未知'
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  loadPlans()
})
</script>

<style scoped>
/* 确保表格内容不换行 */
table {
  table-layout: fixed;
}

/* 自定义复选框样式 */
input[type="checkbox"]:indeterminate {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>