<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Clock class="h-8 w-8 mr-3 text-blue-500" />
          学习记录
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">查看你的学习足迹</p>
      </div>
      <button 
        @click="clearAllHistory"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
      >
        <Trash2 class="h-4 w-4 mr-2" />
        清空历史
      </button>
    </div>

    <!-- 加载状态 -->
    <div 
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h3 class="text-lg font-medium mb-2">正在加载历史记录</h3>
      <p class="text-gray-500 dark:text-gray-400">请稍候...</p>
    </div>
    
    <!-- 历史记录内容 -->
    <div v-if="!isLoading">
      <!-- 无历史记录状态 -->
      <div 
        v-if="historyByDate.length === 0" 
        class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md"
      >
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4">
          <Clock class="h-8 w-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium mb-2">暂无浏览记录</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">浏览教育资源后，这里将显示你的学习足迹</p>
        <router-link to="/search" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block">
          去搜索资源
        </router-link>
      </div>
      
      <!-- 有历史记录 -->
      <div v-else class="space-y-6">
        <div 
          v-for="(dateGroup, dateIndex) in historyByDate"
          :key="dateGroup.date"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300"
        >
          <!-- 日期标题 -->
          <div class="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 flex items-center">
            <Calendar class="h-4 w-4 text-blue-500 mr-2" />
            <span class="font-medium text-blue-600 dark:text-blue-400">{{ dateGroup.dateLabel }}</span>
          </div>
          
          <!-- 当天的历史记录列表 -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div 
              v-for="(item, itemIndex) in dateGroup.items"
              :key="`${item.resource.id}_${item.timestamp}`"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ item.resource.name }}</h3>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{{ item.resource.provider }}</span>
                    <span class="mx-2">•</span>
                    <span class="flex items-center">
                      <ClockIcon class="h-3 w-3 mr-1" />
                      {{ formatTime(item.timestamp) }}
                    </span>
                  </div>
                  
                  <!-- 关键信息 -->
                  <div class="grid grid-cols-3 gap-2 mb-3">
                    <div class="flex items-center">
                      <div class="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg mr-1.5">
                        <ClockIcon class="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div class="text-xs">{{ item.resource.duration }}</div>
                    </div>
                    <div class="flex items-center">
                      <div class="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg mr-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <div class="text-xs">{{ item.resource.rating }}/10</div>
                    </div>
                    <div class="flex items-center">
                      <div class="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg mr-1.5">
                        <DollarSign class="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <div class="text-xs">{{ item.resource.type }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <button
                  @click="handleResourceClick($event, item.resource.url)"
                  class="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center"
                >
                  <BookOpen class="h-4 w-4 mr-1.5" />
                  <span class="text-sm">继续学习</span>
                </button>
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
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Clock as ClockIcon, 
  DollarSign, 
  ExternalLink, 
  Trash2 
} from 'lucide-vue-next'

// 资源数据类型
interface Resource {
  id: number
  name: string
  provider: string
  duration: string
  rating: number
  url: string
  matchPoints: string
  type: string
}

// 历史记录项类型
interface HistoryItem {
  resource: Resource
  timestamp: number
}

// 按日期分组的历史记录类型
interface HistoryByDate {
  date: string
  dateLabel: string
  items: HistoryItem[]
}

const historyByDate = ref<HistoryByDate[]>([])
const isLoading = ref(true)

// 获取用户ID（从localStorage中获取）
const getCurrentUserId = (): string => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return user.id.toString()
    } catch (error) {
      console.error('Failed to parse current user:', error)
    }
  }
  // 如果没有登录用户，返回默认ID
  return 'default_user'
}

// 加载用户的历史记录
const loadHistory = () => {
  isLoading.value = true
  
  try {
    const userId = getCurrentUserId()
    const historyKey = `resource_history_${userId}`
    
    // 获取存储的历史记录
    const savedHistory = localStorage.getItem(historyKey)
    
    if (savedHistory) {
      try {
        const historyItems: HistoryItem[] = JSON.parse(savedHistory)
      
        // 按时间戳降序排序（最新的在前）
        historyItems.sort((a, b) => b.timestamp - a.timestamp)
        
        // 按日期分组
        const groupedByDate: Record<string, HistoryItem[]> = {}
        
        historyItems.forEach(item => {
          const date = new Date(item.timestamp)
          const dateKey = date.toDateString() // 使用Date对象的toDateString作为键，确保相同日期的项目分到同一组
          
          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = []
          }
          
          groupedByDate[dateKey].push(item)
        })
        
        // 转换为需要的格式
        const formattedHistory: HistoryByDate[] = Object.entries(groupedByDate).map(([date, items]) => {
          const dateObj = new Date(date)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          let dateLabel = ''
          
          if (dateObj.toDateString() === today.toDateString()) {
            dateLabel = '今天'
          } else if (dateObj.toDateString() === yesterday.toDateString()) {
            dateLabel = '昨天'
          } else {
            // 格式化日期为 "MM月DD日"
            dateLabel = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
          }
          
          return {
            date,
            dateLabel,
            items
          }
        })
        
        historyByDate.value = formattedHistory
      } catch (error) {
        console.error('Failed to parse history items:', error)
        historyByDate.value = []
      }
    } else {
      // 没有历史记录，显示空状态
      historyByDate.value = []
    }
  } catch (error) {
    console.error('Failed to load history:', error)
    historyByDate.value = []
  } finally {
    isLoading.value = false
  }
}

// 清除所有历史记录
const clearAllHistory = () => {
  try {
    const userId = getCurrentUserId()
    const historyKey = `resource_history_${userId}`
    
    localStorage.removeItem(historyKey)
    historyByDate.value = []
    console.log('历史记录已清空')
  } catch (error) {
    console.error('Failed to clear history:', error)
    console.error('清空历史记录失败')
  }
}

// 处理点击资源链接
const handleResourceClick = (e: Event, url: string) => {
  e.preventDefault()
  window.open(url, '_blank', 'noopener,noreferrer')
}

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 组件加载时加载历史记录
onMounted(() => {
  loadHistory()
})
</script>