import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbService, connection } from '@/services/database'
import { supabaseService } from '@/services/supabase'

export const useDatabaseStore = defineStore('database', () => {
  // 响应式数据
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const followFeatureAvailable = ref(true)

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

  // 根据用户ID获取用户
  async function getUserById(userId: string) {
    return supabaseService.getUserById(userId)
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

  // 获取用户资源数量
  async function getUserResourceCount(userId: string) {
    try {
      const client = await getClient()
      const { count, error } = await client
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId)
      
      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('获取用户资源数量失败:', error)
      return 0
    }
  }

  // 获取用户帖子数量
  async function getUserPostCount(userId: string) {
    try {
      const client = await getClient()
      const { count, error } = await client
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('获取用户帖子数量失败:', error)
      return 0
    }
  }

  // 获取用户发布的资源
  async function getUserResources(userId: string) {
    try {
      const client = await getClient()
      const { data, error } = await client
        .from('resources')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取用户资源失败:', error)
      return []
    }
  }

  // 获取用户发布的帖子
  async function getUserPosts(userId: string) {
    try {
      const client = await getClient()
      const { data, error } = await client
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取用户帖子失败:', error)
      return []
    }
  }

  // 检查是否关注了某用户
  async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!followFeatureAvailable.value) {
      return false
    }
    try {
      const client = await getClient()
      const { data, error } = await client
        .from('user_follows')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single()

      if (error) {
        if (error.code === 'PGRST205') {
          followFeatureAvailable.value = false
          console.warn('用户关注功能未启用：缺少 user_follows 表')
          return false
        }
        if (error.code !== 'PGRST116') throw error
      }
      return !!data
    } catch (err: any) {
      if (err?.code === 'PGRST205') {
        followFeatureAvailable.value = false
        console.warn('用户关注功能未启用：缺少 user_follows 表')
        return false
      }
      console.error('检查关注状态失败:', err)
      return false
    }
  }

  // 关注用户
  async function followUser(followingId: string) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (!currentUser.id) {
        throw new Error('用户未登录')
      }

      if (!followFeatureAvailable.value) {
        throw new Error('当前环境尚未启用关注功能')
      }

      const client = await getClient()
      const { data, error } = await client
        .from('user_follows')
        .insert([{
          follower_id: currentUser.id,
          following_id: followingId,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        if (error.code === 'PGRST205') {
          followFeatureAvailable.value = false
          throw new Error('当前环境尚未启用关注功能')
        }
        throw error
      }
      return data?.[0]
    } catch (error) {
      console.error('关注用户失败:', error)
      throw error
    }
  }

  // 取消关注用户
  async function unfollowUser(followingId: string) {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (!currentUser.id) {
        throw new Error('用户未登录')
      }

      if (!followFeatureAvailable.value) {
        throw new Error('当前环境尚未启用关注功能')
      }

      const client = await getClient()
      const { error } = await client
        .from('user_follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', followingId)

      if (error) {
        if (error.code === 'PGRST205') {
          followFeatureAvailable.value = false
          throw new Error('当前环境尚未启用关注功能')
        }
        throw error
      }
      return true
    } catch (error) {
      console.error('取消关注失败:', error)
      throw error
    }
  }

  // 添加到收藏
  async function addToFavorites(userId: string, resourceId: string) {
    return supabaseService.addToFavorites(userId, resourceId)
  }

  // 从收藏中移除
  async function removeFromFavorites(userId: string, resourceId: string) {
    return supabaseService.removeFromFavorites(userId, resourceId)
  }

  // 获取数据库客户端
  const getClient = async () => {
    return dbService.getClient()
  }

  // 重新连接数据库
  const reconnect = async () => {
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
    getClient,
    getUsers,
    createUser,
    getUserById,
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
    getUserResourceCount,
    getUserPostCount,
    getUserResources,
    getUserPosts,
    isFollowing,
    followUser,
    unfollowUser,
    reconnect
  }
})