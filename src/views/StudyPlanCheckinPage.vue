<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <img 
        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Study Check-in"
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
      <div class="absolute bottom-0 left-0 w-full p-8 z-10">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">每日打卡</h2>
          <h1 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            {{ plan?.title || '加载中...' }}
          </h1>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-2xl mx-auto px-6 -mt-16 relative z-10">
      
      <!-- Loading State -->
      <div v-if="!plan" class="bg-white p-12 shadow-xl border-t-8 border-[#1a3c34] text-center">
        <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-[#1a3c34]/60 font-serif italic">加载计划详情中...</p>
      </div>

      <!-- Check-in Form -->
      <div v-else class="bg-white shadow-xl border-t-8 border-[#1a3c34] p-8 md:p-10">
        
        <!-- Current Progress Preview -->
        <div class="mb-8 pb-6 border-b border-[#1a3c34]/10">
          <h3 class="text-lg font-serif font-bold text-[#1a3c34] mb-4">Current Progress</h3>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-[#f9f9f7] p-4 border border-[#1a3c34]/10">
              <div class="text-2xl font-serif font-bold text-[#1a3c34]">{{ plan.progress || 0 }}%</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">Progress</div>
            </div>
            <div class="bg-[#f9f9f7] p-4 border border-[#1a3c34]/10">
              <div class="text-2xl font-serif font-bold text-[#1a3c34]">{{ plan.totalCompletedHours || 0 }}h</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">Completed</div>
            </div>
            <div class="bg-[#f9f9f7] p-4 border border-[#1a3c34]/10">
              <div class="text-2xl font-serif font-bold text-[#1a3c34]">{{ plan.totalHours || 0 }}h</div>
              <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">Target</div>
            </div>
          </div>
        </div>

        <!-- Check-in Form -->
        <form @submit.prevent="handleSubmitCheckin" class="space-y-6">
          
          <!-- Study Hours -->
          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
              学习小时数 *
            </label>
            <div class="flex items-center gap-4">
              <input 
                v-model.number="checkinForm.hours" 
                type="number" 
                step="0.5" 
                min="0.5" 
                max="24"
                class="flex-1 bg-white border border-[#1a3c34]/20 p-4 text-[#1a3c34] font-serif text-lg focus:border-[#1a3c34] focus:outline-none"
                placeholder="How many hours did you study?"
                required
              />
              <div class="text-[#1a3c34]/60 font-mono text-sm">
                <div class="text-[9px] uppercase tracking-widest mb-1">Suggested</div>
                <button 
                  type="button" 
                  @click="checkinForm.hours = plan.dailyHours || 2"
                  class="px-3 py-1 bg-[#f9f9f7] border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold hover:bg-[#1a3c34] hover:text-white transition-colors"
                >
                  {{ plan.dailyHours || 2 }}h
                </button>
              </div>
            </div>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
              Date *
            </label>
            <input 
              v-model="checkinForm.date" 
              type="date" 
              :max="maxDate"
              class="w-full bg-white border border-[#1a3c34]/20 p-4 font-mono text-[#1a3c34] focus:border-[#1a3c34] focus:outline-none"
              required
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
              学习笔记
            </label>
            <textarea 
              v-model="checkinForm.notes" 
              rows="4" 
              class="w-full bg-white border border-[#1a3c34]/20 p-4 font-serif text-[#1a3c34] leading-relaxed focus:border-[#1a3c34] focus:outline-none resize-none"
              placeholder="What did you learn today? Any challenges or achievements?"
            ></textarea>
          </div>

          <!-- Progress Preview -->
          <div class="bg-[#f9f9f7] p-6 border border-[#1a3c34]/10">
            <h4 class="text-sm font-bold text-[#1a3c34] mb-3">进度预览</h4>
            <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-[#1a3c34]/50 mb-2">
              <span>New Total</span>
              <span>{{ newTotalHours }}h / {{ plan.totalHours || 0 }}h</span>
            </div>
            <div class="h-3 bg-white rounded-full overflow-hidden border border-[#1a3c34]/10">
              <div 
                class="h-full bg-[#1a3c34] transition-all duration-500" 
                :style="{ width: `${newProgressPercent}%` }"
              ></div>
            </div>
            <div class="text-center mt-2 text-sm font-serif font-bold text-[#1a3c34]">
              {{ newProgressPercent }}% Complete
            </div>
          </div>

          <!-- Submit Actions -->
          <div class="pt-6 border-t border-[#1a3c34]/10 flex gap-4">
            <button 
              type="button" 
              @click="goBackToPlanList"
              class="flex-1 py-4 text-[#1a3c34] font-bold uppercase tracking-widest hover:underline transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              :disabled="isSubmitting || !checkinForm.hours || checkinForm.hours <= 0"
              class="flex-1 py-4 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Clock v-else class="w-4 h-4" />
              {{ isSubmitting ? '保存中...' : '记录打卡' }}
            </button>
          </div>
        </form>
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
import { ArrowLeft, Clock, Loader2 } from 'lucide-vue-next'

interface StudyPlan {
  id: string
  title: string
  description?: string
  progress: number
  totalHours?: number
  dailyHours?: number
  totalCompletedHours?: number
}

const route = useRoute()
const router = useRouter()

const plan = ref<StudyPlan | null>(null)
const isSubmitting = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })

const checkinForm = ref({
  hours: 2, // 设置默认值
  date: new Date().toISOString().split('T')[0],
  notes: ''
})

const maxDate = computed(() => new Date().toISOString().split('T')[0])

const newTotalHours = computed(() => {
  if (!plan.value) return 0
  return (plan.value.totalCompletedHours || 0) + checkinForm.value.hours
})

const newProgressPercent = computed(() => {
  if (!plan.value?.totalHours || plan.value.totalHours <= 0) return 0
  const newProgress = Math.round((newTotalHours.value / plan.value.totalHours) * 100)
  return Math.min(100, newProgress)
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
      showNotification('未找到计划', 'error')
      router.back()
      return
    }
    
    // 获取打卡记录并计算实际进度
    const checkins = await supabaseService.getStudyPlanCheckins(planId)
    const totalCompletedHours = checkins?.reduce((sum: number, c: any) => {
      return sum + parseFloat(c.hours || '0')
    }, 0) || 0
    
    // 基于实际完成时长计算真实进度
    let actualProgress = 0
    if (planData.total_hours && planData.total_hours > 0) {
      actualProgress = Math.min(100, Math.round((totalCompletedHours / planData.total_hours) * 100))
    }
    
    plan.value = {
      id: planData.id,
      title: planData.title,
      description: planData.description,
      progress: actualProgress, // 使用计算出的实际进度
      totalHours: planData.total_hours,
      dailyHours: planData.daily_hours,
      totalCompletedHours: totalCompletedHours
    }
    
  } catch (error) {
    console.error('Failed to load plan:', error)
    showNotification('Failed to load plan details', 'error')
  }
}

const handleSubmitCheckin = async () => {
  if (!plan.value) return
  
  isSubmitting.value = true
  
  try {
    console.log('Starting check-in process for plan:', plan.value.id)
    console.log('Check-in form data:', checkinForm.value)
    
    // 验证表单数据
    if (!checkinForm.value.hours || checkinForm.value.hours <= 0) {
      showNotification('请输入有效的学习时长', 'error')
      isSubmitting.value = false
      return
    }
    
    // 首先检查今天是否已经打卡了
    const existingCheckins = await supabaseService.getStudyPlanCheckins(plan.value.id)
    const todayCheckin = existingCheckins?.find((c: any) => c.checkin_date === checkinForm.value.date)
    
    if (todayCheckin) {
      showNotification('You have already checked in for this date!', 'error')
      isSubmitting.value = false
      return
    }
    
    console.log('Adding check-in to database...')
    // 记录打卡
    const checkinData = await supabaseService.addStudyPlanCheckin(plan.value.id, {
      hours: checkinForm.value.hours,
      notes: checkinForm.value.notes,
      date: checkinForm.value.date
    })
    
    console.log('Check-in data saved:', checkinData)
    
    if (checkinData) {
      // 重新计算实际进度（基于所有打卡记录）
      const allCheckins = await supabaseService.getStudyPlanCheckins(plan.value.id)
      const totalCompletedHours = allCheckins?.reduce((sum: number, c: any) => {
        return sum + parseFloat(c.hours || '0')
      }, 0) || 0
      
      console.log('Total completed hours:', totalCompletedHours)
      
      // 基于实际完成时长计算进度
      let actualProgressPercent = 0
      if (plan.value.totalHours && plan.value.totalHours > 0) {
        actualProgressPercent = Math.min(100, Math.round((totalCompletedHours / plan.value.totalHours) * 100))
      }
      
      console.log('Calculated progress:', actualProgressPercent)
      
      // 更新计划进度到数据库
      const client = await supabaseService.getClient()
      await client
        .from('study_plans')
        .update({ 
          progress: actualProgressPercent,
          updated_at: new Date().toISOString()
        })
        .eq('id', plan.value.id)
      
      console.log('Progress updated in database')
      
      // 更新本地页面数据，让进度条立即更新
      plan.value.totalCompletedHours = totalCompletedHours
      plan.value.progress = actualProgressPercent
      
      // 显示成功提示，包含进度信息
      const progressMessage = actualProgressPercent >= 100 
        ? `打卡成功！🎉 计划已完成 (${actualProgressPercent}%)!`
        : `打卡成功！进度: ${actualProgressPercent}%`
      
      showNotification(progressMessage, 'success')
      
      // 延迟返回到计划列表，确保看到进度更新
      setTimeout(() => {
        console.log('Navigating to plan list...')
        router.push('/study-plan')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Check-in failed:', error)
    showNotification(error.message || '记录打卡失败', 'error')
  } finally {
    isSubmitting.value = false
  }
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