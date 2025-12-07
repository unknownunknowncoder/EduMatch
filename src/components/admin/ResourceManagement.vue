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
            placeholder="搜索资源标题或描述..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="resetAndSearch"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="">全部分类</option>
            <option value="programming">编程</option>
            <option value="design">设计</option>
            <option value="language">语言学习</option>
            <option value="business">商业</option>
            <option value="science">科学</option>
            <option value="other">其他</option>
          </select>
          <button
            @click="loadResources"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                资源信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                类型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                发布者
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                统计
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                添加时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="resource in resources" :key="resource.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ resource.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                    {{ resource.description || '无描述' }}
                  </div>
                  <div v-if="resource.url" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    <a :href="resource.url" target="_blank" rel="noopener noreferrer">
                      {{ resource.url }}
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  {{ getCategoryText(resource.category) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                  {{ getTypeText(resource.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ resource.user_id }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white space-y-1">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                    </svg>
                    {{ resource.likes_count || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ resource.views_count || 0 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(resource.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewResource(resource)"
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

interface Resource {
  id: string
  title: string
  description: string | null
  category?: string
  type?: string
  url?: string
  likes_count: number
  views_count: number
  user_id: string
  created_at: string
}

const emit = defineEmits(['refresh'])
const dbStore = useDatabaseStore()

const resources = ref<Resource[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')

// 加载资源列表
const loadResources = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('resources')
      .select('*', { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,description.ilike.%${searchKeyword.value}%`)
    }

    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    // 排序
    query = query.order('created_at', { ascending: false })

    // 分页
    query = query.range(0, 19)

    const { data, error, count } = await query

    if (error) {
      console.error('加载资源失败:', error)
      return
    }

    resources.value = data || []
  } catch (error) {
    console.error('加载资源失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置并搜索
const resetAndSearch = () => {
  loadResources()
}

// 查看资源
const viewResource = (resource: Resource) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

// 获取分类文本
const getCategoryText = (category?: string) => {
  switch (category) {
    case 'programming': return '编程'
    case 'design': return '设计'
    case 'language': return '语言学习'
    case 'business': return '商业'
    case 'science': return '科学'
    default: return '其他'
  }
}

// 获取类型文本
const getTypeText = (type?: string) => {
  switch (type) {
    case 'video': return '视频'
    case 'article': return '文章'
    case 'book': return '书籍'
    case 'course': return '课程'
    case 'tool': return '工具'
    case 'website': return '网站'
    default: return '其他'
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  loadResources()
})
</script>

<style scoped>
/* 确保表格内容不换行 */
table {
  table-layout: fixed;
}
</style>