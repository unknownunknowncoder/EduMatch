<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#1a3c34] selection:text-[#d4c5a3] pb-20">
    
    <!-- 1. Top Banner (The Registry Book) -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <img 
        src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Registry Book"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Return to Profile
        </button>
      </div>

      <!-- Title -->
      <div class="absolute bottom-0 left-0 w-full p-8 z-10">
        <div class="max-w-4xl mx-auto">
           <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Subscriber Log</h2>
           <h1 class="text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md">
              My Followers
           </h1>
           <p class="text-white/60 font-serif italic mt-2">Total Subscribers: {{ totalCount }}</p>
        </div>
      </div>
    </div>

    <!-- 2. Main List Container -->
    <div class="max-w-4xl mx-auto px-6 mt-8 relative z-10 space-y-8 mb-24">
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Opening registry...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="followersList.length === 0" class="bg-white p-16 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <ScrollText class="w-16 h-16 text-[#1a3c34]/20 mx-auto mb-6" />
         <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-2">Registry Empty</h2>
         <p class="text-[#1a3c34]/60 font-serif italic mb-8">Your work has not yet attracted subscribers.</p>
         <button 
            @click="$router.push('/community')"
            class="px-8 py-3 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-colors shadow-lg"
         >
            Publish to Community
         </button>
      </div>

      <!-- 粉丝列表 (Registry Entries) -->
      <div v-else class="space-y-4">
        <div 
          v-for="item in followersList" 
          :key="item.id"
          class="group bg-white p-6 shadow-md border-l-4 border-[#1a3c34] hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
        >
          <!-- 背景装饰 -->
          <User class="absolute -right-6 -bottom-6 w-32 h-32 text-[#1a3c34]/5 -z-0 pointer-events-none rotate-12" />

          <div class="relative z-10 flex items-center justify-between gap-6">
             
             <!-- 用户信息 -->
             <div class="flex items-center gap-6 flex-1 min-w-0">
                <!-- 头像 -->
                <div class="w-16 h-16 bg-[#1a3c34] p-0.5 rounded-sm shadow-sm flex-shrink-0 cursor-pointer group/avatar" @click="goToUserProfile(item.user.id)">
                   <div class="w-full h-full bg-[#f2f0e9] flex items-center justify-center text-[#1a3c34] font-serif font-bold text-2xl group-hover/avatar:bg-white transition-colors">
                      {{ (item.user.nickname || item.user.username || '?').charAt(0).toUpperCase() }}
                   </div>
                </div>
                
                <div class="min-w-0">
                   <h3 class="text-xl font-serif font-bold text-[#1a3c34] truncate hover:underline cursor-pointer" @click="goToUserProfile(item.user.id)">
                      {{ item.user.nickname || item.user.username }}
                   </h3>
                   <p class="text-xs font-mono text-[#1a3c34]/40 uppercase tracking-widest mt-1">
                      Subscribed {{ formatDate(item.created_at) }}
                   </p>
                </div>
             </div>

             <!-- 操作按钮 -->
             <div class="flex items-center gap-3 flex-shrink-0">
                <!-- 关注/回关/取消 -->
                <button 
                   @click="isFollowingMap[item.user.id] ? unfollowUser(item.user.id) : followUser(item.user.id)"
                   class="px-6 py-2 border transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                   :class="isFollowingMap[item.user.id] 
                      ? 'border-[#1a3c34]/20 text-[#1a3c34]/60 hover:border-[#b03e3e] hover:text-[#b03e3e] bg-white' 
                      : 'bg-[#1a3c34] text-[#d4c5a3] hover:bg-[#235246] border-transparent shadow-md'"
                >
                   <component :is="isFollowingMap[item.user.id] ? UserCheck : UserPlus" class="w-3 h-3" />
                   {{ isFollowingMap[item.user.id] ? 'Connected' : 'Connect Back' }}
                </button>
                
                <!-- 查看主页 -->
                <button 
                   @click="viewUserPosts(item.user.id)"
                   class="p-2 text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#f2f0e9] rounded-sm transition-colors"
                   title="View Dossier"
                >
                   <Eye class="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-4 pt-8 border-t border-[#1a3c34]/10">
         <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">Previous</button>
         <span class="px-4 py-2 font-mono text-[#1a3c34]">{{ currentPage }} / {{ totalPages }}</span>
         <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">Next</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { showToast } from '@/utils/message'
import { ArrowLeft, ScrollText, User, UserPlus, UserCheck, Eye } from 'lucide-vue-next'

const router = useRouter()

const isLoading = ref(true)
const followersList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const totalPages = ref(0)
const isFollowingMap = ref<Record<string, boolean>>({})

// 获取当前登录用户ID
const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('currentUser') || '{}')
    return u.id || ''
  } catch (e) { return '' }
}

const loadFollowersList = async () => {
  try {
    isLoading.value = true
    const currentUserId = getCurrentUserId()
    if (!currentUserId) {
      router.push('/login')
      return
    }

    const data = await supabaseService.getFollowersList(currentUserId, {
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    })
    followersList.value = data

    // Check follow status (for Follow Back)
    const followStatusMap: Record<string, boolean> = {}
    for (const follower of data) {
      const followingId = follower.user.id.toString()
      followStatusMap[follower.user.id] = await supabaseService.isFollowing(currentUserId, followingId)
    }
    isFollowingMap.value = followStatusMap

    // Pagination
    totalCount.value = data.length + ((currentPage.value - 1) * pageSize.value)
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)

  } catch (error) { 
    console.error(error)
    showToast('Failed to load registry.', 'error')
  } finally { 
    isLoading.value = false 
  }
}

const followUser = async (fid: string) => {
  try {
    const uid = getCurrentUserId()
    if (!uid) return
    await supabaseService.followUser(uid, fid)
    isFollowingMap.value[fid] = true
    showToast('Connection established.', 'success')
  } catch (e) { showToast('Action failed.', 'error') }
}

const unfollowUser = async (fid: string) => {
  try {
    const uid = getCurrentUserId()
    if (!uid) return
    await supabaseService.unfollowUser(uid, fid)
    isFollowingMap.value[fid] = false
    showToast('Connection severed.', 'success')
  } catch (e) { showToast('Action failed.', 'error') }
}

const goToUserProfile = (uid: string) => router.push(`/user/${uid}`)
const viewUserPosts = (uid: string) => router.push(`/user/${uid}`)
const goBack = () => router.push('/profile')

const formatDate = (str: string) => new Date(str).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; loadFollowersList(); } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; loadFollowersList(); } }

onMounted(() => { loadFollowersList() })
</script>

<style scoped>
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>