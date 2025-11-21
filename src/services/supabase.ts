import { dbService } from './database'
import { dbConfig } from '@/config/database'

// Supabase 数据库操作的专用服务
export class SupabaseService {
  private static instance: SupabaseService

  constructor() {
    if (SupabaseService.instance) {
      return SupabaseService.instance
    }
    SupabaseService.instance = this
  }

  // 获取 Supabase 客户端
  getClient() {
    return dbService.getClient()
  }

  // 用户相关操作
  async createUser(userData: {
    username: string
    email?: string
    nickname?: string
    password_hash: string
    avatar_url?: string
  }) {
    const client = this.getClient()
    
    // 过滤掉 undefined 的字段，避免传递到数据库
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    )
    
    const { data, error } = await client
      .from('users')
      .insert([filteredData])
      .select()
    
    if (error) throw error
    return data[0]
  }

  async getUserById(id: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async getUserByEmail(email: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getUserByUsername(username: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getUserByNickname(nickname: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('nickname', nickname)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async updateUserNickname(userId: string, nickname: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('users')
      .update({ nickname })
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  }

  // 学习资源相关操作
  async getResources(options: {
    limit?: number
    offset?: number
    category?: string
    difficulty?: string
    search?: string
  } = {}) {
    const client = this.getClient()
    let query = client.from('resources').select('*')

    // 添加筛选条件
    if (options.category) {
      query = query.eq('category', options.category)
    }

    if (options.difficulty) {
      query = query.eq('difficulty', options.difficulty)
    }

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    // 添加排序和分页
    query = query.order('created_at', { ascending: false })

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async getResourceById(id: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async createResource(resourceData: {
    title: string
    description: string
    category: string
    difficulty: string
    rating?: number
    duration?: string
    provider?: string
    url?: string
    created_by?: string
  }) {
    const client = this.getClient()
    const { data, error } = await client
      .from('resources')
      .insert([resourceData])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // 学习记录相关操作
  async addLearningRecord(recordData: {
    user_id: string
    resource_id: string
    progress?: number
  }) {
    const client = this.getClient()
    const { data, error } = await client
      .from('learning_records')
      .insert([recordData])
      .select()
    
    if (error) throw error
    return data[0]
  }

  async getLearningRecords(userId: string, options: {
    limit?: number
    offset?: number
  } = {}) {
    const client = this.getClient()
    let query = client
      .from('learning_records')
      .select(`
        *,
        resources (
          id,
          title,
          description,
          category,
          difficulty,
          rating,
          duration,
          provider,
          url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  async updateLearningProgress(recordId: string, progress: number) {
    const client = this.getClient()
    const { data, error } = await client
      .from('learning_records')
      .update({ progress, completed_at: progress >= 100 ? new Date().toISOString() : null })
      .eq('id', recordId)
      .select()
    
    if (error) throw error
    return data[0]
  }

  // 收藏相关操作
  async addToFavorites(userId: string, resourceId: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('favorites')
      .insert([{ user_id: userId, resource_id: resourceId }])
      .select()
    
    if (error) throw error
    return data[0]
  }

  async removeFromFavorites(userId: string, resourceId: string) {
    const client = this.getClient()
    const { error } = await client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
    
    if (error) throw error
  }

  async getFavorites(userId: string, options: {
    limit?: number
    offset?: number
  } = {}) {
    const client = this.getClient()
    let query = client
      .from('favorites')
      .select(`
        *,
        resources (
          id,
          title,
          description,
          category,
          difficulty,
          rating,
          duration,
          provider,
          url,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // 通用查询方法
  async customQuery<T = any>(table: string, options: any = {}) {
    return dbService.query(table, options) as Promise<T[]>
  }
}

// 导出单例实例
export const supabaseService = new SupabaseService()