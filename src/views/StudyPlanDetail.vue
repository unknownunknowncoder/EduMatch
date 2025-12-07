<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner (The Compass) -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 图片：指南针/地图 -->
      <img 
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Navigation"
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
      <div class="absolute bottom-20 left-0 w-full px-8 z-10">
        <div class="max-w-4xl mx-auto flex justify-between items-end">
           <div>
              <div class="flex items-center gap-3 mb-2">
                 <span 
                    class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border"
                    :class="plan?.status === 'in_progress' ? 'bg-[#d4c5a3] text-[#1a3c34] border-[#d4c5a3]' : 'bg-transparent text-white/60 border-white/20'"
                 >
                    {{ plan?.status === 'in_progress' ? '进行中' : '已归档' }}
                 </span>
                 <span class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.2em]">计划状态</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md max-w-2xl line-clamp-1">
                 {{ plan?.title || 'Loading...' }}
              </h1>
           </div>
        </div>
      </div>
    </div>

    <!-- 2. Main Content Container -->
    <div class="max-w-4xl mx-auto px-6 -mt-16 relative z-10 space-y-8">
      
      <!-- Loading State -->
      <div v-if="!plan" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">Retrieving file...</p>
      </div>

      <!-- Plan Detail Card -->
      <div v-else class="bg-white shadow-xl border-t-8 border-[#1a3c34] p-8 md:p-10 relative overflow-hidden">
         <!-- Watermark -->
         <Map class="absolute -right-10 -bottom-10 w-64 h-64 text-[#1a3c34]/5 -z-0 pointer-events-none" />

         <div class="relative z-10">
            <!-- Metrics Dashboard -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a3c34]/10 border border-[#1a3c34]/10 mb-10">
               <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                  <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ plan.totalHours || 0 }}</div>
                  <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">总学时</div>
               </div>
               <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                  <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ plan.totalCompletedHours || 0 }}</div>
                  <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">已完成</div>
               </div>
               <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                  <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ plan.progress }}%</div>
                  <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">进度</div>
               </div>
               <div class="bg-white p-4 text-center group hover:bg-[#f9f9f7] transition-colors">
                  <div class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3]">{{ checkinsCount }}</div>
                  <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">打卡次数</div>
               </div>
            </div>

            <!-- Content -->
            <div class="space-y-8">
               
               <!-- Description -->
               <div>
                  <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-3 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
                     <FileText class="w-4 h-4" /> Objective
                  </h3>
                  <p class="text-[#1a3c34]/80 font-serif leading-relaxed text-lg italic">
                     "{{ plan.description }}"
                  </p>
               </div>

               <!-- Progress Bar -->
               <div>
                  <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-3 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
                     <BarChart3 class="w-4 h-4" /> 时间线状态
                  </h3>
                  <div class="h-4 bg-[#f2f0e9] border border-[#1a3c34]/10 rounded-sm overflow-hidden mb-2 relative">
                     <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                     <div class="h-full bg-[#1a3c34]" :style="{ width: `${plan.progress}%` }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] font-mono text-[#1a3c34]/40 uppercase">
                     <span>开始: {{ formatDate(plan.startDate) }}</span>
                     <span>每日: {{ plan.dailyHours || 2 }}小时</span>
                  </div>
               </div>

               <!-- Recent Check-ins -->
               <div v-if="recentCheckins.length > 0">
                  <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-3 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
                     <Clock class="w-4 h-4" /> Recent Check-ins
                  </h3>
                  <div class="space-y-2">
                     <div v-for="checkin in recentCheckins" :key="checkin.id" class="flex items-center justify-between p-3 bg-[#f9f9f7] border border-[#1a3c34]/10">
                        <div>
                           <div class="text-sm font-serif text-[#1a3c34]">{{ formatDate(checkin.checkin_date) }}</div>
                           <div v-if="checkin.notes" class="text-xs text-[#1a3c34]/60 mt-1">{{ checkin.notes }}</div>
                        </div>
                        <div class="text-right">
                           <div class="font-bold text-[#1a3c34]">{{ checkin.hours }}h</div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Goals (Checklist) -->
               <div v-if="plan.goals && plan.goals.length > 0">
                  <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-3 border-b border-[#1a3c34]/10 pb-1 flex items-center gap-2">
                     <Target class="w-4 h-4" /> 里程碑
                  </h3>
                  <ul class="space-y-2">
                     <li v-for="(goal, index) in plan.goals" :key="index" class="flex items-start gap-3">
                        <div class="mt-1 w-4 h-4 border border-[#1a3c34]/30 flex items-center justify-center">
                           <Check class="w-3 h-3 text-[#1a3c34]" />
                        </div>
                        <span class="text-[#1a3c34]/80 font-serif">{{ goal }}</span>
                     </li>
                  </ul>
               </div>

               <!-- Actions -->
               <div class="flex justify-end pt-8 border-t border-[#1a3c34]/10">
                  <button
                     @click="editPlan"
                     class="px-6 py-4 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                     <Edit3 class="w-4 h-4" /> 修改
                  </button>
               </div>

            </div>
         </div>
      </div>

    </div>

    <!-- Notification Toast -->
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { 
  ArrowLeft, Map, FileText, BarChart3, Target, 
  Check, Edit3, Clock 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

interface StudyPlan {
  id: string
  title: string
  description: string
  status: 'in_progress' | 'completed'
  totalHours: number
  totalCompletedHours?: number
  dailyHours?: number
  startDate?: string
  targetDate?: string
  created_at?: string
  progress: number
  goals?: string[]
  checkins?: Array<{ date: string; hours: number; notes?: string }>
}

interface CheckinRecord {
  id: string
  study_plan_id: string
  hours: number
  notes?: string
  checkin_date: string
  created_at: string
}

const plan = ref<StudyPlan | null>(null)
const checkins = ref<CheckinRecord[]>([])
const notification = ref({ show: false, message: '', type: 'success' })

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 3000)
}

const checkinsCount = computed(() => {
  return checkins.value?.length || 0
})

const recentCheckins = computed(() => {
  return checkins.value?.slice(0, 5) || []
})

const formatDate = (str: string) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const loadPlan = async (id: string) => {
  try {
    // 获取当前用户信息
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) {
      showNotification('User not logged in', 'error')
      return
    }
    
    const user = JSON.parse(userStr)
    
    // 获取计划详情
    const planData = await supabaseService.getStudyPlanById(id)
    if (!planData) {
      showNotification('Plan not found', 'error')
      return
    }
    
    // 获取打卡记录
    const checkinData = await supabaseService.getStudyPlanCheckins(id)
    
    // 计算实际完成的学习时长
    const totalCompletedHours = checkinData?.reduce((sum: number, c: any) => {
      return sum + parseFloat(c.hours || '0')
    }, 0) || 0
    
    // 基于实际完成时长计算进度
    let actualProgress = 0
    if (planData.total_hours && planData.total_hours > 0) {
      actualProgress = Math.min(100, Math.round((totalCompletedHours / planData.total_hours) * 100))
    }
    
    // 更新计划数据
    plan.value = {
      id: planData.id,
      title: planData.title,
      description: planData.description,
      status: planData.status,
      totalHours: planData.total_hours,
      totalCompletedHours: totalCompletedHours,
      dailyHours: planData.daily_hours || 2,
      startDate: planData.start_date,
      targetDate: planData.target_date,
      created_at: planData.created_at,
      progress: actualProgress,
      goals: planData.goals || []
    }
    
    // 保存打卡记录
    checkins.value = checkinData || []
    
    // 更新数据库中的进度，确保数据一致性
    await updatePlanProgressInDB(id, actualProgress)
    
  } catch (error: any) {
    console.error('Failed to load plan:', error)
    showNotification('Failed to load plan details', 'error')
  }
}

// 更新数据库中的进度
const updatePlanProgressInDB = async (planId: string, progress: number) => {
  try {
    const client = await supabaseService.getClient()
    await client
      .from('study_plans')
      .update({ 
        progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
  } catch (error) {
    console.error('Failed to update progress in DB:', error)
  }
}

const editPlan = () => router.push(`/study-plan/${plan.value?.id}/edit`)

const goBackToPlanList = () => {
  // 直接导航到计划列表页面，避免历史记录问题
  router.push('/study-plan')
}

onMounted(() => { loadPlan(route.params.id as string) })
</script>

<style scoped>
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-slide-in { animation: slideIn 0.3s ease-out; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>