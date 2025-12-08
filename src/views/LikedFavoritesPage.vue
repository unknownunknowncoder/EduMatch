<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3] pb-20">
    
    <!-- 顶部导航 (与“我的资源”一致) -->
    <div class="sticky top-0 z-30 bg-[#f4f1ea]/90 backdrop-blur-sm border-b border-[#0f281f]/5 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <button 
          @click="goBack"
          class="group flex items-center text-[#0f281f]/60 hover:text-[#0f281f] transition-colors font-serif italic"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回个人档案
        </button>
        
        <div class="text-xs font-bold text-[#0f281f]/30 uppercase tracking-widest hidden md:block">
           精选收藏
        </div>
      </div>
    </div>

    <!-- Top Banner (Collection) -->
    <div class="relative overflow-hidden bg-[#f4f1ea]">
      
      <div class="relative px-8 pt-8 pb-4">
         <div class="max-w-6xl mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-start gap-6">
               <div class="space-y-2">
                  <div class="flex items-center gap-3">
                     <Bookmark class="w-8 h-8 text-[#0f281f]" />
                     <h1 class="text-4xl font-serif font-bold text-[#0f281f]">精选收藏</h1>
                  </div>
                  <p class="text-[#0f281f]/60 font-serif italic pl-11">
                     您个人珍藏的智慧见解合集。
                  </p>
               </div>
            </div>
         </div>
      </div>
      
      <!-- Border Line directly under the text -->
      <div class="px-8">
        <div class="max-w-6xl mx-auto border-b-2 border-[#0f281f]"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 mt-4 relative z-10">
      
      <!-- Tab Navigation (Archive Tabs) -->
      <div class="flex justify-center mb-10">
         <div class="inline-flex bg-white p-1 rounded-sm shadow-md border border-[#0f281f]/10">
            <button
               @click="setActiveTab('liked')"
               class="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
               :class="activeTab === 'liked' ? 'bg-[#0f281f] text-[#d4c5a3] shadow-lg' : 'text-[#0f281f]/60 hover:text-[#0f281f] hover:bg-[#f4f1ea]'"
            >
               <ThumbsUp class="w-4 h-4" /> 点赞
            </button>
            <button
               @click="setActiveTab('favorites')"
               class="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
               :class="activeTab === 'favorites' ? 'bg-[#0f281f] text-[#d4c5a3] shadow-lg' : 'text-[#0f281f]/60 hover:text-[#0f281f] hover:bg-[#f4f1ea]'"
            >
               <Heart class="w-4 h-4" /> 收藏
            </button>
         </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-6">
         <div class="w-16 h-16 border-4 border-[#d4c5a3] border-t-[#0f281f] rounded-full animate-spin"></div>
         <p class="text-[#0f281f] font-serif tracking-widest uppercase">正在访问收藏库...</p>
      </div>

      <!-- Content Grid -->
      <div v-else class="space-y-6">
         
         <!-- Empty State -->
         <div v-if="(activeTab === 'liked' && likedResources.length === 0) || (activeTab === 'favorites' && favoritedResources.length === 0)" class="text-center py-24 bg-white/50 border-2 border-dashed border-[#0f281f]/10 rounded-sm">
            <div class="w-24 h-24 bg-[#0f281f]/5 rounded-full flex items-center justify-center mx-auto mb-6">
               <component :is="activeTab === 'liked' ? ThumbsUp : Heart" class="w-10 h-10 text-[#0f281f]/20" />
            </div>
            <h3 class="text-2xl font-serif font-bold text-[#0f281f] mb-2">收藏夹为空</h3>
            <p class="text-[#0f281f]/60 max-w-md mx-auto mb-8 font-serif">
               您还没有{{ activeTab === 'liked' ? '点赞' : '收藏' }}任何内容。去社区探索有价值的作品吧。
            </p>
            <router-link to="/community" class="px-8 py-3 border-2 border-[#0f281f] text-[#0f281f] font-bold uppercase tracking-widest hover:bg-[#0f281f] hover:text-[#d4c5a3] transition-colors">
               探索社区
            </router-link>
         </div>

         <!-- List Items -->
         <transition-group name="list">
            <div 
               v-for="resource in (activeTab === 'liked' ? likedResources : favoritedResources)"
               :key="resource.id"
               class="group relative bg-white border border-[#0f281f]/10 p-6 rounded-sm hover:shadow-xl hover:border-[#0f281f]/30 transition-all cursor-pointer overflow-hidden"
               @click="handlePostClick(resource.id)"
            >
               <!-- Decorative Gold Line -->
               <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3] group-hover:bg-[#0f281f] transition-colors"></div>
               
               <!-- Background Watermark -->
               <FileText class="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-[#f4f1ea] opacity-0 group-hover:opacity-100 transition-opacity rotate-[-10deg] duration-500" />

               <div class="relative z-10 flex items-start gap-6">
                  <!-- Type Icon -->
                  <div class="flex-shrink-0 pt-1">
                     <div class="w-12 h-12 bg-[#f4f1ea] border border-[#0f281f]/10 flex items-center justify-center text-[#0f281f]">
                        <ScrollText class="w-6 h-6 opacity-60" />
                     </div>
                  </div>

                  <div class="flex-1 min-w-0">
                     <div class="flex items-start justify-between mb-2">
                        <h3 class="text-xl font-serif font-bold text-[#0f281f] group-hover:text-[#b49b67] transition-colors line-clamp-1 pr-4">
                           {{ resource.name }}
                        </h3>
                        <span class="text-xs font-mono text-[#0f281f]/40 whitespace-nowrap">{{ formatDate(resource.postDetails?.createdAt || '') }}</span>
                     </div>
                     
                     <div class="text-sm text-[#0f281f]/60 font-serif italic mb-4">
                        作者：{{ resource.provider }}
                     </div>

                     <!-- Tags -->
                     <div class="flex items-center gap-3">
                        <span 
                           class="px-2 py-0.5 border border-[#0f281f]/10 text-[#0f281f] text-[10px] font-bold uppercase tracking-widest"
                           :class="activeTab === 'liked' ? 'bg-[#dbeafe]/30 text-blue-800' : 'bg-[#fee2e2]/30 text-red-800'"
                        >
                           {{ activeTab === 'liked' ? '已点赞' : '已收藏' }}
                        </span>
                        
                        <div class="flex items-center gap-4 ml-auto text-xs font-mono text-[#0f281f]/40">
                           <span class="flex items-center gap-1"><Heart class="w-3 h-3" /> {{ resource.likeCount }}</span>
                           <span class="flex items-center gap-1"><Bookmark class="w-3 h-3" /> {{ resource.favoriteCount }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </transition-group>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { 
  ArrowLeft, ThumbsUp, Heart, Bookmark, FileText, ScrollText, Loader2
} from 'lucide-vue-next'

// Interfaces (Keep same as logic provided)
interface Post { id: string; title: string; content: string; author_name: string; created_at: string; view_count: number; like_count: number; comment_count: number; favorite_count: number; user?: { id: string; username: string; nickname: string } }
interface Resource { id: string; name: string; provider: string; duration: string; rating: number; url: string; matchPoints: string; type: string; postDetails?: any; likeCount?: number; favoriteCount?: number }
interface InteractionData { liked: boolean; saved: boolean; likesCount: number }

const router = useRouter()
const route = useRoute()
const activeTab = ref<'liked' | 'favorites'>((route.query.tab as 'liked' | 'favorites') || 'liked')
const likedResources = ref<(Resource & { interaction: InteractionData })[]>([])
const favoritedResources = ref<(Resource & { interaction: InteractionData })[]>([])
const isLoading = ref(true)

const getCurrentUserId = (): string | null => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return user.id?.toString() || null
    } catch (error) { console.error(error) }
  }
  return null
}

const formatDate = (dateString: string) => {
  if(!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Logic same as provided, just wrapping UI
const loadUserInteractions = async () => {
  try {
    isLoading.value = true
    const dbStore = useDatabaseStore()
    const userId = getCurrentUserId()
    
    if (!userId) {
      likedResources.value = []
      favoritedResources.value = []
      return
    }
    
    let client = await dbStore.getClient()
    if (!client) { await dbStore.reconnect(); client = await dbStore.getClient() }
    
    if (client) {
        // Load Liked
        const { data: likedPosts } = await client.from('post_likes').select(`post_id, created_at, posts:post_id (id, title, content, created_at, like_count, favorite_count, user:user_id(nickname, username))`).eq('user_id', userId).order('created_at', { ascending: false })
        
        likedResources.value = (likedPosts || []).map((item: any) => {
            const post = item.posts
            const author = post.user?.nickname || post.user?.username || 'Anonymous'
            return {
              id: post.id, name: post.title, provider: author, duration: 'Post', rating: post.like_count, url: `/post/${post.id}`, matchPoints: '', type: 'Manuscript',
              interaction: { liked: true, saved: false, likesCount: post.like_count },
              likeCount: post.like_count, favoriteCount: post.favorite_count,
              postDetails: { createdAt: post.created_at }
            }
        })

        // Load Favorites
        const { data: favPosts } = await client.from('post_favorites').select(`post_id, created_at, posts:post_id (id, title, content, created_at, like_count, favorite_count, user:user_id(nickname, username))`).eq('user_id', userId).order('created_at', { ascending: false })
        
        favoritedResources.value = (favPosts || []).map((item: any) => {
            const post = item.posts
            const author = post.user?.nickname || post.user?.username || 'Anonymous'
            return {
              id: post.id, name: post.title, provider: author, duration: 'Post', rating: post.favorite_count, url: `/post/${post.id}`, matchPoints: '', type: 'Manuscript',
              interaction: { liked: false, saved: true, likesCount: post.like_count },
              likeCount: post.like_count, favoriteCount: post.favorite_count,
              postDetails: { createdAt: post.created_at }
            }
        })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handlePostClick = (postId: string) => { router.push(`/post/${postId}`) }
const setActiveTab = (tab: 'liked' | 'favorites') => { activeTab.value = tab }
const goBack = () => { router.back() }

onMounted(() => { loadUserInteractions() })
</script>

<style scoped>
/* List Animation */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }

/* Spin */
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>