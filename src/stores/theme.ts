import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    applyTheme()
  }
  
  // 应用主题
  const applyTheme = () => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme.value)
    localStorage.setItem('theme', theme.value)
  }
  
  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  // 监听主题变化
  watch(theme, () => {
    applyTheme()
  })
  
  // 计算属性
  const isDark = computed(() => theme.value === 'dark')
  
  return {
    theme: computed(() => theme.value),
    isDark,
    toggleTheme,
    initTheme
  }
})