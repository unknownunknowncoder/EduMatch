<template>
  <div class="min-h-screen bg-[#F3F4F6] font-sans text-slate-800 py-8">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button 
          @click="$router.back()" 
          class="flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          返回学习社区
        </button>
      </div>

      <!-- 帖子详情 -->
      <div v-if="post" class="bg-white rounded-2xl shadow-md p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ post.title }}</h1>
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ post.author_name || '匿名用户' }}
              </span>
              <span>·</span>
              <span>{{ formatDate(post.created_at) }}</span>
              <span>·</span>
              <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {{ post.category || '未分类' }}
              </span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center space-x-3">
            <!-- 点赞按钮 -->
            <button 
              @click="toggleLike(post)"
              :disabled="isLiking"
              class="flex items-center space-x-1.5 px-3 py-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              :class="post.is_liked ? 'text-red-500 bg-red-50' : 'bg-gray-100'"
            >
              <svg class="w-5 h-5" :class="{ 'fill-current': post.is_liked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span class="text-sm font-medium">{{ post.like_count || 0 }}</span>
            </button>
            
            <!-- 收藏按钮 -->
            <button 
              @click="toggleFavorite(post)"
              :disabled="isFavoriting"
              class="flex items-center space-x-1.5 px-3 py-2 rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50"
              :class="post.is_favorited ? 'text-yellow-500 bg-yellow-50' : 'bg-gray-100'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              <span class="text-sm font-medium">{{ post.favorite_count || 0 }}</span>
            </button>
            
            <!-- 评论按钮 -->
            <button 
              @click="scrollToComments"
              class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors bg-gray-100 dark:bg-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="text-sm font-medium">{{ totalComments }}</span>
            </button>
          </div>
        </div>
        
        <div class="prose prose-lg max-w-none text-slate-700 leading-relaxed">
          <p class="whitespace-pre-wrap">{{ post.content }}</p>
        </div>

        <!-- 关联资源信息 -->
        <div 
          v-if="post.resource" 
          class="mt-8 p-6 bg-indigo-50/80 border border-indigo-100 rounded-2xl"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-indigo-900">{{ post.resource.title }}</p>
              <p class="text-xs text-indigo-500 mt-1">{{ post.resource.category || '未分类' }}</p>
              <p class="text-sm text-slate-600 mt-3 whitespace-pre-wrap">
                {{ post.resource.description || '该资源暂无描述' }}
              </p>
            </div>
            <a
              v-if="post.resource.url"
              :href="post.resource.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
            >
              查看资源
            </a>
          </div>
        </div>

        <!-- 资源已删除提示 -->
        <div 
          v-else-if="post.resource_id && !post.resource" 
          class="mt-8 p-6 bg-gray-50/80 border border-gray-200 rounded-2xl"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-600">发布者已删除</p>
              <p class="text-xs text-gray-500 mt-1">该帖子关联的学习资源已被发布者删除</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="bg-white rounded-2xl shadow-md p-8" id="comments-section">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            全部评论 ({{ totalComments }})
          </h2>
          <div class="text-sm text-slate-500">
            共 {{ totalPages }} 页
          </div>
        </div>
        
        <!-- 添加评论 -->
        <div class="mb-8 p-6 bg-slate-50 rounded-xl">
          <textarea 
            v-model="newComment" 
            placeholder="分享你的想法..."
            rows="3"
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
          ></textarea>
          <div class="flex justify-end mt-3">
            <button 
              @click="addComment" 
              :disabled="!newComment.trim() || isSubmittingComment"
              class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmittingComment" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmittingComment ? '发布中...' : '发表评论' }}
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div v-if="isLoadingComments" class="space-y-4">
          <div v-for="n in 3" :key="n" class="animate-pulse">
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-200"></div>
              <div class="flex-1">
                <div class="h-4 bg-slate-200 w-32 rounded mb-2"></div>
                <div class="h-3 bg-slate-200 w-full rounded mb-1"></div>
                <div class="h-3 bg-slate-200 w-3/4 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="comment in displayedComments" 
            :key="comment.id"
            class="flex gap-4 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div class="flex-shrink-0">
              <button 
                @click="navigateToUserProfile(comment.user_id)"
                class="flex-shrink-0 group"
              >
                <img 
                  :src="getUserAvatar(comment.user_id, comment.author_name)" 
                  :alt="comment.author_name || '匿名用户'"
                  class="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-blue-500 transition-all cursor-pointer"
                />
              </button>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <button 
                  @click="navigateToUserProfile(comment.user_id)"
                  class="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                >
                  {{ comment.author_name || '匿名用户' }}
                </button>
                <span class="text-sm text-slate-500">{{ formatDate(comment.created_at) }}</span>
              </div>
              <div class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ comment.content }}</div>
            </div>
          </div>
          
          <!-- 无评论状态 -->
          <div v-if="totalComments === 0" class="text-center py-16">
            <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-900 mb-2">还没有评论</h3>
            <p class="text-slate-500">快来发表第一条评论吧！</p>
          </div>

          <!-- 分页控件 -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-6 border-t border-slate-200">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1" 
              class="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div class="flex items-center gap-1">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages" 
              class="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import type { Post, Comment } from '@/types/community'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const post = ref<Post | null>(null)
const allComments = ref<Comment[]>([])
const newComment = ref('')
const isLiking = ref(false)
const isFavoriting = ref(false)
const isSubmittingComment = ref(false)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalComments = ref(0)
const isLoadingComments = ref(false)

const dbStore = useDatabaseStore()

// 计算属性
const totalPages = computed(() => Math.ceil(totalComments.value / pageSize.value))

const displayedComments = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return allComments.value.slice(startIndex, endIndex)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      for (let i = totalPages.value - 4; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
})

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 滚动到评论区
const scrollToComments = () => {
  const commentsSection = document.getElementById('comments-section')
  if (commentsSection) {
    commentsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 切换点赞状态
const toggleLike = async (post: Post) => {
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
            currentUserId = user.id.toString(); // 确保ID为字符串
          }
        } catch (error) {
          console.error('解析用户信息失败:', error)
        }
    }
    
    if (!currentUserId) {
      router.push('/login')
      return
    }
    
    // 确保数据库连接
    let client = null
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        client = createClient(supabaseUrl, supabaseKey)
        console.log('✅ 数据库客户端创建成功')
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.error('❌ 数据库连接失败:', error.message)
      showToast('数据库连接失败，请稍后重试', 'error')
      return
    }
    
    if (post.is_liked) {
      // 取消点赞
      console.log('🗑️ 取消点赞:', post.id)
      
      const { error } = await client
        .from('post_likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
      
      if (error) {
        console.error('❌ 取消点赞失败:', error)
        if (error.code === 'PGRST116' || error.message.includes('No rows')) {
          console.log('⚠️ 记录不存在，可能已被删除')
        } else {
          throw error
        }
      } else {
        console.log('✅ 取消点赞成功')
      }
      
      // 更新本地状态
      post.is_liked = false
      post.like_count = Math.max((post.like_count || 0) - 1, 0)
      
    } else {
      // 添加点赞 - 使用UPSERT避免重复
      console.log('❤️ 添加点赞:', post.id)
      
      const { error } = await client
        .from('post_likes')
        .upsert([{
          user_id: currentUserId,
          post_id: post.id
        }], {
          onConflict: 'user_id,post_id'
        })
      
      if (error) {
        console.error('❌ 添加点赞失败:', error)
        throw error
      } else {
        console.log('✅ 添加点赞成功')
      }
      
      // 更新本地状态
      post.is_liked = true
      post.like_count = (post.like_count || 0) + 1
    }
    
    console.log('📊 更新后的点赞数:', post.like_count)
    
  } catch (error) {
    console.error('❌ 点赞操作失败:', error)
    showToast('操作失败，请稍后重试', 'error')
    
    // 恢复原始状态
    post.is_liked = !post.is_liked
    post.like_count = post.is_liked ? 
      (post.like_count || 0) - 1 : 
      (post.like_count || 0) + 1
      
  } finally {
    isLiking.value = false
  }
}

// 切换收藏状态
const toggleFavorite = async (post: Post) => {
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
            currentUserId = user.id.toString(); // 确保ID为字符串
          }
        } catch (error) {
          console.error('解析用户信息失败:', error)
        }
    }
    
    if (!currentUserId) {
      router.push('/login')
      return
    }
    
    // 确保数据库连接
    let client = null
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        client = createClient(supabaseUrl, supabaseKey)
        console.log('✅ 数据库客户端创建成功')
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.error('❌ 数据库连接失败:', error.message)
      showToast('数据库连接失败，请稍后重试', 'error')
      return
    }
    
    if (post.is_favorited) {
      // 取消收藏
      console.log('🗑️ 取消收藏:', post.id)
      
      const { error } = await client
        .from('post_favorites')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
      
      if (error) {
        console.error('❌ 取消收藏失败:', error)
        if (error.code === 'PGRST116' || error.message.includes('No rows')) {
          console.log('⚠️ 记录不存在，可能已被删除')
        } else {
          throw error
        }
      } else {
        console.log('✅ 取消收藏成功')
      }
      
      // 更新本地状态
      post.is_favorited = false
      post.favorite_count = Math.max((post.favorite_count || 0) - 1, 0)
      
    } else {
      // 添加收藏 - 使用UPSERT避免重复
      console.log('⭐ 添加收藏:', post.id)
      
      const { error } = await client
        .from('post_favorites')
        .upsert([{
          user_id: currentUserId,
          post_id: post.id
        }], {
          onConflict: 'user_id,post_id'
        })
      
      if (error) {
        console.error('❌ 添加收藏失败:', error)
        throw error
      } else {
        console.log('✅ 添加收藏成功')
      }
      
      // 更新本地状态
      post.is_favorited = true
      post.favorite_count = (post.favorite_count || 0) + 1
    }
    
    console.log('📊 更新后的收藏数:', post.favorite_count)
    
  } catch (error) {
    console.error('❌ 收藏操作失败:', error)
    showToast('操作失败，请稍后重试', 'error')
    
    // 恢复原始状态
    post.is_favorited = !post.is_favorited
    post.favorite_count = post.is_favorited ? 
      (post.favorite_count || 0) - 1 : 
      (post.favorite_count || 0) + 1
      
  } finally {
    isFavoriting.value = false
  }
}

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    console.log('📖 开始加载帖子详情，ID:', postId)
    
    // 使用 supabase service 获取帖子数据
    const { supabaseService } = await import('@/services/supabase')
    const postData = await supabaseService.getPostById(postId)
    
    if (!postData) {
      console.error('❌ 帖子未找到:', postId)
      return
    }
    
    console.log('✅ 帖子数据加载成功:', postData)
    
    // 获取用户信息
    let userInfo = null
    if (postData.user_id) {
      try {
        const { supabaseService } = await import('@/services/supabase')
        userInfo = await supabaseService.getUserById(postData.user_id)
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
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
    
    // 检查用户是否已收藏该帖子
    let isFavorited = false
    if (currentUserId) {
      try {
        const { supabaseService } = await import('@/services/supabase')
        const { data: favoriteData } = await supabaseService.getClient()
          .from('post_favorites')
          .select('id')
          .eq('user_id', currentUserId)
          .eq('post_id', postId)
          
        if (favoriteData && favoriteData.length > 0) {
          isFavorited = true
        }
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    }
    
    // 处理帖子数据
    post.value = {
      ...postData,
      author_name: userInfo?.nickname || userInfo?.username || '匿名用户',
      user: userInfo,
      is_favorited: isFavorited,
      favorite_count: postData.favorite_count || 0,
      resource: postData.resource || null
    }
    
    console.log('✅ 帖子详情加载成功:', post.value)
    
    // 获取帖子评论
    await loadComments()
    
  } catch (error) {
    console.error('❌ 获取帖子详情失败:', error)
  }
}

// 加载评论
const loadComments = async () => {
  isLoadingComments.value = true
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('评论加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('评论加载：数据库客户端初始化失败')
      return
    }
    
    console.log('💬 开始加载评论，帖子ID:', postId)
    
    // 先获取总数
    const { count, error: countError } = await client
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
    
    if (countError) {
      console.error('❌ 获取评论总数失败:', countError)
    } else {
      totalComments.value = count || 0
    }
    
    // 分页获取评论数据
    const { data: commentsData, error: commentsError } = await client
      .from('post_comments')
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false }) // 最新评论在前
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1)
    
    if (commentsError) {
      console.error('❌ 加载评论失败:', commentsError)
      return
    }
    
    // 处理评论数据
    allComments.value = (commentsData || []).map(comment => ({
      ...comment,
      author_name: comment.user?.nickname || comment.user?.username || '匿名用户'
    }))
    
    console.log('✅ 评论加载完成，总数:', totalComments.value, '当前页显示:', allComments.value.length)
    
  } catch (error) {
    console.error('❌ 加载评论失败:', error)
  } finally {
    isLoadingComments.value = false
  }
}

// 获取用户头像
const getUserAvatar = (userId: string, authorName: string) => {
  // 与个人中心保持一致，使用浅蓝色背景和深蓝色字母
  const bgColor = '#DBEAFE' // 浅蓝色，对应 bg-blue-100
  const textColor = '#2563EB' // 深蓝色，对应 text-blue-600
  
  // 创建SVG头像，与个人中心保持一致
  const initial = authorName ? authorName.charAt(0).toUpperCase() : 'U'
  
  // 生成SVG头像数据URL
  const svgContent = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${bgColor}"/>
      <text x="20" y="26" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `.trim()
  
  // 将SVG转换为Data URL
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)))
}

// 添加评论
const addComment = async () => {
  if (!newComment.value.trim()) {
    return // 空评论不处理
  }
  
  isSubmittingComment.value = true
  
  try {
    // 获取当前用户信息
    let currentUser = null
    let currentUserId = null
    let authorName = '当前用户'
    
    const currentUserStr = localStorage.getItem('currentUser')
    if (currentUserStr) {
      try {
        currentUser = JSON.parse(currentUserStr)
        if (currentUser.id) {
          currentUserId = currentUser.id
          authorName = currentUser.nickname || currentUser.username || '当前用户'
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      return // 未登录不处理
    }
    
    console.log('💬 开始发表评论，帖子ID:', postId, '用户ID:', currentUserId)
    
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('发表评论：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('发表评论：数据库客户端初始化失败')
      return
    }
    
    const { data: commentData, error } = await client
      .from('post_comments')
      .insert([{
        post_id: postId,
        user_id: currentUserId,
        content: newComment.value.trim()
      }])
      .select()
    
    if (error) {
      console.error('❌ 发表评论失败:', error)
      return
    }
    
    // 重新加载评论列表以显示最新评论
    await loadComments()
    
    // 更新帖子评论数
    if (post.value) {
      post.value.comment_count = (post.value.comment_count || 0) + 1
    }
    
    newComment.value = ''
    console.log('✅ 评论发表成功')
    
  } catch (error) {
    console.error('❌ 发表评论失败:', error)
  } finally {
    isSubmittingComment.value = false
  }
}

// 导航到用户主页
const navigateToUserProfile = (userId: string) => {
  if (!userId) return
  
  // 如果点击的是自己的用户ID，跳转到个人资料页面
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (currentUser.id === userId) {
    router.push('/profile')
  } else {
    router.push(`/user/${userId}`)
  }
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
/* 自定义prose样式 */
.prose {
  color: inherit;
  max-width: none;
}

.prose p {
  margin-bottom: 0;
  line-height: 1.75;
}

/* 分页动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 文本换行保持换行符 */
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 深色模式支持 */
.dark .post-card {
  background: #2d3748;
  color: #e2e8f0;
}

.dark .comments-section {
  background: #2d3748;
  color: #e2e8f0;
}

.dark .add-comment {
  background: #4a5568;
  border-color: #718096;
}

.dark .comment-input {
  background: #4a5568;
  border-color: #718096;
  color: #e2e8f0;
}

.dark .comment-input:focus {
  border-color: #63b3ed;
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
}

.dark .comment-item {
  border-bottom-color: #4a5568;
}

.dark .post-title {
  color: #e2e8f0;
}

.dark .comments-section h2 {
  color: #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .post-card, .comments-section {
    padding: 16px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .add-comment {
    padding: 16px;
  }
}
</style>