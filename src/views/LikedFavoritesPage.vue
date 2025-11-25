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
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
              <div class="flex items-center">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-2">
                  <ThumbsUp class="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">点赞数</div>
                  <div class="text-sm font-medium">{{ resource.likeCount || 0 }}</div>
                </div>
              </div>
            </div>
            
            <!-- 点赞状态 -->
            <div class="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
              <div class="flex items-center mb-2">
                <ThumbsUp class="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <p class="text-sm text-blue-700 dark:text-blue-300">你已点赞此资源</p>
              </div>
              
              <!-- 点赞用户信息 -->
              <div class="mt-2">
                <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  点赞用户 ({{ resource.likedUsers.length }}):
                </div>
                <div v-if="resource.likedUsers && resource.likedUsers.length > 0" class="flex flex-wrap gap-1">
                  <span 
                    v-for="(user, index) in resource.likedUsers.slice(0, 5)" 
                    :key="index"
                    class="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                  >
                    {{ user }}
                  </span>
                  <span v-if="resource.likedUsers.length > 5" class="text-xs text-gray-500">
                    等{{ resource.likedUsers.length - 5 }}人
                  </span>
                </div>
                <div v-else class="text-xs text-gray-400">
                  暂无其他用户点赞
                </div>
              </div>
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
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
              <div class="flex items-center">
                <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-2">
                  <ThumbsUp class="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">点赞数</div>
                  <div class="text-sm font-medium">{{ resource.likeCount || 0 }}</div>
                </div>
              </div>
            </div>
            
            <!-- 收藏状态 -->
            <div class="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 mb-4">
              <div class="flex items-center mb-2">
                <Heart class="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p class="text-sm text-red-700 dark:text-red-300">你已收藏此资源</p>
              </div>
              
              <!-- 收藏用户信息 -->
              <div class="mt-2">
                <div class="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                  收藏用户 ({{ resource.favoritedUsers.length }}):
                </div>
                <div v-if="resource.favoritedUsers && resource.favoritedUsers.length > 0" class="flex flex-wrap gap-1">
                  <span 
                    v-for="(user, index) in resource.favoritedUsers.slice(0, 5)" 
                    :key="index"
                    class="text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full"
                  >
                    {{ user }}
                  </span>
                  <span v-if="resource.favoritedUsers.length > 5" class="text-xs text-gray-500">
                    等{{ resource.favoritedUsers.length - 5 }}人
                  </span>
                </div>
                <div v-else class="text-xs text-gray-400">
                  暂无其他用户收藏
                </div>
              </div>
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
  
  // 如果localStorage中没有，尝试从authStore获取
  const authStore = localStorage.getItem('authStore')
  if (authStore) {
    try {
      const auth = JSON.parse(authStore)
      return auth.user?.id?.toString() || null
    } catch (error) {
      console.error('Failed to parse auth store:', error)
    }
  }
  
  console.warn('⚠️ 未找到当前用户ID，请先登录')
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
    
  // 尝试使用数据库加载，失败时使用本地存储
  let databaseSuccess = false
  let client = null
  
  try {
    // 确保数据库已初始化
    client = await dbStore.getClient()
    if (!client) {
      console.log('数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      throw new Error('数据库客户端初始化失败')
    }
    
    databaseSuccess = true
  } catch (error) {
    console.warn('⚠️ 数据库连接失败，尝试直接连接:', error.message)
    
    // 尝试直接使用supabase客户端
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        client = createClient(supabaseUrl, supabaseKey)
        console.log('✅ 使用直接连接的Supabase客户端')
        databaseSuccess = true
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (directError) {
      console.warn('⚠️ 直接连接也失败，使用本地存储:', directError.message)
      databaseSuccess = false
    }
  }
    
    if (databaseSuccess && client) {
      // 使用数据库加载
      try {
        console.log('📊 开始从数据库加载点赞和收藏数据...')
        
        // 加载用户点赞的帖子 - 优化查询，包含详细的点赞用户信息
        const { data: likedPosts, error: likedError } = await client
          .from('post_likes')
          .select(`
            post_id,
            created_at,
            posts:post_id (
              id,
              title,
              content,
              created_at,
              view_count,
              like_count,
              comment_count,
              favorite_count,
              user:user_id (
                id,
                username,
                nickname
              ),
              post_likes!post_likes_post_id_fkey!inner(
                user:user_id (
                  id,
                  username,
                  nickname
                )
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (likedError) {
          console.warn('⚠️ 数据库加载点赞失败，切换到本地存储:', likedError.message)
          databaseSuccess = false
        } else {
          console.log('✅ 点赞帖子数据查询成功，数量:', (likedPosts || []).length)
          
          // 处理点赞帖子数据
          likedResources.value = (likedPosts || []).map((item: any) => {
            const post = item.posts
            
            // 获取所有点赞该帖子的用户信息
            const likedUsers = post.post_likes?.map((like: any) => 
              like.user?.nickname || like.user?.username || '匿名用户'
            ) || []
            
            // 获取作者信息
            const author = post.user?.nickname || post.user?.username || '匿名用户'
            
            return {
              id: post.id,
              name: post.title,
              provider: author,
              duration: '帖子',
              rating: post.like_count || 0,
              url: `/post/${post.id}`,
              matchPoints: post.content?.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
              type: '社区帖子',
              interaction: {
                liked: true,
                saved: false,
                likesCount: post.like_count || 0
              },
              // 添加点赞用户信息
              likedUsers: likedUsers,
              favoritedUsers: [], // 收藏用户信息在收藏部分单独处理
              likeCount: post.like_count || 0,
              favoriteCount: post.favorite_count || 0,
              // 添加帖子详情信息
              postDetails: {
                id: post.id,
                author: author,
                content: post.content,
                createdAt: post.created_at,
                viewCount: post.view_count || 0,
                commentCount: post.comment_count || 0
              }
            }
          })
          
          console.log('✅ 数据库点赞帖子加载完成，数量:', likedResources.value.length)
          console.log('📋 点赞帖子详情:', likedResources.value.map(p => ({
            id: p.id,
            title: p.name,
            author: p.provider,
            likedUsers: p.likedUsers
          })))
        }
        
        // 加载用户收藏的帖子 - 优化查询，包含详细的收藏用户信息
        const { data: favoritedPosts, error: favoritedError } = await client
          .from('post_favorites')
          .select(`
            post_id,
            created_at,
            posts:post_id (
              id,
              title,
              content,
              created_at,
              view_count,
              like_count,
              comment_count,
              favorite_count,
              user:user_id (
                id,
                username,
                nickname
              ),
              post_favorites!inner(
                user:user_id (
                  id,
                  username,
                  nickname
                )
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (favoritedError) {
          console.warn('⚠️ 数据库加载收藏失败，切换到本地存储:', favoritedError.message)
          databaseSuccess = false
        } else {
          console.log('✅ 收藏帖子数据查询成功，数量:', (favoritedPosts || []).length)
          
          // 处理收藏帖子数据
          favoritedResources.value = (favoritedPosts || []).map((item: any) => {
            const post = item.posts
            
            // 获取所有收藏该帖子的用户信息
            const favoritedUsers = post.post_favorites?.map((fav: any) => 
              fav.user?.nickname || fav.user?.username || '匿名用户'
            ) || []
            
            // 获取作者信息
            const author = post.user?.nickname || post.user?.username || '匿名用户'
            
            return {
              id: post.id,
              name: post.title,
              provider: author,
              duration: '帖子',
              rating: post.favorite_count || 0,
              url: `/post/${post.id}`,
              matchPoints: post.content?.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
              type: '社区帖子',
              interaction: {
                liked: false,
                saved: true,
                likesCount: post.like_count || 0
              },
              // 添加收藏用户信息
              likedUsers: [], // 点赞用户信息在点赞部分单独处理
              favoritedUsers: favoritedUsers,
              likeCount: post.like_count || 0,
              favoriteCount: post.favorite_count || 0,
              // 添加帖子详情信息
              postDetails: {
                id: post.id,
                author: author,
                content: post.content,
                createdAt: post.created_at,
                viewCount: post.view_count || 0,
                commentCount: post.comment_count || 0
              }
            }
          })
          
          console.log('✅ 数据库收藏帖子加载完成，数量:', favoritedResources.value.length)
          console.log('📋 收藏帖子详情:', favoritedResources.value.map(p => ({
            id: p.id,
            title: p.name,
            author: p.provider,
            favoritedUsers: p.favoritedUsers
          })))
        }
      } catch (error) {
        console.warn('⚠️ 数据库查询异常，切换到本地存储:', error.message)
        databaseSuccess = false
      }
    }
    
    // 如果数据库失败，使用本地存储
    if (!databaseSuccess) {
      console.log('🔄 使用本地存储加载点赞收藏数据')
      
      // 加载本地点赞数据
      const localLikesKey = `edumatch_likes_${userId}`
      const localLikes = JSON.parse(localStorage.getItem(localLikesKey) || '[]')
      
      // 加载本地收藏数据
      const localFavoritesKey = `edumatch_favorites_${userId}`
      const localFavorites = JSON.parse(localStorage.getItem(localFavoritesKey) || '[]')
      
      // 需要获取帖子详情，这里简化处理，只显示本地存储的帖子ID
      likedResources.value = localLikes.map((like: any) => ({
        id: like.post_id,
        name: `帖子 ${like.post_id}`,
        provider: '本地存储',
        duration: '帖子',
        rating: 0,
        url: `/post/${like.post_id}`,
        matchPoints: '从本地存储加载的点赞记录',
        type: '社区帖子',
        interaction: {
          liked: true,
          saved: false,
          likesCount: 0
        },
        // 本地存储不包含用户信息，使用默认值
        likedUsers: ['当前用户'],
        favoritedUsers: [],
        likeCount: 0,
        favoriteCount: 0,
        postDetails: {
          id: like.post_id,
          author: '本地存储',
          content: '从本地存储加载的点赞记录',
          createdAt: new Date(like.timestamp || Date.now()).toISOString(),
          viewCount: 0,
          commentCount: 0
        }
      }))
      
      favoritedResources.value = localFavorites.map((fav: any) => ({
        id: fav.post_id,
        name: `帖子 ${fav.post_id}`,
        provider: '本地存储',
        duration: '帖子',
        rating: 0,
        url: `/post/${fav.post_id}`,
        matchPoints: '从本地存储加载的收藏记录',
        type: '社区帖子',
        interaction: {
          liked: false,
          saved: true,
          likesCount: 0
        },
        // 本地存储不包含用户信息，使用默认值
        likedUsers: [],
        favoritedUsers: ['当前用户'],
        likeCount: 0,
        favoriteCount: 0,
        postDetails: {
          id: fav.post_id,
          author: '本地存储',
          content: '从本地存储加载的收藏记录',
          createdAt: new Date(fav.timestamp || Date.now()).toISOString(),
          viewCount: 0,
          commentCount: 0
        }
      }))
      
      console.log('✅ 本地存储点赞帖子加载完成，数量:', likedResources.value.length)
      console.log('✅ 本地存储收藏帖子加载完成，数量:', favoritedResources.value.length)
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
  router.push(`/post/${postId}`)
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