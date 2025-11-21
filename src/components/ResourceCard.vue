<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1">
    <!-- 资源头部 -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700 relative">
      <div :class="`absolute -top-2 -left-2 w-8 h-8 rounded-full ${getRankBadgeColor(rank)} flex items-center justify-center font-bold text-sm z-10`">
        {{ rank }}
      </div>
      <div class="pl-6">
        <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ resource.name || resource.title }}</h3>
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{{ resource.provider }}</span>
        </div>
      </div>
    </div>
    
    <!-- 资源内容 -->
    <div class="p-4">
      <!-- 核心契合点 -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
        <div class="flex items-start">
          <Check class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ resource.matchPoints }}</p>
        </div>
      </div>
      
      <!-- 内容大纲 -->
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
          <BookOpen class="h-4 w-4 mr-1" />
          内容大纲
        </h4>
        <ul class="space-y-1">
          <li 
            v-for="(item, index) in (resource.contentOutline || []).slice(0, 3)" 
            :key="index" 
            class="flex items-start text-sm text-gray-700 dark:text-gray-300"
          >
            <span class="text-blue-500 mr-2">•</span>
            <span class="line-clamp-1">{{ item }}</span>
          </li>
          <li v-if="(resource.contentOutline || []).length > 3" class="text-sm text-blue-500">
            +{{ (resource.contentOutline || []).length - 3 }} 更多内容
          </li>
        </ul>
      </div>
      
      <!-- 关键信息 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div class="flex items-center">
          <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-2">
            <Clock class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">学习时长</div>
            <div class="text-sm font-medium">{{ resource.duration }}</div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-2">
            <Star class="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">用户评分</div>
            <div class="text-sm font-medium">{{ resource.rating }}/10</div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-2">
            <DollarSign class="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">资源类型</div>
            <div class="text-sm font-medium">{{ resource.type }}</div>
          </div>
        </div>
      </div>
      
      <!-- 互动按钮 -->
      <div class="flex space-x-3 mb-4">
        <button
          @click="handleLike"
          :class="`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
            interaction.liked 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`"
        >
          <ThumbsUp :class="`h-4 w-4 mr-1 ${interaction.liked ? 'fill-current' : ''}`" />
          <span>{{ interaction.likesCount }}</span>
        </button>
        
        <button
          @click="handleSave"
          :class="`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
            interaction.saved 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`"
        >
          <Heart :class="`h-4 w-4 mr-1 ${interaction.saved ? 'fill-current' : ''}`" />
          <span>{{ interaction.saved ? '已收藏' : '收藏' }}</span>
        </button>
      </div>
      
      <!-- 立即学习按钮 -->
      <button
        @click="handleResourceClick(resource.url)"
        class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors hover:scale-105 active:scale-95"
      >
        立即学习
        <ExternalLink class="h-4 w-4 ml-2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { 
  BookOpen, 
  Award, 
  Clock, 
  DollarSign, 
  Star, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  Heart, 
  ThumbsUp 
} from 'lucide-vue-next'
import type { Resource, InteractionData } from '@/types'

interface Props {
  resource: Resource
  rank: number
}

const props = defineProps<Props>()

// 获取排名徽章的颜色
const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-500 text-white'
    case 2:
      return 'bg-gray-400 text-white'
    case 3:
      return 'bg-amber-700 text-white'
    default:
      return 'bg-blue-500 text-white'
  }
}

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

// 获取资源交互数据的唯一键
const getInteractionKey = () => {
  const userId = getCurrentUserId()
  return `resource_interaction_${userId}_${props.resource.id}`
}

// 初始化点赞和收藏状态
const interaction = ref<InteractionData>(() => {
  const savedInteraction = localStorage.getItem(getInteractionKey())
  if (savedInteraction) {
    return JSON.parse(savedInteraction)
  }
  // 默认状态，不设置初始点赞数
  return {
    liked: false,
    saved: false,
    likesCount: 0
  }
})

// 保存交互数据到localStorage
watch(interaction, (newValue) => {
  localStorage.setItem(getInteractionKey(), JSON.stringify(newValue))
}, { deep: true })

// 组件加载时保存资源详情到localStorage
onMounted(() => {
  const resourceDetailsKey = `resource_details_${props.resource.id}`
  // 只有当localStorage中没有该资源详情时才保存
  if (!localStorage.getItem(resourceDetailsKey)) {
    localStorage.setItem(resourceDetailsKey, JSON.stringify(props.resource))
  }
})

// 处理点击资源链接
const handleResourceClick = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
  
  // 记录浏览历史
  addToHistory()
}

// 添加到历史记录
const addToHistory = () => {
  try {
    // 获取用户ID
    const userId = getCurrentUserId()
    const historyKey = `resource_history_${userId}`
    
    // 获取现有历史记录
    const existingHistory = localStorage.getItem(historyKey)
    let historyItems: Array<{
      resource: Resource
      timestamp: number
    }> = existingHistory ? JSON.parse(existingHistory) : []
    
    // 检查是否已存在相同资源，如果存在则更新时间戳
    const existingIndex = historyItems.findIndex(item => item.resource.id === props.resource.id)
    
    if (existingIndex >= 0) {
      // 更新现有资源的时间戳
      historyItems[existingIndex].timestamp = Date.now()
    } else {
      // 添加新资源到历史记录
      historyItems.unshift({
        resource: props.resource,
        timestamp: Date.now()
      })
      
      // 限制历史记录数量为100条
      if (historyItems.length > 100) {
        historyItems = historyItems.slice(0, 100)
      }
    }
    
    // 保存更新后的历史记录
    localStorage.setItem(historyKey, JSON.stringify(historyItems))
  } catch (error) {
    console.error('Failed to save history:', error)
  }
}

// 处理点赞
const handleLike = () => {
  interaction.value = {
    ...interaction.value,
    liked: !interaction.value.liked,
    likesCount: interaction.value.liked ? interaction.value.likesCount - 1 : interaction.value.likesCount + 1
  }
  
  console.log(interaction.value.liked ? '已取消点赞' : '点赞成功')
}

// 处理收藏
const handleSave = () => {
  interaction.value = {
    ...interaction.value,
    saved: !interaction.value.saved
  }
  
  console.log(interaction.value.saved ? '已取消收藏' : '收藏成功')
}
</script>