// Supabase 客户端单例管理
// 解决 Multiple GoTrueClient instances detected 警告

import { dbConfig } from '@/config/database'

interface SupabaseClient {
  from: (table: string) => any
  auth: any
  storage: any
  functions: any
}

class SupabaseSingleton {
  private static instance: SupabaseClient | null = null
  private static isInitializing = false
  private static initPromise: Promise<SupabaseClient> | null = null

  // 获取单例实例
  static async getInstance(): Promise<SupabaseClient> {
    // 如果已有实例，直接返回
    if (this.instance) {
      console.log('📋 复用现有 Supabase 客户端实例')
      return this.instance
    }

    // 如果正在初始化，等待初始化完成
    if (this.isInitializing && this.initPromise) {
      console.log('⏳ 等待 Supabase 客户端初始化完成')
      return this.initPromise
    }

    // 开始初始化
    this.isInitializing = true
    this.initPromise = this.createInstance()
    
    try {
      const client = await this.initPromise
      this.instance = client
      return client
    } finally {
      this.isInitializing = false
      this.initPromise = null
    }
  }

  // 创建客户端实例
  private static async createInstance(): Promise<SupabaseClient> {
    console.log('🆕 创建新的 Supabase 客户端实例')

    if (!dbConfig.connectionString || !dbConfig.apiKey) {
      console.warn('⚠️ Supabase URL 或 API Key 未配置')
      throw new Error('Supabase 配置缺失')
    }

    try {
      // 动态导入 Supabase 客户端
      const { createClient } = await import('@supabase/supabase-js')
      
      const client = createClient(
        dbConfig.connectionString,
        dbConfig.apiKey,
        {
          // 添加唯一标识，避免多实例警告
          global: {
            headers: {
              'X-Client-Name': 'EduMatch-Vue-App-Single',
              'X-Client-Version': '1.0.0'
            }
          },
          // 启用持久化会话
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        }
      )

      console.log('✅ Supabase 客户端创建成功（单例模式）')
      return client

    } catch (error) {
      console.error('❌ 创建 Supabase 客户端失败:', error)
      throw error
    }
  }

  // 重置单例（需要时调用）
  static reset(): void {
    console.log('🔄 重置 Supabase 客户端单例')
    this.instance = null
    this.isInitializing = false
    this.initPromise = null
  }

  // 检查是否已初始化
  static isInitialized(): boolean {
    return this.instance !== null
  }
}

export default SupabaseSingleton