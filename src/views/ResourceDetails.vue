<template>
  <div class="p-6 md:p-8">
    <!-- 返回按钮 -->
    <button 
      @click="$router.back()"
      class="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      返回
    </button>

    <!-- 资源详情 -->
    <div v-if="resource" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <!-- 资源头部 -->
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ resource.title }}</h1>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{{ resource.provider }}</span>
                <span class="mx-2">•</span>
                <span>{{ resource.type }}</span>
                <span class="mx-2">•</span>
                <span>{{ resource.difficulty }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                {{ resource.status }}
              </span>
            </div>
          </div>

          <!-- 评分和统计 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

            
            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="ml-1 font-semibold text-lg">{{ resource.duration }}</span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">学习时长</div>
            </div>
            

          </div>
        </div>

        <!-- 资源内容 -->
        <div class="p-6">
          <!-- 描述 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">资源描述</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ resource.description }}</p>
          </div>

          <!-- 标签 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">相关标签</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in resource.tags" 
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 内容大纲 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">内容大纲</h3>
            <ul class="space-y-2">
              <li 
                v-for="(item, index) in resource.contentOutline" 
                :key="index"
                class="flex items-start"
              >
                <span class="text-blue-500 mr-3 mt-1">•</span>
                <span class="text-gray-700 dark:text-gray-300">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              @click="handleStartLearning"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              开始学习
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
      <h3 class="text-lg font-medium mb-2">正在加载资源信息</h3>
      <p class="text-gray-500 dark:text-gray-400">请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Resource {
  id: string
  title: string
  provider: string
  type: string
  difficulty: string
  description: string
  duration: string
  rating: number
  views: number
  likes: number
  status: string
  tags: string[]
  contentOutline: string[]
  url: string
}

const resource = ref<Resource | null>(null)

// 从数据库加载资源数据
const loadResource = async (id: string) => {
  try {
    const { supabaseService } = await import('@/services/supabase')
    const resourceData = await supabaseService.getResourceById(id)
    
    if (resourceData) {
      resource.value = {
        ...resourceData,
        views: resourceData.views || 0,
        likes: resourceData.likes || 0,
        status: '推荐',
        tags: resourceData.tags || [],
        contentOutline: [] // 数据库中没有这个字段，留空
      }
    } else {
      console.error('资源未找到:', id)
    }
  } catch (error) {
    console.error('加载资源失败:', error)
  }
}

const handleStartLearning = () => {
  if (resource.value?.url) {
    window.open(resource.value.url, '_blank')
  }
}

const handleLike = () => {
  console.log('收藏资源')
  // 这里可以添加收藏逻辑
}

const handleShare = () => {
  console.log('分享资源')
  // 这里可以添加分享逻辑
}

onMounted(() => {
  const resourceId = route.params.id as string
  loadResource(resourceId)
})
</script>