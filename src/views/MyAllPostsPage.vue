<template>
  <div class="p-6 md:p-8">
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
          <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <p class="text-gray-500 dark:text-gray-400 mt-2">加载中...</p>
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
    console.log('🗑️ 开始删除帖子:', selectedPost.value.id)
    
    const client = supabaseService.getClient()
    let retryCount = 0
    const maxRetries = 3
    let deleteError = null
    
    // 重试机制
    while (retryCount < maxRetries) {
      try {
        console.log(`🔄 尝试删除帖子 (${retryCount + 1}/${maxRetries})...`)
        
        // 删除帖子
        const { error } = await client
          .from('community_posts')
          .delete()
          .eq('id', selectedPost.value.id)
        
        deleteError = error
        
        if (!error) {
          console.log('✅ 帖子删除成功')
          break
        } else {
          console.error(`❌ 删除失败 (${retryCount + 1}/${maxRetries}):`, error)
          if (retryCount < maxRetries - 1) {
            // 等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      } catch (err) {
        console.error(`❌ 删除异常 (${retryCount + 1}/${maxRetries}):`, err)
        deleteError = err
        if (retryCount < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
      retryCount++
    }
    
    if (deleteError) {
      console.error('❌ 删除帖子最终失败:', deleteError)
      
      // 更详细的错误信息
      let errorMessage = '删除失败，请稍后重试'
      if (deleteError.message) {
        if (deleteError.message.includes('Failed to fetch')) {
          errorMessage = '网络连接失败，请检查网络连接后重试'
        } else if (deleteError.message.includes('permission')) {
          errorMessage = '没有删除权限，请联系管理员'
        } else if (deleteError.message.includes('row-level security')) {
          errorMessage = '安全策略阻止删除，请联系管理员'
        } else {
          errorMessage = `删除失败: ${deleteError.message}`
        }
      }
      
      alert(errorMessage)
      return
    }
    
    // 从本地列表中移除
    myPosts.value = myPosts.value.filter(post => post.id !== selectedPost.value!.id)
    
    // 关闭对话框
    hideDeleteConfirm()
    
  } catch (error) {
    console.error('❌ 删除帖子时出现意外错误:', error)
    alert('删除过程中出现意外错误，请稍后重试')
  }
}

const loadMyPosts = async () => {
  isLoadingPosts.value = true
  try {
    console.log('🔄 开始加载用户全部帖子...')
    
    // 获取当前用户ID
    const client = supabaseService.getClient()
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
      return
    }
    
    // 查询用户发布的所有帖子
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 获取我的帖子失败:', error)
      myPosts.value = []
      return
    }
    
    if (!data || data.length === 0) {
      console.log('ℹ️ 该用户没有发布任何帖子')
      myPosts.value = []
      return
    }
    
    // 转换数据格式并添加评论数
    const postsWithComments = []
    
    for (let i = 0; i < data.length; i++) {
      const post = data[i]
      
      // 查询评论数
      const { data: commentData, error: commentError } = await client
        .from('post_comments')
        .select('id')
        .eq('post_id', post.id)
      
      const commentCount = commentError ? 0 : (commentData ? commentData.length : 0)
      
      const transformedPost = {
        id: post.id,
        title: post.title,
        content: post.content || '',
        category: post.category,
        tags: [],
        status: 'published',
        views: post.views_count || 0,
        likes: post.likes_count || 0,
        comments: commentCount,
        created_at: post.created_at,
        updated_at: post.updated_at
      }
      
      postsWithComments.push(transformedPost)
    }
    
    myPosts.value = postsWithComments
    console.log('✅ 成功加载我的全部帖子:', myPosts.value.length)
    
  } catch (error) {
    console.error('❌ 加载我的帖子时出错:', error)
    myPosts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

onMounted(() => {
  loadMyPosts()
})
</script>