<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <button 
        @click="goBack"
        class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回学习社区
      </button>
    </div>

    <!-- 帖子详情内容 -->
    <div class="max-w-4xl mx-auto">
      <!-- 帖子头部 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <!-- 帖子标题和元信息 -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ post.title }}
          </h1>
          
          <div class="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-6 mb-4 md:mb-0">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ post.author || '匿名用户' }}
              </span>
              
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ formatDate(post.created_at) }}
              </span>
              
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 002.828 0l.586-.586c.391-.39.586-.902.586-1.414V15a2 2 0 01-2 2H7a2 2 0 01-2-2v-4c0-.814.195-1.523.586-1.914L7.414 5.586C7.004 5.195 6.492 5 6 5z"></path>
                </svg>
                {{ post.category || '未分类' }}
              </span>
            </div>
            
            <div class="flex items-center space-x-4">
              <button 
                @click="toggleLike"
                :disabled="isLiking"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                :class="post.is_liked ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{{ post.likes_count || 0 }}</span>
              </button>
              
              <div class="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>{{ post.views_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="p-8">
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ post.content }}
            </p>
          </div>
          
          <!-- 标签 -->
          <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-8">
            <span 
              v-for="tag in post.tags" 
              :key="tag"
              class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            评论 ({{ comments.length }})
          </h2>
        </div>

        <!-- 评论表单 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <form @submit.prevent="addComment" class="space-y-4">
            <textarea
              v-model="newComment"
              rows="3"
              placeholder="写下你的评论..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              maxlength="500"
            ></textarea>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ newComment.length }}/500
              </span>
              <button
                type="submit"
                :disabled="!newComment.trim() || isSubmitting"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                发表评论
              </button>
            </div>
          </form>
        </div>

        <!-- 评论列表 -->
        <div v-if="comments.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="p-6"
          >
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 font-medium">
                  {{ comment.author?.[0]?.toUpperCase() || 'U' }}
                </span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ comment.author || '匿名用户' }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(comment.created_at) }}
                  </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 暂无评论 -->
        <div v-else class="p-12 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无评论</h3>
          <p class="text-gray-500 dark:text-gray-400">成为第一个评论的人吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

// 响应式数据
const post = ref<any>({})
const comments = ref<any[]>([])
const newComment = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const isLiking = ref(false)

// 获取帖子ID
const postId = route.params.id as string

// 返回上一页
const goBack = () => {
  router.back()
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
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
const toggleLike = async () => {
  if (isLiking.value) return
  
  isLiking.value = true
  try {
    // 简单的点赞切换
    post.value.is_liked = !post.value.is_liked
    post.value.likes_count = (post.value.likes_count || 0) + (post.value.is_liked ? 1 : -1)
  } catch (error) {
    console.error('点赞失败:', error)
  } finally {
    isLiking.value = false
  }
}

// 添加评论
const addComment = async () => {
  if (!newComment.value.trim()) return
  
  isSubmitting.value = true
  try {
    // 模拟添加评论
    const comment = {
      id: Date.now().toString(),
      author: '当前用户',
      content: newComment.value.trim(),
      created_at: new Date().toISOString()
    }
    
    comments.value.unshift(comment)
    newComment.value = ''
    
    // 在实际应用中，这里应该调用API保存评论
    console.log('添加评论:', comment)
    
  } catch (error) {
    console.error('添加评论失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 加载帖子详情
const loadPostDetail = async () => {
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
    
    console.log('🔄 开始加载帖子详情，ID:', postId)
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .single()
    
    if (error) {
      console.error('❌ 加载帖子详情失败:', error)
      throw error
    }
    
    post.value = data || {}
    console.log('✅ 帖子详情加载成功:', post.value)
    
    // 模拟加载评论（实际应用中应该从数据库加载）
    comments.value = [
      {
        id: '1',
        author: '学习伙伴A',
        content: '很有价值的分享！感谢作者的详细讲解。',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        author: '技术爱好者',
        content: '我在学习中遇到了类似的问题，这篇文章给了我很好的启发。',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
    
  } catch (error) {
    console.error('❌ 加载帖子详情异常:', error)
  } finally {
    isLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  console.log('🚀 PostDetail 组件挂载，帖子ID:', postId)
  
  if (!postId) {
    console.error('帖子ID不存在')
    router.push('/community')
    return
  }
  
  await loadPostDetail()
})
</script>