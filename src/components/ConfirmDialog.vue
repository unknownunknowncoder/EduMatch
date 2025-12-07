<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a3c34]/90 backdrop-blur-sm px-4">
      
      <!-- Modal Container -->
      <div class="w-full max-w-md bg-[#f4f1ea] shadow-2xl relative overflow-hidden rounded-sm border-t-4" 
           :class="borderColorClass">
        
        <!-- Decoration: Background Watermark -->
        <AlertTriangle v-if="type === 'danger' || type === 'warning'" class="absolute -right-6 -bottom-6 w-32 h-32 text-[#1a3c34]/5 -z-0 pointer-events-none rotate-12" />
        <Info v-else class="absolute -right-6 -bottom-6 w-32 h-32 text-[#1a3c34]/5 -z-0 pointer-events-none rotate-12" />

        <div class="p-8 relative z-10">
          
          <!-- Header -->
          <div class="flex items-start gap-4 mb-4">
            <div class="p-3 rounded-sm flex-shrink-0" :class="iconBgClass">
              <component :is="iconComponent" class="w-6 h-6" :class="iconColorClass" />
            </div>
            <div>
              <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-2">{{ title }}</h3>
              <p class="text-[#1a3c34]/70 font-serif leading-relaxed text-sm">
                {{ message }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[#1a3c34]/10">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-[#1a3c34]/60 font-bold uppercase tracking-widest text-xs hover:text-[#1a3c34] transition-colors"
            >
              {{ cancelText === '取消' ? 'Discard' : cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="confirmButtonClass"
              class="px-6 py-2.5 font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 rounded-sm"
            >
              <span>{{ confirmText }}</span>
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
import { AlertTriangle, Info, ArrowRight, Trash2 } from 'lucide-vue-next'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = ref(false)

// 样式逻辑
const borderColorClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'border-[#b03e3e]' // 暗红
    case 'warning': return 'border-[#d4c5a3]' // 黄铜
    default: return 'border-[#1a3c34]' // 墨绿
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-[#b03e3e]/10'
    case 'warning': return 'bg-[#d4c5a3]/20'
    default: return 'bg-[#1a3c34]/10'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'text-[#b03e3e]'
    case 'warning': return 'text-[#8c734b]' // 深金
    default: return 'text-[#1a3c34]'
  }
})

const iconComponent = computed(() => {
  switch (props.type) {
    case 'danger': return Trash2 // 删除通常是危险操作
    case 'warning': return AlertTriangle
    default: return Info
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-[#b03e3e] text-white hover:bg-[#8a2c2c]'
    case 'warning':
      return 'bg-[#d4c5a3] text-[#1a3c34] hover:bg-[#c4b593]'
    default:
      return 'bg-[#1a3c34] text-[#d4c5a3] hover:bg-[#235246]'
  }
})

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm')
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

/* 弹窗进入时的缩放效果 */
.fade-enter-active .w-full,
.fade-leave-active .w-full {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from .w-full,
.fade-leave-to .w-full {
  transform: scale(0.95) translateY(10px);
}
</style>