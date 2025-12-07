<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner -->
    <div class="h-48 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 背景图片 -->
      <img 
        src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Manuscripts Archive"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Return
        </button>
      </div>

      <!-- Title -->
      <div class="absolute bottom-12 left-0 w-full px-8 z-10">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Manuscript Archive</h2>
          <h1 class="text-3xl font-serif font-bold text-white tracking-wide">
            {{ userInfo.username }}'s Publications
          </h1>
          <p v-if="!privacyCheckPassed" class="text-white/60 text-sm mt-2 flex items-center gap-2">
            <Lock class="w-4 h-4" />
            This archive is private
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-6xl mx-auto px-6 mt-8">
      
      <!-- 加载状态 -->
      <div v-if="loading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Accessing manuscript archive...</p>
      </div>

      <!-- 隐私保护状态 -->
      <div v-else-if="!privacyCheckPassed" class="bg-white p-16 shadow-xl border-t-8 border-[#d4c5a3] text-center">
         <Lock class="w-16 h-16 text-[#d4c5a3]/20 mx-auto mb-4" />
         <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-2">Private Archive</h2>
         <p class="text-[#1a3c34]/60 mb-6">This scholar has chosen to keep their manuscript archive private.</p>
         <button @click="goBack" class="px-6 py-2 border border-[#1a3c34] text-[#1a3c34] uppercase tracking-widest text-xs font-bold hover:bg-[#1a3c34] hover:text-white transition-colors">
            Return
         </button>
      </div>

      <!-- 正常内容 -->
      <div v-else>
         
         <!-- 统计信息 -->
         <div class="bg-white p-6 shadow-lg mb-6 border border-[#1a3c34]/10">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-[#f2f0e9] border-2 border-[#1a3c34]/20 flex items-center justify-center">
                     <PenTool class="w-6 h-6 text-[#1a3c34]" />
                  </div>
                  <div>
                     <h3 class="text-xl font-serif font-bold text-[#1a3c34]">
                        {{ userInfo.nickname || userInfo.username }}'s Manuscripts
                     </h3>
                     <p class="text-sm text-[#1a3c34]/60">
                        {{ totalPosts }} publications • Joined {{ formatDate(userInfo.created_at) }}
                     </p>
                  </div>
               </div>
               <div class="text-right">
                  <div class="text-2xl font-serif font-bold text-[#d4c5a3]">{{ totalPosts }}</div>
                  <div class="text-xs font-bold text-[#1a3c34]/40 uppercase tracking-widest">Total Posts</div>
               </div>
            </div>
         </div>

         <!-- 空状态 -->
         <div v-if="postsList.length === 0" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
            <FileText class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
            <p class="text-[#1a3c34]/60 font-serif text-lg">No manuscripts published yet.</p>
            <p class="text-[#1a3c34]/40 text-sm mt-2">This scholar hasn't published any manuscripts yet.</p>
         </div>

         <!-- 帖子列表 -->
         <div v-else class="space-y-6">
            <div
               v-for="(post, index) in postsList"
               :key="post.id"
               class="bg-white shadow-lg border border-[#1a3c34]/10 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
               @click="navigateToPost(post.id)"
            >
               <!-- 帖子头部 -->
               <div class="p-6 border-b border-[#1a3c34]/5">
                  <div class="flex items-start justify-between mb-4">
                     <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                           <span class="text-xs font-mono text-[#d4c5a3] bg-[#f2f0e9] px-2 py-1">
                              #{{ (currentPage - 1) * pageSize + index + 1 }}
                           </span>
                           <span class="text-xs font-bold text-[#1a3c34]/40 bg-[#f9f9f7] px-2 py-1">
                              {{ post.category || 'General' }}
                           </span>
                           <span class="text-xs text-[#1a3c34]/30">
                              {{ formatDate(post.created_at) }}
                           </span>
                        </div>
                        <h3 class="text-2xl font-serif font-bold text-[#1a3c34] group-hover:text-[#b49b67] transition-colors leading-tight">
                           {{ post.title }}
                        </h3>
                     </div>
                     <ArrowRight class="w-5 h-5 text-[#d4c5a3] opacity-0 group-hover:opacity-100 transition-all ml-4 flex-shrink-0" />
                  </div>
                  
                  <p class="text-[#1a3c34]/70 font-serif leading-relaxed line-clamp-3">
                     {{ post.content }}
                  </p>
               </div>

               <!-- 帖子底部统计 -->
               <div class="p-4 bg-[#f9f9f7] border-t border-[#1a3c34]/5">
                  <div class="flex items-center justify-between">
                     <div class="flex items-center gap-6 text-sm text-[#1a3c34]/40">
                        <div class="flex items-center gap-1">
                           <Heart class="w-4 h-4" />
                           <span class="font-mono">{{ post.likes_count || 0 }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <MessageSquare class="w-4 h-4" />
                           <span class="font-mono">{{ post.comments_count || 0 }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                           <Eye class="w-4 h-4" />
                           <span class="font-mono">{{ post.views_count || 0 }}</span>
                        </div>
                     </div>
                     <div class="text-xs text-[#1a3c34]/30">
                        {{ getRelativeTime(post.created_at) }}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- 分页 -->
         <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-4">
            <button
               @click="prevPage"
               :disabled="currentPage <= 1"
               class="px-4 py-2 border border-[#1a3c34] text-[#1a3c34] text-xs font-bold uppercase tracking-widest hover:bg-[#1a3c34] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
               Previous
            </button>
            <span class="text-sm text-[#1a3c34]/60 font-mono">
               Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
               @click="nextPage"
               :disabled="currentPage >= totalPages"
               class="px-4 py-2 border border-[#1a3c34] text-[#1a3c34] text-xs font-bold uppercase tracking-widest hover:bg-[#1a3c34] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
               Next
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { 
  ArrowLeft, Lock, PenTool, FileText, Heart, MessageSquare, Eye, ArrowRight
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

// State
const userInfo = ref({ id: '', username: '', nickname: '', created_at: '' })
const postsList = ref([])
const totalPosts = ref(0)
const loading = ref(true)
const privacyCheckPassed = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

// Computed
const targetUserId = computed(() => route.params.userId as string)

// Methods
const formatDate = (str: string) => {
  if(!str) return 'N/A'
  return new Date(str).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const checkUserPrivacy = async (userId: string) => {
  try {
    // 如果是查看自己的帖子，总是允许
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id === userId) {
      privacyCheckPassed.value = true
      return
    }

    const { supabaseService } = await import('@/services/supabase')
    const client = supabaseService.getClient()
    const { data } = await client
      .from('user_privacy_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    // 如果设置了hide_posts，则不允许查看
    if (data?.hide_posts) {
      privacyCheckPassed.value = false
    } else {
      privacyCheckPassed.value = true
    }
  } catch (error) {
    console.log('获取隐私设置失败，默认允许查看')
    privacyCheckPassed.value = true
  }
}

const loadUserInfo = async () => {
  try {
    const user = await dbStore.getUserById(targetUserId.value)
    if (!user) return
    
    userInfo.value = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      created_at: user.created_at
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const loadPostsList = async () => {
  try {
    if (!privacyCheckPassed.value) return

    loading.value = true
    const posts = await dbStore.getUserPosts(targetUserId.value)
    
    // 处理数据格式
    const processedPosts = (posts || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      created_at: post.created_at,
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      views_count: post.views_count || 0
    }))

    // 分页处理
    totalPosts.value = processedPosts.length
    totalPages.value = Math.ceil(totalPosts.value / pageSize.value)
    
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    postsList.value = processedPosts.slice(startIndex, endIndex)

  } catch (error) {
    console.error('加载帖子列表失败:', error)
  } finally {
    loading.value = false
  }
}

const navigateToPost = (id: string) => {
  router.push(`/post/${id}`)
}

const goBack = () => {
  router.back()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPostsList()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadPostsList()
  }
}

onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    checkUserPrivacy(targetUserId.value)
  ])
  await loadPostsList()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>