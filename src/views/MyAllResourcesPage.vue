<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3] pb-20">
    
    <!-- 顶部导航 (Sticky) -->
    <div class="sticky top-0 z-30 bg-[#f4f1ea]/90 backdrop-blur-sm border-b border-[#0f281f]/5 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <button 
          @click="goBack"
          class="group flex items-center text-[#0f281f]/60 hover:text-[#0f281f] transition-colors font-serif italic"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </button>
        
        <div class="text-xs font-bold text-[#0f281f]/30 uppercase tracking-widest hidden md:block">
           Personal Archive Registry
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 mt-8">
       <!-- Header Section -->
       <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b-2 border-[#0f281f] pb-6">
          <div class="space-y-2">
             <div class="flex items-center gap-3">
                <FolderOpen class="w-8 h-8 text-[#0f281f]" />
                <h1 class="text-4xl font-serif font-bold text-[#0f281f]">My Contributions</h1>
             </div>
             <p class="text-[#0f281f]/60 font-serif italic pl-11">
                Registry of all knowledge artifacts you've archived.
             </p>
          </div>
          
          <button 
             @click="navigateToCreateResource"
             class="px-6 py-3 bg-[#0f281f] text-[#d4c5a3] rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a4533] hover:shadow-lg transition-all flex items-center gap-2 group"
          >
             <Plus class="w-4 h-4 group-hover:rotate-90 transition-transform" />
             New Entry
          </button>
       </div>

       <!-- Loading State -->
       <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-6">
          <div class="w-16 h-16 border-4 border-[#d4c5a3] border-t-[#0f281f] rounded-full animate-spin"></div>
          <p class="text-[#0f281f] font-serif tracking-widest uppercase">Retrieving Records...</p>
       </div>

       <!-- Empty State -->
       <div v-else-if="myResources.length === 0" class="text-center py-24 border-2 border-dashed border-[#0f281f]/10 rounded-sm bg-white/50">
          <div class="w-24 h-24 bg-[#0f281f]/5 rounded-full flex items-center justify-center mx-auto mb-6">
             <FileX class="w-10 h-10 text-[#0f281f]/30" />
          </div>
          <h3 class="text-2xl font-serif font-bold text-[#0f281f] mb-2">No Records Found</h3>
          <p class="text-[#0f281f]/60 max-w-md mx-auto mb-8 font-serif">
             Your personal archive is currently empty. Begin by cataloging your first resource.
          </p>
          <button 
             @click="navigateToCreateResource"
             class="px-8 py-3 border-2 border-[#0f281f] text-[#0f281f] font-bold uppercase tracking-widest hover:bg-[#0f281f] hover:text-[#d4c5a3] transition-colors"
          >
             Initialize Archive
          </button>
       </div>

       <!-- Resource List -->
       <div v-else class="grid gap-6">
          <div 
             v-for="resource in myResources"
             :key="resource.id"
             class="group relative bg-white border border-[#0f281f]/10 hover:border-[#0f281f]/30 rounded-sm p-6 transition-all hover:shadow-xl cursor-pointer overflow-hidden"
             @click="navigateToResource(resource.id)"
          >
             <!-- 左侧装饰条 -->
             <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3] group-hover:bg-[#0f281f] transition-colors"></div>
             
             <div class="flex flex-col md:flex-row gap-6">
                <!-- Icon / Type -->
                <div class="flex-shrink-0">
                   <div class="w-16 h-16 bg-[#f4f1ea] flex items-center justify-center border border-[#0f281f]/10 text-[#0f281f]">
                      <component :is="getTypeIcon(resource.type)" class="w-8 h-8 opacity-70" />
                   </div>
                   <div class="mt-2 text-center">
                      <span class="inline-block px-2 py-0.5 bg-[#0f281f]/5 text-[#0f281f] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                         {{ resource.type }}
                      </span>
                   </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                   <div class="flex items-start justify-between gap-4 mb-2">
                      <h3 class="text-xl font-serif font-bold text-[#0f281f] group-hover:text-[#b49b67] transition-colors truncate pr-4">
                         {{ resource.title }}
                      </h3>
                      
                      <!-- Actions -->
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            @click.stop="navigateToResource(resource.id)"
                            class="p-2 text-[#0f281f]/40 hover:text-[#0f281f] hover:bg-[#f4f1ea] rounded-sm transition-colors"
                            title="View Details"
                         >
                            <Eye class="w-4 h-4" />
                         </button>
                         <button 
                            @click.stop="showDeleteConfirm(resource)"
                            class="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                            title="Delete Record"
                         >
                            <Trash2 class="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <p class="text-[#0f281f]/60 text-sm line-clamp-2 mb-4 font-serif">
                      {{ resource.description || 'No description provided.' }}
                   </p>

                   <!-- Meta Data -->
                   <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-[#0f281f]/50 border-t border-[#0f281f]/5 pt-3 mt-auto">
                      <span class="flex items-center gap-1">
                         <Calendar class="w-3 h-3" />
                         {{ formatDate(resource.created_at) }}
                      </span>
                      <span v-if="resource.difficulty" class="flex items-center gap-1">
                         <BarChart3 class="w-3 h-3" />
                         {{ resource.difficulty }}
                      </span>
                      <span v-if="resource.duration" class="flex items-center gap-1">
                         <Clock class="w-3 h-3" />
                         {{ resource.duration }}
                      </span>
                      <span v-if="resource.provider" class="flex items-center gap-1">
                         <User class="w-3 h-3" />
                         {{ resource.provider }}
                      </span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Delete Dialog -->
    <CascadeDeleteDialog
      ref="cascadeDeleteDialog"
      title="Confirm Deletion"
      :message="`Permanently remove '${selectedResource?.title}' from the archive?`"
      :relatedPosts="relatedPosts"
      @confirm="handleCascadeDelete"
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import CascadeDeleteDialog from '@/components/CascadeDeleteDialog.vue'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import { 
  ArrowLeft, FolderOpen, Plus, FileX, Eye, Trash2, 
  Calendar, BarChart3, Clock, User, 
  Video, FileText, Book, MonitorPlay, Wrench, Box
} from 'lucide-vue-next'

interface MyResource {
  id: string
  title: string
  description: string
  type: string
  category?: string
  difficulty?: string
  duration?: string
  provider?: string
  url?: string
  views?: number
  likes?: number
  created_at: string
}

const router = useRouter()
const myResources = ref<MyResource[]>([])
const isLoading = ref(false)
const selectedResource = ref<MyResource | null>(null)
const relatedPosts = ref<any[]>([])
const cascadeDeleteDialog = ref<InstanceType<typeof CascadeDeleteDialog>>()

const goBack = () => {
  router.push('/profile')
}

const navigateToResource = (resourceId: string) => {
  router.push(`/resource/${resourceId}`)
}

const navigateToCreateResource = () => {
  router.push('/create-resource')
}

// 根据类型获取图标
const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    video: Video,
    article: FileText,
    book: Book,
    course: MonitorPlay,
    tool: Wrench,
    other: Box
  }
  return icons[type] || Box
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const showDeleteConfirm = async (resource: MyResource) => {
  selectedResource.value = resource
  
  try {
    const client = supabaseService.getClient()
    const { data: posts, error } = await client
      .from('community_posts')
      .select('id, title')
      .eq('resource_id', resource.id)
    
    if (error) {
      console.error('Check related posts failed:', error)
      relatedPosts.value = []
    } else {
      relatedPosts.value = posts || []
    }
  } catch (error) {
    console.error('Check related posts exception:', error)
    relatedPosts.value = []
  }
  
  cascadeDeleteDialog.value?.show()
}

const hideDeleteConfirm = () => {
  selectedResource.value = null
}

const handleCascadeDelete = async (option: string) => {
  if (!selectedResource.value) return
  
  const resourceTitle = selectedResource.value.title
  const resourceId = selectedResource.value.id
  
  try {
    const client = supabaseService.getClient()
    
    if (option === 'cascade') {
      if (relatedPosts.value.length > 0) {
        const { error: postsDeleteError } = await client
          .from('community_posts')
          .delete()
          .eq('resource_id', resourceId)
        
        if (postsDeleteError) {
          showToast('Failed to delete related posts.', 'error')
          return
        }
      }
      await performResourceDeletion(resourceId, resourceTitle)
      
    } else if (option === 'resource_only') {
      if (relatedPosts.value.length > 0) {
        const { error: updateError } = await client
          .from('community_posts')
          .update({ resource_id: null })
          .eq('resource_id', resourceId)
        
        if (updateError) {
          showToast('Failed to unlink resources.', 'error')
          return
        }
      }
      await performResourceDeletion(resourceId, resourceTitle)
    }
    
  } catch (error) {
    console.error('Cascade delete failed:', error)
    showToast('Delete operation failed.', 'error')
  }
}

const performResourceDeletion = async (resourceId: string, resourceTitle: string) => {
  const client = supabaseService.getClient()
  
  try {
    const { error } = await client
      .from('resources')
      .delete()
      .eq('id', resourceId)
    
    if (error) throw error
    
    myResources.value = myResources.value.filter(resource => resource.id !== resourceId)
    hideDeleteConfirm()
    showToast(`Archived record '${resourceTitle}' deleted.`, 'success')
    
  } catch (error: any) {
    console.error('Resource deletion failed:', error)
    showToast(`Delete failed: ${error.message || 'Unknown error'}`, 'error')
  }
}

const loadMyResources = async () => {
  isLoading.value = true
  try {
    const client = supabaseService.getClient()
    const currentUser = localStorage.getItem('currentUser')
    
    if (!currentUser) {
      myResources.value = []
      return
    }
    
    const user = JSON.parse(currentUser)
    if (!user.id) {
      myResources.value = []
      return
    }
    
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    if (!data) {
      myResources.value = []
      return
    }
    
    myResources.value = data.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description || '',
      type: resource.type || 'other',
      category: resource.category,
      difficulty: resource.difficulty,
      duration: resource.duration,
      provider: resource.provider,
      url: resource.url,
      views: resource.views || 0,
      likes: resource.likes || 0,
      created_at: resource.created_at
    }))
    
  } catch (error) {
    console.error('Load resources failed:', error)
    myResources.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMyResources()
})
</script>

<style scoped>
/* 覆盖 Toast 样式以匹配 Theme C */
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>