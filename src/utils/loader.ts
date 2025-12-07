import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 全局加载状态
const isLoading = ref(false)
const loadingMessage = ref('Loading...')
const error = ref<string | null>(null)

export const useGlobalLoader = () => {
  const router = useRouter()
  const route = useRoute()

  // 显示加载状态
  const showLoader = (message: string = 'Loading...') => {
    isLoading.value = true
    loadingMessage.value = message
    error.value = null
  }

  // 隐藏加载状态
  const hideLoader = () => {
    isLoading.value = false
    loadingMessage.value = 'Loading...'
  }

  // 显示错误
  const showError = (message: string) => {
    error.value = message
    isLoading.value = false
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: computed(() => isLoading.value),
    loadingMessage: computed(() => loadingMessage.value),
    error: computed(() => error.value),
    showLoader,
    hideLoader,
    showError,
    clearError
  }
}