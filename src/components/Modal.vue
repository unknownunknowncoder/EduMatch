<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-wrapper" @click="handleBackdropClick">
        <!-- 背景遮罩 -->
        <div 
          class="modal-backdrop"
          :class="backdropClasses"
        ></div>
        
        <!-- 模态框容器 -->
        <div 
          class="modal-container"
          :class="containerClasses"
          @click.stop
        >
          <!-- 模态框 -->
          <div 
            class="modal-content"
            :class="contentClasses"
          >
            <!-- 头部 -->
            <header 
              v-if="showHeader"
              class="modal-header"
              :class="headerClasses"
            >
              <!-- 标题区域 -->
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <!-- 图标 -->
                <div 
                  v-if="icon"
                  class="flex-shrink-0"
                  :class="iconContainerClasses"
                >
                  <component :is="icon" :class="iconClasses" />
                </div>
                
                <!-- 标题 -->
                <div class="flex-1 min-w-0">
                  <h2 
                    v-if="title"
                    class="modal-title"
                    :class="titleClasses"
                  >
                    {{ title }}
                  </h2>
                  <p 
                    v-if="subtitle"
                    class="modal-subtitle"
                    :class="subtitleClasses"
                  >
                    {{ subtitle }}
                  </p>
                </div>
              </div>
              
              <!-- 关闭按钮 -->
              <button
                v-if="closable"
                @click="handleClose"
                class="modal-close"
                :class="closeButtonClasses"
              >
                <component :is="closeIcon" :class="closeIconClasses" />
              </button>
            </header>
            
            <!-- 主体内容 -->
            <main 
              class="modal-body"
              :class="bodyClasses"
            >
              <slot>
                <p v-if="message">{{ message }}</p>
              </slot>
            </main>
            
            <!-- 底部操作区 -->
            <footer 
              v-if="showFooter"
              class="modal-footer"
              :class="footerClasses"
            >
              <slot name="footer">
                <div class="flex gap-3 justify-end">
                  <!-- 取消按钮 -->
                  <button
                    v-if="showCancelButton"
                    @click="handleCancel"
                    :class="cancelButtonClasses"
                  >
                    {{ cancelText }}
                  </button>
                  
                  <!-- 确认按钮 -->
                  <button
                    v-if="showConfirmButton"
                    @click="handleConfirm"
                    :disabled="loading"
                    :class="confirmButtonClasses"
                  >
                    <component 
                      v-if="loading"
                      :is="loadingIcon" 
                      :class="loadingIconClasses" 
                    />
                    <span v-if="!loading">{{ confirmText }}</span>
                    <span v-else>{{ loadingText }}</span>
                  </button>
                </div>
              </slot>
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  message?: string
  icon?: any
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'success'
  closable?: boolean
  backdrop?: boolean
  closeOnBackdrop?: boolean
  showHeader?: boolean
  showFooter?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelText?: string
  confirmText?: string
  loading?: boolean
  loadingText?: string
  persistent?: boolean // 禁止关闭
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'default',
  closable: true,
  backdrop: true,
  closeOnBackdrop: true,
  showHeader: true,
  showFooter: false,
  showCancelButton: true,
  showConfirmButton: true,
  cancelText: '取消',
  confirmText: '确认',
  loadingText: '处理中...',
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  cancel: []
  confirm: []
  'opened': []
  'closed': []
}>()

const backdropClasses = computed(() => {
  const baseClasses = ['fixed inset-0 z-40']
  
  if (props.backdrop) {
    baseClasses.push('bg-black/50 backdrop-blur-sm')
  } else {
    baseClasses.push('bg-transparent')
  }
  
  return baseClasses
})

const containerClasses = computed(() => {
  const baseClasses = ['fixed inset-0 z-50 flex items-center justify-center p-4']
  
  const sizeClasses = {
    small: 'items-center',
    medium: 'items-center',
    large: 'items-center',
    fullscreen: 'items-stretch p-0'
  }
  
  return [...baseClasses, ...sizeClasses[props.size]]
})

const contentClasses = computed(() => {
  const baseClasses = ['bg-white shadow-2xl relative max-h-full flex flex-col']
  
  const sizeClasses = {
    small: ['w-full max-w-md rounded-lg'],
    medium: ['w-full max-w-lg rounded-lg'],
    large: ['w-full max-w-2xl rounded-lg'],
    fullscreen: ['w-full h-full rounded-none']
  }
  
  if (props.maxWidth) {
    baseClasses.push(`max-w-[${props.maxWidth}]`)
  }
  
  return [...baseClasses, ...sizeClasses[props.size]]
})

const headerClasses = computed(() => {
  const sizeClasses = {
    small: ['px-4 py-3'],
    medium: ['px-6 py-4'],
    large: ['px-8 py-6'],
    fullscreen: ['px-6 py-4 border-b']
  }
  
  const variantClasses = {
    default: ['border-b border-gray-200'],
    danger: ['border-b border-red-200 bg-red-50'],
    warning: ['border-b border-yellow-200 bg-yellow-50'],
    info: ['border-b border-blue-200 bg-blue-50'],
    success: ['border-b border-green-200 bg-green-50']
  }
  
  return [...sizeClasses[props.size], ...variantClasses[props.variant]]
})

const bodyClasses = computed(() => {
  const sizeClasses = {
    small: ['px-4 py-3'],
    medium: ['px-6 py-4'],
    large: ['px-8 py-6'],
    fullscreen: ['flex-1 overflow-auto p-6']
  }
  
  return [...sizeClasses[props.size], 'flex-1 overflow-auto']
})

const footerClasses = computed(() => {
  const sizeClasses = {
    small: ['px-4 py-3'],
    medium: ['px-6 py-4'],
    large: ['px-8 py-6'],
    fullscreen: ['px-6 py-4 border-t']
  }
  
  const variantClasses = {
    default: ['border-t border-gray-200 bg-gray-50'],
    danger: ['border-t border-red-200 bg-red-50'],
    warning: ['border-t border-yellow-200 bg-yellow-50'],
    info: ['border-t border-blue-200 bg-blue-50'],
    success: ['border-t border-green-200 bg-green-50']
  }
  
  return [...sizeClasses[props.size], ...variantClasses[props.variant]]
})

const iconContainerClasses = computed(() => {
  const variantClasses = {
    default: ['text-gray-600'],
    danger: ['text-red-600'],
    warning: ['text-yellow-600'],
    info: ['text-blue-600'],
    success: ['text-green-600']
  }
  
  return variantClasses[props.variant]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
    fullscreen: 'w-6 h-6'
  }
  
  return sizeClasses[props.size]
})

const titleClasses = computed(() => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    fullscreen: 'text-xl'
  }
  
  return [`font-semibold text-gray-900 ${sizeClasses[props.size]}`]
})

const subtitleClasses = computed(() => {
  return ['text-sm text-gray-600 mt-1']
})

const closeButtonClasses = computed(() => {
  const baseClasses = [
    'flex-shrink-0 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  ]
  
  const variantClasses = {
    default: ['text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-500'],
    danger: ['text-red-400 hover:text-red-600 hover:bg-red-100 focus:ring-red-500'],
    warning: ['text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500'],
    info: ['text-blue-400 hover:text-blue-600 hover:bg-blue-100 focus:ring-blue-500'],
    success: ['text-green-400 hover:text-green-600 hover:bg-green-100 focus:ring-green-500']
  }
  
  return [...baseClasses, ...variantClasses[props.variant]]
})

const closeIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-5 h-5',
    fullscreen: 'w-5 h-5'
  }
  
  return sizeClasses[props.size]
})

const cancelButtonClasses = computed(() => {
  return [
    'px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors',
    props.loading ? 'opacity-50 cursor-not-allowed' : ''
  ]
})

const confirmButtonClasses = computed(() => {
  const baseClasses = [
    'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors inline-flex items-center gap-2',
    props.loading ? 'opacity-50 cursor-not-allowed' : ''
  ]
  
  const variantClasses = {
    default: ['bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'],
    danger: ['bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'],
    warning: ['bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500'],
    info: ['bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'],
    success: ['bg-green-600 text-white hover:bg-green-700 focus:ring-green-500']
  }
  
  return [...baseClasses, ...variantClasses[props.variant]]
})

const loadingIconClasses = computed(() => {
  return 'w-4 h-4 animate-spin'
})

const closeIcon = computed(() => X)
const loadingIcon = computed(() => Loader2)

const handleClose = () => {
  if (props.persistent || props.loading) return
  
  emit('update:modelValue', false)
  emit('close')
}

const handleCancel = () => {
  if (props.persistent || props.loading) return
  
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  if (props.loading) return
  
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent && !props.loading) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && !props.persistent && !props.loading) {
    handleClose()
  }
}

// 监听键盘事件
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscape)
    nextTick(() => {
      emit('opened')
    })
  } else {
    document.removeEventListener('keydown', handleEscape)
    nextTick(() => {
      emit('closed')
    })
  }
})

// 清理事件监听
const cleanup = () => {
  document.removeEventListener('keydown', handleEscape)
}

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(cleanup)
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-10px);
  opacity: 0;
}

.modal-enter-active .modal-backdrop,
.modal-leave-active .modal-backdrop {
  transition: opacity 0.3s ease;
}

.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  opacity: 0;
}

.modal-title {
  margin: 0;
  word-break: break-word;
}

.modal-subtitle {
  margin: 0;
  word-break: break-word;
}

.modal-body {
  word-wrap: break-word;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.min-w-0 {
  min-width: 0;
}

.max-h-full {
  max-height: 100%;
}

.overflow-auto {
  overflow: auto;
}

.text-center {
  text-align: center;
}

.font-semibold {
  font-weight: 600;
}

.font-medium {
  font-weight: 500;
}

.inline-flex {
  display: inline-flex;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

.relative {
  position: relative;
}

.w-full {
  width: 100%;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-lg {
  max-width: 32rem;
}

.max-w-2xl {
  max-width: 42rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: rgb(229 231 235);
}

.border-red-200 {
  border-color: rgb(254 202 202);
}

.border-yellow-200 {
  border-color: rgb(254 240 138);
}

.border-blue-200 {
  border-color: rgb(219 234 254);
}

.border-green-200 {
  border-color: rgb(187 247 208);
}

.border-gray-300 {
  border-color: rgb(209 213 219);
}

.bg-white {
  background-color: rgb(255 255 255);
}

.bg-gray-50 {
  background-color: rgb(249 250 251);
}

.bg-red-50 {
  background-color: rgb(254 242 242);
}

.bg-yellow-50 {
  background-color: rgb(254 252 232);
}

.bg-blue-50 {
  background-color: rgb(239 246 255);
}

.bg-green-50 {
  background-color: rgb(240 253 244);
}

.bg-black\/50 {
  background-color: rgb(0 0 0 / 0.5);
}

.bg-blue-600 {
  background-color: rgb(37 99 235);
}

.bg-red-600 {
  background-color: rgb(220 38 38);
}

.bg-yellow-600 {
  background-color: rgb(202 138 4);
}

.bg-green-600 {
  background-color: rgb(22 163 74);
}

.text-white {
  color: rgb(255 255 255);
}

.text-gray-400 {
  color: rgb(156 163 175);
}

.text-gray-600 {
  color: rgb(75 85 99);
}

.text-gray-700 {
  color: rgb(55 65 81);
}

.text-gray-900 {
  color: rgb(17 24 39);
}

.text-red-400 {
  color: rgb(248 113 113);
}

.text-red-600 {
  color: rgb(220 38 38);
}

.text-yellow-400 {
  color: rgb(251 191 36);
}

.text-yellow-600 {
  color: rgb(202 138 4);
}

.text-blue-400 {
  color: rgb(96 165 250);
}

.text-blue-600 {
  color: rgb(37 99 235);
}

.text-green-400 {
  color: rgb(74 222 128);
}

.text-green-600 {
  color: rgb(22 163 74);
}

.shadow-2xl {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast);
}

.p-2 {
  padding: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-7 {
  width: 1.75rem;
}

.h-7 {
  height: 1.75rem;
}

.hover\:bg-gray-50:hover {
  background-color: rgb(249 250 251);
}

.hover\:bg-gray-100:hover {
  background-color: rgb(243 244 246);
}

.hover\:bg-red-100:hover {
  background-color: rgb(254 226 226);
}

.hover\:bg-yellow-100:hover {
  background-color: rgb(254 249 195);
}

.hover\:bg-blue-100:hover {
  background-color: rgb(219 234 254);
}

.hover\:bg-green-100:hover {
  background-color: rgb(220 252 231);
}

.hover\:text-gray-600:hover {
  color: rgb(75 85 99);
}

.hover\:text-red-600:hover {
  color: rgb(220 38 38);
}

.hover\:text-yellow-600:hover {
  color: rgb(202 138 4);
}

.hover\:text-blue-600:hover {
  color: rgb(37 99 235);
}

.hover\:text-green-600:hover {
  color: rgb(22 163 74);
}

.hover\:bg-blue-700:hover {
  background-color: rgb(29 78 216);
}

.hover\:bg-red-700:hover {
  background-color: rgb(185 28 28);
}

.hover\:bg-yellow-700:hover {
  background-color: rgb(161 98 7);
}

.hover\:bg-green-700:hover {
  background-color: rgb(21 128 61);
}

.opacity-50 {
  opacity: 0.5;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
}

.focus\:ring-gray-500:focus {
  --tw-ring-color: rgb(107 114 128);
}

.focus\:ring-red-500:focus {
  --tw-ring-color: rgb(239 68 68);
}

.focus\:ring-yellow-500:focus {
  --tw-ring-color: rgb(234 179 8);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

.focus\:ring-green-500:focus {
  --tw-ring-color: rgb(34 197 94);
}

.word-break\:break-word {
  overflow-wrap: break-word;
}

.word-wrap\:break-word {
  overflow-wrap: break-word;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>