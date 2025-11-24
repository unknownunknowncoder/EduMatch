<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <Heart class="h-8 w-8 mr-3 text-red-500" />
        点赞收藏
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">查看你点赞和收藏的学习资源</p>
    </div>

    <!-- 标签切换 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
      <div class="flex">
        <button
          @click="setActiveTab('liked')"
          :class="`flex-1 py-4 px-6 flex items-center justify-center transition-colors ${
            activeTab === 'liked' 
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`"
        >
          <ThumbsUp class="h-5 w-5 mr-2" />
          <span class="font-medium">我的点赞</span>
        </button>
        <button
          @click="setActiveTab('favorites')"
          :class="`flex-1 py-4 px-6 flex items-center justify-center transition-colors ${
            activeTab === 'favorites' 
              ? 'bg-red-500 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`"
        >
          <Heart class="h-5 w-5 mr-2" />
          <span class="font-medium">我的收藏</span>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">正在加载点赞收藏数据...</span>
    </div>

    <!-- 内容列表 -->
    <div v-else :key="activeTab" class="space-y-6">
      <!-- 点赞内容列表 -->
      <template v-if="activeTab === 'liked'">
        <div 
          v-if="likedResources.length === 0"
          class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md"
        >
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4">
            <ThumbsUp class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium mb-2">暂无点赞内容</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">浏览社区帖子并点赞，这里将显示你喜欢的内容</p>
          <router-link to="/community" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block">
            去社区看看
          </router-link>
        </div>
        
        <div 
          v-for="resource in likedResources"
          :key="resource.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-transform duration-200 hover:scale-105 cursor-pointer"
          @click="handlePostClick(resource.id)"
        >
          <!-- 资源头部 -->
          <div class="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ resource.name }}</h3>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{{ resource.provider }}</span>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
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
            
            <!-- 点赞状态 -->
            <div class="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 mb-4 flex items-center">
              <ThumbsUp class="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p class="text-sm text-blue-700 dark:text-blue-300">你已点赞此资源</p>
            </div>
            
            <!-- 立即学习按钮 -->
            <button
              @click="handleResourceClick($event, resource.url)"
              class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              立即学习
              <ExternalLink class="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </template>
      
      <!-- 收藏内容列表 -->
      <template v-else>
        <div 
          v-if="favoritedResources.length === 0"
          class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md"
        >
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex items-center justify-center mb-4">
            <Heart class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium mb-2">暂无收藏内容</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">浏览社区帖子并收藏，这里将显示你保存的内容</p>
          <router-link to="/community" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block">
            去社区看看
          </router-link>
        </div>
        
        <div 
          v-for="resource in favoritedResources"
          :key="resource.id"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-transform duration-200 hover:scale-105 cursor-pointer"
          @click="handlePostClick(resource.id)"
        >
          <!-- 资源头部 -->
          <div class="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ resource.name }}</h3>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{{ resource.provider }}</span>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
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
            
            <!-- 收藏状态 -->
            <div class="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 mb-4 flex items-center">
              <Heart class="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p class="text-sm text-red-700 dark:text-red-300">你已收藏此资源</p>
            </div>
            
            <!-- 立即学习按钮 -->
            <button
              @click="handleResourceClick($event, resource.url)"
              class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              立即学习
              <ExternalLink class="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { 
  ThumbsUp, 
  Heart, 
  Clock, 
  DollarSign, 
  Check, 
  ExternalLink 
} from 'lucide-vue-next'

// 帖子数据类型
interface Post {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
  view_count: number
  like_count: number
  comment_count: number
  favorite_count: number
  user?: {
    id: string
    username: string
    nickname: string
  }
}

// 资源数据类型
interface Resource {
  id: string
  name: string
  provider: string
  duration: string
  rating: number
  url: string
  matchPoints: string
  type: string
}

// 互动数据类型
interface InteractionData {
  liked: boolean
  saved: boolean
  likesCount: number
}

const router = useRouter()
const activeTab = ref<'liked' | 'favorites'>('liked')
const likedResources = ref<(Resource & { interaction: InteractionData })[]>([])
const favoritedResources = ref<(Resource & { interaction: InteractionData })[]>([])
const isLoading = ref(true)

// 获取用户ID（从localStorage中获取）
const getCurrentUserId = (): string | null => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return user.id?.toString() || null
    } catch (error) {
      console.error('Failed to parse current user:', error)
    }
  }
  return null
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 加载用户的点赞和收藏数据
const loadUserInteractions = async () => {
  try {
    isLoading.value = true
    const dbStore = useDatabaseStore()
    const userId = getCurrentUserId()
    
    if (!userId) {
      console.log('用户未登录，无法加载点赞收藏数据')
      likedResources.value = []
      favoritedResources.value = []
      return
    }
    
    console.log('开始加载用户点赞收藏数据，用户ID:', userId)
    
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('数据库客户端初始化失败')
      likedResources.value = []
      favoritedResources.value = []
      return
    }
    
    // 加载用户点赞的帖子
    const { data: likedPosts, error: likedError } = await client
      .from('post_likes')
      .select(`
        post_id,
        posts:post_id (
          id,
          title,
          content,
          author_name,
          created_at,
          view_count,
          like_count,
          comment_count,
          user:user_id (
            id,
            username,
            nickname
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (likedError) {
      console.error('加载点赞帖子失败:', likedError)
      likedResources.value = []
    } else {
      // 处理点赞帖子数据
      likedResources.value = (likedPosts || []).map(item => {
        const post = item.posts
        return {
          id: post.id,
          name: post.title,
          provider: post.user?.nickname || post.user?.username || '匿名用户',
          duration: '帖子',
          rating: post.like_count || 0,
          url: `/community/post/${post.id}`,
          matchPoints: post.content?.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          type: '社区帖子',
          interaction: {
            liked: true,
            saved: false,
            likesCount: post.like_count || 0
          }
        }
      })
      console.log('✅ 点赞帖子加载完成，数量:', likedResources.value.length)
    }
    
    // 加载用户收藏的帖子
    const { data: favoritedPosts, error: favoritedError } = await client
      .from('post_favorites')
      .select(`
        post_id,
        posts:post_id (
          id,
          title,
          content,
          author_name,
          created_at,
          view_count,
          like_count,
          comment_count,
          favorite_count,
          user:user_id (
            id,
            username,
            nickname
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (favoritedError) {
      console.error('加载收藏帖子失败:', favoritedError)
      favoritedResources.value = []
    } else {
      // 处理收藏帖子数据
      favoritedResources.value = (favoritedPosts || []).map(item => {
        const post = item.posts
        return {
          id: post.id,
          name: post.title,
          provider: post.user?.nickname || post.user?.username || '匿名用户',
          duration: '帖子',
          rating: post.favorite_count || 0,
          url: `/community/post/${post.id}`,
          matchPoints: post.content?.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          type: '社区帖子',
          interaction: {
            liked: false,
            saved: true,
            likesCount: post.like_count || 0
          }
        }
      })
      console.log('✅ 收藏帖子加载完成，数量:', favoritedResources.value.length)
    }
    
  } catch (error) {
    console.error('加载用户点赞收藏数据失败:', error)
    likedResources.value = []
    favoritedResources.value = []
  } finally {
    isLoading.value = false
  }
}

// 处理点击帖子
const handlePostClick = (postId: string) => {
  router.push(`/community/post/${postId}`)
}

// 处理点击资源链接
const handleResourceClick = (e: Event, url: string) => {
  e.stopPropagation()
  if (url.startsWith('/')) {
    router.push(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// 设置活动标签
const setActiveTab = (tab: 'liked' | 'favorites') => {
  activeTab.value = tab
}

// 组件加载时加载用户互动数据
onMounted(() => {
  loadUserInteractions()
})
</script>