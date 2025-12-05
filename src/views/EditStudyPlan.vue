<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, X, Calendar, Target, Clock, RefreshCw } from 'lucide-vue-next'
import { showToast } from '@/utils/message'
import { supabaseService } from '@/services/supabase'

const route = useRoute()
const router = useRouter()

interface StudyPlan {
  id: string
  title: string
  description: string
  status: string
  total_hours: number
  target_date: string
  daily_hours?: number
}

const plan = ref<StudyPlan | null>(null)
const loading = ref(false)
const saving = ref(false)

const editForm = ref({
  title: '',
  description: '',
  total_hours: 0,
  target_date: '',
  daily_hours: 0
})

// 计算预计完成日期
const estimatedCompletionDate = computed(() => {
  if (!editForm.value.total_hours || !editForm.value.daily_hours || editForm.value.daily_hours <= 0) {
    return ''
  }
  
  // 计算需要的天数
  const daysNeeded = Math.ceil(editForm.value.total_hours / editForm.value.daily_hours)
  
  // 从开始日期计算目标日期，优先使用start_date，其次使用created_at，最后使用今天
  let startDate
  if (plan.value?.start_date) {
    startDate = new Date(plan.value.start_date)
  } else if (plan.value?.created_at) {
    startDate = new Date(plan.value.created_at)
  } else {
    startDate = new Date() // 如果没有开始日期，从今天开始计算
  }
  
  const targetDate = new Date(startDate)
  targetDate.setDate(targetDate.getDate() + daysNeeded - 1) // -1因为开始日期也算一天
  
  return targetDate.toISOString().split('T')[0]
})

// 计算建议日期（不自动填充，只用于显示）
const suggestedDate = computed(() => {
  if (!editForm.value.total_hours || !editForm.value.daily_hours || editForm.value.daily_hours <= 0) {
    return ''
  }
  
  const daysNeeded = Math.ceil(editForm.value.total_hours / editForm.value.daily_hours)
  
  let startDate
  if (plan.value?.start_date) {
    startDate = new Date(plan.value.start_date)
  } else if (plan.value?.created_at) {
    startDate = new Date(plan.value.created_at)
  } else {
    startDate = new Date()
  }
  
  const targetDate = new Date(startDate)
  targetDate.setDate(targetDate.getDate() + daysNeeded - 1)
  
  return targetDate.toISOString().split('T')[0]
})

const loadPlan = async () => {
  const planId = route.params.id as string
  if (!planId) return
  
  loading.value = true
  try {
    const planData = await supabaseService.getStudyPlanById(planId)
    if (planData) {
      plan.value = planData
      editForm.value = {
        title: planData.title || '',
        description: planData.description || '',
        total_hours: planData.total_hours || 0,
        target_date: planData.target_date || '',
        daily_hours: planData.daily_hours || 0
      }
    }
  } catch (error) {
    console.error('加载计划失败:', error)
    showToast('加载计划失败', 'error')
  } finally {
    loading.value = false
  }
}



const savePlan = async () => {
  if (!plan.value) return
  
  // 验证用户权限
  const userStr = localStorage.getItem('currentUser')
  if (!userStr) {
    showToast('请先登录', 'error')
    return
  }
  
  // 验证表单
  if (!editForm.value.title.trim()) {
    showToast('请输入计划标题', 'error')
    return
  }
  
  if (!editForm.value.description.trim()) {
    showToast('请输入计划描述', 'error')
    return
  }
  
  if (editForm.value.total_hours <= 0) {
    showToast('总学时必须大于0', 'error')
    return
  }
  
  if (!editForm.value.target_date) {
    showToast('请选择目标日期', 'error')
    return
  }
  
  saving.value = true
  try {
    console.log('准备更新学习计划，ID:', plan.value.id)
    
    // 获取当前计划的打卡记录
    const checkins = await supabaseService.getStudyPlanCheckins(plan.value.id)
    const completedHours = checkins.length * (editForm.value.daily_hours || 2)
    
    // 重新计算进度
    const newProgress = Math.min(100, Math.round((completedHours / editForm.value.total_hours) * 100))
    const isCompleted = newProgress >= 100
    
    const updateData = {
      title: editForm.value.title,
      description: editForm.value.description,
      total_hours: editForm.value.total_hours,
      target_date: editForm.value.target_date,
      daily_hours: editForm.value.daily_hours,
      progress: newProgress,
      status: isCompleted ? 'completed' : 'in_progress'
    }
    
    console.log('更新数据:', updateData)
    
    const result = await supabaseService.updateStudyPlan(plan.value.id, updateData)
    
    console.log('学习计划更新成功:', result)
    showToast('计划更新成功，进度已重新计算', 'success')
    router.replace(`/study-plan/${plan.value.id}`)
  } catch (error) {
    console.error('更新计划失败:', error)
    showToast('更新计划失败: ' + (error as Error).message, 'error')
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  router.back()
}

// 手动计算目标日期
const calculateTargetDate = () => {
  if (suggestedDate.value) {
    editForm.value.target_date = suggestedDate.value
    showToast('目标日期已更新为 ' + new Date(suggestedDate.value).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' }), 'success')
  } else {
    showToast('请先填写总学时和每日学时', 'error')
  }
}

onMounted(() => {
  loadPlan()
})
</script>

<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner -->
    <div class="h-48 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 背景图片 -->
      <img 
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Edit Plan"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="cancel"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Plan
        </button>
      </div>

      <!-- Title -->
      <div class="absolute bottom-8 left-0 w-full px-8 z-10">
        <div class="max-w-4xl mx-auto">
           <h1 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md">
              Edit Study Plan
           </h1>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-4xl mx-auto px-6 mt-8 space-y-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Loading plan...</p>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white shadow-xl border-t-8 border-[#1a3c34] p-8 md:p-10">
         
         <!-- Basic Information -->
         <div class="space-y-6 mb-8">
            <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-4 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
               <Target class="w-4 h-4" /> Basic Information
            </h3>
            
            <div>
               <label class="block text-sm font-serif font-bold text-[#1a3c34] mb-2">Plan Title</label>
               <input 
                  v-model="editForm.title"
                  type="text" 
                  class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif"
                  placeholder="Enter your plan title"
               />
            </div>

            <div>
               <label class="block text-sm font-serif font-bold text-[#1a3c34] mb-2">Description</label>
               <textarea 
                  v-model="editForm.description"
                  rows="3"
                  class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif resize-none"
                  placeholder="Describe your learning objectives"
               ></textarea>
            </div>
         </div>

         <!-- Schedule -->
         <div class="space-y-6 mb-8">
            <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-4 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
               <Calendar class="w-4 h-4" /> Schedule
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label class="block text-sm font-serif font-bold text-[#1a3c34] mb-2">Total Hours</label>
                  <input 
                     v-model.number="editForm.total_hours"
                     type="number" 
                     min="1"
                     class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif"
                     placeholder="100"
                  />
               </div>

               <div>
                  <label class="block text-sm font-serif font-bold text-[#1a3c34] mb-2">Daily Hours</label>
                  <input 
                     v-model.number="editForm.daily_hours"
                     type="number" 
                     min="0.5"
                     step="0.5"
                     class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif"
                     placeholder="2"
                  />
               </div>

               <div>
                  <div class="flex items-center justify-between mb-2">
                     <label class="text-sm font-serif font-bold text-[#1a3c34]">Target Date</label>
                     <button 
                        type="button"
                        @click="calculateTargetDate"
                        class="flex items-center gap-1 px-3 py-1 text-xs bg-[#1a3c34]/10 text-[#1a3c34] hover:bg-[#1a3c34]/20 transition-colors rounded-sm"
                     >
                        <RefreshCw class="w-3 h-3" />
                        自动计算
                     </button>
                  </div>
                  <input 
                     v-model="editForm.target_date"
                     type="date" 
                     class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif"
                     :min="new Date().toISOString().split('T')[0]"
                  />
                  <p v-if="suggestedDate" class="text-xs text-[#1a3c34]/50 mt-1">
                    💡 建议日期：{{ new Date(suggestedDate).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                  </p>
               </div>
            </div>
         </div>



         <!-- Actions -->
         <div class="flex flex-col md:flex-row gap-4 pt-8 border-t border-[#1a3c34]/10">
            <button
               @click="cancel"
               class="flex-1 py-4 border border-[#1a3c34]/20 text-[#1a3c34] font-bold uppercase tracking-widest hover:bg-[#f9f9f7] transition-all flex items-center justify-center gap-2"
            >
               <X class="w-4 h-4" /> Cancel
            </button>
            
            <button
               @click="savePlan"
               :disabled="saving"
               class="flex-1 py-4 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <Save class="w-4 h-4" /> 
               {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>