<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 搜索头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center space-x-4">
          <!-- 返回按钮 -->
          <button @click="$router.back()" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft class="h-5 w-5" />
          </button>
          
          <!-- 搜索框 -->
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索学习资源..."
              class="w-full pl-10 pr-24 py-3 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <!-- 搜索按钮 -->
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full transition-colors"
            >
              搜索
            </button>
          </div>
          
          <!-- 筛选按钮 -->
          <button 
            @click="showFilters = !showFilters"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter class="h-5 w-5" />
          </button>
        </div>
        
        <!-- 新增筛选项标签 -->
        <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 学习目标 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Target class="h-4 w-4 mr-2 text-blue-500" />
                学习目标
              </h4>
              <div class="flex flex-wrap gap-2 mb-3">
                <button
                  v-for="option in learningGoalOptions"
                  :key="option.value"
                  @click="toggleLearningGoal(option.value)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-lg border transition-all duration-200',
                    customFilters.learningGoalOptions.includes(option.value)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
              <input
                v-model="customFilters.learningGoal"
                type="text"
                placeholder="例如：掌握React基础"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <!-- 资源时长 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Clock class="h-4 w-4 mr-2 text-green-500" />
                资源时长
              </h4>
              <div class="flex flex-wrap gap-2 mb-3">
                <button
                  v-for="option in durationOptions"
                  :key="option.value"
                  @click="toggleDuration(option.value)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-lg border transition-all duration-200',
                    customFilters.durationOptions.includes(option.value)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
              <input
                v-model="customFilters.duration"
                type="text"
                placeholder="例如：1-2小时"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <!-- 资源类型 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FileText class="h-4 w-4 mr-2 text-purple-500" />
                资源类型
              </h4>
              <div class="flex flex-wrap gap-2 mb-3">
                <button
                  v-for="option in resourceTypeOptions"
                  :key="option.value"
                  @click="toggleResourceType(option.value)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-lg border transition-all duration-200',
                    customFilters.resourceTypeOptions.includes(option.value)
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
              <input
                v-model="customFilters.resourceType"
                type="text"
                placeholder="例如：视频课程"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        
        <!-- 筛选面板 -->
        <div v-if="showFilters" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">类型</label>
            <select v-model="filters.type" class="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm">
              <option value="">全部</option>
              <option value="course">课程</option>
              <option value="video">视频</option>
              <option value="article">文章</option>
              <option value="book">书籍</option>
              <option value="tool">工具</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">难度</label>
            <select v-model="filters.difficulty" class="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm">
              <option value="">全部</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">时长</label>
            <select v-model="filters.duration" class="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm">
              <option value="">全部</option>
              <option value="short">短篇 (&lt; 30分钟)</option>
              <option value="medium">中等 (30分钟-2小时)</option>
              <option value="long">长篇 (&gt; 2小时)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">评分</label>
            <select v-model="filters.rating" class="w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 text-sm">
              <option value="">全部</option>
              <option value="4.5">4.5星以上</option>
              <option value="4.0">4.0星以上</option>
              <option value="3.5">3.5星以上</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- 搜索结果 -->
    <main class="container mx-auto px-4 py-6">
      <!-- 搜索统计 -->
      <div v-if="hasSearched" class="mb-6 flex justify-between items-center">
        <p class="text-gray-600 dark:text-gray-400">
          找到 <span class="font-semibold">{{ filteredResources.length }}</span> 个相关结果
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">排序:</span>
          <select v-model="sortBy" class="bg-transparent border-0 text-sm focus:outline-none">
            <option value="relevance">相关性</option>
            <option value="rating">评分</option>
            <option value="date">最新</option>
            <option value="views">人气</option>
          </select>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">正在搜索...</p>
      </div>

      <!-- 搜索结果 -->
      <div v-else-if="filteredResources.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResourceCard
          v-for="(resource, index) in paginatedResources"
          :key="resource.id"
          :resource="resource"
          :rank="index + 1"
          @click="navigateToResource(resource.id)"
        />
      </div>

      <!-- 无结果 -->
      <div v-else-if="hasSearched && filteredResources.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
        <Search class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          没有找到相关结果
        </h3>
        <p class="text-gray-500 dark:text-gray-500">
          尝试调整搜索关键词或筛选条件
        </p>
      </div>

      <!-- 初始状态 -->
      <div v-if="!hasSearched" class="flex flex-col items-center justify-center py-16 text-center">
        <Search class="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          搜索学习资源
        </h3>
        <p class="text-gray-500 dark:text-gray-500 mb-6">
          输入关键词或选择筛选条件，然后点击搜索按钮
        </p>
        
        <!-- 热门搜索建议 -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="searchQuery = suggestion; handleSearch()"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="hasSearched && totalPages > 1" class="flex justify-center mt-8">
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg transition-colors',
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import ResourceCard from '@/components/ResourceCard.vue'
import { Search, Filter, ArrowLeft, Target, Clock, FileText } from 'lucide-vue-next'

interface Resource {
  id: number
  title: string
  description: string
  type: string
  difficulty: string
  duration: string
  rating: number
  views: number
  thumbnail: string
  tags: string[]
  date: string
}

const router = useRouter()

// 搜索相关
const searchQuery = ref('')
const isLoading = ref(false)
const showFilters = ref(false)
const hasSearched = ref(false)

// 筛选条件
const filters = ref({
  type: '',
  difficulty: '',
  duration: '',
  rating: ''
})

// 学习目标选项
const learningGoalOptions = [
  { label: '掌握基础', value: 'basic' },
  { label: '进阶提升', value: 'intermediate' },
  { label: '专家级别', value: 'advanced' }
]

// 资源时长选项
const durationOptions = [
  { label: '1小时以内', value: 'short' },
  { label: '1-3小时', value: 'medium' },
  { label: '3小时以上', value: 'long' }
]

// 资源类型选项
const resourceTypeOptions = [
  { label: '视频课程', value: 'video-course' },
  { label: '图文教程', value: 'tutorial' },
  { label: '实践项目', value: 'practice' }
]

// 自定义筛选条件
const customFilters = ref({
  learningGoal: '',
  learningGoalOptions: [] as string[],
  duration: '',
  durationOptions: [] as string[],
  resourceType: '',
  resourceTypeOptions: [] as string[]
})

// 排序
const sortBy = ref('relevance')

// 分页
const currentPage = ref(1)
const pageSize = ref(9)

// 热门搜索建议 - 从数据库获取
const searchSuggestions = ref<string[]>([])
const searchResults = ref<any[]>([])

// 从数据库加载搜索建议
const loadSearchSuggestions = async () => {
  try {
    const dbStore = useDatabaseStore()
    const resources = await dbStore.getResources({ limit: 10 })
    // 从资源标题中提取关键词作为搜索建议
    const keywords = new Set<string>()
    resources.forEach(resource => {
      if (resource.title) {
        resource.title.split(' ').forEach(word => {
          if (word.length > 1) keywords.add(word)
        })
      }
    })
    searchSuggestions.value = Array.from(keywords).slice(0, 7)
  } catch (error) {
    console.warn('加载搜索建议失败:', error)
    searchSuggestions.value = []
  }
}

// 从数据库搜索资源
const searchResources = async (query: string) => {
  isLoading.value = true
  
  try {
    const dbStore = useDatabaseStore()
    const results = await dbStore.searchResources(query)
    searchResults.value = results
    return results
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
    return []
  } finally {
    isLoading.value = false
  }
}



// 切换学习目标选项
const toggleLearningGoal = (goal: string) => {
  const index = customFilters.value.learningGoalOptions.indexOf(goal)
  if (index > -1) {
    customFilters.value.learningGoalOptions.splice(index, 1)
  } else {
    customFilters.value.learningGoalOptions.push(goal)
  }
}

// 切换资源时长选项
const toggleDuration = (duration: string) => {
  const index = customFilters.value.durationOptions.indexOf(duration)
  if (index > -1) {
    customFilters.value.durationOptions.splice(index, 1)
  } else {
    customFilters.value.durationOptions.push(duration)
  }
}

// 切换资源类型选项
const toggleResourceType = (type: string) => {
  const index = customFilters.value.resourceTypeOptions.indexOf(type)
  if (index > -1) {
    customFilters.value.resourceTypeOptions.splice(index, 1)
  } else {
    customFilters.value.resourceTypeOptions.push(type)
  }
}

// 处理搜索
const handleSearch = async () => {
  if (!searchQuery.value.trim() && 
      !customFilters.value.learningGoal.trim() &&
      !customFilters.value.resourceType.trim() &&
      !customFilters.value.duration.trim() &&
      customFilters.value.learningGoalOptions.length === 0 &&
      customFilters.value.durationOptions.length === 0 &&
      customFilters.value.resourceTypeOptions.length === 0) {
    return
  }
  
  currentPage.value = 1
  hasSearched.value = true
  await searchResources(searchQuery.value)
}

// 计算筛选后的资源
const filteredResources = computed(() => {
  // 如果还没有搜索过，返回空数组
  if (!hasSearched.value) {
    return []
  }
  
  let results = [...searchResults.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    results = results.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }
  
  // 自定义筛选条件 - 学习目标选项
  if (customFilters.value.learningGoalOptions.length > 0) {
    results = results.filter(resource => {
      return customFilters.value.learningGoalOptions.some(goal => {
        const goalLower = goal.toLowerCase()
        return resource.title.toLowerCase().includes(goalLower) ||
               resource.description.toLowerCase().includes(goalLower) ||
               resource.tags.some(tag => tag.toLowerCase().includes(goalLower))
      })
    })
  }
  
  // 自定义筛选条件 - 资源时长选项
  if (customFilters.value.durationOptions.length > 0) {
    results = results.filter(resource => {
      return customFilters.value.durationOptions.some(duration => {
        const durationLower = duration.toLowerCase()
        if (durationLower === 'short') {
          return resource.duration === 'short'
        } else if (durationLower === 'medium') {
          return resource.duration === 'medium'
        } else if (durationLower === 'long') {
          return resource.duration === 'long'
        }
        return resource.duration.toLowerCase().includes(durationLower)
      })
    })
  }
  
  // 自定义筛选条件 - 资源类型选项
  if (customFilters.value.resourceTypeOptions.length > 0) {
    results = results.filter(resource => {
      return customFilters.value.resourceTypeOptions.some(type => {
        const typeLower = type.toLowerCase()
        if (typeLower === 'video-course') {
          return resource.type === 'video' || resource.type === 'course'
        } else if (typeLower === 'tutorial') {
          return resource.type === 'article' || resource.type === 'tutorial'
        } else if (typeLower === 'practice') {
          return resource.type === 'practice' || resource.type === 'project' ||
                 resource.title.toLowerCase().includes('project') ||
                 resource.title.toLowerCase().includes('practice')
        }
        return resource.type.toLowerCase().includes(typeLower) ||
               resource.tags.some(tag => tag.toLowerCase().includes(typeLower))
      })
    })
  }
  
  // 自定义筛选条件 - 学习目标
  if (customFilters.value.learningGoal) {
    const goal = customFilters.value.learningGoal.toLowerCase()
    results = results.filter(resource => 
      resource.title.toLowerCase().includes(goal) ||
      resource.description.toLowerCase().includes(goal) ||
      resource.tags.some(tag => tag.toLowerCase().includes(goal))
    )
  }
  
  // 自定义筛选条件 - 资源类型
  if (customFilters.value.resourceType) {
    const type = customFilters.value.resourceType.toLowerCase()
    results = results.filter(resource => 
      resource.type.toLowerCase().includes(type) ||
      resource.category.toLowerCase().includes(type) ||
      resource.tags.some(tag => tag.toLowerCase().includes(type))
    )
  }
  
  // 自定义筛选条件 - 资源时长
  if (customFilters.value.duration) {
    const duration = customFilters.value.duration.toLowerCase()
    results = results.filter(resource => 
      resource.duration.toLowerCase().includes(duration)
    )
  }
  
  // 类型筛选
  if (filters.value.type) {
    results = results.filter(resource => resource.type === filters.value.type)
  }
  
  // 难度筛选
  if (filters.value.difficulty) {
    results = results.filter(resource => resource.difficulty === filters.value.difficulty)
  }
  
  // 时长筛选
  if (filters.value.duration) {
    results = results.filter(resource => resource.duration === filters.value.duration)
  }
  
  // 评分筛选
  if (filters.value.rating) {
    const minRating = parseFloat(filters.value.rating)
    results = results.filter(resource => resource.rating >= minRating)
  }
  
  // 排序
  switch (sortBy.value) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'date':
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'views':
      results.sort((a, b) => b.views - a.views)
      break
    default: // relevance
      // 保持搜索相关性排序
      break
  }
  
  return results
})

// 分页相关计算
const totalPages = computed(() => Math.ceil(filteredResources.value.length / pageSize.value))
const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredResources.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 导航到资源详情
const navigateToResource = (id: number) => {
  router.push(`/resource/${id}`)
}

// 监听筛选条件变化
watch([filters, sortBy], () => {
  currentPage.value = 1
})

// 搜索输入框引用
const searchInput = ref<HTMLInputElement | null>(null)

// 监听路由参数
onMounted(() => {
  // 加载搜索建议
  loadSearchSuggestions()
  
  const routeQuery = router.currentRoute.value.query.q
  if (routeQuery && typeof routeQuery === 'string') {
    searchQuery.value = routeQuery
    // 不自动搜索，等待用户点击搜索按钮
  }
  
  // 自动聚焦到搜索框
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
})
</script>

<style scoped>
/* 自定义样式 */
</style>