<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3] pb-20">
    
    <!-- Top Banner (Library Aesthetic) -->
    <div class="h-64 relative overflow-hidden bg-[#0f281f]">
      <img 
        src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay grayscale-[30%]"
        alt="Desk Study"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#f4f1ea]"></div>
      

      
      <div class="absolute bottom-8 left-0 right-0 p-8 text-center">
         <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#0f281f] mb-2">新建资源</h1>
         <p class="text-[#0f281f]/60 font-serif italic tracking-wide">将新资源编录到档案中。</p>
      </div>
    </div>

    <!-- Main Form Container (Paper Card) -->
    <div class="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
      <div class="bg-white shadow-xl rounded-sm border-t-4 border-[#0f281f] p-8 md:p-12 relative overflow-hidden">
        
        <!-- Decorative Watermark -->
        <FileText class="absolute -right-10 -bottom-10 w-64 h-64 text-[#f4f1ea] -z-0 pointer-events-none opacity-50" />

        <form @submit.prevent="handleSubmit" class="relative z-10 space-y-12">
          
          <!-- Section 1: Core Data -->
          <div class="space-y-8">
            <div class="flex items-center gap-3 border-b border-[#0f281f]/10 pb-2">
               <Layers class="w-5 h-5 text-[#d4c5a3]" />
               <h2 class="text-lg font-serif font-bold text-[#0f281f] uppercase tracking-widest">核心元数据</h2>
            </div>

            <!-- Title -->
            <div class="group">
               <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">资源标题 *</label>
               <input
                 v-model="formData.title"
                 type="text"
                 required
                 class="w-full bg-transparent border-b-2 border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-3 text-[#0f281f] text-2xl font-serif placeholder-slate-300 focus:outline-none transition-colors"
                 placeholder="例如：高级神经网络"
               />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <!-- Type -->
               <div class="group">
                  <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">格式类型 *</label>
                  <select
                    v-model="formData.type"
                    required
                    class="w-full bg-transparent border-b border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-2 text-[#0f281f] font-serif focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>选择分类...</option>
                    <option value="course">系列课程</option>
                    <option value="book">电子书籍</option>
                    <option value="video">视频讲座</option>
                    <option value="article">学术文章</option>
                    <option value="tool">工具软件</option>
                    <option value="other">其他资料</option>
                  </select>
               </div>
               
               <!-- Provider -->
               <div class="group">
                  <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">来源 / 提供者</label>
                  <input
                    v-model="formData.provider"
                    type="text"
                    class="w-full bg-transparent border-b border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-2 text-[#0f281f] font-serif placeholder-slate-300 focus:outline-none transition-colors"
                    placeholder="例如：MIT 公开课"
                  />
               </div>
            </div>
          </div>

          <!-- Section 2: Details -->
          <div class="space-y-8">
            <div class="flex items-center gap-3 border-b border-[#0f281f]/10 pb-2">
               <BookOpen class="w-5 h-5 text-[#d4c5a3]" />
               <h2 class="text-lg font-serif font-bold text-[#0f281f] uppercase tracking-widest">详细分析</h2>
            </div>

            <!-- Description -->
            <div class="group">
               <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">摘要 / 描述</label>
               <textarea
                 v-model="formData.description"
                 rows="4"
                 class="w-full bg-[#f9f9f9] border border-[#0f281f]/10 rounded-sm p-4 text-[#0f281f] font-serif placeholder-slate-300 focus:outline-none focus:border-[#0f281f] transition-colors resize-none"
                 placeholder="提供材料的简要摘要..."
               ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
               <!-- Difficulty -->
               <div class="group">
                  <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">复杂程度</label>
                  <select
                    v-model="formData.difficulty"
                    class="w-full bg-transparent border-b border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-2 text-[#0f281f] font-serif focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>选择级别...</option>
                    <option value="beginner">入门基础 (101)</option>
                    <option value="intermediate">进阶提升 (201)</option>
                    <option value="advanced">高阶研究 (301+)</option>
                  </select>
               </div>

               <!-- Duration -->
               <div class="group">
                  <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">预计时长（小时）</label>
                  <input
                    v-model.number="formData.duration"
                    type="number"
                    min="0"
                    step="0.5"
                    class="w-full bg-transparent border-b border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-2 text-[#0f281f] font-serif placeholder-slate-300 focus:outline-none transition-colors"
                    placeholder="0.0"
                  />
               </div>
            </div>

            <!-- URL -->
            <div class="group">
               <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">访问链接 *</label>
               <div class="flex items-center gap-2 border-b border-[#0f281f]/20 focus-within:border-[#0f281f] transition-colors">
                  <LinkIcon class="w-4 h-4 text-slate-400" />
                  <input
                    v-model="formData.url"
                    type="url"
                    class="w-full bg-transparent px-0 py-2 text-blue-800 font-mono text-sm placeholder-slate-300 focus:outline-none"
                    placeholder="https://..."
                  />
               </div>
            </div>

            <!-- Tags -->
            <div class="group">
               <label class="block text-xs font-bold text-[#0f281f]/70 uppercase tracking-widest mb-2">关键词 / 标签</label>
               <input
                 v-model="formData.tags"
                 type="text"
                 class="w-full bg-transparent border-b border-[#0f281f]/20 focus:border-[#0f281f] px-0 py-2 text-[#0f281f] font-serif placeholder-slate-300 focus:outline-none transition-colors"
                 placeholder="用逗号分隔（例如：科学、数学、历史）"
               />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-8 border-t border-[#0f281f]/10 flex items-center justify-end gap-6">
            <button
              type="button"
              @click="handleCancel"
              class="text-sm font-bold text-[#0f281f]/60 hover:text-[#0f281f] transition-colors uppercase tracking-widest"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-8 py-3 bg-[#0f281f] text-[#d4c5a3] rounded-sm font-bold uppercase tracking-widest hover:bg-[#1a4533] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 group"
            >
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-[#d4c5a3] border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSubmitting ? '归档中...' : '发布资源' }}</span>
              <Save v-if="!isSubmitting" class="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </form>
      </div>
    </div>

    <!-- Message Toast -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import { ArrowLeft, Layers, BookOpen, Link as LinkIcon, Save, FileText } from 'lucide-vue-next'

const router = useRouter()

// 表单数据
const formData = reactive({
  title: '',
  description: '',
  type: '',
  difficulty: '',
  duration: '',
  provider: '',
  url: '',
  tags: ''
})

// 提交状态
const isSubmitting = ref(false)

// 提交表单
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    let currentUserId = null
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user && user.id) {
          currentUserId = user.id
        }
      }
    }
    
    if (!currentUserId) {
      showToast('Authentication required to archive resources.', 'warning')
      isSubmitting.value = false
      return
    }
    
    const resourceData = {
      title: formData.title,
      description: formData.description,
      type: formData.type || 'other',
      category: formData.type,
      difficulty: formData.difficulty,
      duration: formData.duration,
      provider: formData.provider,
      url: formData.url,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      created_by: currentUserId
    }
    
    const createdResource = await supabaseService.createResource(resourceData)
    
    if (!createdResource || !createdResource.id) {
      throw new Error('Archive creation failed: Invalid response.')
    }
    
    showToast('Resource successfully archived.', 'success')
    
    setTimeout(() => {
      // 假设有一个资源详情页或列表页
      // 这里跳回搜索页或个人中心可能更合适，视你路由而定
      router.push('/search') 
    }, 1500)
  } catch (error) {
    console.error('Submission failed:', error)
    showToast('Failed to archive resource: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/search')
}
</script>

<style scoped>
/* 消息提示框样式覆盖（适配 Scheme C） */
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

:deep(.bg-yellow-100) {
  background-color: #fefce8 !important;
  color: #854d0e !important;
  border-color: #854d0e !important;
}

/* 简单的滑入动画 */
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