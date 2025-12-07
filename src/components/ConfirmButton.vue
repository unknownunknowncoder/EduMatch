<template>
  <div class="relative inline-block">
    <!-- 主按钮 -->
    <button
      @click="handleClick"
      :disabled="disabled || confirming"
      :class="buttonClasses"
      v-bind="$attrs"
    >
      <component 
        :is="confirming ? Loader2 : icon" 
        v-if="icon" 
        :class="iconClasses" 
      />
      <span v-if="confirming">{{ confirmingText }}</span>
      <span v-else>{{ text }}</span>
    </button>
    
    <!-- 确认对话框 -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
          <!-- 背景遮罩 -->
          <div 
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="cancel"
          ></div>
          
          <!-- 对话框 -->
          <div 
            class="relative bg-[#f4f1ea] rounded-sm shadow-lg border border-[#d4c5a3]/30 max-w-md w-full mx-4 border-t-2 border-t-[#1a3c34]"
            :class="size === 'small' ? 'p-4' : size === 'large' ? 'p-6' : 'p-5'"
          >
            <!-- 头部 -->
            <div class="flex items-start gap-3">
              <!-- 警告图标 -->
              <div 
                class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm border"
                :class="[
                  variant === 'danger' ? 'bg-[#b03e3e]/10 border-[#b03e3e]/30 text-[#b03e3e]' : 
                  variant === 'warning' ? 'bg-[#d4c5a3]/10 border-[#d4c5a3]/30 text-[#d4c5a3]' :
                  variant === 'info' ? 'bg-[#1a3c34]/10 border-[#1a3c34]/30 text-[#1a3c34]' :
                  'bg-[#1a3c34]/10 border-[#1a3c34]/30 text-[#1a3c34]'
                ]"
              >
                <AlertTriangle 
                  v-if="variant === 'danger' || variant === 'warning'"
                  :class="size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'"
                />
                <HelpCircle 
                  v-else
                  :class="size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5'"
                />
              </div>
              
              <!-- 内容 -->
              <div class="flex-1 min-w-0">
                <h3 
                  v-if="confirmTitle" 
                  class="font-serif font-bold text-[#1a3c34] mb-1"
                  :class="size === 'small' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-sm'"
                >
                  {{ confirmTitle }}
                </h3>
                <p 
                  class="text-[#1a3c34]/70 leading-relaxed font-serif"
                  :class="size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-sm'"
                >
                  {{ confirmMessage }}
                </p>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex gap-3 mt-4 justify-end">
              <button
                @click="cancel"
                class="px-4 py-2 rounded-sm text-sm font-serif font-medium transition-colors bg-[#f4f1ea] border border-[#d4c5a3]/30 text-[#1a3c34] hover:bg-[#d4c5a3]/10"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                class="px-4 py-2 rounded-sm text-sm font-serif font-medium transition-colors"
                :class="[
                  variant === 'danger' ? 'bg-[#b03e3e] text-[#f4f1ea] hover:bg-[#8a2f2f]' :
                  variant === 'warning' ? 'bg-[#d4c5a3] text-[#1a3c34] hover:bg-[#b8a678]' :
                  variant === 'info' ? 'bg-[#1a3c34] text-[#f4f1ea] hover:bg-[#244838]' :
                  'bg-[#1a3c34] text-[#f4f1ea] hover:bg-[#244838]'
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-vue-next'

interface Props {
  text: string
  confirmTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
  confirmingText?: string
  variant?: 'danger' | 'warning' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: any
  requireConfirmation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmTitle: '确认操作',
  confirmMessage: '您确定要执行此操作吗？此操作可能无法撤销。',
  confirmText: '确认',
  cancelText: '取消',
  confirmingText: '处理中...',
  variant: 'warning',
  size: 'medium',
  disabled: false,
  requireConfirmation: true
})

const emit = defineEmits<{
  click: []
  confirm: []
  cancel: []
}>()

const showConfirm = ref(false)
const confirming = ref(false)

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    props.disabled || props.confirming ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ]
  
  const sizeClasses = props.size === 'small' ? 'px-3 py-1.5 text-xs' :
                       props.size === 'large' ? 'px-6 py-3 text-base' :
                       'px-4 py-2 text-sm'
  
  const variantClasses = props.variant === 'danger' ? 
    ['bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'] :
    props.variant === 'warning' ?
    ['bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'] :
    props.variant === 'info' ?
    ['bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'] :
    ['bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500']
  
  return [...baseClasses, ...sizeClasses, ...variantClasses]
})

const iconClasses = computed(() => {
  return props.size === 'small' ? 'w-3 h-3' :
         props.size === 'large' ? 'w-5 h-5' :
         'w-4 h-4'
})

const handleClick = () => {
  if (props.disabled || props.confirming) return
  
  if (props.requireConfirmation) {
    showConfirm.value = true
  } else {
    emit('click')
  }
}

const confirm = async () => {
  showConfirm.value = false
  confirming.value = true
  
  try {
    emit('confirm')
    // 等待一个tick让父组件处理
    await new Promise(resolve => setTimeout(resolve, 100))
  } finally {
    confirming.value = false
  }
}

const cancel = () => {
  showConfirm.value = false
  emit('cancel')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(-10px);
  opacity: 0;
}
</style>