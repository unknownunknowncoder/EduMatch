// 通用提示工具类
import { ref } from 'vue'

// 提示类型
export type MessageType = 'success' | 'error' | 'warning' | 'info'

// 全局提示状态
const showMessage = ref(false)
const messageText = ref('')
const messageType = ref<MessageType>('success')

// 显示提示
export const showToast = (
  message: string, 
  type: MessageType = 'success', 
  duration: number = 3000
) => {
  messageText.value = message
  messageType.value = type
  showMessage.value = true
  
  // 自动隐藏
  setTimeout(() => {
    showMessage.value = false
  }, duration)
}

// 获取样式类名
export const getMessageClasses = (type: MessageType) => {
  const baseClasses = 'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 shadow-xl z-[110] font-serif font-bold border-l-4 transition-all duration-300'
  
  const typeClasses = {
    success: 'bg-white text-[#0f281f] border-[#d4c5a3]',
    error: 'bg-white text-red-700 border-red-500',
    warning: 'bg-white text-yellow-700 border-yellow-500',
    info: 'bg-white text-blue-700 border-blue-500'
  }
  
  return `${baseClasses} ${typeClasses[type]}`
}



// 获取图标SVG
export const getMessageIcon = (type: MessageType) => {
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`
  }
  
  return icons[type]
}

// 导出响应式变量供组件使用
export { showMessage, messageText, messageType }