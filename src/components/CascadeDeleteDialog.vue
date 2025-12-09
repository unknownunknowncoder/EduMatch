<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a3c34]/95 backdrop-blur-sm px-4">
      
      <!-- Modal Container (Official Document) -->
      <div class="bg-[#f4f1ea] w-full max-w-lg shadow-2xl relative border-t-8 border-[#b03e3e] max-h-[90vh] overflow-y-auto rounded-sm">
        
        <!-- Watermark -->
        <AlertTriangle class="absolute -right-10 -top-10 w-48 h-48 text-[#b03e3e]/5 -z-0 pointer-events-none rotate-12" />

        <div class="p-8 relative z-10">
          
          <!-- Header -->
          <div class="flex items-start gap-4 mb-6 border-b border-[#1a3c34]/10 pb-4">
            <div class="p-3 bg-[#b03e3e]/10 rounded-sm">
              <Trash2 class="w-8 h-8 text-[#b03e3e]" />
            </div>
            <div>
              <h3 class="text-2xl font-serif font-bold text-[#1a3c34] leading-tight">删除协议</h3>
              <p class="text-[#1a3c34]/60 text-sm mt-1 font-medium">
                {{ message }}
              </p>
            </div>
          </div>
          
          <!-- Linked References (Evidence List) -->
          <div v-if="relatedPosts && relatedPosts.length > 0" class="mb-8">
            <div class="bg-white border border-[#1a3c34]/20 p-4 shadow-sm relative">
              <!-- Paperclip decoration -->
              <div class="absolute -top-3 right-4 w-4 h-8 border-2 border-[#1a3c34]/40 rounded-full border-b-0"></div>
              
              <h4 class="text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Link class="w-3 h-3" /> 检测到关联引用
              </h4>
              
              <ul class="space-y-2">
                <li v-for="post in relatedPosts.slice(0, 3)" :key="post.id" class="flex items-start gap-2 text-sm text-[#1a3c34]/80 font-mono bg-[#f4f1ea] p-2 border-l-2 border-[#d4c5a3]">
                  <FileText class="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60" />
                  <span class="line-clamp-1">{{ post.title }}</span>
                </li>
                <li v-if="relatedPosts.length > 3" class="text-xs text-[#1a3c34]/50 italic pl-2 pt-1 font-serif">
                  ...以及其他 {{ relatedPosts.length - 3 }} 个文档。
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Execution Options -->
          <div class="space-y-4 mb-8">
            <h4 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">选择操作方式</h4>
            
            <!-- Option 1: Cancel -->
            <label class="flex items-start gap-3 p-4 border transition-all cursor-pointer group hover:bg-white"
                   :class="deleteOption === 'cancel' ? 'border-[#1a3c34] bg-white shadow-md' : 'border-[#1a3c34]/10 bg-transparent'">
              <div class="mt-0.5">
                <input v-model="deleteOption" type="radio" value="cancel" class="accent-[#1a3c34] w-4 h-4" />
              </div>
              <div>
                <span class="block font-serif font-bold text-[#1a3c34] text-sm group-hover:text-[#1a3c34]">中止操作</span>
                <p class="text-xs text-[#1a3c34]/60 mt-1">不执行任何操作，先查看关联引用。</p>
              </div>
            </label>

            <!-- Option 2: Resource Only -->
            <label class="flex items-start gap-3 p-4 border transition-all cursor-pointer group hover:bg-white"
                   :class="deleteOption === 'resource_only' ? 'border-[#1a3c34] bg-white shadow-md' : 'border-[#1a3c34]/10 bg-transparent'">
              <div class="mt-0.5">
                <input v-model="deleteOption" type="radio" value="resource_only" class="accent-[#1a3c34] w-4 h-4" />
              </div>
              <div>
                <span class="block font-serif font-bold text-[#1a3c34] text-sm">取消链接并归档</span>
                <p class="text-xs text-[#1a3c34]/60 mt-1">
                  {{ relatedPosts && relatedPosts.length > 0 ? '仅删除资源，关联帖子将显示"资源已移除"。' : '删除该资源。' }}
                </p>
              </div>
            </label>

            <!-- Option 3: Cascade (Danger) -->
            <label class="flex items-start gap-3 p-4 border transition-all cursor-pointer group hover:bg-[#b03e3e]/5"
                   :class="deleteOption === 'cascade' ? 'border-[#b03e3e] bg-[#b03e3e]/5 shadow-md' : 'border-[#1a3c34]/10 bg-transparent'">
              <div class="mt-0.5">
                <input v-model="deleteOption" type="radio" value="cascade" class="accent-[#b03e3e] w-4 h-4" />
              </div>
              <div>
                <span class="block font-serif font-bold text-[#b03e3e] text-sm flex items-center gap-2">
                  <AlertOctagon class="w-3 h-3" /> 级联清除
                </span>
                <p class="text-xs text-[#b03e3e]/80 mt-1 font-medium">
                  删除资源及所有关联帖子。此操作不可逆转。
                </p>
              </div>
            </label>
          </div>
          
          <!-- Footer Actions -->
          <div class="flex justify-end gap-4 pt-6 border-t border-[#1a3c34]/10">
            <button
              @click="handleCancel"
              class="px-6 py-2 text-[#1a3c34]/60 font-bold uppercase tracking-widest text-xs hover:text-[#1a3c34] transition-colors"
            >
              取消
            </button>
            <button
              @click="handleConfirm"
              :disabled="!canConfirm"
              :class="confirmButtonClass"
              class="px-8 py-2.5 font-bold uppercase tracking-widest text-xs text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="deleteOption === 'cascade'">执行清除</span>
              <span v-else>确认</span>
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, AlertTriangle, Link, FileText, ArrowRight, AlertOctagon } from 'lucide-vue-next'

interface RelatedPost {
  id: string
  title: string
}

interface Props {
  title?: string
  message: string
  relatedPosts?: RelatedPost[]
  confirmText?: string
  type?: 'warning' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认删除',
  confirmText: '确认',
  type: 'warning'
})

const emit = defineEmits<{
  confirm: [option: string]
  cancel: []
}>()

const visible = ref(false)
const deleteOption = ref('cancel')

const confirmButtonClass = computed(() => {
  if (!canConfirm.value) {
    return 'bg-[#1a3c34]/40'
  }
  
  if (deleteOption.value === 'cascade') {
    return 'bg-[#b03e3e] hover:bg-[#8a2c2c]' // 红色警示
  }
  
  return 'bg-[#1a3c34] hover:bg-[#235246]' // 墨绿标准
})

const canConfirm = computed(() => {
  return deleteOption.value !== 'cancel'
})

const show = () => {
  visible.value = true
  if (props.relatedPosts && props.relatedPosts.length > 0) {
    deleteOption.value = 'cancel'
  } else {
    deleteOption.value = 'resource_only'
  }
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm', deleteOption.value)
    hide()
  }
}

const handleCancel = () => {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 简单的行截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>