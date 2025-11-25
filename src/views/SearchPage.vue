<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 搜索头部 -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <button 
            @click="goBack"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="搜索课程、视频、技能..."
                class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                @click="handleSearch"
                :disabled="isSearching || !searchQuery.trim()"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors"
              >
                {{ isSearching ? '搜索中...' : '搜索' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 筛选选项 -->
        <div class="flex items-center space-x-4 mt-4">
          <select 
            v-model="selectedLevel"
            class="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部难度</option>
            <option value="beginner">初学者</option>
            <option value="intermediate">进阶</option>
            <option value="advanced">高级</option>
          </select>
          
          <select 
            v-model="selectedCategory"
            class="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            <option value="frontend">前端开发</option>
            <option value="backend">后端开发</option>
            <option value="mobile">移动开发</option>
            <option value="ai">人工智能</option>
            <option value="data">数据科学</option>
            <option value="design">设计</option>
          </select>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索结果 -->
      <div v-if="searchResults" class="space-y-8">
        <!-- AI推荐区域 -->
        <div v-if="searchResults.topRecommendation && !searchResults.topRecommendation.id.startsWith('fallback')">
          <div class="mb-6">
            <div class="flex items-center mb-4">
              <Sparkles class="h-6 w-6 text-blue-500 mr-2" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">AI 智能推荐</h2>
            </div>
            
            <!-- 最推荐资源 -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-700">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-xs font-semibold bg-blue-500 text-white px-2 py-1 rounded">最推荐</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      匹配度: {{ Math.round(searchResults.topRecommendation.matchScore * 100) }}%
                    </span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ searchResults.topRecommendation.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ searchResults.topRecommendation.description }}
                  </p>
                  
                  <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">平台</span>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ searchResults.topRecommendation.provider === 'MOOC' ? '中国大学MOOC' : 'B站' }}
                      </p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">难度</span>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ searchResults.topRecommendation.difficulty }}
                      </p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">时长</span>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ searchResults.topRecommendation.duration }}
                      </p>
                    </div>
                    <div v-if="searchResults.topRecommendation.bv_number">
                      <span class="text-sm text-gray-500 dark:text-gray-400">BV号</span>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ searchResults.topRecommendation.bv_number }}
                      </p>
                    </div>
                    <div v-if="searchResults.topRecommendation.study_data && searchResults.topRecommendation.study_data !== '暂无数据'">
                      <span class="text-sm text-gray-500 dark:text-gray-400">播放量</span>
                      <p class="font-semibold text-gray-900 dark:text-white">
                        {{ searchResults.topRecommendation.study_data }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-3 mb-4">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                      <strong>推荐理由：</strong>{{ searchResults.topRecommendation.recommendedReason }}
                    </p>
                  </div>
                  
                  <div class="flex space-x-3">
                    <button 
                      @click="openResource(searchResults.topRecommendation)"
                      class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      立即学习
                    </button>
                    <button 
                      @click="saveToFavorites(searchResults.topRecommendation)"
                      class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      收藏
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他推荐 -->
        <div v-if="searchResults.otherRecommendations.length > 0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">其他推荐</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              找到 {{ searchResults.otherRecommendations.length }} 个相关资源
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="resource in searchResults.otherRecommendations" 
              :key="resource.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              @click="openResource(resource)"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                  <span 
                    :class="`px-2 py-1 text-xs font-semibold rounded ${getResourceProviderColor(resource.provider)}`"
                  >
                    {{ resource.provider === 'MOOC' ? '中国大学MOOC' : 'B站' }}
                  </span>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span class="mr-1">⭐</span>
                    <span>{{ resource.rating || '暂无评分' }}</span>
                  </div>
                </div>
                
                <h4 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {{ resource.title }}
                </h4>
                
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {{ resource.description }}
                </p>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ resource.difficulty }} · {{ resource.duration }}</span>
                    <div v-if="resource.bv_number" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      BV: {{ resource.bv_number }}
                    </div>
                  </div>
                  <div v-if="resource.study_data && resource.study_data !== '暂无数据'" class="text-sm text-gray-500 dark:text-gray-400">
                    <span class="mr-1">👁️</span>
                    播放量: {{ resource.study_data }}
                  </div>
                  <div class="flex items-center justify-between">
                    <div></div>
                    <div class="text-blue-500 hover:text-blue-600">
                      查看详情 →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 学习建议 -->
        <div v-if="searchResults.learningAdvice" class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div class="flex items-center mb-3">
            <Lightbulb class="h-6 w-6 text-green-500 mr-2" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">AI 学习建议</h3>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ searchResults.learningAdvice }}
          </p>
        </div>

        <!-- 相关关键词 -->
        <div v-if="searchResults.relatedKeywords.length > 0" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">相关搜索</h4>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="keyword in searchResults.relatedKeywords" 
              :key="keyword"
              @click="searchKeyword(keyword)"
              class="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              {{ keyword }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!isSearching && hasSearched" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <Search class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            没有找到相关资源
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            试试调整关键词或选择不同的筛选条件
          </p>
          <div class="flex justify-center space-x-4">
            <button 
              @click="clearSearch"
              class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              清空搜索
            </button>
            <button 
              @click="showPopularSearches"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              热门搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 初始状态 -->
      <div v-else-if="!hasSearched" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <BookOpen class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            开始搜索学习资源
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            输入您想学习的技能或课程，AI 将为您智能匹配最佳资源
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cozeAPIService } from '@/services/coze-api'
import { 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Lightbulb, 
  BookOpen 
} from 'lucide-vue-next'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref<any | null>(null)
const selectedLevel = ref('')
const selectedCategory = ref('')

// 搜索处理
const handleSearch = async () => {
  if (!searchQuery.value.trim() || isSearching.value) return
  
  isSearching.value = true
  hasSearched.value = true
  
  try {
    const results = await cozeAPIService.searchRecommendations({
      query: searchQuery.value.trim()
    })
    
    // 转换为搜索页面期望的格式
    searchResults.value = {
      topRecommendation: {
        id: 'top',
        title: results.top_recommendation.name,
        description: results.top_recommendation.reason,
        provider: results.top_recommendation.platform === '中国大学MOOC官网' ? 'MOOC' : 'Bilibili',
        url: results.top_recommendation.bv_number ? `https://www.bilibili.com/video/${results.top_recommendation.bv_number}` : undefined,
        difficulty: results.top_recommendation.difficulty,
        duration: results.top_recommendation.duration,
        matchScore: 0.9,
        recommendedReason: results.top_recommendation.reason,
        bv_number: results.top_recommendation.bv_number,
        study_data: results.top_recommendation.study_data,
        up_host: results.top_recommendation.up_host
      },
      otherRecommendations: results.other_recommendations.map((item, index) => ({
        id: `other_${index}`,
        title: item.name,
        description: item.reason,
        provider: item.platform === '中国大学MOOC官网' ? 'MOOC' : 'Bilibili',
        url: item.bv_number ? `https://www.bilibili.com/video/${item.bv_number}` : undefined,
        difficulty: item.difficulty,
        duration: item.duration,
        matchScore: 0.7 - index * 0.1,
        recommendedReason: item.reason,
        bv_number: item.bv_number,
        study_data: item.study_data,
        up_host: item.up_host
      })),
      learningAdvice: results.learning_advice,
      relatedKeywords: []
    }
  } catch (error) {
    console.error('搜索失败:', error)
    // 显示错误提示
  } finally {
    isSearching.value = false
  }
}

// 工具方法
const goBack = () => {
  router.back()
}

const openResource = (resource: any) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

const saveToFavorites = (resource: any) => {
  // 实现收藏功能
  console.log('收藏资源:', resource)
}

const searchKeyword = (keyword: string) => {
  searchQuery.value = keyword
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = null
  hasSearched.value = false
}

const showPopularSearches = () => {
  // 显示热门搜索
  const popularSearches = ['Vue.js', 'Python', '前端开发', '数据分析', '机器学习']
  searchQuery.value = popularSearches[Math.floor(Math.random() * popularSearches.length)]
}

const getResourceProviderColor = (provider: string) => {
  return provider === 'MOOC' 
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
}

// 生命周期
onMounted(() => {
  // 如果从首页跳转过来，可能带有初始查询参数
  const query = router.currentRoute.value.query.q as string
  if (query) {
    searchQuery.value = query
    handleSearch()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>