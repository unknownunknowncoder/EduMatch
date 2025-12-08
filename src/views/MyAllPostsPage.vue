<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3] pb-20">
    
    <!-- 顶部导航 (Sticky) -->
    <div class="sticky top-0 z-30 bg-[#f4f1ea]/90 backdrop-blur-sm border-b border-[#0f281f]/5 px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <button 
          @click="goBack"
          class="group flex items-center text-[#0f281f]/60 hover:text-[#0f281f] transition-colors font-serif italic"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回个人中心
        </button>
        
        <div class="text-xs font-bold text-[#0f281f]/30 uppercase tracking-widest hidden md:block">
           个人文稿档案
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="max-w-5xl mx-auto px-4 mt-8">
      
      <!-- 页面标题区域 -->
      <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b-2 border-[#0f281f] pb-6">
        <div class="space-y-2">
           <div class="flex items-center gap-3">
              <ScrollText class="w-8 h-8 text-[#0f281f]" />
              <h1 class="text-4xl font-serif font-bold text-[#0f281f]">我的帖子</h1>
           </div>
           <p class="text-[#0f281f]/60 font-serif italic pl-11">
              您在学术社区发布的所有观点与见解均归档于此。
           </p>
        </div>
        
        <button 
           @click="navigateToCommunity"
           class="px-6 py-3 bg-[#0f281f] text-[#d4c5a3] rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a4533] hover:shadow-lg transition-all flex items-center gap-2 group"
        >
           <PenTool class="w-4 h-4 group-hover:-rotate-12 transition-transform" />
           起草新文
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoadingPosts" class="flex flex-col items-center justify-center py-32 space-y-6">
         <div class="w-16 h-16 border-4 border-[#d4c5a3] border-t-[#0f281f] rounded-full animate-spin"></div>
         <p class="text-[#0f281f] font-serif tracking-widest uppercase">正在调取档案...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="myPosts.length === 0" class="text-center py-24 border-2 border-dashed border-[#0f281f]/10 rounded-sm bg-white/50">
         <div class="w-24 h-24 bg-[#0f281f]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX class="w-10 h-10 text-[#0f281f]/30" />
         </div>
         <h3 class="text-2xl font-serif font-bold text-[#0f281f] mb-2">暂无记录</h3>
         <p class="text-[#0f281f]/60 max-w-md mx-auto mb-8 font-serif">
            您的档案库中还没有任何文稿。去社区发表您的第一个观点吧。
         </p>
         <button 
            @click="navigateToCommunity"
            class="px-8 py-3 border-2 border-[#0f281f] text-[#0f281f] font-bold uppercase tracking-widest hover:bg-[#0f281f] hover:text-[#d4c5a3] transition-colors"
         >
            前往社区
         </button>
      </div>

      <!-- 帖子列表 -->
      <div v-else class="space-y-4">
        <div 
          v-for="post in myPosts"
          :key="post.id"
          class="group bg-white border border-[#0f281f]/10 hover:border-[#0f281f]/30 p-6 rounded-sm transition-all hover:shadow-lg cursor-pointer relative overflow-hidden"
          @click="navigateToPost(post.id)"
        >
          <!-- 左侧装饰线 -->
          <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3] group-hover:bg-[#0f281f] transition-colors"></div>

          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 space-y-3">
              <!-- 头部标签 -->
              <div class="flex items-center gap-3">
                 <span class="px-2 py-0.5 bg-[#f4f1ea] text-[#0f281f] text-xs font-bold uppercase tracking-wider border border-[#0f281f]/10">
                    {{ post.category || '未分类' }}
                 </span>
                 <span class="text-xs font-mono text-[#0f281f]/40 flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ formatDate(post.created_at) }}
                 </span>
              </div>

              <!-- 标题与摘要 -->
              <div>
                 <h3 class="text-xl font-serif font-bold text-[#0f281f] group-hover:text-[#b49b67] transition-colors mb-2">
                    {{ post.title }}
                 </h3>
                 <p class="text-[#0f281f]/60 text-sm font-serif line-clamp-2 leading-relaxed">
                    {{ post.content }}
                 </p>
              </div>

              <!-- 底部数据 -->
              <div class="flex items-center gap-6 text-xs font-mono text-[#0f281f]/40 pt-2">
                 <span class="flex items-center gap-1"><Eye class="w-3 h-3"/> {{ post.views || 0 }}</span>
                 <span class="flex items-center gap-1"><Heart class="w-3 h-3"/> {{ post.likes || 0 }}</span>
                 <span class="flex items-center gap-1"><MessageSquare class="w-3 h-3"/> {{ post.comments || 0 }}</span>
              </div>
            </div>

            <!-- 操作按钮 (悬浮显示) -->
            <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                  @click.stop="navigateToPost(post.id)"
                  class="p-2 text-[#0f281f]/40 hover:text-[#0f281f] hover:bg-[#f4f1ea] rounded-sm transition-colors"
                  title="查阅档案"
                >
                  <Eye class="w-5 h-5" />
                </button>
                <button
                  @click.stop="showDeleteConfirm(post)"
                  class="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                  title="销毁记录"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 (组件需自行适配样式，或使用插槽) -->
    <DeleteConfirmDialog
      :show="showDeleteDialog"
      :message="`确认要从档案中永久销毁「${selectedPost?.title}」吗？此操作不可逆。`"
      @confirm="handleDeletePost"
      @cancel="hideDeleteConfirm"
    />

    <!-- Toast Message -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog.vue'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import { 
  ArrowLeft, ScrollText, PenTool, FileX, Calendar, 
  Eye, Heart, MessageSquare, Trash2 
} from 'lucide-vue-next'

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
    const postTitle = selectedPost.value.title
    const postId = selectedPost.value.id
    
    await supabaseService.deleteCommunityPost(postId)
    
    myPosts.value = myPosts.value.filter(post => post.id !== postId)
    
    hideDeleteConfirm()
    showToast(`手稿「${postTitle}」已成功销毁`, 'success')
    
  } catch (error) {
    console.error('❌ 删除帖子失败:', error)
    let errorMessage = '删除失败，请稍后重试'
    if (error instanceof Error) {
      errorMessage = `删除失败: ${error.message}`
    }
    showToast(errorMessage, 'error')
  }
}

const loadMyPosts = async () => {
  isLoadingPosts.value = true
  try {
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) currentUserId = user.id
    }
    
    if (!currentUserId) {
      myPosts.value = []
      showToast('请先登录身份以查阅档案', 'warning')
      return
    }
    
    const posts = await supabaseService.getCommunityPostsByUserId(currentUserId)
    
    if (!posts || posts.length === 0) {
      myPosts.value = []
      return
    }
    
    const postsWithDetails = []
    
    for (const post of posts) {
      try {
        const commentCount = await supabaseService.getPostCommentsCount(post.id)
        
        const transformedPost = {
          id: post.id,
          title: post.title || '无标题手稿',
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
        console.error('❌ 档案详情处理出错:', post.id, error)
        postsWithDetails.push({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          status: 'published',
          views: 0, likes: 0, comments: 0,
          created_at: post.created_at
        })
      }
    }
    
    myPosts.value = postsWithDetails as MyPost[]
    
  } catch (error) {
    console.error('❌ 档案调取失败:', error)
    myPosts.value = []
    showToast('档案调取失败，请稍后重试', 'error')
  } finally {
    isLoadingPosts.value = false
  }
}

onMounted(() => {
  loadMyPosts()
})
</script>

<style scoped>
/* 覆盖 Toast 样式 (匹配 Theme C) */
:deep(.bg-green-100) {
  background-color: #f0fdf4 !important;
  color: #166534 !important;
  border-color: #166534 !important;
}

:deep(.bg-red-100) {
  background-color: #fef2f2 !important;
  color: #991b1b !important;
  border-color: #991b1b !important;
}

/* 旋转动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>