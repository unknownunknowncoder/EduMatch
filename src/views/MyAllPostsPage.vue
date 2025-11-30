<template>
  <div class="p-6 md:p-8">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <button 
        @click="goBack"
        class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        返回个人中心
      </button>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <svg class="h-8 w-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        我的全部帖子
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">管理你在社区发布的所有帖子</p>
    </div>

    <!-- 帖子列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="isLoadingPosts" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-green-500 hover:bg-green-400 transition ease-in-out duration-150">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="myPosts.length === 0" class="text-center py-12">
          <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无发布的帖子</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有在社区发布任何帖子</p>
          <button 
            @click="navigateToCommunity"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            去社区发帖
          </button>
        </div>

        <!-- 帖子列表 -->
        <div v-else class="space-y-4">
          <div 
            v-for="post in myPosts"
            :key="post.id"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToPost(post.id)"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">{{ post.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-2">{{ post.content }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="post.category" class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                    {{ post.category }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    已发布
                  </span>
                </div>
              </div>
              <button
                @click.stop="showDeleteConfirm(post)"
                class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="删除帖子"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            
            <div class="text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(post.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <DeleteConfirmDialog
      :show="showDeleteDialog"
      :message="`确定要删除帖子「${selectedPost?.title}」吗？删除后无法恢复。`"
      @confirm="handleDeletePost"
      @cancel="hideDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'

interface MyPost {
  id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  status: 'published'
  views?: number
  likes?: number
  comments?: number
  created_at: string
  updated_at?: string
}

const router = useRouter()
const myPosts = ref<MyPost[]>([])
const isLoadingPosts = ref(false)
const showDeleteDialog = ref(false)
const selectedPost = ref<MyPost | null>(null)

const navigateToPost = (postId: string) => {
  router.push(`/post/${postId}`)
}

const navigateToCommunity = () => {
  router.push('/community')
}

const goBack = () => {
  router.push('/profile')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const showDeleteConfirm = (post: MyPost) => {
  selectedPost.value = post
  showDeleteDialog.value = true
}

const hideDeleteConfirm = () => {
  showDeleteDialog.value = false
  selectedPost.value = null
}

const handleDeletePost = async () => {
  if (!selectedPost.value) return
  
  try {
    // 保存帖子标题，避免在hideDeleteConfirm()后访问
    const postTitle = selectedPost.value.title
    const postId = selectedPost.value.id
    
    console.log('🗑️ 开始删除帖子:', postId)
    
    // 使用新的服务方法删除帖子
    await supabaseService.deleteCommunityPost(postId)
    
    // 从本地列表中移除
    myPosts.value = myPosts.value.filter(post => post.id !== postId)
    
    // 关闭对话框
    hideDeleteConfirm()
    
    // 显示成功提示
    showToast(`帖子「${postTitle}」已成功删除`, 'success')
    
  } catch (error) {
    console.error('❌ 删除帖子失败:', error)
    
    // 更详细的错误信息
    let errorMessage = '删除失败，请稍后重试'
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = '网络连接失败，请检查网络连接后重试'
      } else if (error.message.includes('permission')) {
        errorMessage = '没有删除权限，请联系管理员'
      } else if (error.message.includes('row-level security')) {
        errorMessage = '安全策略阻止删除，请联系管理员'
      } else {
        errorMessage = `删除失败: ${error.message}`
      }
    }
    
    showToast(errorMessage, 'error')
  }
}

const loadMyPosts = async () => {
  isLoadingPosts.value = true
  try {
    console.log('🔄 开始加载用户全部帖子...')
    
    // 获取当前用户ID
    let currentUserId = null
    
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) {
        currentUserId = user.id
        console.log('✅ 当前用户ID:', currentUserId)
      }
    }
    
    if (!currentUserId) {
      console.error('❌ 用户未登录')
      myPosts.value = []
      showToast('请先登录后再查看您的帖子', 'warning')
      return
    }
    
    // 使用新的服务方法获取用户发布的帖子
    const posts = await supabaseService.getCommunityPostsByUserId(currentUserId)
    
    if (!posts || posts.length === 0) {
      console.log('ℹ️ 该用户没有发布任何帖子')
      myPosts.value = []
      return
    }
    
    // 转换数据格式并添加评论数
    const postsWithDetails = []
    
    for (const post of posts) {
      try {
        // 获取评论数
        const commentCount = await supabaseService.getPostCommentsCount(post.id)
        
        const transformedPost = {
          id: post.id,
          title: post.title || '无标题',
          content: post.content || '',
          category: post.category || '未分类',
          tags: [],
          status: 'published',
          views: post.views_count || 0,
          likes: post.likes_count || 0,
          comments: commentCount,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
        
        postsWithDetails.push(transformedPost)
      } catch (error) {
        console.error('❌ 处理帖子详情时出错:', post.id, error)
        // 即使获取评论数失败，也保留帖子基本信息
        const transformedPost = {
          id: post.id,
          title: post.title || '无标题',
          content: post.content || '',
          category: post.category || '未分类',
          tags: [],
          status: 'published',
          views: post.views_count || 0,
          likes: post.likes_count || 0,
          comments: 0,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
        
        postsWithDetails.push(transformedPost)
      }
    }
    
    myPosts.value = postsWithDetails
    console.log('✅ 成功加载我的全部帖子:', myPosts.value.length)
    
  } catch (error) {
    console.error('❌ 加载我的帖子时出错:', error)
    myPosts.value = []
    showToast('加载帖子失败，请稍后重试', 'error')
  } finally {
    isLoadingPosts.value = false
  }
}

onMounted(() => {
  loadMyPosts()
})
</script>