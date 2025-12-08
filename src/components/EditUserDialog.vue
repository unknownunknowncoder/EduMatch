<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a3c34]/90 backdrop-blur-sm px-4">
      
      <!-- Modal Container -->
      <div class="bg-[#f4f1ea] w-full max-w-md shadow-2xl relative border-t-8 border-[#d4c5a3]">
        
        <!-- Close Button -->
        <button 
          @click="handleCancel" 
          class="absolute top-4 right-4 text-[#1a3c34]/40 hover:text-[#1a3c34] transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="p-8">
          
          <!-- Header -->
          <div class="mb-8 border-b border-[#1a3c34]/10 pb-4">
            <div class="flex items-center gap-2 mb-1">
              <FileSignature class="w-5 h-5 text-[#d4c5a3]" />
              <h3 class="text-2xl font-serif font-bold text-[#1a3c34]">编辑记录</h3>
            </div>
            <p class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest">
              修改类型：{{ editType === 'nickname' ? '身份信息' : '个人简介' }}
            </p>
          </div>
          
          <!-- 昵称编辑 -->
          <div class="mb-6" v-if="editType === 'nickname'">
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
              昵称
            </label>
            <div class="relative">
              <input 
                v-model="nicknameValue"
                type="text" 
                placeholder="请输入新昵称..."
                maxlength="20"
                class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] font-serif focus:border-[#1a3c34] focus:outline-none transition-colors placeholder-[#1a3c34]/20"
              >
              <div class="absolute right-2 bottom-2 text-[10px] font-mono text-[#1a3c34]/40 bg-[#f4f1ea] px-1 rounded">
                {{ nicknameValue.length }}/20
              </div>
            </div>
          </div>

          <!-- 个人签名编辑 -->
          <div class="mb-6" v-if="editType === 'bio'">
            <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">
              个性签名
            </label>
            <div class="relative">
              <textarea
                v-model="bioValue"
                rows="4"
                maxlength="200"
                placeholder="请介绍一下您的学术背景或兴趣..."
                class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] font-serif leading-relaxed focus:border-[#1a3c34] focus:outline-none transition-colors resize-none placeholder-[#1a3c34]/20"
              ></textarea>
              <div class="absolute right-2 bottom-2 text-[10px] font-mono text-[#1a3c34]/40 bg-[#f4f1ea] px-1 rounded">
                {{ bioValue.length }}/200
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end gap-4 pt-4 border-t border-[#1a3c34]/10">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-[#1a3c34]/60 font-bold uppercase tracking-widest text-xs hover:text-[#1a3c34] transition-colors"
            >
              取消
            </button>
            <button
              @click="handleConfirm"
              class="px-6 py-2 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest text-xs hover:bg-[#235246] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              :disabled="isConfirmDisabled"
            >
              <Save class="w-3 h-3" />
              <span>{{ confirmText }}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, FileSignature, Save } from 'lucide-vue-next'

interface Props {
  title?: string
  editType: 'nickname' | 'bio'
  initialValue?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '编辑信息',
  confirmText: '保存更改'
})

const emit = defineEmits<{
  confirm: [value: string]
  cancel: []
}>()

const visible = ref(false)
const nicknameValue = ref('')
const bioValue = ref('')

const isConfirmDisabled = computed(() => {
  if (props.editType === 'nickname') {
    return !nicknameValue.value.trim()
  }
  if (props.editType === 'bio') {
    // 允许 bio 为空，但如果是未修改状态(且不为空时)可能需要考虑业务逻辑
    // 这里简单处理：只要内容变化了或者原内容不为空都可以提交
    return false 
  }
  return false
})

// 监听编辑类型变化，重置表单值
watch(() => props.editType, (newType) => {
  if (newType === 'nickname') {
    nicknameValue.value = props.initialValue || ''
  } else if (newType === 'bio') {
    bioValue.value = props.initialValue || ''
  }
}, { immediate: true })

const show = () => {
  visible.value = true
  // 重置表单值
  if (props.editType === 'nickname') {
    nicknameValue.value = props.initialValue || ''
  } else if (props.editType === 'bio') {
    bioValue.value = props.initialValue || ''
  }
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  const value = props.editType === 'nickname' ? nicknameValue.value.trim() : bioValue.value.trim()
  emit('confirm', value)
  hide()
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

/* 弹窗进入时的微动效 */
.fade-enter-active .shadow-2xl,
.fade-leave-active .shadow-2xl {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from .shadow-2xl,
.fade-leave-to .shadow-2xl {
  transform: scale(0.95) translateY(10px);
}
</style>