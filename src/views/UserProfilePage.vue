<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner (The Hall) -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 图片：学院走廊/档案室 -->
      <img 
        src="https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Academic Hall"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="goBack()"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Return
        </button>
      </div>

      <!-- Title -->
      <div class="absolute bottom-24 left-0 w-full px-8 z-10">
        <div class="max-w-6xl mx-auto flex items-end justify-between">
           <div>
              <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Public Registry</h2>
              <h1 class="text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md">Scholar Profile</h1>
           </div>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-6xl mx-auto px-6 -mt-20 relative z-10 space-y-12">
      
      <!-- 加载/错误状态 -->
      <div v-if="loading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Retrieving dossier...</p>
      </div>

      <div v-else-if="error" class="bg-white p-12 shadow-xl border-t-8 border-[#b03e3e] text-center">
         <UserX class="w-16 h-16 text-[#b03e3e]/20 mx-auto mb-4" />
         <h2 class="text-2xl font-serif font-bold text-[#b03e3e] mb-2">Record Not Found</h2>
         <p class="text-[#1a3c34]/60 mb-6">{{ error }}</p>
         <button @click="goBack()" class="px-6 py-2 border border-[#1a3c34] text-[#1a3c34] uppercase tracking-widest text-xs font-bold hover:bg-[#1a3c34] hover:text-white transition-colors">Return</button>
      </div>

      <!-- 正常内容 -->
      <div v-else>
         
         <!-- === A. 学者档案卡 (The Scholar Card) === -->
         <div class="bg-white shadow-2xl border border-[#1a3c34]/10 relative overflow-hidden flex flex-col md:flex-row">
            <!-- 左侧装饰 -->
            <div class="w-full md:w-3 bg-[#1a3c34] flex flex-col items-center justify-center gap-1 py-2">
               <div class="w-1 h-1 bg-[#d4c5a3] rounded-full"></div>
               <div class="w-1 h-1 bg-[#d4c5a3] rounded-full"></div>
               <div class="w-1 h-1 bg-[#d4c5a3] rounded-full"></div>
            </div>

            <div class="p-8 md:p-10 flex-1">
               <div class="flex flex-col md:flex-row gap-10">
                  
                  <!-- 头像与身份 -->
                  <div class="flex-shrink-0 text-center md:text-left">
                     <div class="w-32 h-32 bg-[#f2f0e9] p-1 border-2 border-[#1a3c34]/20 shadow-md inline-block relative group">
                        <img 
                           v-if="userInfo.avatar_url" 
                           :src="userInfo.avatar_url" 
                           class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" 
                           @error="handleImageError"
                        />
                        <div v-else class="w-full h-full bg-[#1a3c34] flex items-center justify-center text-[#d4c5a3] font-serif font-bold text-5xl">
                           {{ userInfo.username.charAt(0).toUpperCase() }}
                        </div>
                        <!-- 装饰角标 -->
                        <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#d4c5a3] border border-white"></div>
                        <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-[#1a3c34] border border-white"></div>
                     </div>
                     <div class="mt-4">
                        <h1 class="text-2xl font-serif font-bold text-[#1a3c34]">{{ userInfo.nickname || userInfo.username }}</h1>
                        <p class="text-xs font-mono text-[#1a3c34]/50 mt-1 uppercase tracking-wider">@{{ userInfo.username }}</p>
                        <div class="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#1a3c34]/5 text-[#1a3c34] text-[10px] font-bold uppercase tracking-widest border border-[#1a3c34]/10">
                           <Award class="w-3 h-3" /> Scholar
                        </div>
                     </div>
                  </div>

                  <!-- 详细信息与统计 -->
                  <div class="flex-1 flex flex-col justify-between">
                     
                     <!-- 签名 -->
                     <div class="mb-8 relative pl-6 border-l-2 border-[#d4c5a3]">
                        <p class="text-[#1a3c34]/80 font-serif italic text-lg leading-relaxed">
                           "{{ userInfo.bio || 'No personal statement recorded in the archive.' }}"
                        </p>
                        <p class="text-[10px] text-[#1a3c34]/40 mt-3 font-mono uppercase tracking-widest">
                           Member since {{ formatDate(userInfo.created_at) }}
                        </p>
                     </div>

                     <!-- 数据统计 (Data Strip) -->
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a3c34]/10 border border-[#1a3c34]/10 mb-6">
                        <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                           <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ stats.resourceCount }}</div>
                           <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">Resources</div>
                        </div>
                        <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                           <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ stats.postCount }}</div>
                           <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">Manuscripts</div>
                        </div>
                        <div 
                           @click="!privacySettings.hide_followers && goToFollowers()" 
                           class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors"
                           :class="{ 'cursor-not-allowed opacity-50': privacySettings.hide_followers, 'cursor-pointer': !privacySettings.hide_followers }"
                        >
                           <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">
                              {{ privacySettings.hide_followers ? '---' : followStats.followers_count }}
                           </div>
                           <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">
                              {{ privacySettings.hide_followers ? 'Private' : 'Followers' }}
                           </div>
                        </div>
                        <div 
                           @click="!privacySettings.hide_following && goToFollowing()" 
                           class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors"
                           :class="{ 'cursor-not-allowed opacity-50': privacySettings.hide_following, 'cursor-pointer': !privacySettings.hide_following }"
                        >
                           <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">
                              {{ privacySettings.hide_following ? '---' : followStats.followings_count }}
                           </div>
                           <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">
                              {{ privacySettings.hide_following ? 'Private' : 'Following' }}
                           </div>
                        </div>
                     </div>

                     <!-- 操作按钮 -->
                     <div class="flex gap-4">
                        <button
                           v-if="isCurrentUser"
                           @click="router.push('/profile')"
                           class="flex-1 py-3 border border-[#1a3c34] text-[#1a3c34] font-bold uppercase tracking-widest text-xs hover:bg-[#1a3c34] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                           <Settings class="w-4 h-4" /> Edit Dossier
                        </button>
                        <button
                           v-else
                           @click="toggleFollow"
                           :disabled="followLoading"
                           class="flex-1 py-3 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                           :class="isFollowing 
                              ? 'bg-white border border-[#1a3c34]/20 text-[#1a3c34]/60 hover:border-[#b03e3e] hover:text-[#b03e3e]' 
                              : 'bg-[#1a3c34] text-[#d4c5a3] hover:bg-[#235246] hover:shadow-lg'"
                        >
                           <span v-if="followLoading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                           <component v-else :is="isFollowing ? UserCheck : UserPlus" class="w-4 h-4" />
                           {{ isFollowing ? 'Connected' : 'Connect' }}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- === B. 内容档案柜 (The Content Cabinet) === -->
         <div class="mt-12">
            <!-- Tabs (Folder Tabs) -->
            <div class="flex border-b border-[#1a3c34]/20 mb-8">
               <button
                  @click="activeTab = 'resources'"
                  class="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all relative top-[1px]"
                  :class="activeTab === 'resources' 
                     ? 'border-t-2 border-x border-[#1a3c34]/20 border-b-white bg-white text-[#1a3c34]' 
                     : 'text-[#1a3c34]/40 hover:text-[#1a3c34] bg-[#f9f9f7] border border-transparent'"
               >
                  <span class="flex items-center gap-2"><FolderOpen class="w-4 h-4" /> Resources</span>
               </button>
               <button
                  @click="activeTab = 'posts'"
                  class="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all relative top-[1px]"
                  :class="activeTab === 'posts' 
                     ? 'border-t-2 border-x border-[#1a3c34]/20 border-b-white bg-white text-[#1a3c34]' 
                     : 'text-[#1a3c34]/40 hover:text-[#1a3c34] bg-[#f9f9f7] border border-transparent'"
               >
                  <span class="flex items-center gap-2"><PenTool class="w-4 h-4" /> Manuscripts</span>
               </button>
            </div>

            <!-- 1. Resources Tab -->
            <div v-if="activeTab === 'resources'" class="min-h-[300px]">
               <div v-if="loading" class="text-center py-12 text-[#1a3c34]/40 font-serif italic">Accessing archives...</div>
               <div v-else-if="privacySettings.hide_resources" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
                  <Shield class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
                  <p class="text-[#1a3c34]/60 font-serif">This scholar's resource library is private.</p>
               </div>
               <div v-else-if="userResources.length === 0" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
                  <FileX class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
                  <p class="text-[#1a3c34]/60 font-serif">No resources cataloged by this scholar.</p>
               </div>
               <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ResourceCard
                     v-for="(resource, index) in userResources"
                     :key="resource.id"
                     :resource="resource"
                     :rank="index + 1"
                     @click="navigateToResource(resource.id)"
                  />
               </div>
            </div>

            <!-- 2. Posts Tab -->
            <div v-else class="min-h-[300px]">
               <div v-if="loading" class="text-center py-12 text-[#1a3c34]/40 font-serif italic">Retrieving manuscripts...</div>
               <div v-else-if="privacySettings.hide_posts" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
                  <Shield class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
                  <p class="text-[#1a3c34]/60 font-serif">This scholar's manuscripts are private.</p>
               </div>
               <div v-else-if="userPosts.length === 0" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
                  <Feather class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
                  <p class="text-[#1a3c34]/60 font-serif">No manuscripts published.</p>
               </div>
               <div v-else class="space-y-4">
                  <div 
                     v-for="post in userPosts"
                     :key="post.id"
                     class="group bg-white p-6 border-l-4 border-[#d4c5a3] hover:border-[#1a3c34] shadow-sm hover:shadow-md transition-all cursor-pointer"
                     @click="navigateToPost(post.id)"
                  >
                     <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#b49b67] transition-colors">{{ post.title }}</h3>
                        <span class="text-[10px] font-mono text-[#1a3c34]/40 bg-[#f9f9f7] px-2 py-1">{{ formatDate(post.created_at) }}</span>
                     </div>
                     <p class="text-[#1a3c34]/60 text-sm font-serif line-clamp-2 mb-4">{{ post.content }}</p>
                     
                     <div class="flex items-center justify-between border-t border-[#1a3c34]/5 pt-3">
                        <span class="text-xs font-bold uppercase tracking-wider text-[#1a3c34]/50">{{ post.category || 'General' }}</span>
                        <div class="flex gap-4 text-xs font-mono text-[#1a3c34]/40">
                           <span class="flex items-center gap-1"><Heart class="w-3 h-3"/> {{ post.likes_count || 0 }}</span>
                           <span class="flex items-center gap-1"><MessageSquare class="w-3 h-3"/> {{ post.comments_count || 0 }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import ResourceCard from '@/components/ResourceCard.vue'
import { showToast } from '@/utils/message'
import { 
  ArrowLeft, User, UserX, BookOpen, MessageSquare, Heart, 
  MessageCircle, FolderOpen, PenTool, UserPlus, UserCheck,
  Settings, Mail, Award, FileX, Feather, Shield
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

// State
const userInfo = ref({ id: '', username: '', nickname: '', email: '', avatar_url: '', bio: '', created_at: '' })
const stats = ref({ resourceCount: 0, postCount: 0 })
const followStats = ref({ followers_count: 0, followings_count: 0 })
const userResources = ref([])
const userPosts = ref([])
const loading = ref(true)
const error = ref('')
const activeTab = ref('resources')
const isFollowing = ref(false)
const followLoading = ref(false)
const privacySettings = ref({
  hide_following: false,
  hide_followers: false,
  hide_posts: false,
  hide_resources: false
})

// Computed
const isCurrentUser = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  return currentUser.id === userInfo.value.id
})

// Methods
const formatDate = (str: string) => {
  if(!str) return 'N/A'
  return new Date(str).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const fetchUserInfo = async () => {
  try {
    const userId = route.params.userId as string
    const user = await dbStore.getUserById(userId)
    if (!user) { error.value = 'Scholar not found in archive.'; return; }

    userInfo.value = { ...user, bio: user.bio || '' }
    await Promise.all([fetchUserStats(), fetchUserContent(), fetchPrivacySettings()])
    if (!isCurrentUser.value) await checkFollowStatus()
  } catch (err) { error.value = 'Failed to retrieve dossier.'; } 
  finally { loading.value = false }
}

const fetchUserStats = async () => {
  try {
    const [rCount, pCount] = await Promise.all([
      dbStore.getUserResourceCount(userInfo.value.id),
      dbStore.getUserPostCount(userInfo.value.id)
    ])
    stats.value = { resourceCount: rCount || 0, postCount: pCount || 0 }
    
    const { supabaseService } = await import('@/services/supabase')
    followStats.value = await supabaseService.getFollowStats(userInfo.value.id)
  } catch (e) { console.error(e) }
}

const fetchPrivacySettings = async () => {
  try {
    const { supabaseService } = await import('@/services/supabase')
    const client = supabaseService.getClient()
    const { data } = await client.from('user_privacy_settings').select('*').eq('user_id', userInfo.value.id).single()
    
    if (data) {
      privacySettings.value = {
        hide_following: data.hide_following,
        hide_followers: data.hide_followers,
        hide_posts: data.hide_posts,
        hide_resources: data.hide_resources
      }
    }
  } catch (e) { 
    console.error('获取隐私设置失败:', e)
    // 如果没有找到记录，使用默认值
  }
}

const fetchUserContent = async () => {
  try {
    const [res, posts] = await Promise.all([
      dbStore.getUserResources(userInfo.value.id),
      dbStore.getUserPosts(userInfo.value.id)
    ])
    userResources.value = (res || []).map((r:any) => ({
       // Map to ResourceCard format
       id: r.id, name: r.title, title: r.title, provider: r.provider, type: r.type, 
       matchPoints: r.description, description: r.description, 
       duration: r.duration, rating: r.rating || 0, url: r.url,
       contentOutline: [] 
    }))
    
    // Process posts to include counts if needed (simplified here)
    userPosts.value = posts || []
  } catch (e) { console.error(e) }
}

const checkFollowStatus = async () => {
  try {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) return
    const currentUser = JSON.parse(currentUserStr)
    const { supabaseService } = await import('@/services/supabase')
    isFollowing.value = await supabaseService.isFollowing(currentUser.id.toString(), userInfo.value.id.toString())
  } catch (e) { isFollowing.value = false }
}

const toggleFollow = async () => {
  const currentUserStr = localStorage.getItem('currentUser')
  if (!currentUserStr) { router.push('/login'); return }
  const currentUser = JSON.parse(currentUserStr)
  
  followLoading.value = true
  try {
    const { supabaseService } = await import('@/services/supabase')
    const fid = currentUser.id.toString()
    const tid = userInfo.value.id.toString()
    
    if (isFollowing.value) {
      await supabaseService.unfollowUser(fid, tid)
      isFollowing.value = false
      followStats.value.followers_count--
    } else {
      await supabaseService.followUser(fid, tid)
      isFollowing.value = true
      followStats.value.followers_count++
    }
    showToast(isFollowing.value ? 'Connection established.' : 'Connection severed.', 'success')
  } catch (e) { showToast('Action failed.', 'error') }
  finally { followLoading.value = false }
}

const goBack = () => {
  // 如果是从关注/粉丝页面来的，直接返回社区页面，避免循环
  if (router.options.history.state?.from === 'user-following' || router.options.history.state?.from === 'user-followers') {
    router.push('/community');
  } else {
    router.back();
  }
};

const navigateToResource = (id: string) => router.push(`/resource/${id}`)
const navigateToPost = (id: string) => router.push(`/post/${id}`)
const goToFollowers = () => router.push(`/user/${userInfo.value.id}/followers`)
const goToFollowing = () => router.push(`/user/${userInfo.value.id}/following`)

onMounted(() => { fetchUserInfo() })
watch(() => route.params.userId, () => { loading.value = true; fetchUserInfo() })
</script>

<style scoped>
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

