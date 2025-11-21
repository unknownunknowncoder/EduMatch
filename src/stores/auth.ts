import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)  // 改为 false，不自动登录
  
  // 初始化时不设置默认用户，让用户必须手动登录
  const initializeAuth = () => {
    console.log('🔐 Auth store 初始化，不自动登录')
    
    // 检查当前登录状态
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user && user.id) {
          isAuthenticated.value = true
          console.log('✅ 发现有效登录状态:', user.username)
        } else {
          console.log('❌ 用户数据无效，清除登录状态')
          localStorage.removeItem('currentUser')
        }
      } catch (error) {
        console.log('❌ 用户数据解析失败，清除登录状态')
        localStorage.removeItem('currentUser')
      }
    }
  }
  
  // 用户数据将从数据库获取
  
  // 检查登录状态
  const checkAuthStatus = () => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      isAuthenticated.value = true
    }
  }
  
  // 登录 (使用数据库验证)
  const login = async (username: string, password: string) => {
    try {
      // 这里应该调用数据库服务，为了兼容性暂时保持原逻辑
      console.log('🔐 尝试登录:', username)
      
      // 简单的本地验证（实际项目中应该调用数据库）
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const user = JSON.parse(currentUser)
        if (user.username === username) {
          isAuthenticated.value = true
          return user
        }
      }
      
      // 如果没有匹配的用户，说明需要通过数据库验证
      throw new Error('请使用数据库登录系统')
      
    } catch (error) {
      isAuthenticated.value = false
      throw error
    }
  }
  
  // 注册 (重定向到数据库注册)
  const register = async (username: string, password: string, nickname: string) => {
    // 重定向到数据库注册系统
    console.log('📝 注册请求，请使用数据库注册系统')
    throw new Error('请使用数据库注册系统')
  }
  
  // 登出
  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
  }
  
  // 获取当前用户
  const getCurrentUser = () => {
    const currentUser = localStorage.getItem('currentUser')
    return currentUser ? JSON.parse(currentUser) : null
  }
  
  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    checkAuthStatus,
    login,
    register,
    logout,
    getCurrentUser
  }
})