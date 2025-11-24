<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <svg class="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        学习社区
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">与学习伙伴交流，分享学习经验</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧边栏 - 搜索和热门标签 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 搜索框 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div class="flex space-x-2">
            <div class="relative flex-1">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="搜索社区内容" 
                v-model="searchKeyword"
                @keyup.enter="performSearch"
                @input="handleSearchInput"
                @keyup.escape="clearSearch"
                class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none text-sm"
              />
            </div>
            <button
              @click="performSearch"
              :disabled="isSearching"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
            >
              <svg v-if="isSearching" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C6.47 4 4 5.47 4 8s-.47 4-4 4 4.47 4 4zm0 0a8 8 0 1008z"></path>
              </svg>
              <span v-else>搜索</span>
            </button>
          </div>
          
          <!-- 搜索结果提示 -->
          <div v-if="showSearchResults && searchKeyword" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between">
              <span class="text-sm text-blue-700 dark:text-blue-300">
                搜索 "{{ searchKeyword }}" 的结果：{{ filteredPosts.length }} 条
              </span>
              <button 
                @click="clearSearch"
                class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                清除搜索
              </button>
            </div>
          </div>
        </div>
        
        <!-- 发表我的经验按钮 -->
        <button 
          @click="showCreatePostModal = true"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl p-4 shadow-md transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5h-1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5H3a2 2 0 00-2-2V4a2 2 0 012-2h7m-1 4v4h8v-4m0 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1m5-1h7a2 2 0 012 2v4a2 2 0 01-2 2h-7a2 2 0 01-2-2v-4z"></path>
          </svg>
          <span>发表我的经验</span>
        </button>
        
        <!-- 热门标签 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h3 class="font-semibold mb-4 flex items-center">
            <svg class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            热门标签
          </h3>
          <div v-if="popularTags.length > 0" class="flex flex-wrap gap-2">
            <a 
              v-for="tag in popularTags"
              :key="tag.id"
              href="#" 
              @click="filterByTag(tag.name)"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {{ tag.name }}
              <span class="ml-1 text-xs opacity-70">({{ tag.count }})</span>
            </a>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
            暂无热门标签
          </div>
        </div>
      </div>

      <!-- 主内容区 - 帖子列表 -->
      <div class="lg:col-span-3">
        <div v-if="!showSearchResults && posts.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h3 class="text-lg font-medium mb-2">暂无社区帖子</h3>
          <p class="text-gray-500 dark:text-gray-400">快来发表你的第一个学习经验吧！</p>
        </div>

        <div v-else-if="(showSearchResults && filteredPosts.length === 0) || (!showSearchResults && posts.length === 0)" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 class="text-lg font-medium mb-2">未找到相关内容</h3>
          <p class="text-gray-500 dark:text-gray-400">尝试使用其他关键词搜索</p>
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="(post, index) in (showSearchResults ? filteredPosts : posts)"
            :key="post.id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer group"
            @click="viewPostDetail(post.id)"
          >
            <!-- 帖子内容 -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {{ post.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {{ post.content }}
                  </p>
                </div>
                
                <!-- 点赞和收藏按钮 - 右上角横向排列 -->
                <div class="ml-4 flex space-x-3">
                  <!-- 点赞按钮 -->
                  <button 
                    @click.stop="toggleLike(post)"
                    :disabled="isLiking"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    :class="post.is_liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span class="text-sm font-medium">{{ post.likes_count || 0 }}</span>
                  </button>
                  
                  <!-- 收藏按钮 -->
                  <button 
                    @click.stop="toggleFavorite(post)"
                    :disabled="isFavoriting"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors disabled:opacity-50"
                    :class="post.is_favorited ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-700'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span class="text-sm font-medium">{{ post.favorite_count || 0 }}</span>
                  </button>
                </div>
              </div>
              
              <!-- 帖子元信息 -->
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {{ post.author || '匿名用户' }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 002.828 0l.586-.586c.391-.39.586-.902.586-1.414V15a2 2 0 01-2 2H7a2 2 0 01-2-2v-4c0-.814.195-1.523.586-1.914L7.414 5.586C7.004 5.195 6.492 5 6 5z"></path>
                    </svg>
                    {{ post.category || '未分类' }}
                  </span>
                </div>
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              
              <!-- 标签 -->
              <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建帖子弹窗 -->
    <div v-if="showCreatePostModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">发表学习经验</h2>
          <button 
            @click="closeCreatePostModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="createPost" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
            <input
              v-model="newPost.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="分享你的学习心得..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">内容</label>
            <textarea
              v-model="newPost.content"
              rows="6"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="详细描述你的学习经验、遇到的问题和解决方法..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
            <select
              v-model="newPost.category"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">选择分类</option>
              <option value="前端开发">前端开发</option>
              <option value="后端开发">后端开发</option>
              <option value="算法与数据结构">算法与数据结构</option>
              <option value="数据库">数据库</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in newPost.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center"
                >
                  {{ tag }}
                  <button 
                    type="button"
                    @click="removeTag(tag)"
                    class="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex space-x-2">
                <input
                  v-model="customTag"
                  type="text"
                  @keyup.enter="addCustomTag"
                  class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="输入自定义标签..."
                />
                <button
                  type="button"
                  @click="addCustomTag"
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  添加
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreatePostModal"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C6.47 4 4 5.47 4 8s-.47 4-4 4 4.47 4 4zm0 0a8 8 0 1008z"></path>
              </svg>
              {{ isSubmitting ? '发布中...' : '发布经验' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'

const router = useRouter()

// 响应式数据
const posts = ref<any[]>([])
const filteredPosts = ref<any[]>([])
const popularTags = ref<any[]>([])
const searchKeyword = ref('')
const isSearching = ref(false)
const showSearchResults = ref(false)
const isLoading = ref(false)
const showCreatePostModal = ref(false)
const isSubmitting = ref(false)
const isLiking = ref(false)
const isFavoriting = ref(false)
const newPost = ref({
  title: '',
  content: '',
  category: '',
  tags: []
})
const customTag = ref('')

const dbStore = useDatabaseStore()

// 处理搜索输入变化
const handleSearchInput = () => {
  if (!searchKeyword.value.trim()) {
    clearSearch()
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  showSearchResults.value = false
  filteredPosts.value = []
  isSearching.value = false
}

// 执行搜索
const performSearch = async () => {
  const keyword = searchKeyword.value.trim()
  
  if (!keyword) {
    clearSearch()
    return
  }
  
  isSearching.value = true
  showSearchResults.value = true
  
  try {
    if (posts.value.length === 0) {
      await loadPosts()
    }
    
    const keywordLower = keyword.toLowerCase()
    const matchedPosts = posts.value.filter(post => {
      if (post.title && post.title.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.content && post.content.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.category && post.category.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.author && post.author.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.tags && Array.isArray(post.tags)) {
        const tagMatch = post.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
        )
        if (tagMatch) {
          return true
        }
      }
      return false
    })
    
    filteredPosts.value = matchedPosts
    
  } catch (error) {
    // 搜索失败处理
  } finally {
    isSearching.value = false
  }
}

// 查看帖子详情
const viewPostDetail = (postId: string) => {
  console.log('📖 查看帖子详情，ID:', postId)
  router.push(`/post/${postId}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 切换点赞
const toggleLike = async (post: any) => {
  if (isLiking.value) return
  
  isLiking.value = true
  try {
    // 获取当前用户ID
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再点赞')
      return
    }
    
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('点赞操作：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('点赞操作：数据库客户端初始化失败')
      return
    }
    
    if (post.is_liked) {
      // 取消点赞
      const { error } = await client
        .from('post_likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
      
      if (error) {
        console.error('取消点赞失败:', error)
        throw error
      }
      
      post.is_liked = false
      post.likes_count = Math.max((post.likes_count || 0) - 1, 0)
      console.log('✅ 取消点赞成功')
    } else {
      // 添加点赞
      const { error } = await client
        .from('post_likes')
        .insert([{
          user_id: currentUserId,
          post_id: post.id
        }])
      
      if (error) {
        console.error('添加点赞失败:', error)
        throw error
      }
      
      post.is_liked = true
      post.likes_count = (post.likes_count || 0) + 1
      console.log('✅ 添加点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  } finally {
    isLiking.value = false
  }
}

// 切换收藏
const toggleFavorite = async (post: any) => {
  if (isFavoriting.value) return
  
  isFavoriting.value = true
  try {
    // 获取当前用户ID
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再收藏帖子')
      return
    }
    
    let client = await dbStore.getClient()
    if (!client) {
      console.log('收藏操作：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('收藏操作：数据库客户端初始化失败')
      return
    }
    
    if (post.is_favorited) {
      // 取消收藏
      const { error } = await client
        .from('post_favorites')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
      
      if (error) {
        console.error('取消收藏失败:', error)
        throw error
      }
      
      post.is_favorited = false
      post.favorite_count = Math.max((post.favorite_count || 0) - 1, 0)
      console.log('✅ 取消收藏成功')
    } else {
      // 添加收藏
      const { error } = await client
        .from('post_favorites')
        .insert([{
          user_id: currentUserId,
          post_id: post.id
        }])
      
      if (error) {
        console.error('添加收藏失败:', error)
        throw error
      }
      
      post.is_favorited = true
      post.favorite_count = (post.favorite_count || 0) + 1
      console.log('✅ 添加收藏成功')
    }
  } catch (error) {
    console.error('收藏操作异常:', error)
  } finally {
    isFavoriting.value = false
  }
}

// 按标签过滤
const filterByTag = async (tagName: string) => {
  isLoading.value = true
  showSearchResults.value = true
  
  try {
    const keywordLower = tagName.toLowerCase()
    const matchedPosts = posts.value.filter(post => {
      if (post.tags && Array.isArray(post.tags)) {
        const tagMatch = post.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
        )
        if (tagMatch) {
          return true
        }
      }
      return false
    })
    
    filteredPosts.value = matchedPosts
    searchKeyword.value = tagName
    
  } catch (error) {
    // 过滤失败处理
  } finally {
    isLoading.value = false
  }
}

// 加载帖子
const loadPosts = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('数据库客户端初始化失败')
      return
    }
    
    console.log('🔄 开始加载帖子...')
    const { data, error } = await client
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 加载帖子失败:', error)
      console.error('错误详情:', error.details, error.hint)
      return
    }
    
    // 获取当前用户ID以检查收藏状态
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    // 处理帖子数据，添加用户名显示和收藏状态
    posts.value = (data || []).map(post => ({
      ...post,
      // 优先使用昵称，如果没有昵称则使用用户名
      author: post.user?.nickname || post.user?.username || '匿名用户',
      // 默认收藏状态为false
      is_favorited: false,
      favorite_count: post.favorite_count || 0
    }))
    
    // 如果用户已登录，加载收藏状态
    if (currentUserId) {
      await loadFavoritesStatus(currentUserId)
    }
    
    console.log('✅ 成功加载帖子数量:', posts.value.length)
    console.log('📄 帖子列表:', posts.value)
    
  } catch (error) {
    console.error('❌ 加载帖子异常:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载收藏状态
const loadFavoritesStatus = async (userId: string) => {
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('收藏状态加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('收藏状态加载：数据库客户端初始化失败')
      return
    }
    
    console.log('⭐ 开始加载用户收藏状态...')
    const { data, error } = await client
      .from('post_favorites')
      .select('post_id')
      .eq('user_id', userId)
    
    if (error) {
      console.error('❌ 加载收藏状态失败:', error)
      return
    }
    
    // 获取用户收藏的帖子ID列表
    const favoritedPostIds = data.map(fav => fav.post_id)
    
    // 更新帖子列表中的收藏状态
    posts.value.forEach(post => {
      post.is_favorited = favoritedPostIds.includes(post.id)
    })
    
    console.log('✅ 收藏状态加载完成，已收藏帖子数量:', favoritedPostIds.length)
    
  } catch (error) {
    console.error('❌ 加载收藏状态异常:', error)
  }
}

// 加载热门标签
const loadPopularTags = async () => {
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('标签加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('标签加载：数据库客户端初始化失败')
      return
    }
    
    console.log('🏷️ 开始加载热门标签...')
    const { data, error } = await client
      .from('community_posts')
      .select('tags')
    
    if (error) {
      console.error('❌ 加载标签失败:', error)
      return
    }
    
    const tagCount: any = {}
    data?.forEach((post: any) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    popularTags.value = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count, id: name }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)
      
    console.log('✅ 热门标签加载完成:', popularTags.value)
      
  } catch (error) {
    console.error('❌ 加载标签异常:', error)
  }
}

// 创建帖子
const createPost = async () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim()) {
    return
  }
  
  isSubmitting.value = true
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('创建帖子：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('创建帖子：数据库客户端初始化失败')
      return
    }
    
    // 获取当前用户ID和用户信息
    let currentUserId = null
    let currentUserInfo = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
          currentUserInfo = user
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再发布帖子')
      isSubmitting.value = false
      return
    }
    
    console.log('💾 开始创建帖子，用户ID:', currentUserId, '数据:', newPost.value)
    const { data, error } = await client
      .from('community_posts')
      .insert([{
        title: newPost.value.title,
        content: newPost.value.content,
        category: newPost.value.category || '学习经验',
        tags: newPost.value.tags,
        user_id: currentUserId,
        likes_count: 0,
        views_count: 0,
        comments_count: 0
      }])
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
    
    if (error) {
      console.error('❌ 创建帖子失败:', error)
      throw error
    }
    
    console.log('✅ 帖子创建成功:', data)
    
    // 处理新帖子的用户信息
    if (data && data[0]) {
      const newPostData = {
        ...data[0],
        // 优先使用昵称，如果没有昵称则使用用户名
        author: data[0].user?.nickname || data[0].user?.username || '匿名用户'
      }
      posts.value.unshift(newPostData)
    }
    
    // 关闭弹窗
    closeCreatePostModal()
    
    // 重新加载热门标签
    loadPopularTags()
    
  } catch (error) {
    console.error('❌ 发布帖子异常:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 移除标签
const removeTag = (tag: string) => {
  const index = newPost.value.tags.indexOf(tag)
  if (index > -1) {
    newPost.value.tags.splice(index, 1)
  }
}

// 添加自定义标签
const addCustomTag = () => {
  const trimmedTag = customTag.value.trim()
  if (!trimmedTag) return
  
  if (!newPost.value.tags.includes(trimmedTag)) {
    newPost.value.tags.push(trimmedTag)
  }
  
  customTag.value = ''
}

// 关闭创建帖子弹窗
const closeCreatePostModal = () => {
  showCreatePostModal.value = false
  newPost.value = {
    title: '',
    content: '',
    category: '',
    tags: []
  }
  customTag.value = ''
}

// 全局键盘事件处理
const handleGlobalKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showSearchResults.value) {
    clearSearch()
  }
}

// 初始化
onMounted(async () => {
  console.log('🚀 CommunityPage 组件挂载')
  
  // 等待数据库初始化
  console.log('⏳ 等待数据库初始化...')
  await new Promise(resolve => setTimeout(resolve, 2000)) // 等待2秒确保数据库初始化
  
  // 检查数据库连接状态
  if (dbStore.isConnected) {
    console.log('✅ 数据库已连接，开始加载数据')
  } else {
    console.log('⚠️ 数据库未连接，尝试重新连接')
    await dbStore.reconnect()
  }
  
  // 加载数据
  await loadPosts()
  await loadPopularTags()
  
  document.addEventListener('keyup', handleGlobalKeyup)
  console.log('🎉 CommunityPage 初始化完成')
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleGlobalKeyup)
})
</script>