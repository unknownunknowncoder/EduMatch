<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">帖子详情管理</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="deletePost"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              删除帖子
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在加载帖子详情...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600 text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <button @click="loadPost" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          重新加载
        </button>
      </div>

      <!-- 删除成功提示 -->
      <div v-if="deleteSuccess" class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
        ✅ 帖子删除成功
      </div>

      <!-- 帖子详情 -->
      <div v-else-if="post" class="space-y-8">
        <!-- 帖子基本信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h2>
          
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {{ post.user?.nickname?.charAt(0) || post.user?.username?.charAt(0) || 'U' }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ post.user?.nickname || post.user?.username || '未知用户' }}
                  </p>
                  <p class="text-xs text-gray-500">{{ post.user_id }}</p>
                </div>
              </div>
              
              <div class="text-sm text-gray-500">
                <span>发布时间：{{ formatTime(post.created_at) }}</span>
                <span class="mx-2">|</span>
                <span>最后更新：{{ formatTime(post.updated_at) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <span v-if="post.category" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ post.category }}
              </span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                已发布
              </span>
            </div>
          </div>

          <div class="prose max-w-none">
            <div v-if="post.content" class="whitespace-pre-wrap text-gray-700">
              {{ post.content }}
            </div>
            <div v-else class="text-gray-500 italic">
              此帖子没有内容
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">统计信息</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">{{ post.likes_count || 0 }}</div>
              <div class="text-sm text-gray-600">点赞数</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">{{ post.comments_count || 0 }}</div>
              <div class="text-sm text-gray-600">评论数</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">{{ post.favorites_count || 0 }}</div>
              <div class="text-sm text-gray-600">收藏数</div>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" 
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 相关资源 -->
        <div v-if="post.resource" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">相关资源</h3>
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-gray-900">{{ post.resource.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ post.resource.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {{ post.resource.category || '其他' }}
                  </span>
                  <a :href="post.resource.url" target="_blank" 
                     class="text-blue-600 hover:text-blue-800 text-sm">
                    查看资源
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

    <!-- 确认删除对话框 -->
    <div v-if="confirmDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">确认删除</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="confirmDialog.show = false"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDialog.onConfirm"
            class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'

interface Post {
  id: string
  title: string
  content?: string
  user_id: string
  category?: string
  tags?: string[]
  likes_count: number
  comments_count: number
  views_count: number
  favorites_count: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    username: string
    nickname?: string
  }
  resource?: {
    id: string
    title: string
    description: string
    url: string
    category?: string
  }
}

const route = useRoute()
const router = useRouter()

const postId = route.params.id as string
const userId = route.query.user_id as string || null
const loading = ref(true)
const error = ref('')
const post = ref<Post | null>(null)
const deleteSuccess = ref(false)

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})

// 弹窗提示系统
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
})

// 显示弹窗提示
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  // 3秒后自动隐藏
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 加载帖子详情
const loadPost = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔄 加载管理员帖子详情，ID:', postId)
    
    // 确保数据库连接已初始化
    const { useDatabaseStore } = await import('@/stores/database')
    const dbStore = useDatabaseStore()
    await dbStore.reconnect()
    
    const { supabaseService } = await import('@/services/supabase')
    console.log('✅ Supabase服务获取成功')
    
    // 获取帖子基本信息
    console.log('📋 获取帖子基本信息...')
    const postData = await supabaseService.getPostById(postId)
    console.log('📋 帖子基本信息:', postData)
    
    if (!postData) {
      console.error('❌ 帖子不存在或已被删除')
      error.value = '帖子不存在或已被删除'
      return
    }
    
    // 获取用户信息
    let userInfo = null
    if (postData.user_id) {
      console.log('👤 获取用户信息，用户ID:', postData.user_id)
      try {
        userInfo = await supabaseService.getUserById(postData.user_id)
        console.log('✅ 用户信息获取成功:', userInfo)
      } catch (userError) {
        console.error('❌ 获取用户信息失败:', userError)
        // 用户信息获取失败不应该阻止帖子显示
      }
    }
    
    // 获取统计信息
    console.log('📊 获取统计信息...')
    const client = supabaseService.getClient()
    
    try {
      const { data: likesData } = await client
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        
      const { data: commentsData } = await client
        .from('post_comments')
        .select('id')
        .eq('post_id', postId)
        
      const { data: favoritesData } = await client
        .from('post_favorites')
        .select('id')
        .eq('post_id', postId)
      
      console.log('📊 统计信息:', {
        likes: likesData?.length || 0,
        comments: commentsData?.length || 0,
        favorites: favoritesData?.length || 0
      })
    
      post.value = {
        ...postData,
        user: userInfo,
        likes_count: likesData?.length || 0,
        comments_count: commentsData?.length || 0,
        favorites_count: favoritesData?.length || 0,
        views_count: postData.views_count || 0
      }
    } catch (statsError) {
      console.error('❌ 获取统计信息失败:', statsError)
      // 统计信息获取失败也应该显示帖子
      post.value = {
        ...postData,
        user: userInfo,
        likes_count: 0,
        comments_count: 0,
        favorites_count: 0,
        views_count: postData.views_count || 0
      }
    }
    
    console.log('✅ 帖子详情加载成功:', post.value)
    
  } catch (err) {
    console.error('❌ 加载帖子详情失败:', err)
    console.error('❌ 错误详情:', {
      message: err.message,
      code: err.code,
      details: err.details,
      hint: err.hint
    })
    error.value = `加载帖子详情失败: ${err.message || '未知错误'}`
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  console.log('🔙 点击返回按钮')
  try {
    // 优先返回到对应用户的管理详情页面
    const targetUserId = post.value?.user_id || userId
    
    if (targetUserId) {
      const userDetailUrl = `/admin/user/${targetUserId}`
      console.log('📍 返回到用户详情页面:', userDetailUrl)
      console.log('📍 使用用户ID:', targetUserId, '(来自帖子:', !!post.value?.user_id, ', 来自URL:', !!userId, ')')
      router.push(userDetailUrl)
      return
    }
    
    // 如果没有用户信息，尝试返回上一页
    if (window.history.length > 1) {
      console.log('📍 使用 history.back() 返回')
      router.back()
    } else {
      // 最后备选：跳转到管理主页
      console.log('📍 跳转到管理主页')
      router.push('/admin')
    }
  } catch (error) {
    console.error('❌ 返回失败，跳转到管理页面:', error)
    router.push('/admin')
  }
}

// 删除帖子
const deletePost = async () => {
  if (!post.value) return
  
  // 显示确认对话框
  confirmDialog.value = {
    show: true,
    message: '确定要删除这个帖子吗？此操作不可撤销。',
    onConfirm: () => executeDeletePost()
  }
}

// 实际执行删除的函数
const executeDeletePost = async () => {
  try {
    console.log('🗑️ 删除帖子，ID:', post.value.id)
    
    const { supabaseService } = await import('@/services/supabase')
    await supabaseService.deleteCommunityPost(post.value.id)
    
    console.log('✅ 帖子删除成功')
    
    confirmDialog.value.show = false
    
    // 显示成功提示
    deleteSuccess.value = true
    showToast('帖子删除成功！', 'success')
    
    // 延迟1.5秒后返回到对应用户的管理详情页面
    setTimeout(() => {
      if (post.value.user_id) {
        const userDetailUrl = `/admin/user/${post.value.user_id}`
        console.log('🗑️ 删除成功，返回到用户详情页面:', userDetailUrl)
        router.push(userDetailUrl)
      } else {
        console.log('🗑️ 删除成功，返回到管理主页')
        router.push('/admin')
      }
    }, 1500)
    
  } catch (err) {
    console.error('❌ 删除帖子失败:', err)
    showNotification('删除帖子失败，请稍后重试', 'error')
  }
}



onMounted(() => {
  loadPost()
})
</script>

<style>
/* 移除前端侧边栏和导航 */
.sidebar-navigation,
.bottom-navigation,
nav {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

div[class*="sidebar"],
div[class*="navigation"],
aside {
  display: none !important;
  visibility: hidden !important;
}

#app {
  width: 100%;
  height: 100%;
}

a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>