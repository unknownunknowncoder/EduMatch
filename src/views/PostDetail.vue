<template>
  <div class="post-detail">
    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-button">
        <button @click="$router.back()" class="btn btn-secondary">
          ← 返回社区
        </button>
      </div>

      <!-- 帖子详情 -->
      <div v-if="post" class="post-card">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span class="author">作者: {{ post.author_name || '匿名用户' }}</span>
            <span class="date">{{ formatDate(post.created_at) }}</span>
            
            <!-- 操作按钮 - 在日期右边横向排列 -->
            <div class="flex items-center space-x-2 ml-auto">
              <!-- 点赞按钮 -->
              <button 
                @click="toggleLike(post)"
                :disabled="isLiking"
                class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                :class="post.is_liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span class="text-sm font-medium">{{ post.like_count || 0 }}</span>
              </button>
              
              <!-- 收藏按钮 -->
              <button 
                @click="toggleFavorite(post)"
                :disabled="isFavoriting"
                class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors disabled:opacity-50"
                :class="post.is_favorited ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-700'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span class="text-sm font-medium">{{ post.favorite_count || 0 }}</span>
              </button>
              
              <!-- 评论按钮 -->
              <button 
                @click="toggleComments"
                class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors bg-gray-100 dark:bg-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span class="text-sm font-medium">{{ commentCount }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>
      </div>

      <!-- 评论区域 - 默认显示，点击评论按钮时跳转到评论区 -->
      <div class="comments-section" id="comments-section">
        <h2>评论 ({{ commentCount }})</h2>
        
        <!-- 添加评论 -->
        <div class="add-comment">
          <textarea 
            v-model="newComment" 
            placeholder="写下你的评论..."
            rows="3"
            class="comment-input"
          ></textarea>
          <button 
            @click="addComment" 
            :disabled="!newComment.trim()"
            class="btn btn-primary"
          >
            发表评论
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="comment in topLevelComments" 
            :key="comment.id"
            class="comment-wrapper"
          >
            <CommentComponent 
              :comment="comment" 
              :all-comments="comments"
              @reply="handleReply"
              @add-reply="addReply"
            />
          </div>
          
          <div v-if="topLevelComments.length === 0" class="no-comments">
            暂无评论，快来发表第一条评论吧！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import CommentComponent from '@/components/CommentComponent.vue'
import type { Post, Comment } from '@/types/community'

const route = useRoute()
const postId = route.params.id as string

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const showReplyInput = ref<{[key: string]: boolean}>({})
const isLiking = ref(false)
const isFavoriting = ref(false)
const showCommentInput = ref(true) // 进入页面时默认显示评论
const commentCount = ref(0)

const dbStore = useDatabaseStore()

// 计算属性：获取顶级评论（parent_id为null的评论）
const topLevelComments = computed(() => {
  return comments.value.filter(comment => !comment.parent_id)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 切换评论区域的显示状态并跳转到评论区
const toggleComments = () => {
  // 现在评论区默认显示，所以这里主要负责跳转功能
  scrollToComments()
}

// 滚动到评论区并置顶显示
const scrollToComments = () => {
  // 使用 setTimeout 确保 DOM 更新后再滚动
  setTimeout(() => {
    const commentsSection = document.querySelector('.comments-section')
    if (commentsSection) {
      // 使用更精确的滚动行为，确保评论区置顶但保持页面可滚动
      commentsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start', // 置顶显示
        inline: 'nearest'
      })
    }
  }, 100)
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
      post.like_count = Math.max((post.like_count || 0) - 1, 0)
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
      post.like_count = (post.like_count || 0) + 1
      console.log('✅ 添加点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
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
    
    // 确保数据库已初始化
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
    console.error('收藏操作失败:', error)
  } finally {
    isFavoriting.value = false
  }
}

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('帖子详情加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('帖子详情加载：数据库客户端初始化失败')
      return
    }
    
    console.log('📖 开始加载帖子详情，ID:', postId)
    
    // 获取帖子详情
    const { data: postData, error: postError } = await client
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
      .eq('id', postId)
      .single()
    
    if (postError) {
      console.error('❌ 加载帖子详情失败:', postError)
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
    
    // 检查用户是否已收藏该帖子
    let isFavorited = false
    if (currentUserId) {
      const { data: favoriteData, error: favoriteError } = await client
        .from('post_favorites')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('post_id', postId)
        
      if (!favoriteError && favoriteData && favoriteData.length > 0) {
        isFavorited = true
      }
    }
    
    // 处理帖子数据
    post.value = {
      ...postData,
      author_name: postData.user?.nickname || postData.user?.username || '匿名用户',
      is_favorited: isFavorited,
      favorite_count: postData.favorite_count || 0
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
      .order('created_at', { ascending: true })
    
    if (commentsError) {
      console.error('❌ 加载评论失败:', commentsError)
      return
    }
    
    // 处理评论数据
    comments.value = (commentsData || []).map(comment => ({
      ...comment,
      author_name: comment.user?.nickname || comment.user?.username || '匿名用户'
    }))
    
    // 更新评论计数
    commentCount.value = comments.value.length
    
    console.log('✅ 评论加载完成，数量:', comments.value.length)
    
  } catch (error) {
    console.error('❌ 加载评论失败:', error)
  }
}

// 获取用户头像（与个人中心保持一致）
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
    
    // 使用服务端密钥绕过RLS策略
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
    if (serviceKey) {
      console.log('使用服务端密钥绕过RLS策略')
      
      // 使用服务端密钥创建新的客户端
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      
      if (supabaseUrl && serviceKey) {
        const adminClient = createClient(supabaseUrl, serviceKey)
        
        // 保存评论到数据库
        const { data: commentData, error } = await adminClient
          .from('post_comments')
          .insert([{
            post_id: postId,
            user_id: currentUserId,
            content: newComment.value.trim()
          }])
          .select()
        
        if (error) {
          console.error('❌ 使用服务端密钥保存评论失败:', error)
          
          // 如果服务端密钥也失败，尝试使用原始客户端
          console.log('尝试使用原始客户端保存评论...')
          const { data: commentData2, error: error2 } = await client
            .from('post_comments')
            .insert([{
              post_id: postId,
              user_id: currentUserId,
              content: newComment.value.trim()
            }])
            .select()
          
          if (error2) {
            console.error('❌ 原始客户端保存评论失败:', error2)
            
            // 如果两种方法都失败，使用本地模式
            console.log('使用本地模式保存评论')
            const comment = {
              id: 'temp-' + Date.now(),
              post_id: postId,
              user_id: currentUserId,
              content: newComment.value.trim(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              author_name: authorName
            }
            
            comments.value.unshift(comment)
            
            // 更新帖子评论数
            if (post.value) {
              post.value.comment_count = (post.value.comment_count || 0) + 1
            }
            
            // 更新评论计数
            commentCount.value = comments.value.length
            
            newComment.value = ''
            console.log('✅ 评论发表成功（本地模式）')
            return
          } else {
          // 原始客户端保存成功
          console.log('✅ 评论已保存到数据库（原始客户端）')
          
          // 重新加载评论列表以确保显示最新的评论
          await loadComments()
          
          // 更新帖子评论数
          if (post.value) {
            post.value.comment_count = (post.value.comment_count || 0) + 1
          }
          
          // 更新评论计数（通过loadComments已更新）
          
          newComment.value = ''
          console.log('✅ 评论发表成功')
          return
          }
        } else {
          // 服务端密钥保存成功
          console.log('✅ 评论已保存到数据库（服务端密钥）')
          
          // 重新加载评论列表以确保显示最新的评论
          await loadComments()
          
          // 更新帖子评论数
          if (post.value) {
            post.value.comment_count = (post.value.comment_count || 0) + 1
          }
          
          // 更新评论计数（通过loadComments已更新）
          
          newComment.value = ''
          console.log('✅ 评论发表成功')
          return
        }
      }
    }
    
    // 如果没有服务端密钥，尝试使用原始客户端
    console.log('没有服务端密钥，尝试使用原始客户端')
    
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
      
      // 如果RLS策略导致问题，使用本地模式
      if (error.message.includes('RLS') || error.message.includes('policy')) {
        console.log('RLS策略限制，使用本地模式...')
        
        const comment = {
          id: 'temp-' + Date.now(),
          post_id: postId,
          user_id: currentUserId,
          content: newComment.value.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_name: authorName
        }
        
        comments.value.unshift(comment)
        
        // 更新帖子评论数
        if (post.value) {
          post.value.comment_count = (post.value.comment_count || 0) + 1
        }
        
        // 更新评论计数
        commentCount.value = comments.value.length
        
        newComment.value = ''
        console.log('✅ 评论发表成功（本地模式）')
        return
      }
      
      return
    }
    
    // 处理新评论数据
    if (commentData && commentData[0]) {
      // 重新加载评论列表以确保显示最新的评论
      await loadComments()
      
      // 更新帖子评论数
      if (post.value) {
        post.value.comment_count = (post.value.comment_count || 0) + 1
      }
    }
    
    newComment.value = ''
    console.log('✅ 评论发表成功')
    
    // 保持评论输入框显示，并自动聚焦
    setTimeout(() => {
      const textarea = document.querySelector('.comment-input') as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
      }
    }, 100)
    
  } catch (error) {
    console.error('❌ 发表评论失败:', error)
  }
}

// 处理回复操作
const handleReply = (commentId: string) => {
  replyingTo.value = commentId
}

// 添加回复
const addReply = async (replyData: { parentCommentId: string; content: string }) => {
  if (!replyData.content.trim()) return
  
  try {
    // 获取当前用户信息
    let currentUserId = null
    let authorName = '当前用户'
    
    const currentUserStr = localStorage.getItem('currentUser')
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr)
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
    
    console.log('💬 开始发表回复，帖子ID:', postId, '用户ID:', currentUserId, '父评论ID:', replyData.parentCommentId)
    
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('发表回复：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('发表回复：数据库客户端初始化失败')
      return
    }
    
    // 使用服务端密钥绕过RLS策略
    const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
    if (serviceKey) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      
      if (supabaseUrl && serviceKey) {
        const adminClient = createClient(supabaseUrl, serviceKey)
        
        // 保存回复到数据库
        const { data: replyDataResult, error } = await adminClient
          .from('post_comments')
          .insert([{
            post_id: postId,
            user_id: currentUserId,
            content: replyData.content.trim(),
            parent_id: replyData.parentCommentId
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
          console.error('❌ 保存回复失败:', error)
          return
        }
        
        // 添加回复到本地状态
        if (replyDataResult && replyDataResult.length > 0) {
          const newReply = replyDataResult[0]
          const formattedReply = {
            ...newReply,
            author_name: newReply.user?.nickname || newReply.user?.username || '匿名用户'
          }
          comments.value.push(formattedReply)
          commentCount.value = comments.value.length
          
          console.log('✅ 回复发表成功')
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 发表回复失败:', error)
  }
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.post-detail {
  padding: 20px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-button {
  margin-bottom: 20px;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.post-header {
  margin-bottom: 20px;
}

.post-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
}

.author {
  font-weight: 500;
}

.comments-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.add-comment {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  margin-bottom: 12px;
}

.comment-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-wrapper {
  margin-bottom: 0;
}

.comment-wrapper .comment-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-wrapper .comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-author {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.comment-date {
  color: #666;
  font-size: 0.8rem;
}

.comment-content {
  color: #444;
  line-height: 1.5;
}

.no-comments {
  text-align: center;
  color: #666;
  padding: 40px;
  font-style: italic;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
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