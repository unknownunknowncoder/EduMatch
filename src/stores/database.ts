import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbService, connection } from '@/services/database'
import { supabaseService } from '@/services/supabase'

export const useDatabaseStore = defineStore('database', () => {
  // 响应式数据
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isConnected = computed(() => connection.status === 'connected')
  const isConnecting = computed(() => connection.status === 'connecting')
  const hasError = computed(() => connection.status === 'error')

  // 执行数据库查询的通用方法
  async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (!isConnected.value) {
      throw new Error('数据库未连接')
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await dbService.query(query, params)
      return result as T[]
    } catch (err) {
      error.value = err instanceof Error ? err.message : '查询失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户数据
  async function getUsers() {
    try {
      const client = supabaseService.getClient()
      const { data, error } = await client.from('users').select('*')
      if (error) throw error
      return data
    } catch (error) {
      console.error('获取用户数据失败:', error)
      return []
    }
  }

  // 创建用户
  async function createUser(userData: {
    username: string
    nickname?: string
    password_hash: string
    avatar_url?: string
  }) {
    return supabaseService.createUser(userData)
  }

  // 根据用户名获取用户
  async function getUserByUsername(username: string) {
    return supabaseService.getUserByUsername(username)
  }

  // 根据邮箱获取用户
  async function getUserByEmail(email: string) {
    return supabaseService.getUserByEmail(email)
  }

  // 根据昵称获取用户
  async function getUserByNickname(nickname: string) {
    return supabaseService.getUserByNickname(nickname)
  }

  // 更新用户昵称
  async function updateUserNickname(userId: string, nickname: string) {
    return supabaseService.updateUserNickname(userId, nickname)
  }

  // 获取学习资源
  async function getResources(options: {
    limit?: number
    offset?: number
    category?: string
    difficulty?: string
    search?: string
  } = {}) {
    return supabaseService.getResources(options)
  }

  // 搜索资源
  async function searchResources(keyword: string) {
    return supabaseService.getResources({ search: keyword })
  }

  // 添加学习记录
  async function addLearningRecord(userId: string, resourceId: string) {
    return supabaseService.addLearningRecord({
      user_id: userId,
      resource_id: resourceId,
      progress: 0
    })
  }

  // 获取学习记录
  async function getLearningRecords(userId: string) {
    return supabaseService.getLearningRecords(userId)
  }

  // 获取收藏列表
  async function getFavorites(userId: string) {
    return supabaseService.getFavorites(userId)
  }

  // 添加到收藏
  async function addToFavorites(userId: string, resourceId: string) {
    return supabaseService.addToFavorites(userId, resourceId)
  }

  // 从收藏中移除
  async function removeFromFavorites(userId: string, resourceId: string) {
    return supabaseService.removeFromFavorites(userId, resourceId)
  }

  // 重新连接数据库
  async function reconnect() {
    await dbService.init()
  }

  return {
    // 状态
    isLoading,
    error,
    isConnected,
    isConnecting,
    hasError,

    // 方法
    executeQuery,
    getUsers,
    createUser,
    getUserByUsername,
    getUserByEmail,
    getUserByNickname,
    updateUserNickname,
    getResources,
    searchResources,
    addLearningRecord,
    getLearningRecords,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    reconnect
  }
})