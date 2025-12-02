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
          <select
            v-model="selectedPriority"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="created_at">创建时间</option>
            <option value="start_date">开始日期</option>
            <option value="end_date">结束日期</option>
            <option value="progress">完成进度</option>
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

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">进行中</p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ stats.inProgress }}</p>
          </div>
          <svg class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-800 dark:text-green-200">已完成</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ stats.completed }}</p>
          </div>
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">已暂停</p>
            <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ stats.paused }}</p>
          </div>
          <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-800 dark:text-purple-200">平均完成率</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ stats.avgProgress }}%</p>
          </div>
          <svg class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedPlans.length > 0" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          已选择 {{ selectedPlans.length }} 个计划
        </div>
        <div class="flex gap-2">
          <button
            @click="batchComplete"
            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            批量完成
          </button>
          <button
            @click="batchPause"
            class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            批量暂停
          </button>
          <button
            @click="batchDelete"
            class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            批量删除
          </button>
          <button
            @click="clearSelection"
            class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            清空选择
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
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedPlans.length === plans.length && plans.length > 0"
                  :indeterminate="selectedPlans.length > 0 && selectedPlans.length < plans.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
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
                <input
                  type="checkbox"
                  :checked="selectedPlans.includes(plan.id)"
                  @change="toggleSelect(plan.id)"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ plan.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                    {{ plan.description || '无描述' }}
                  </div>
                  <div class="flex items-center mt-1 space-x-2">
                    <span
                      v-if="plan.priority"
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        getPriorityClass(plan.priority)
                      ]"
                    >
                      {{ getPriorityText(plan.priority) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ plan.total_hours || 0 }} 小时
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      v-if="plan.user?.avatar_url"
                      :src="plan.user.avatar_url"
                      :alt="plan.user.nickname || plan.user.email"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div v-else class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {{ (plan.user?.nickname || plan.user?.email || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ plan.user?.nickname || plan.user?.email || '未知用户' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ plan.user_id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="w-full max-w-xs">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ plan.progress || 0 }}%
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ (plan.completed_hours || 0) }}/{{ plan.total_hours || 0 }}h
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${plan.progress || 0}%` }"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    已完成 {{ plan.completed_days || 0 }} 天
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white space-y-1">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {{ formatDate(plan.start_date) }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {{ formatDate(plan.end_date) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    剩余 {{ calculateDaysRemaining(plan) }} 天
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    getStatusClass(plan.status)
                  ]"
                >
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
                  <button
                    v-if="plan.status !== 'completed'"
                    @click="completePlan(plan)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="标记完成"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="plan.status !== 'paused'"
                    @click="pausePlan(plan)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="暂停计划"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deletePlan(plan)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="删除计划"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCount) 条，共 {{ totalCount }} 条记录
          </div>
          <div class="flex items-center space-x-2">
            <button
              :disabled="currentPage <= 1"
              @click="changePage(currentPage - 1)"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </span>
            <button
              :disabled="currentPage >= totalPages"
              @click="changePage(currentPage + 1)"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- 自定义确认对话框 -->
    <div v-if="confirmDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">确认删除</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ confirmDialog.message }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="confirmDialog.show = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              @click="confirmDialog.onConfirm"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              确认删除
            </button>
          </div>
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

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})
const loading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(0)
const selectedPlans = ref<string[]>([])

const stats = ref({
  inProgress: 0,
  completed: 0,
  paused: 0,
  avgProgress: 0
})

// 加载学习计划列表
const loadPlans = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('study_plans')
      .select(`
        *,
        user:users!user_id(nickname, email, avatar_url)
      `, { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,description.ilike.%${searchKeyword.value}%`)
    }

    if (selectedStatus.value) {
      query = query.eq('status', selectedStatus.value)
    }

    if (selectedPriority.value) {
      query = query.eq('priority', selectedPriority.value)
    }

    // 排序
    query = query.order(sortBy.value, { ascending: false })

    // 分页
    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('加载学习计划失败:', error)
      return
    }

    plans.value = data || []
    totalCount.value = count || 0
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)

    // 计算统计数据
    calculateStats()
  } catch (error) {
    console.error('加载学习计划失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算统计数据
const calculateStats = () => {
  const inProgress = plans.value.filter(p => p.status === 'in_progress').length
  const completed = plans.value.filter(p => p.status === 'completed').length
  const paused = plans.value.filter(p => p.status === 'paused').length
  
  const avgProgress = plans.value.length > 0
    ? Math.round(plans.value.reduce((sum, p) => sum + (p.progress || 0), 0) / plans.value.length)
    : 0

  stats.value = { inProgress, completed, paused, avgProgress }
}

// 重置并搜索
const resetAndSearch = () => {
  currentPage.value = 1
  selectedPlans.value = []
  loadPlans()
}

// 选择计划
const toggleSelect = (planId: string) => {
  const index = selectedPlans.value.indexOf(planId)
  if (index > -1) {
    selectedPlans.value.splice(index, 1)
  } else {
    selectedPlans.value.push(planId)
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedPlans.value.length === plans.value.length) {
    selectedPlans.value = []
  } else {
    selectedPlans.value = plans.value.map(plan => plan.id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedPlans.value = []
}

// 批量操作
const batchComplete = async () => {
  if (selectedPlans.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .update({ 
        status: 'completed',
        progress: 100,
        completed_hours: 100 // 简化处理，实际应该根据total_hours计算
      })
      .in('id', selectedPlans.value)

    if (error) throw error

    clearSelection()
    loadPlans()
    emit('refresh')
  } catch (error) {
    console.error('批量完成失败:', error)
  }
}

const batchPause = async () => {
  if (selectedPlans.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .update({ status: 'paused' })
      .in('id', selectedPlans.value)

    if (error) throw error

    clearSelection()
    loadPlans()
    emit('refresh')
  } catch (error) {
    console.error('批量暂停失败:', error)
  }
}

const batchDelete = async () => {
  if (selectedPlans.value.length === 0) {
    showToast('请先选择要删除的学习计划', 'warning')
    return
  }
  
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除选中的 ${selectedPlans.value.length} 个学习计划吗？此操作不可恢复！`,
    onConfirm: () => {
      confirmDialog.value.show = false
      executeBatchDelete()
    }
  }
}

// 实际执行批量删除的函数
const executeBatchDelete = async () => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .delete()
      .in('id', selectedPlans.value)

    if (error) throw error

    clearSelection()
    loadPlans()
    emit('refresh')
    showToast(`成功删除 ${selectedPlans.value.length} 个学习计划`, 'success')
  } catch (error) {
    console.error('批量删除失败:', error)
    showToast('批量删除失败，请稍后重试', 'error')
  }
}

// 单个操作
const viewPlan = (plan: StudyPlan) => {
  // 打开新窗口查看计划详情
  window.open(`/study-plan/${plan.id}`, '_blank')
}

const completePlan = async (plan: StudyPlan) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .update({ 
        status: 'completed',
        progress: 100,
        completed_hours: plan.total_hours
      })
      .eq('id', plan.id)

    if (error) throw error

    loadPlans()
    emit('refresh')
  } catch (error) {
    console.error('完成计划失败:', error)
  }
}

const pausePlan = async (plan: StudyPlan) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .update({ status: 'paused' })
      .eq('id', plan.id)

    if (error) throw error

    loadPlans()
    emit('refresh')
  } catch (error) {
    console.error('暂停计划失败:', error)
  }
}

const deletePlan = (plan: StudyPlan) => {
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除学习计划\"${plan.title}\"吗？此操作不可恢复！`,
    onConfirm: () => {
      confirmDialog.value.show = false
      executeDeletePlan(plan)
    }
  }
}

// 实际执行单个删除的函数
const executeDeletePlan = async (plan: StudyPlan) => {
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('study_plans')
      .delete()
      .eq('id', plan.id)

    if (error) throw error

    loadPlans()
    emit('refresh')
    showToast(`学习计划"${plan.title}"删除成功`, 'success')
  } catch (error) {
    console.error('删除计划失败:', error)
    showToast('删除失败，请稍后重试', 'error')
  }
}

// 分页
const changePage = (page: number) => {
  currentPage.value = page
  loadPlans()
}

// 获取优先级样式
const getPriorityClass = (priority: string | null) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

// 获取优先级文本
const getPriorityText = (priority: string | null) => {
  switch (priority) {
    case 'high':
      return '高'
    case 'medium':
      return '中'
    case 'low':
      return '低'
    default:
      return '无'
  }
}

// 获取状态样式
const getStatusClass = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
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

// 计算剩余天数
const calculateDaysRemaining = (plan: StudyPlan) => {
  const endDate = new Date(plan.end_date)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
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