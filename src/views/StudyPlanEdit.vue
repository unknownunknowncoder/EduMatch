<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-20">
    
    <!-- 1. Top Banner -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <img 
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Edit Plan"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="goBackToPlanList"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          返回计划列表
        </button>
      </div>

      <!-- Title -->
      <div class="absolute top-24 left-0 w-full p-8 z-10">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">编辑学习计划</h2>
          <h1 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            {{ editPlan.title || 'Loading...' }}
          </h1>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-2xl mx-auto px-6 -mt-16 relative z-10">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
        <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-[#1a3c34]/60 font-serif italic">正在加载计划详情...</p>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white shadow-xl border-t-8 border-[#1a3c34] p-8 md:p-10">
        
        <!-- Progress Info -->
        <div class="mb-8 p-6 bg-[#f9f9f7] border border-[#1a3c34]/10 rounded">
          <h3 class="text-sm font-bold text-[#1a3c34] mb-4">当前进度</h3>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-[#1a3c34]">{{ currentProgress }}%</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">进度</div>
            </div>
            <div>
              <div class="text-xl font-bold text-[#1a3c34]">{{ completedHours }}h</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">已完成</div>
            </div>
            <div>
              <div class="text-xl font-bold text-[#1a3c34]">{{ editPlan.totalHours || 0 }}h</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">目标</div>
            </div>
          </div>
          <div class="mt-4 h-2 bg-white rounded-full overflow-hidden border border-[#1a3c34]/10">
            <div class="h-full bg-[#1a3c34]" :style="{ width: `${currentProgress}%` }"></div>
          </div>
        </div>

        <form @submit.prevent="handleUpdatePlan" class="space-y-6">
          
          <!-- Title -->
          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">
              计划标题 *
            </label>
            <input 
              v-model="editPlan.title" 
              type="text" 
              class="w-full bg-white border border-[#1a3c34]/20 p-3 font-serif text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" 
              placeholder="例如：高等数学" 
              required 
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">
              目标描述
            </label>
            <textarea 
              v-model="editPlan.description" 
              rows="3" 
              class="w-full bg-white border border-[#1a3c34]/20 p-3 font-serif text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] resize-none"
            ></textarea>
          </div>

          <!-- Dates & Hours -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">
                开始日期 *
              </label>
              <input 
                v-model="editPlan.startDate" 
                type="date" 
                class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" 
                required 
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">
                每日学时 *
              </label>
              <input 
                v-model="editPlan.dailyHours" 
                type="number" 
                step="0.5" 
                class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" 
                required 
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">
              总学时
            </label>
            <input 
              v-model="editPlan.totalHours" 
              type="number" 
              class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" 
              placeholder="目标总学时" 
            />
            <p class="text-xs text-[#1a3c34]/40 mt-1">更改此项将重新计算进度百分比</p>
          </div>

          <!-- Resource Link -->
          <div class="bg-[#1a3c34]/5 p-4 rounded-sm border border-[#1a3c34]/10">
            <label class="block text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-2">
              关联资源
            </label>
            <div class="flex gap-2">
              <input 
                v-model="editPlan.resourceName" 
                type="text" 
                class="flex-1 bg-white border border-[#1a3c34]/20 p-2 text-sm font-serif focus:outline-none" 
                placeholder="资源名称" 
              />
              <button 
                type="button" 
                @click="handleOpenResourceModal" 
                class="px-3 bg-[#d4c5a3] text-[#1a3c34] font-bold text-xs uppercase hover:bg-[#c4b593]"
              >
                选择
              </button>
            </div>
            <input 
              v-model="editPlan.resourceUrl" 
              type="url" 
              class="w-full bg-white border border-[#1a3c34]/20 p-2 mt-2 text-sm font-mono focus:outline-none" 
              placeholder="https://..." 
            />
          </div>

          <!-- Progress Preview -->
          <div class="text-xs text-[#1a3c34]/60 font-mono bg-[#f9f9f7] p-3 border border-[#1a3c34]/10">
            更新进度: <span class="font-bold">{{ updatedProgress }}%</span> 
            <span v-if="editPlan.totalHours"> ({{ completedHours }}小时 / {{ editPlan.totalHours }}小时)</span>
            <span v-else class="text-[#1a3c34]/40"> (设置总学时以计算进度)</span>
          </div>

          <!-- Actions -->
          <div class="pt-6 border-t border-[#1a3c34]/10 flex gap-4">
            <button 
              type="button" 
              @click="goBackToPlanList"
              class="flex-1 py-3 text-[#1a3c34] font-bold uppercase tracking-widest hover:underline transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="flex-1 py-3 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Edit3 v-else class="w-4 h-4" />
              {{ isSubmitting ? '更新中...' : '更新计划' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Resource Picker Modal -->
    <div v-if="showMyResourcesModal" class="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-[#1a3c34]/90 backdrop-blur-sm px-4">
      <div class="bg-[#f4f1ea] w-full max-w-lg shadow-2xl p-6 border-t-4 border-[#d4c5a3]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-serif font-bold text-[#1a3c34]">从存档中选择</h3>
          <button 
            @click="showMyResourcesModal = false" 
            class="text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#1a3c34]/10 rounded-sm p-1 transition-all"
          >
            <X class="w-5 h-5"/>
          </button>
        </div>
        <div class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          <div v-if="isLoadingMyResources" class="text-center py-4 text-[#1a3c34]/40 italic">加载中...</div>
          <div v-else-if="myResources.length === 0" class="text-center py-4 text-[#1a3c34]/40 italic">未找到资源。</div>
          <div v-else v-for="res in myResources" :key="res.id" @click="selectResource(res)" class="p-3 bg-white border border-[#1a3c34]/10 hover:border-[#1a3c34] cursor-pointer transition-colors">
            <div class="font-bold text-[#1a3c34] text-sm">{{ res.title }}</div>
            <div class="text-xs text-[#1a3c34]/50 font-mono">{{ res.type }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="notification.show" 
         :class="[
           'fixed top-24 right-6 z-[110] shadow-xl px-6 py-4 font-serif font-bold border-l-4 flex items-center gap-3 animate-slide-in',
           notification.type === 'success' ? 'bg-[#f0fdf4] text-[#166534] border-[#166534]' : 
           notification.type === 'error' ? 'bg-[#fef2f2] text-[#991b1b] border-[#991b1b]' : 
           'bg-white text-[#1a3c34] border-[#1a3c34]'
         ]">
      <span>{{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '!' : 'i' }}</span>
      <span>{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { ArrowLeft, Edit3, Loader2, X } from 'lucide-vue-next'

interface StudyPlan {
  id: string
  title: string
  description?: string
  totalHours?: number
  dailyHours?: number
  startDate?: string
  targetDate?: string
  resourceName?: string
  resourceUrl?: string
}

interface MyResource {
  id: string
  title: string
  description: string
  type: string
  duration?: string
  url?: string
}

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const isSubmitting = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })
const showMyResourcesModal = ref(false)
const myResources = ref<MyResource[]>([])
const isLoadingMyResources = ref(false)
const completedHours = ref(0)

const editPlan = ref<StudyPlan>({
  id: '',
  title: '',
  description: '',
  totalHours: 0,
  dailyHours: 2,
  startDate: '',
  targetDate: '',
  resourceName: '',
  resourceUrl: ''
})

const currentProgress = computed(() => {
  if (!editPlan.value.totalHours || editPlan.value.totalHours <= 0) return 0
  return Math.min(100, Math.round((completedHours.value / editPlan.value.totalHours) * 100))
})

const updatedProgress = computed(() => {
  if (!editPlan.value.totalHours || editPlan.value.totalHours <= 0) return 0
  return Math.min(100, Math.round((completedHours.value / editPlan.value.totalHours) * 100))
})

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 3000)
}

const loadPlan = async () => {
  try {
    const planId = route.params.id as string
    const userStr = localStorage.getItem('currentUser')
    
    if (!userStr) {
      showNotification('User not logged in', 'error')
      router.back()
      return
    }
    
    const user = JSON.parse(userStr)
    const client = await supabaseService.getClient()
    
    // 获取计划详情
    const { data: planData, error: planError } = await client
      .from('study_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', user.id)
      .single()
    
    if (planError || !planData) {
      showNotification('Plan not found', 'error')
      router.back()
      return
    }
    
    // 获取打卡记录计算已完成时长
    const checkins = await supabaseService.getStudyPlanCheckins(planId)
    const totalCompleted = checkins?.reduce((sum: number, c: any) => {
      return sum + parseFloat(c.hours || '0')
    }, 0) || 0
    
    completedHours.value = totalCompleted
    
    // 设置编辑表单数据
    editPlan.value = {
      id: planData.id,
      title: planData.title,
      description: planData.description,
      totalHours: planData.total_hours,
      dailyHours: planData.daily_hours || 2,
      startDate: planData.start_date,
      targetDate: planData.target_date,
      resourceName: planData.resource_name,
      resourceUrl: planData.resource_url
    }
    
  } catch (error) {
    console.error('Failed to load plan:', error)
    showNotification('Failed to load plan details', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleUpdatePlan = async () => {
  try {
    isSubmitting.value = true
    
    // 验证表单数据
    if (!editPlan.value.title?.trim()) {
      showNotification('Please enter a plan title', 'error')
      return
    }
    
    if (!editPlan.value.startDate) {
      showNotification('Please select a start date', 'error')
      return
    }
    
    if (!editPlan.value.dailyHours || editPlan.value.dailyHours <= 0) {
      showNotification('Please enter valid daily hours', 'error')
      return
    }
    
    // 计算新的进度百分比
    const newProgress = updatedProgress.value
    
    // 构建更新数据
    const updateData = {
      title: editPlan.value.title.trim(),
      description: editPlan.value.description?.trim() || '',
      start_date: editPlan.value.startDate,
      daily_hours: parseFloat(editPlan.value.dailyHours.toString()),
      total_hours: editPlan.value.totalHours ? parseFloat(editPlan.value.totalHours.toString()) : null,
      resource_name: editPlan.value.resourceName?.trim() || '',
      resource_url: editPlan.value.resourceUrl?.trim() || '',
      progress: newProgress,
      updated_at: new Date().toISOString()
    }
    
    console.log('Updating plan with data:', updateData)
    
    // 更新数据库
    const client = await supabaseService.getClient()
    const { data, error } = await client
      .from('study_plans')
      .update(updateData)
      .eq('id', editPlan.value.id)
      .select()
    
    if (error) {
      console.error('Update plan error:', error)
      showNotification(`Failed to update plan: ${error.message}`, 'error')
      return
    }
    
    if (data && data.length > 0) {
      console.log('Plan updated successfully:', data[0])
      showNotification('Study plan updated successfully!', 'success')
      
      // 延迟返回到详情页
      setTimeout(() => {
        router.push(`/study-plan/${editPlan.value.id}`)
      }, 1500)
    }
    
  } catch (error: any) {
    console.error('Update plan failed:', error)
    showNotification('Failed to update study plan', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const fetchMyResources = async () => {
  isLoadingMyResources.value = true
  try {
    // 这里可以添加获取用户资源的逻辑
    // 暂时使用模拟数据
    myResources.value = []
  } catch (error) {
    console.error('Failed to fetch resources:', error)
  } finally {
    isLoadingMyResources.value = false
  }
}

const handleOpenResourceModal = () => {
  showMyResourcesModal.value = true
  fetchMyResources()
}

const selectResource = (resource: MyResource) => {
  editPlan.value.resourceName = resource.title
  editPlan.value.resourceUrl = resource.url || ''
  showMyResourcesModal.value = false
}

const goBackToPlanList = () => {
  // 直接导航到计划列表页面，避免历史记录问题
  router.push('/study-plan')
}

onMounted(() => {
  loadPlan()
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

.animate-slide-in { 
  animation: slideIn 0.3s ease-out; 
}
@keyframes slideIn { 
  from { transform: translateX(100%); opacity: 0; } 
  to { transform: translateX(0); opacity: 1; } 
}
</style>