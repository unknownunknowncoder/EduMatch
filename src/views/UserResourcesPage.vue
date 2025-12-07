<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner -->
    <div class="h-48 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 背景图片 -->
      <img 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Resources Archive"
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
          <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Resource Archive</h2>
          <h1 class="text-3xl font-serif font-bold text-white tracking-wide">
            {{ userInfo.username }}'s Collection
          </h1>
          <p v-if="!privacyCheckPassed" class="text-white/60 text-sm mt-2 flex items-center gap-2">
            <Lock class="w-4 h-4" />
            This collection is private
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-6xl mx-auto px-6 mt-8">
      
      <!-- 加载状态 -->
      <div v-if="loading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Accessing resource archive...</p>
      </div>

      <!-- 隐私保护状态 -->
      <div v-else-if="!privacyCheckPassed" class="bg-white p-16 shadow-xl border-t-8 border-[#d4c5a3] text-center">
         <Lock class="w-16 h-16 text-[#d4c5a3]/20 mx-auto mb-4" />
         <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-2">Private Collection</h2>
         <p class="text-[#1a3c34]/60 mb-6">This scholar has chosen to keep their resource collection private.</p>
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
                     <FolderOpen class="w-6 h-6 text-[#1a3c34]" />
                  </div>
                  <div>
                     <h3 class="text-xl font-serif font-bold text-[#1a3c34]">
                        {{ userInfo.nickname || userInfo.username }}'s Resources
                     </h3>
                     <p class="text-sm text-[#1a3c34]/60">
                        {{ totalResources }} items in collection • Joined {{ formatDate(userInfo.created_at) }}
                     </p>
                  </div>
               </div>
               <div class="text-right">
                  <div class="text-2xl font-serif font-bold text-[#d4c5a3]">{{ totalResources }}</div>
                  <div class="text-xs font-bold text-[#1a3c34]/40 uppercase tracking-widest">Total Resources</div>
               </div>
            </div>
         </div>

         <!-- 空状态 -->
         <div v-if="resourcesList.length === 0" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10 rounded-sm bg-white/50">
            <FileX class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
            <p class="text-[#1a3c34]/60 font-serif text-lg">No resources cataloged yet.</p>
            <p class="text-[#1a3c34]/40 text-sm mt-2">This scholar hasn't added any resources to their collection.</p>
         </div>

         <!-- 资源列表 -->
         <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
               v-for="(resource, index) in resourcesList"
               :key="resource.id"
               class="bg-white shadow-lg border border-[#1a3c34]/10 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
               @click="navigateToResource(resource.id)"
            >
               <!-- 资源头部 -->
               <div class="p-6 border-b border-[#1a3c34]/5">
                  <div class="flex items-start justify-between mb-3">
                     <span class="text-xs font-mono text-[#d4c5a3] bg-[#f2f0e9] px-2 py-1">
                        #{{ (currentPage - 1) * pageSize + index + 1 }}
                     </span>
                     <span class="text-xs font-bold text-[#1a3c34]/40 bg-[#f9f9f7] px-2 py-1">
                        {{ resource.type || 'General' }}
                     </span>
                  </div>
                  <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-2 group-hover:text-[#b49b67] transition-colors">
                     {{ resource.title || resource.name }}
                  </h3>
                  <p class="text-sm text-[#1a3c34]/60 font-serif line-clamp-2">
                     {{ resource.description || resource.matchPoints }}
                  </p>
               </div>

               <!-- 资源详情 -->
               <div class="p-4 bg-[#f9f9f7] border-t border-[#1a3c34]/5">
                  <div class="flex items-center justify-between text-xs">
                     <div class="flex items-center gap-2 text-[#1a3c34]/40">
                        <Clock class="w-3 h-3" />
                        <span>{{ resource.duration || 'N/A' }}</span>
                     </div>
                     <div class="flex items-center gap-2 text-[#1a3c34]/40">
                        <Star class="w-3 h-3" />
                        <span>{{ resource.rating || 0 }}/5</span>
                     </div>
                  </div>
                  <div class="mt-2 pt-2 border-t border-[#1a3c34]/5">
                     <div class="text-xs text-[#1a3c34]/40">Provider</div>
                     <div class="text-sm font-mono text-[#1a3c34]/60">
                        {{ resource.provider || 'Unknown' }}
                     </div>
                  </div>
               </div>

               <!-- 悬停状态指示器 -->
               <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight class="w-5 h-5 text-[#d4c5a3]" />
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
  ArrowLeft, Lock, FolderOpen, FileX, Clock, Star, ArrowRight
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

// State
const userInfo = ref({ id: '', username: '', nickname: '', created_at: '' })
const resourcesList = ref([])
const totalResources = ref(0)
const loading = ref(true)
const privacyCheckPassed = ref(true)
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)

// Computed
const targetUserId = computed(() => route.params.userId as string)

// Methods
const formatDate = (str: string) => {
  if(!str) return 'N/A'
  return new Date(str).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const checkUserPrivacy = async (userId: string) => {
  try {
    // 如果是查看自己的资源，总是允许
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
    
    // 如果设置了hide_resources，则不允许查看
    if (data?.hide_resources) {
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

const loadResourcesList = async () => {
  try {
    if (!privacyCheckPassed.value) return

    loading.value = true
    const resources = await dbStore.getUserResources(targetUserId.value)
    
    // 处理数据格式
    const processedResources = (resources || []).map((resource: any) => ({
      id: resource.id,
      title: resource.title,
      name: resource.name,
      description: resource.description,
      matchPoints: resource.description,
      provider: resource.provider,
      type: resource.type,
      duration: resource.duration,
      rating: resource.rating || 0,
      url: resource.url,
      contentOutline: []
    }))

    // 分页处理
    totalResources.value = processedResources.length
    totalPages.value = Math.ceil(totalResources.value / pageSize.value)
    
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    resourcesList.value = processedResources.slice(startIndex, endIndex)

  } catch (error) {
    console.error('加载资源列表失败:', error)
  } finally {
    loading.value = false
  }
}

const navigateToResource = (id: string) => {
  router.push(`/resource/${id}`)
}

const goBack = () => {
  router.back()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadResourcesList()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadResourcesList()
  }
}

onMounted(async () => {
  await Promise.all([
    loadUserInfo(),
    checkUserPrivacy(targetUserId.value)
  ])
  await loadResourcesList()
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>