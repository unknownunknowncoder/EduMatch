<template>
  <div class="p-6 md:p-8">
    <!-- 用户状态栏 -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <div v-if="currentUser" class="text-sm text-gray-600 dark:text-gray-400">
          欢迎，{{ currentUser.username || currentUser.email }}
        </div>
        <div v-else class="flex items-center space-x-3">
          <button
            @click="navigateTo('/login')"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            登录
          </button>
          <button
            @click="navigateTo('/register')"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            注册
          </button>
        </div>
      </div>
      
      <!-- 右上角退出登录按钮 -->
      <div v-if="currentUser">
        <button
          @click="logout"
          class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <LogOut class="h-4 w-4" />
          <span>退出登录</span>
        </button>
      </div>
    </div>





      <!-- 大标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          学配智联平台
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          智能匹配您的学习需求，发现最适合的学习资源
        </p>
      </div>

      <!-- AI助手对话界面 -->
      <div class="mb-12">
        <div class="max-w-4xl mx-auto">
          <!-- 对话标题 -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full px-6 py-3">
              <Sparkles class="h-6 w-6 text-blue-500" />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">学习资源AI助手</h2>
            </div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              🤖 我是您的专属学习助手，告诉我您的学习需求，为您推荐最合适的学习资源
            </p>
          </div>

          <!-- 对话历史 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6" style="height: 600px;">
            <div class="h-full overflow-y-auto p-6" ref="chatContainer">
              <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-32">
                <MessageCircle class="h-20 w-20 mx-auto mb-6 opacity-50" />
                <p class="text-lg mb-3">开始对话，让我为您推荐学习资源吧！</p>
                <div class="space-y-2 text-sm">
                  <p>💡 例如：我想学习英语六级考试</p>
                  <p>💡 例如：推荐前端开发课程</p>
                  <p>💡 例如：我想学习人工智能</p>
                </div>
              </div>
              
              <div v-for="(message, index) in messages" :key="index" class="mb-6">
                <!-- 用户消息 -->
                <div v-if="message.role === 'user'" class="flex justify-end mb-8">
                  <div class="max-w-3xl">
                    <div class="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg">
                      <p class="text-base leading-relaxed">{{ message.content }}</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{{ formatTime(message.timestamp) }}</p>
                  </div>
                </div>
                
                <!-- AI回复 -->
                <div v-else class="flex justify-start mb-8">
                  <div class="max-w-3xl">
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles class="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg">
                          <div v-if="message.loading" class="flex items-center space-x-2">
                            <div class="animate-bounce bg-blue-500 rounded-full w-2 h-2"></div>
                            <div class="animate-bounce bg-blue-500 rounded-full w-2 h-2" style="animation-delay: 0.1s"></div>
                            <div class="animate-bounce bg-blue-500 rounded-full w-2 h-2" style="animation-delay: 0.2s"></div>
                            <span class="ml-2 text-gray-500">AI正在思考...</span>
                          </div>
                          <div v-else>
                            <div class="whitespace-pre-wrap">{{ message.content }}</div>
                            <!-- 推荐资源卡片 -->
                            <div v-if="message.resources && message.resources.length > 0" class="mt-4 space-y-3">
                              <div v-for="(resource, rIndex) in message.resources" :key="rIndex" 
                                   class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                <div class="flex justify-between items-start">
                                  <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ resource.name }}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ resource.description }}</p>
                                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                                      <span class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                        {{ resource.platform }}
                                      </span>
                                      <span>{{ resource.difficulty }}</span>
                                      <span>{{ resource.duration }}</span>
                                    </div>
                                  </div>
                                  <button v-if="resource.url" 
                                          @click="openResource(resource)"
                                          class="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                                    立即学习
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(message.timestamp) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="flex items-end space-x-4">
            <div class="flex-1">
              <textarea
                v-model="currentMessage"
                @keydown.enter.exact="sendMessage"
                @keydown.enter.shift.exact.prevent
                :disabled="isLoading"
                placeholder="输入您的学习需求，例如：我想准备英语六级考试... (Shift+Enter换行，Enter发送)"
                class="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 shadow resize-none text-base"
                rows="4"
              ></textarea>
            </div>
            <button
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isLoading"
              class="px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Send v-if="!isLoading" class="h-5 w-5" />
              <div v-else class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{{ isLoading ? '发送中' : '发送' }}</span>
            </button>
          </div>
          <p class="text-center mt-3 text-sm text-gray-500 dark:text-gray-400">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>

      <!-- AI推荐结果 -->
      <div v-if="searchResults" id="ai-search-results" class="mb-12">
        <div class="max-w-6xl mx-auto">
          <!-- 最推荐 -->
          <div v-if="searchResults.top_recommendation" class="mb-8">
            <div class="flex items-center mb-4">
              <Sparkles class="h-6 w-6 text-blue-500 mr-2" />
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">AI 最推荐</h3>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ searchResults.top_recommendation.name }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ searchResults.top_recommendation.reason }}
                  </p>
                  <div class="space-y-2 text-sm">
                    <div><span class="font-semibold">平台：</span>{{ searchResults.top_recommendation.platform }}</div>
                    <div><span class="font-semibold">难度：</span>{{ searchResults.top_recommendation.difficulty }}</div>
                    <div><span class="font-semibold">时长：</span>{{ searchResults.top_recommendation.duration }}</div>
                    <div><span class="font-semibold">学习数据：</span>{{ searchResults.top_recommendation.study_data }}</div>
                    <div v-if="searchResults.top_recommendation.institution">
                      <span class="font-semibold">机构/UP主：</span>{{ searchResults.top_recommendation.institution }}
                    </div>
                    <div v-if="searchResults.top_recommendation.bv_number">
                      <span class="font-semibold">BV号：</span>{{ searchResults.top_recommendation.bv_number }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-center">
                  <button
                    @click="openResource(searchResults.top_recommendation)"
                    class="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                  >
                    立即学习
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他推荐 -->
          <div v-if="searchResults.other_recommendations.length > 0" class="mb-8">
            <div class="flex items-center mb-4">
              <BookOpen class="h-6 w-6 text-green-500 mr-2" />
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">其他推荐</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(resource, index) in searchResults.other_recommendations"
                :key="index"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                @click="openResource(resource)"
              >
                <div class="p-6">
                  <div class="flex items-center justify-between mb-3">
                    <span
                      :class="`px-2 py-1 text-xs font-semibold rounded ${resource.platform === '中国大学MOOC官网' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'}`"
                    >
                      {{ resource.platform }}
                    </span>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ resource.study_data }}
                    </div>
                  </div>
                  
                  <h4 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {{ resource.name }}
                  </h4>
                  
                  <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {{ resource.brief_description }}
                  </p>
                  
                  <div class="flex items-center justify-between text-sm">
                    <div class="text-gray-500 dark:text-gray-400">
                      {{ resource.difficulty }} · {{ resource.duration }}
                    </div>
                    <div v-if="resource.bv_number" class="text-blue-500 hover:text-blue-600 text-xs">
                      BV: {{ resource.bv_number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习建议 -->
          <div v-if="searchResults.learning_advice" class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
            <div class="flex items-center mb-3">
              <Lightbulb class="h-6 w-6 text-green-500 mr-2" />
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">AI 学习建议</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ searchResults.learning_advice }}
            </p>
          </div>
        </div>
      </div>

      <!-- 平台特色标签 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- 智能匹配 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <BookOpen class="h-8 w-8 text-blue-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">智能匹配</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            基于AI算法精准推荐最适合您的学习资源，让学习更高效
          </p>
        </div>

        <!-- 海量资源 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <PlusCircle class="h-8 w-8 text-green-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">海量资源</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            涵盖各领域的优质学习资料，从基础入门到高级进阶全覆盖
          </p>
        </div>



        <!-- 社区互动 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <BarChart3 class="h-8 w-8 text-orange-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">社区互动</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            与学习者交流分享，在互助社区中共同成长进步
          </p>
        </div>
      </div>

      <!-- 推荐资源 -->
      <div v-if="!searchResults" class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">推荐资源</h3>
          <button
            @click="navigateTo('/search')"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            查看全部
          </button>
        </div>

        <!-- 空状态：不显示任何模拟数据 -->
        <div class="text-center py-12">
          <BookOpen class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">暂无推荐资源，请使用上方搜索框获取AI推荐</p>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BookOpen, 
  PlusCircle, 
  BarChart3,
  Search,
  Sparkles,
  Lightbulb,
  MessageCircle,
  Send,
  LogOut
} from 'lucide-vue-next'
import { cozeAPIService, type CozeSearchResponse } from '@/services/coze-api'

const router = useRouter()

const searchResults = ref<CozeSearchResponse | null>(null)
const currentUser = ref<any>(null)

// 对话相关
const messages = ref<Array<{
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
  resources?: Array<{
    name: string
    description: string
    platform: string
    difficulty: string
    duration: string
    url?: string
  }>
}>>([])
const currentMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement>()

// 导航方法
const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToSearch = () => {
  router.push('/search')
}



// 打开资源
const openResource = (resource: any) => {
  if (resource.platform === 'B站' && resource.bv_number) {
    // 打开B站视频
    window.open(`https://www.bilibili.com/video/${resource.bv_number}`, '_blank')
  } else if (resource.platform === '中国大学MOOC官网') {
    // 打开MOOC课程（需要根据实际URL调整）
    window.open('https://www.icourse163.org/', '_blank')
  }
}

// 检查用户登录状态
const checkUserStatus = () => {
  const userData = localStorage.getItem('currentUser')
  if (userData) {
    try {
      currentUser.value = JSON.parse(userData)
    } catch (error) {
      console.error('解析用户数据失败:', error)
      localStorage.removeItem('currentUser')
      currentUser.value = null
    }
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  alert('已退出登录')
}

// 发送消息
const sendMessage = async () => {
  const message = currentMessage.value.trim()
  if (!message || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  })

  currentMessage.value = ''
  isLoading.value = true

  // 添加AI占位消息
  const aiMessageIndex = messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    loading: true,
    resources: []
  }) - 1

  // 滚动到底部
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 100)

  try {
    const response = await cozeAPIService.searchRecommendations({
      query: message
    })

    // 更新AI消息
    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: response.learning_advice || '我来为您推荐一些优质的学习资源：',
      timestamp: new Date(),
      resources: [
        {
          name: response.top_recommendation.name,
          description: response.top_recommendation.reason || '这是一个非常优质的学习资源',
          platform: response.top_recommendation.platform,
          difficulty: response.top_recommendation.difficulty,
          duration: response.top_recommendation.duration,
          url: response.top_recommendation.platform === 'B站' && response.top_recommendation.bv_number 
            ? `https://www.bilibili.com/video/${response.top_recommendation.bv_number}`
            : undefined
        },
        ...response.other_recommendations.map(rec => ({
          name: rec.name,
          description: rec.reason || '推荐学习资源',
          platform: rec.platform,
          difficulty: rec.difficulty,
          duration: rec.duration,
          url: rec.platform === 'B站' && rec.bv_number 
            ? `https://www.bilibili.com/video/${rec.bv_number}`
            : undefined
        }))
      ]
    }

    searchResults.value = response

  } catch (error) {
    console.error('❌ 对话失败:', error)
    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: `抱歉，暂时无法处理您的请求：${error.message || '未知错误'}。请稍后再试。`,
      timestamp: new Date(),
      resources: []
    }
  } finally {
    isLoading.value = false
    // 滚动到底部
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }, 100)
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 组件挂载时检查用户状态
onMounted(() => {
  checkUserStatus()
})
</script>