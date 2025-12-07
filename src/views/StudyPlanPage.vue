<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#1a3c34] selection:text-[#d4c5a3] pb-20">
    
    <!-- 1. Top Banner (The Agenda) -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34]">
      <!-- 图片：复古日历/钟表 -->
      <img 
        src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[20%]"
        alt="Study Agenda"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <div class="absolute bottom-0 left-0 w-full p-8 z-10">
        <div class="max-w-5xl mx-auto flex justify-between items-start">
           <div>
              <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">个人日程</h2>
              <h1 class="text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md">
                 学习日程
              </h1>
           </div>
           
           <div class="hidden md:flex flex-col items-end gap-4 text-white/80 font-mono text-xs">
              <div class="flex gap-8">
                 <div class="text-center">
                    <div class="text-2xl font-bold text-[#d4c5a3]">{{ plans.inProgress }}</div>
                    <div class="uppercase tracking-widest opacity-60">进行中</div>
                 </div>
                 <div class="text-center">
                    <div class="text-2xl font-bold text-[#d4c5a3]">{{ plans.completed }}</div>
                    <div class="uppercase tracking-widest opacity-60">已完成</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- 2. Main Content Container -->
    <div class="max-w-5xl mx-auto px-6 -mt-16 relative z-10 space-y-8">
      
      <!-- New Plan 按钮 - 在统计数字下方右对齐 -->
      <div class="flex justify-end mt-20">
         <button 
            @click="showCreatePlanModal = true"
            class="px-6 py-3 bg-[#1a3c34] text-[#d4c5a3] shadow-xl hover:bg-[#235246] hover:-translate-y-1 transition-all rounded-sm font-bold uppercase tracking-widest flex items-center gap-2 border border-[#d4c5a3]/20"
         >
            <Plus class="w-4 h-4" /> 新建计划
         </button>
      </div>

      <!-- Empty State -->
      <div v-if="currentPlans.length === 0" class="bg-white p-16 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <Calendar class="w-16 h-16 text-[#1a3c34]/20 mx-auto mb-6" />
         <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-2">日程为空</h2>
         <p class="text-[#1a3c34]/60 font-serif italic mb-8">未找到活跃的学习计划。设置新目标。</p>
         <button 
            @click="showCreatePlanModal = true"
            class="px-8 py-3 border-2 border-[#1a3c34] text-[#1a3c34] font-bold uppercase tracking-widest hover:bg-[#1a3c34] hover:text-[#d4c5a3] transition-colors"
         >
            创建计划
         </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingPlans" class="bg-white p-16 shadow-xl border-t-8 border-[#1a3c34] text-center">
         <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
         <p class="mt-4 text-[#1a3c34]/60 font-serif italic">加载您的学习计划...</p>
      </div>

      <!-- Plan List -->
      <div v-else-if="currentPlans.length > 0" class="space-y-6 mt-2">
        <div 
          v-for="plan in currentPlans" 
          :key="plan.id"
          class="group bg-white p-8 shadow-md border-l-4 transition-all hover:shadow-xl relative overflow-hidden"
          :class="plan.progress >= 100 ? 'border-gray-300 opacity-80' : 'border-[#d4c5a3] hover:border-[#1a3c34]'"
        >
          <!-- Background Decor -->
          <CheckCircle2 v-if="plan.progress >= 100" class="absolute -right-6 -bottom-6 w-40 h-40 text-gray-100 -z-0 pointer-events-none" />
          <Clock v-else class="absolute -right-6 -bottom-6 w-40 h-40 text-[#1a3c34]/5 -z-0 pointer-events-none rotate-12" />

          <div class="relative z-10">
             <!-- Header -->
             <div class="flex justify-between items-start mb-6">
                <div>
                   <h3 class="text-2xl font-serif font-bold text-[#1a3c34] mb-2">{{ plan.title }}</h3>
                   <p class="text-[#1a3c34]/60 font-serif text-sm max-w-2xl">{{ plan.description || '暂无描述。' }}</p>
                </div>
                
                <div class="flex items-center gap-2">
                   <button 
                      @click="viewPlanDetail(plan.id)"
                      class="p-2 text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#f4f1ea] transition-colors rounded-sm"
                      title="查看详情"
                   >
                      <Eye class="w-5 h-5" />
                   </button>
                   <button 
                      @click="showDeleteConfirm(plan)"
                      class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-sm"
                      title="删除计划"
                   >
                      <Trash2 class="w-5 h-5" />
                   </button>
                </div>
             </div>

             <!-- Resource Link (Attached Note) -->
             <div v-if="plan.resourceName || plan.resourceUrl" class="mb-6 inline-flex items-center gap-3 px-4 py-2 bg-[#f9f9f7] border border-[#1a3c34]/10 rounded-sm text-sm">
                <Link class="w-4 h-4 text-[#d4c5a3]" />
                <span class="font-bold text-[#1a3c34]">{{ plan.resourceName || 'Linked Resource' }}</span>
                <a 
                   v-if="plan.resourceUrl" 
                   :href="plan.resourceUrl" 
                   target="_blank" 
                   class="text-[#1a3c34]/60 hover:text-[#1a3c34] hover:underline ml-2 flex items-center gap-1 text-xs uppercase font-bold tracking-wider"
                >
                   Open <ExternalLink class="w-3 h-3" />
                </a>
             </div>

             <!-- Progress Section -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <!-- Stats -->
                <div class="space-y-4">
                   <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-[#1a3c34]/50 mb-1">
                      <span>进度</span>
                      <span>{{ plan.progress }}%</span>
                   </div>
                   <div class="h-2 bg-[#f4f1ea] rounded-full overflow-hidden border border-[#1a3c34]/10">
                      <div class="h-full bg-[#1a3c34] transition-all duration-500" :style="{ width: `${plan.progress}%` }"></div>
                   </div>
                   
                   <div class="flex gap-6 text-xs font-mono text-[#1a3c34]/60 pt-2">
                      <span>开始：{{ formatDate(plan.startDate) }}</span>
                      <span>目标：{{ formatDate(plan.targetDate) }}</span>
                      <span>每日：{{ plan.dailyHours }}小时</span>
                   </div>
                </div>

                <!-- Check-in Action -->
                <div class="flex justify-end">
                   <!-- 基于实际进度判断状态，而不是数据库中的status字段 -->
                   <button
                      v-if="plan.progress < 100 && !plan.isTodayChecked && plan.id"
                      @click="handleCheckin(plan)"
                      class="group relative px-6 py-3 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 border border-[#d4c5a3]/20"
                   >
                      <CheckCircle2 class="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>每日打卡</span>
                      <div class="absolute -top-2 -right-2 w-3 h-3 bg-[#d4c5a3] rounded-full animate-pulse"></div>
                   </button>
                   
                   <div v-else-if="plan.isTodayChecked" class="px-6 py-3 bg-[#f9f9f7] text-[#1a3c34]/60 font-bold uppercase tracking-widest border border-[#1a3c34]/20 flex items-center gap-2 cursor-default relative">
                      <Check class="w-4 h-4 text-green-600" /> 
                      <span>今日目标已完成</span>
                      <div class="absolute -top-1 -right-1 text-green-600">
                        <CheckCircle2 class="w-5 h-5" />
                      </div>
                   </div>
                   
                   <div v-else-if="plan.progress >= 100" class="px-6 py-3 bg-gradient-to-r from-[#d4c5a3]/30 to-[#d4c5a3]/10 text-[#1a3c34] font-bold uppercase tracking-widest border border-[#d4c5a3]/30 flex items-center gap-2 relative overflow-hidden">
                      <Award class="w-4 h-4 text-[#d4c5a3]" />
                      <span>已完成</span>
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Create Modal -->
    <transition name="fade">
      <div v-if="showCreatePlanModal" class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-[#1a3c34]/90 backdrop-blur-sm px-4">
        <div class="bg-[#f4f1ea] w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto border-t-8 border-[#d4c5a3]">
          <button @click="closeCreatePlanModal" class="absolute top-4 right-4 text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#1a3c34]/10 rounded-sm p-2 transition-all"><X class="w-5 h-5"/></button>
          
          <div class="p-8">
             <div class="text-center mb-8 border-b border-[#1a3c34]/10 pb-4">
                <Calendar class="w-8 h-8 text-[#1a3c34] mx-auto mb-2" />
                <h2 class="text-2xl font-serif font-bold text-[#1a3c34]">新建学习计划</h2>
             </div>

             <form @submit.prevent="handleCreatePlan" class="space-y-6">
                <!-- Title -->
                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">计划标题 *</label>
                   <input v-model="newPlan.title" type="text" class="w-full bg-white border border-[#1a3c34]/20 p-3 font-serif text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" placeholder="例如：高等数学" required />
                </div>

                <!-- Description -->
                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">目标</label>
                   <textarea v-model="newPlan.description" rows="3" class="w-full bg-white border border-[#1a3c34]/20 p-3 font-serif text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] resize-none"></textarea>
                </div>

                <!-- Dates & Hours -->
                <div class="grid grid-cols-2 gap-4">
                   <div>
                      <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">开始日期 *</label>
                      <input v-model="newPlan.startDate" type="date" class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" required />
                   </div>
                   <div>
                      <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">每日小时 *</label>
                      <input v-model="newPlan.dailyHours" type="number" step="0.5" class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" required />
                   </div>
                </div>

                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-1">总小时数（可选）</label>
                   <input v-model="newPlan.totalHours" type="number" class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:outline-none focus:border-[#1a3c34]" placeholder="预计总时长" />
                </div>

                <!-- Resource Link -->
                <div class="bg-[#1a3c34]/5 p-4 rounded-sm border border-[#1a3c34]/10">
                   <label class="block text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-2">关联资源</label>
                   <div class="flex gap-2">
                      <input v-model="newPlan.resourceName" type="text" class="flex-1 bg-white border border-[#1a3c34]/20 p-2 text-sm font-serif focus:outline-none" placeholder="资源名称" />
                      <button type="button" @click="handleOpenResourceModal" class="px-3 bg-[#d4c5a3] text-[#1a3c34] font-bold text-xs uppercase hover:bg-[#c4b593]">选择</button>
                   </div>
                   <input v-model="newPlan.resourceUrl" type="url" class="w-full bg-white border border-[#1a3c34]/20 p-2 mt-2 text-sm font-mono focus:outline-none" placeholder="https://..." />
                </div>

                <!-- Info Box -->
                <div class="text-xs text-[#1a3c34]/60 font-mono bg-[#f9f9f7] p-3 border border-[#1a3c34]/10">
                   预计时长：<span class="font-bold">{{ calculatedStudyDays }} 天</span> <br/>
                   完成时间：<span class="font-bold">{{ estimatedCompletionDate || '---' }}</span>
                </div>

                <div class="flex justify-end gap-4 pt-4">
                   <button type="button" @click="closeCreatePlanModal" class="px-6 py-2 text-[#1a3c34]/60 font-bold uppercase tracking-widest text-xs hover:text-[#1a3c34]">取消</button>
                   <button type="submit" class="px-8 py-2 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest text-xs hover:bg-[#235246]">创建计划</button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Resource Picker Modal (Simplified) -->
    <div v-if="showMyResourcesModal" class="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-[#1a3c34]/90 backdrop-blur-sm px-4">
       <div class="bg-[#f4f1ea] w-full max-w-lg shadow-2xl p-6 border-t-4 border-[#d4c5a3]">
          <div class="flex justify-between items-center mb-4">
             <h3 class="text-lg font-serif font-bold text-[#1a3c34]">Select from Archive</h3>
             <button @click="showMyResourcesModal = false" class="text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#1a3c34]/10 rounded-sm p-1 transition-all"><X class="w-5 h-5"/></button>
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

    <!-- Delete Confirm -->
    <ConfirmDialog
      ref="deleteConfirmDialog"
      title="终止计划"
      message="确定要删除这个学习计划吗？所有进度记录将会丢失。"
      confirm-text="删除"
      cancel-text="保留"
      type="danger"
      @confirm="handleDeletePlan"
    />

    <!-- Check-in Modal -->
    <div v-if="showCheckinModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-serif font-bold text-[#1a3c34]">每日打卡</h3>
            <button 
              @click="showCheckinModal = false"
              class="text-[#1a3c34]/40 hover:text-[#1a3c34]"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="selectedPlan">
            <!-- Plan Info -->
            <div class="mb-6 p-4 bg-[#f9f9f7] border border-[#1a3c34]/10 rounded">
              <h4 class="font-serif font-bold text-[#1a3c34] mb-2">{{ selectedPlan.title }}</h4>
              <div class="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div class="font-bold text-[#1a3c34]">{{ selectedPlan.progress }}%</div>
                  <div class="text-[#1a3c34]/60 text-xs">Progress</div>
                </div>
                <div>
                  <div class="font-bold text-[#1a3c34]">{{ selectedPlan.totalCompletedHours || 0 }}h</div>
                  <div class="text-[#1a3c34]/60 text-xs">Completed</div>
                </div>
                <div>
                  <div class="font-bold text-[#1a3c34]">{{ selectedPlan.totalHours || 0 }}h</div>
                  <div class="text-[#1a3c34]/60 text-xs">Target</div>
                </div>
              </div>
            </div>

            <!-- Check-in Form -->
            <form @submit.prevent="handleSubmitCheckin" class="space-y-4">
              <!-- Study Hours -->
              <div>
                <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
                  学习小时数 *
                </label>
                <div class="flex items-center gap-3">
                  <input 
                    v-model.number="checkinForm.hours" 
                    type="number" 
                    step="0.5" 
                    min="0.5" 
                    max="24"
                    class="flex-1 bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] font-serif focus:border-[#1a3c34] focus:outline-none"
                    placeholder="今天学习了多少小时？"
                    required
                  />
                  <button 
                    type="button" 
                    @click="checkinForm.hours = selectedPlan.dailyHours || 2"
                    class="px-3 py-2 bg-[#f9f9f7] border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold hover:bg-[#1a3c34] hover:text-white transition-colors"
                  >
                    {{ selectedPlan.dailyHours || 2 }}小时
                  </button>
                </div>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
                  日期 *
                </label>
                <input 
                  v-model="checkinForm.date" 
                  type="date" 
                  :max="maxCheckinDate"
                  class="w-full bg-white border border-[#1a3c34]/20 p-3 font-mono text-[#1a3c34] focus:border-[#1a3c34] focus:outline-none"
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
                  rows="3" 
                  class="w-full bg-white border border-[#1a3c34]/20 p-3 font-serif text-[#1a3c34] leading-relaxed focus:border-[#1a3c34] focus:outline-none resize-none"
                  placeholder="今天学到了什么？有什么挑战或成就？"
                ></textarea>
              </div>

              <!-- Progress Preview -->
              <div class="bg-[#f9f9f7] p-4 border border-[#1a3c34]/10">
                <h4 class="text-sm font-bold text-[#1a3c34] mb-2">进度预览</h4>
                <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-[#1a3c34]/50 mb-1">
                  <span>新总计</span>
                  <span>{{ newCheckinTotalHours }}小时 / {{ selectedPlan.totalHours || 0 }}小时</span>
                </div>
                <div class="h-2 bg-white rounded-full overflow-hidden border border-[#1a3c34]/10">
                  <div 
                    class="h-full bg-[#1a3c34] transition-all duration-500" 
                    :style="{ width: `${newCheckinProgressPercent}%` }"
                  ></div>
                </div>
                <div class="text-center mt-1 text-sm font-serif font-bold text-[#1a3c34]">
                  {{ newCheckinProgressPercent }}% 完成
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-4 border-t border-[#1a3c34]/10 flex gap-3">
                <button 
                  type="button" 
                  @click="showCheckinModal = false"
                  class="flex-1 py-3 text-[#1a3c34] font-bold uppercase tracking-widest hover:underline transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  :disabled="isSubmittingCheckin || !checkinForm.hours || checkinForm.hours <= 0"
                  class="flex-1 py-3 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest hover:bg-[#235246] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="isSubmittingCheckin" class="w-4 h-4 animate-spin" />
                  <Clock v-else class="w-4 h-4" />
                  {{ isSubmittingCheckin ? '保存中...' : '记录打卡' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Check-in Notification Toast -->
    <div v-if="checkinNotification.show" 
         :class="[
           'fixed top-6 right-6 z-[110] shadow-xl px-6 py-4 font-serif font-bold border-l-4 flex items-center gap-3 animate-slide-in',
           checkinNotification.type === 'success' ? 'bg-[#f0fdf4] text-[#166534] border-[#166534]' : 
           checkinNotification.type === 'error' ? 'bg-[#fef2f2] text-[#991b1b] border-[#991b1b]' : 
           'bg-white text-[#1a3c34] border-[#1a3c34]'
         ]">
      <span>{{ checkinNotification.type === 'success' ? '✓' : checkinNotification.type === 'error' ? '!' : 'i' }}</span>
      <span>{{ checkinNotification.message }}</span>
    </div>

    <!-- Toast -->
    <div v-if="showMessage" :class="getMessageClasses(messageType)">
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
// (Script logic remains mostly identical, just ensuring imports match Vue 3 setup)
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSupabaseService } from '@/services/supabase'
import { useDatabaseStore } from '@/stores/database'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { 
  Calendar, Plus, Clock, CheckCircle2, Check, Award, Eye, Trash2,
  Link, ExternalLink, X, FileText, Loader2
} from 'lucide-vue-next'

const dbStore = useDatabaseStore()
const router = useRouter()

// Interfaces (Same as provided)
interface StudyPlan { id: string; title: string; description: string; progress: number; status: string; startDate?: string; targetDate?: string; dailyHours?: number; totalHours?: number; resourceName?: string; resourceUrl?: string; checkinCount?: number; totalDays?: number; remainingDays?: number; isTodayChecked?: boolean; created_at?: string }
interface MyResource { id: string; title: string; description: string; type: string; duration?: string; url?: string }

// State
const showCreatePlanModal = ref(false)
const showMyResourcesModal = ref(false)
const myResources = ref<MyResource[]>([])
const isLoadingMyResources = ref(false)
const isCheckingIn = ref(false)
const deleteConfirmDialog = ref<InstanceType<typeof ConfirmDialog>>()
const planToDelete = ref<StudyPlan | null>(null)
const plans = ref({ inProgress: 0, completed: 0 })
const currentPlans = ref<StudyPlan[]>([])
const isLoadingPlans = ref(true) // 添加加载状态

const newPlan = ref({ title: '', description: '', startDate: '', dailyHours: 2, totalHours: '', resourceName: '', resourceUrl: '' })

// Check-in modal state
const showCheckinModal = ref(false)
const selectedPlan = ref<StudyPlan | null>(null)
const checkinForm = ref({
  hours: 2,
  date: new Date().toISOString().split('T')[0],
  notes: ''
})
const isSubmittingCheckin = ref(false)
const checkinNotification = ref({ show: false, message: '', type: 'success' })

// Computed (Logic reused)
const calculatedStudyDays = computed(() => {
  const t = parseFloat(newPlan.value.totalHours), d = parseFloat(newPlan.value.dailyHours as any)
  if (!t || !d || d <= 0) return 0
  return Math.ceil(t / d)
})

const estimatedCompletionDate = computed(() => {
  if (!newPlan.value.startDate || calculatedStudyDays.value === 0) return ''
  const d = new Date(newPlan.value.startDate)
  if (isNaN(d.getTime())) return ''
  d.setDate(d.getDate() + calculatedStudyDays.value - 1)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

// Check-in computed properties
const maxCheckinDate = computed(() => new Date().toISOString().split('T')[0])

const newCheckinTotalHours = computed(() => {
  if (!selectedPlan.value) return 0
  return (selectedPlan.value.totalCompletedHours || 0) + checkinForm.value.hours
})

const newCheckinProgressPercent = computed(() => {
  if (!selectedPlan.value?.totalHours || selectedPlan.value.totalHours <= 0) return 0
  const newProgress = Math.round((newCheckinTotalHours.value / selectedPlan.value.totalHours) * 100)
  return Math.min(100, newProgress)
})

// Methods (Simplified for brevity, core logic maintained)
const loadDatabasePlans = async () => {
  isLoadingPlans.value = true // 开始加载
  
  try {
    const client = await dbStore.getClient()
    if(!client) return
    const userStr = localStorage.getItem('currentUser')
    if(!userStr) { currentPlans.value=[]; updateStats(); return }
    const user = JSON.parse(userStr)

    const { data, error } = await client.from('study_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading plans:', error)
      return
    }
    
    if(data && data.length > 0) {
       // 先初始化计划数据
       const initialPlans = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          status: p.status,
          progress: p.progress || 0,
          startDate: p.start_date, 
          targetDate: p.target_date, 
          dailyHours: p.daily_hours || 2,
          totalHours: p.total_hours,
          resourceName: p.resource_name, 
          resourceUrl: p.resource_url,
          checkinCount: 0,
          isTodayChecked: false,
          totalCompletedHours: 0
       }))
       
       // 并行加载所有计划的打卡记录
       await loadCheckinsForAllPlans(initialPlans)
       
       // 一次性更新所有计划数据
       currentPlans.value = initialPlans
    } else {
      currentPlans.value = []
    }
  } catch(e) { console.error(e) } finally { 
    updateStats()
    isLoadingPlans.value = false // 结束加载
  }
}

// 优化后的方法：并行加载所有计划的打卡记录
const loadCheckinsForAllPlans = async (plans: any[]) => {
  const today = new Date().toISOString().split('T')[0]
  
  // 并行获取所有计划的打卡记录
  const checkinPromises = plans.map(async (plan) => {
    try {
      const supabaseService = getSupabaseService()
      const checkins = await supabaseService.getStudyPlanCheckins(plan.id)
      
      // 计算实际完成的学习时长
      const totalHours = checkins?.reduce((sum: number, c: any) => {
        return sum + parseFloat(c.hours || '0')
      }, 0) || 0
      
      // 基于实际完成时长计算进度百分比
      let progressPercent = 0
      if (plan.totalHours && plan.totalHours > 0) {
        progressPercent = Math.min(100, Math.round((totalHours / plan.totalHours) * 100))
      } else {
        // 如果没有设置总时长，使用打卡次数作为粗略估算
        progressPercent = Math.min(100, (checkins?.length || 0) * 10)
      }
      
      // 检查今天是否已打卡
      const todayCheckin = checkins?.find((c: any) => c.checkin_date === today)
      
      // 返回更新后的计划数据
      return {
        ...plan,
        checkinCount: checkins?.length || 0,
        isTodayChecked: !!todayCheckin,
        progress: progressPercent,
        totalCompletedHours: totalHours
      }
      
    } catch (error) {
      console.error(`Failed to load checkins for plan ${plan.id}:`, error)
      // 如果加载失败，返回原始数据
      return plan
    }
  })
  
  // 等待所有打卡记录加载完成
  const updatedPlans = await Promise.all(checkinPromises)
  
  // 批量更新数据库中的进度
  const progressUpdatePromises = updatedPlans.map(plan => 
    updatePlanProgressInDB(plan.id, plan.progress)
  )
  
  try {
    await Promise.all(progressUpdatePromises)
  } catch (error) {
    console.error('Failed to update some progress in DB:', error)
  }
  
  // 更新原始数组中的数据
  updatedPlans.forEach((updatedPlan, index) => {
    plans[index] = updatedPlan
  })
}

// 更新数据库中的进度
const updatePlanProgressInDB = async (planId: string, progress: number) => {
  try {
    const client = await dbStore.getClient()
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

const updateStats = () => {
   plans.value = {
      inProgress: currentPlans.value.filter(p => p.progress < 100).length,
      completed: currentPlans.value.filter(p => p.progress >= 100).length
   }
}

const handleCreatePlan = async () => {
   try {
      // 验证必填字段
      if (!newPlan.value.title.trim()) {
         showToast('请输入计划标题', 'error')
         return
      }
      
      if (!newPlan.value.startDate) {
         showToast('Please select a start date', 'error')
         return
      }
      
      if (!newPlan.value.dailyHours || newPlan.value.dailyHours <= 0) {
         showToast('请输入有效的每日学习时长', 'error')
         return
      }
      
      // 构建计划数据
      const planData = {
         title: newPlan.value.title.trim(),
         description: newPlan.value.description?.trim() || '',
         startDate: newPlan.value.startDate,
         dailyHours: parseFloat(newPlan.value.dailyHours.toString()),
         totalHours: newPlan.value.totalHours ? parseFloat(newPlan.value.totalHours.toString()) : null,
         resourceName: newPlan.value.resourceName?.trim() || '',
         resourceUrl: newPlan.value.resourceUrl?.trim() || '',
         progress: 0,
         status: 'in_progress'
      }
      
      // 调用创建计划服务
      const client = await dbStore.getClient()
      const { data, error } = await client
         .from('study_plans')
         .insert([{
            user_id: JSON.parse(localStorage.getItem('currentUser') || '{}').id,
            title: planData.title,
            description: planData.description,
            progress: 0,
            status: 'in_progress',
            start_date: planData.startDate,
            target_date: null, // 可以根据需要计算
            daily_hours: planData.dailyHours,
            total_hours: planData.totalHours,
            resource_name: planData.resourceName,
            resource_url: planData.resourceUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
         }])
         .select()
      
      if (error) {
         console.error('Create plan error:', error)
         showToast(`创建计划失败: ${error.message}`, 'error')
         return
      }
      
      if (data && data.length > 0) {
         console.log('Plan created successfully:', data[0])
         closeCreatePlanModal()
         showToast('学习计划创建成功！', 'success')
         loadDatabasePlans() // Refresh the list
      }
      
   } catch (error: any) {
      console.error('Create plan failed:', error)
      showToast('创建学习计划失败', 'error')
   }
}

const handleCheckin = (plan: StudyPlan) => {
   console.log('handleCheckin called with plan:', plan)
   if (!plan || !plan.id) {
      console.error('Plan or plan.id is undefined:', plan)
      return
   }
   showCheckinModal.value = true
   selectedPlan.value = plan
   // Reset form with suggested hours
   checkinForm.value.hours = plan.dailyHours || 2
   checkinForm.value.date = new Date().toISOString().split('T')[0]
   checkinForm.value.notes = ''
}

// Check-in functions
const showCheckinNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  checkinNotification.value = { show: true, message, type }
  setTimeout(() => { checkinNotification.value.show = false }, 3000)
}

const handleSubmitCheckin = async () => {
  if (!selectedPlan.value) return
  
  isSubmittingCheckin.value = true
  
  try {
    console.log('Starting check-in process for plan:', selectedPlan.value.id)
    console.log('Check-in form data:', checkinForm.value)
    
    // 验证表单数据
    if (!checkinForm.value.hours || checkinForm.value.hours <= 0) {
      showCheckinNotification('请输入有效的学习时长', 'error')
      isSubmittingCheckin.value = false
      return
    }
    
    // 首先检查今天是否已经打卡了
    const supabaseService = getSupabaseService()
    const existingCheckins = await supabaseService.getStudyPlanCheckins(selectedPlan.value.id)
    const todayCheckin = existingCheckins?.find((c: any) => c.checkin_date === checkinForm.value.date)
    
    if (todayCheckin) {
      showCheckinNotification('该日期已打卡！', 'error')
      isSubmittingCheckin.value = false
      return
    }
    
    console.log('Adding check-in to database...')
    // 记录打卡
    const checkinData = await supabaseService.addStudyPlanCheckin(selectedPlan.value.id, {
      hours: checkinForm.value.hours,
      notes: checkinForm.value.notes,
      date: checkinForm.value.date
    })
    
    console.log('Check-in data saved:', checkinData)
    
    if (checkinData) {
      // 重新计算实际进度（基于所有打卡记录）
      const allCheckins = await supabaseService.getStudyPlanCheckins(selectedPlan.value.id)
      const totalCompletedHours = allCheckins?.reduce((sum: number, c: any) => {
        return sum + parseFloat(c.hours || '0')
      }, 0) || 0
      
      console.log('Total completed hours:', totalCompletedHours)
      
      // 基于实际完成时长计算进度
      let actualProgressPercent = 0
      if (selectedPlan.value.totalHours && selectedPlan.value.totalHours > 0) {
        actualProgressPercent = Math.min(100, Math.round((totalCompletedHours / selectedPlan.value.totalHours) * 100))
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
        .eq('id', selectedPlan.value.id)
      
      console.log('Progress updated in database')
      
      // 更新本地页面数据
      selectedPlan.value.totalCompletedHours = totalCompletedHours
      selectedPlan.value.progress = actualProgressPercent
      
      // 更新计划列表中的对应计划
      const planIndex = currentPlans.value.findIndex(p => p.id === selectedPlan.value?.id)
      if (planIndex !== -1) {
        currentPlans.value[planIndex].totalCompletedHours = totalCompletedHours
        currentPlans.value[planIndex].progress = actualProgressPercent
        currentPlans.value[planIndex].isTodayChecked = true
      }
      
      // 显示成功提示，包含进度信息
      const progressMessage = actualProgressPercent >= 100 
        ? `打卡成功！🎉 计划已完成 (${actualProgressPercent}%)!`
        : `打卡成功！进度: ${actualProgressPercent}%`
      
      showCheckinNotification(progressMessage, 'success')
      
      // 关闭模态框
      setTimeout(() => {
        showCheckinModal.value = false
        selectedPlan.value = null
      }, 2000)
    }
  } catch (error: any) {
    console.error('Check-in failed:', error)
    showCheckinNotification(error.message || '记录打卡失败', 'error')
  } finally {
    isSubmittingCheckin.value = false
  }
}

const fetchMyResources = async () => {
   // Fetch logic...
   myResources.value = [{id:'1', title:'Sample Resource', description:'...', type:'Book'}] // Mock
}

const handleOpenResourceModal = () => { showMyResourcesModal.value = true; fetchMyResources() }
const selectResource = (r: MyResource) => { 
   newPlan.value.resourceName = r.title; newPlan.value.resourceUrl = r.url || ''; 
   showMyResourcesModal.value = false 
}

const closeCreatePlanModal = () => { 
   showCreatePlanModal.value = false;
   newPlan.value = { title: '', description: '', startDate: '', dailyHours: 2, totalHours: '', resourceName: '', resourceUrl: '' };
}
const showDeleteConfirm = (p: StudyPlan) => { planToDelete.value = p; deleteConfirmDialog.value?.show() }
const handleDeletePlan = async () => {
   if (!planToDelete.value) {
      showToast('未选择要删除的计划', 'error')
      return
   }
   
   try {
      // 删除学习计划（由于有外键约束，相关的打卡记录会自动删除）
      await supabaseService.deleteStudyPlan(planToDelete.value.id)
      
      deleteConfirmDialog.value?.hide()
      planToDelete.value = null
      showToast('计划删除成功。', 'success')
      loadDatabasePlans()
   } catch (error) {
      console.error('Failed to delete plan:', error)
      showToast('删除计划失败', 'error')
   }
}

const updatePlanProgress = async (planId: string) => {
   try {
      // 获取该计划的所有打卡记录
      const checkins = await supabaseService.getStudyPlanCheckins(planId)
      
      if (checkins && checkins.length > 0) {
         // 计算总学习时长，兼容有无hours字段的情况
         const totalHours = checkins.reduce((sum: number, checkin: any) => {
           const planInfo = currentPlans.value.find(p => p.id === planId)
           return sum + (checkin.hours || planInfo?.dailyHours || 1)
         }, 0)
         
         // 获取计划信息以计算进度
         const planInfo = currentPlans.value.find(p => p.id === planId)
         if (planInfo && planInfo.totalHours) {
            const progressPercent = Math.min(100, Math.round((totalHours / planInfo.totalHours) * 100))
            
            // 更新进度到数据库
            const client = await dbStore.getClient()
            await client
               .from('study_plans')
               .update({ progress: progressPercent, last_checkin: new Date().toISOString() })
               .eq('id', planId)
         }
      }
   } catch (error) {
      console.error('Failed to update progress:', error)
   }
}

const viewPlanDetail = (id: string) => { 
  console.log('View plan detail:', id)
  if (id) {
    router.push(`/study-plan/${id}`)
  } else {
    console.error('Plan ID is undefined in viewPlanDetail')
  }
}
const formatDate = (str?: string) => str ? new Date(str).toLocaleDateString('en-US') : 'N/A'

onMounted(() => { 
  isLoadingPlans.value = true // 初始加载状态
  loadDatabasePlans() 
})
</script>

<style scoped>
:deep(.bg-green-100) { background-color: #f0fdf4 !important; color: #166534 !important; border-color: #166534 !important; }

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>