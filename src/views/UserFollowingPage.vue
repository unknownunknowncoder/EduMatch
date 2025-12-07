<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <img 
        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Following"
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
      <div class="absolute bottom-0 left-0 w-full p-8 z-10">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Following Records</h2>
          <h1 class="text-3xl font-serif font-bold text-white tracking-wide">{{ userInfo.nickname || userInfo.username }}'s Following</h1>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-6xl mx-auto px-6 mt-8 relative z-10 space-y-8 mb-24">
      
      <!-- 加载状态 -->
      <div v-if="loading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
        <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Loading following records...</p>
      </div>

      <!-- 隐私保护状态 -->
      <div v-else-if="privacySettings.hide_following" class="bg-white p-12 shadow-xl border-t-8 border-[#b03e3e] text-center">
        <Shield class="w-16 h-16 text-[#b03e3e]/20 mx-auto mb-4" />
        <h2 class="text-2xl font-serif font-bold text-[#b03e3e] mb-2">Private Content</h2>
        <p class="text-[#1a3c34]/60 mb-6">This scholar's following list is private.</p>
        <button @click="router.back()" class="px-6 py-2 border border-[#1a3c34] text-[#1a3c34] uppercase tracking-widest text-xs font-bold hover:bg-[#1a3c34] hover:text-white transition-colors">Return</button>
      </div>

      <!-- 正常内容 -->
      <div v-else>
         <!-- Following List -->
         <div class="bg-white shadow-xl border border-[#1a3c34]/10">
            <div class="p-6 border-b border-[#1a3c34]/10">
               <h3 class="text-lg font-serif font-bold text-[#1a3c34]">
                  Following <span class="text-[#d4c5a3]">{{ followingList.length }}</span> scholars
               </h3>
            </div>
            
            <div v-if="followingList.length === 0" class="text-center py-16">
               <UserX class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
               <p class="text-[#1a3c34]/60 font-serif">Not following any scholars yet.</p>
            </div>
            
            <div v-else class="divide-y divide-[#1a3c34]/10">
               <div 
                  v-for="user in followingList" 
                  :key="user.id"
                  class="p-6 flex items-center justify-between hover:bg-[#f9f9f7] transition-colors"
               >
                  <div class="flex items-center gap-4">
                     <!-- Avatar -->
                     <div class="w-12 h-12 bg-[#1a3c34] p-0.5 rounded-sm flex items-center justify-center">
                        <img 
                           v-if="user.avatar_url" 
                           :src="user.avatar_url" 
                           class="w-full h-full object-cover"
                           @error="handleImageError"
                        />
                        <div v-else class="text-[#d4c5a3] font-serif font-bold text-lg">
                           {{ user.nickname?.charAt(0) || user.username?.charAt(0)?.toUpperCase() }}
                        </div>
                     </div>
                     
                     <!-- Info -->
                     <div>
                        <h4 class="font-serif font-bold text-[#1a3c34]">{{ user.nickname || user.username }}</h4>
                        <p class="text-sm text-[#1a3c34]/60">@{{ user.username }}</p>
                        <p v-if="user.bio" class="text-xs text-[#1a3c34]/40 mt-1 line-clamp-1">{{ user.bio }}</p>
                     </div>
                  </div>
                  
                  <button 
                     @click="navigateToUserProfile(user.id)"
                     class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold uppercase tracking-widest hover:bg-[#1a3c34] hover:text-white transition-colors"
                  >
                     View Profile
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Shield, UserX } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// State
const userInfo = ref({ id: '', username: '', nickname: '', avatar_url: '', bio: '' })
const followingList = ref([])
const loading = ref(true)
const privacySettings = ref({
  hide_following: false,
  hide_followers: false,
  hide_posts: false,
  hide_resources: false
})

// Methods
const fetchUserInfo = async () => {
  try {
    const userId = route.params.userId as string
    const { useDatabaseStore } = await import('@/stores/database')
    const dbStore = useDatabaseStore()
    
    const user = await dbStore.getUserById(userId)
    if (!user) {
      router.back()
      return
    }

    userInfo.value = { ...user }
    await Promise.all([fetchFollowingList(), fetchPrivacySettings()])
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.back()
  } finally {
    loading.value = false
  }
}

const fetchFollowingList = async () => {
  try {
    const { supabaseService } = await import('@/services/supabase')
    const client = supabaseService.getClient()
    
    const { data } = await client
      .from('user_follows')
      .select(`
        following_id,
        users!user_follows_following_id_fkey (
          id, username, nickname, avatar_url, bio
        )
      `)
      .eq('follower_id', userInfo.value.id)
    
    if (data) {
      followingList.value = data.map(item => item.users).filter(Boolean)
    }
  } catch (error) {
    console.error('获取关注列表失败:', error)
  }
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
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

const navigateToUserProfile = (userId: string) => {
  router.push({ 
    path: `/user/${userId}`, 
    state: { from: 'user-following' } 
  });
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchUserInfo()
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>