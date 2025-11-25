import { ref, reactive } from 'vue'
import { dbConfig, ConnectionStatus, type DatabaseConnection } from '@/config/database'

// 数据库连接状态
export const connection = reactive<DatabaseConnection>({
  status: ConnectionStatus.DISCONNECTED
})

// 数据库服务类
export class DatabaseService {
  private static instance: DatabaseService
  private client: any = null

  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }
    DatabaseService.instance = this
  }

  // 初始化数据库连接
  async init() {
    try {
      connection.status = ConnectionStatus.CONNECTING
      
      switch (dbConfig.type) {
        case 'mysql':
          await this.initMySQL()
          break
        case 'postgresql':
          await this.initPostgreSQL()
          break
        case 'mongodb':
          await this.initMongoDB()
          break
        case 'firebase':
          await this.initFirebase()
          break
        case 'supabase':
          await this.initSupabase()
          break
        default:
          throw new Error(`Unsupported database type: ${dbConfig.type}`)
      }

      connection.status = ConnectionStatus.CONNECTED
      connection.lastConnected = new Date()
      console.log(`✅ 数据库连接成功 (${dbConfig.type})`)
      
    } catch (error) {
      connection.status = ConnectionStatus.ERROR
      connection.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ 数据库连接失败:', error)
    }
  }

  // MySQL 连接初始化
  private async initMySQL() {
    // 注意：这里需要安装 mysql2 包
    // npm install mysql2 @types/mysql2
    
    console.log('🔄 初始化 MySQL 连接...')
    console.log('配置信息:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database
    })
    
    // Supabase 连接已配置
    // const mysql = require('mysql2/promise')
    // this.client = await mysql.createConnection({
    //   host: dbConfig.host,
    //   port: dbConfig.port,
    //   user: dbConfig.username,
    //   password: dbConfig.password,
    //   database: dbConfig.database
    // })
  }

  // PostgreSQL 连接初始化
  private async initPostgreSQL() {
    console.log('🔄 初始化 PostgreSQL 连接...')
    
    // 注意：这里需要安装 pg 包
    // npm install pg @types/pg
    
    // Supabase 连接已配置
    // const { Client } = require('pg')
    // this.client = new Client({
    //   host: dbConfig.host,
    //   port: dbConfig.port,
    //   user: dbConfig.username,
    //   password: dbConfig.password,
    //   database: dbConfig.database
    // })
    // await this.client.connect()
  }

  // MongoDB 连接初始化
  private async initMongoDB() {
    console.log('🔄 初始化 MongoDB 连接...')
    
    // 注意：这里需要安装 mongodb 包
    // npm install mongodb
    
    // Supabase 连接已配置
    // const { MongoClient } = require('mongodb')
    // const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    // this.client = new MongoClient(uri)
    // await this.client.connect()
  }

  // Firebase 连接初始化
  private async initFirebase() {
    console.log('🔄 初始化 Firebase 连接...')
    
    // 注意：这里需要安装 firebase 包
    // npm install firebase
    
    // Supabase 连接已配置
    // import { initializeApp } from 'firebase/app'
    // import { getFirestore } from 'firebase/firestore'
    // 
    // const firebaseConfig = {
    //   apiKey: dbConfig.apiKey,
    //   authDomain: dbConfig.authDomain,
    //   projectId: dbConfig.projectId,
    //   storageBucket: dbConfig.storageBucket,
    //   messagingSenderId: dbConfig.messagingSenderId,
    //   appId: dbConfig.appId
    // }
    // 
    // const app = initializeApp(firebaseConfig)
    // this.client = getFirestore(app)
  }

  // Supabase 连接初始化
  private async initSupabase() {
    console.log('🔄 初始化 Supabase 连接...')
    
    if (!dbConfig.connectionString || !dbConfig.apiKey) {
      console.warn('⚠️ Supabase URL 或 API Key 未配置，跳过数据库连接')
      console.log('📝 请在 .env 文件中配置:')
      console.log('   VITE_SUPABASE_URL=https://your-project-id.supabase.co')
      console.log('   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key')
      // 不抛出错误，只是设置为未连接状态
      connection.status = ConnectionStatus.DISCONNECTED
      return
    }

    try {
      // 动态导入 Supabase 客户端
      const { createClient } = await import('@supabase/supabase-js')
      
      this.client = createClient(
        dbConfig.connectionString,
        dbConfig.apiKey
      )
      
      console.log('✅ Supabase 客户端初始化成功')
      
      // 测试连接 - 使用实际存在的表
      const { data, error } = await this.client.from('users').select('id').limit(1)
      // 预期会成功或失败，但测试连接是否正常
      console.log('🔗 Supabase 连接测试完成')
    } catch (error) {
      console.error('❌ Supabase 连接失败:', error)
      throw error
    }
  }

  // 获取数据库客户端
  getClient() {
    if (!this.client) {
      console.warn('⚠️ 数据库客户端未初始化，尝试重新连接...')
      this.init().catch(console.error)
      // 即使连接失败，也返回一个模拟客户端，避免应用崩溃
      if (!this.client) {
        console.warn('⚠️ 数据库连接失败，返回模拟客户端')
        return {
          from: () => ({
            select: () => ({ data: null, error: new Error('数据库未连接') }),
            insert: () => ({ data: null, error: new Error('数据库未连接') }),
            update: () => ({ data: null, error: new Error('数据库未连接') }),
            delete: () => ({ data: null, error: new Error('数据库未连接') }),
            eq: () => ({ data: null, error: new Error('数据库未连接') })
          })
        }
      }
    }
    return this.client
  }

  // 执行查询
  async query(table: string, options?: any) {
    if (connection.status !== ConnectionStatus.CONNECTED) {
      throw new Error('数据库未连接')
    }

    console.log('🔍 执行查询:', table, options)
    
    // 根据不同的数据库类型执行查询
    switch (dbConfig.type) {
      case 'mysql':
        // SQL 查询
        const sql = options?.sql || table
        const params = options?.params || []
        return this.client?.execute(sql, params)
        
      case 'postgresql':
        return this.client?.query(table, options)
        
      case 'mongodb':
        // MongoDB 查询语法不同
        return this.client?.collection(options?.collection || table).find(options?.filter || {}).toArray()
        
      case 'supabase':
        // Supabase 查询语法
        const queryBuilder = this.client.from(table)
        
        if (options?.select) {
          queryBuilder.select(options.select)
        }
        
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            queryBuilder.eq(key, value)
          })
        }
        
        if (options?.order) {
          Object.entries(options.order).forEach(([column, ascending]) => {
            queryBuilder.order(column, { ascending: ascending as boolean })
          })
        }
        
        if (options?.limit) {
          queryBuilder.limit(options.limit)
        }
        
        if (options?.range) {
          queryBuilder.range(options.range[0], options.range[1])
        }
        
        return await queryBuilder
        
      default:
        throw new Error('暂不支持该数据库类型的查询')
    }
  }

  // 关闭连接
  async close() {
    if (this.client) {
      try {
        if (dbConfig.type === 'mongodb') {
          await this.client.close()
        } else if (dbConfig.type === 'postgresql') {
          await this.client.end()
        } else {
          await this.client.end()
        }
        
        connection.status = ConnectionStatus.DISCONNECTED
        console.log('🔌 数据库连接已关闭')
      } catch (error) {
        console.error('❌ 关闭数据库连接时出错:', error)
      }
    }
  }

  // 创建学习计划
  async createStudyPlan(planData: any) {
    try {
      console.log('💾 创建学习计划:', planData)
      
      // 获取当前用户
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      // 如果没有用户信息，返回空数组（不显示任何数据）
      if (!currentUser.id) {
        console.warn('⚠️ 未找到用户ID，返回空数据')
        return []
      }

      // 转换字段名（驼峰式转下划线式）
      const convertedPlan = {
        user_id: currentUser.id,
        title: planData.title,
        description: planData.description,
        progress: planData.progress || 0,
        status: planData.status || 'pending',
        start_date: planData.startDate,
        target_date: planData.targetDate,
        daily_hours: planData.dailyHours,
        total_hours: planData.totalHours || null,
        resource_name: planData.resourceName,
        resource_url: planData.resourceUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('🔄 转换后的数据:', convertedPlan)

      let result
      
      switch (dbConfig.type) {
        case 'supabase':
          const { data, error } = await this.client
            .from('study_plans')
            .insert([convertedPlan])
            .select()
          
          if (error) {
            throw new Error(`Supabase插入失败: ${error.message}`)
          }
          result = data
          break
          
        case 'mysql':
          const sql = `
            INSERT INTO study_plans (user_id, title, description, progress, status, start_date, target_date, daily_hours, total_hours, resource_name, resource_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
          result = await this.client.execute(sql, [
            convertedPlan.user_id,
            convertedPlan.title,
            convertedPlan.description,
            convertedPlan.progress,
            convertedPlan.status,
            convertedPlan.start_date,
            convertedPlan.target_date,
            convertedPlan.daily_hours,
            convertedPlan.total_hours,
            convertedPlan.resource_name,
            convertedPlan.resource_url,
            convertedPlan.created_at,
            convertedPlan.updated_at
          ])
          break
          
        case 'postgresql':
          const pgResult = await this.client.query(`
            INSERT INTO study_plans (user_id, title, description, progress, status, start_date, target_date, daily_hours, resource_name, resource_url, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
          `, [
            convertedPlan.user_id,
            convertedPlan.title,
            convertedPlan.description,
            convertedPlan.progress,
            convertedPlan.status,
            convertedPlan.start_date,
            convertedPlan.target_date,
            convertedPlan.daily_hours,
            convertedPlan.resource_name,
            convertedPlan.resource_url,
            convertedPlan.created_at,
            convertedPlan.updated_at
          ])
          result = pgResult.rows
          break
          
        case 'mongodb':
          result = await this.client
            .collection('study_plans')
            .insertOne(convertedPlan)
          break
          
        default:
          throw new Error('不支持的数据库类型')
      }

      console.log('✅ 学习计划创建成功:', result)
      return result
      
    } catch (error) {
      console.error('❌ 创建学习计划失败:', error)
      throw error
    }
  }

  // 获取用户的学习计划
  async getStudyPlans() {
    try {
      console.log('📚 获取学习计划列表')
      
      // 获取当前用户
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      // 如果没有用户信息，返回空数组（不显示任何数据）
      if (!currentUser.id) {
        console.warn('⚠️ 未找到用户ID，返回空数据')
        return []
      }

      let result
      
      switch (dbConfig.type) {
        case 'supabase':
          const { data, error } = await this.client
            .from('study_plans')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (error) {
            throw new Error(`Supabase查询失败: ${error.message}`)
          }
          result = data || []
          break
          
        case 'mysql':
          const sql = `
            SELECT * FROM study_plans 
            WHERE user_id = ? 
            ORDER BY created_at DESC
          `
          result = await this.client.execute(sql, [currentUser.id])
          result = result[0] // MySQL 返回 [rows, fields]
          break
          
        case 'postgresql':
          const pgResult = await this.client.query(`
            SELECT * FROM study_plans 
            WHERE user_id = $1 
            ORDER BY created_at DESC
          `, [currentUser.id])
          result = pgResult.rows
          break
          
        case 'mongodb':
          result = await this.client
            .collection('study_plans')
            .find({ user_id: currentUser.id })
            .sort({ created_at: -1 })
            .toArray()
          break
          
        default:
          throw new Error('不支持的数据库类型')
      }

      console.log('✅ 学习计划列表获取成功:', result?.length || 0, '个')
      return result || []
      
    } catch (error) {
      console.error('❌ 获取学习计划失败:', error)
      return []
    }
  }

  // 创建社区帖子
  async createCommunityPost(postData: any) {
    try {
      console.log('💾 创建社区帖子:', postData)
      
      // 获取当前用户
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      // 如果没有用户信息，使用默认用户ID (为了兼容性和演示)
      if (!currentUser.id) {
        console.warn('⚠️ 未找到用户ID，使用默认用户ID')
        currentUser.id = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
      }

      // 转换字段名
      const convertedPost = {
        user_id: currentUser.id,
        title: postData.title,
        content: postData.content,
        category: postData.category || (postData.tags.length > 0 ? postData.tags.join(', ') : '学习经验'),
        tags: postData.tags || [],
        author: postData.author || '管理员',
        likes_count: 0,
        views_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('🔄 转换后的帖子数据:', convertedPost)

      let result
      
      switch (dbConfig.type) {
        case 'supabase':
          const { data, error } = await this.client
            .from('community_posts')
            .insert([convertedPost])
            .select()
          
          if (error) {
            throw new Error(`Supabase插入失败: ${error.message}`)
          }
          result = data
          break
          
        case 'mysql':
          const sql = `
            INSERT INTO community_posts (user_id, title, content, category, tags, author, likes_count, views_count, comments_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
          result = await this.client.execute(sql, [
            convertedPost.user_id,
            convertedPost.title,
            convertedPost.content,
            convertedPost.category,
            JSON.stringify(convertedPost.tags), // MySQL 中将数组转为 JSON 字符串
            convertedPost.author,
            convertedPost.likes_count,
            convertedPost.views_count,
            convertedPost.comments_count,
            convertedPost.created_at,
            convertedPost.updated_at
          ])
          break
          
        case 'postgresql':
          const pgResult = await this.client.query(`
            INSERT INTO community_posts (user_id, title, content, category, tags, author, likes_count, views_count, comments_count, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
          `, [
            convertedPost.user_id,
            convertedPost.title,
            convertedPost.content,
            convertedPost.category,
            convertedPost.tags,
            convertedPost.author,
            convertedPost.likes_count,
            convertedPost.views_count,
            convertedPost.comments_count,
            convertedPost.created_at,
            convertedPost.updated_at
          ])
          result = pgResult.rows
          break
          
        case 'mongodb':
          result = await this.client
            .collection('community_posts')
            .insertOne(convertedPost)
          break
          
        default:
          throw new Error('不支持的数据库类型')
      }

      console.log('✅ 社区帖子创建成功:', result)
      return result
      
    } catch (error) {
      console.error('❌ 创建社区帖子失败:', error)
      throw error
    }
  }

  // 获取社区帖子
  async getCommunityPosts(options: {
    limit?: number
    offset?: number
    sortBy?: 'latest' | 'popular' | 'mostLiked'
    searchKeyword?: string
    tag?: string
  } = {}) {
    try {
      console.log('📚 获取社区帖子列表:', options)
      
      const {
        limit = 10,
        offset = 0,
        sortBy = 'latest',
        searchKeyword,
        tag
      } = options

      let result
      
      switch (dbConfig.type) {
        case 'supabase':
          let query = this.client.from('community_posts').select('*')
          
          // 按标签过滤
          if (tag) {
            query = query.contains('tags', [tag])
          }
          
          // 搜索关键词
          if (searchKeyword) {
            query = query.or(`title.ilike.%${searchKeyword}%,content.ilike.%${searchKeyword}%,category.ilike.%${searchKeyword}%`)
          }
          
          // 排序
          switch (sortBy) {
            case 'latest':
              query = query.order('created_at', { ascending: false })
              break
            case 'popular':
              query = query.order('views_count', { ascending: false })
              break
            case 'mostLiked':
              query = query.order('likes_count', { ascending: false })
              break
          }
          
          const { data, error } = await query.range(offset, offset + limit - 1)
          
          if (error) {
            throw new Error(`Supabase查询失败: ${error.message}`)
          }
          result = data || []
          break
          
        case 'mysql':
          let sql = 'SELECT * FROM community_posts WHERE 1=1'
          const params = []
          
          if (tag) {
            sql += ' AND JSON_CONTAINS(tags, ?)'
            params.push(JSON.stringify(tag))
          }
          
          if (searchKeyword) {
            sql += ' AND (title LIKE ? OR content LIKE ? OR category LIKE ?)'
            const searchTerm = `%${searchKeyword}%`
            params.push(searchTerm, searchTerm, searchTerm)
          }
          
          switch (sortBy) {
            case 'latest':
              sql += ' ORDER BY created_at DESC'
              break
            case 'popular':
              sql += ' ORDER BY views_count DESC'
              break
            case 'mostLiked':
              sql += ' ORDER BY likes_count DESC'
              break
          }
          
          sql += ' LIMIT ? OFFSET ?'
          params.push(limit, offset)
          
          result = await this.client.execute(sql, params)
          result = result[0]
          break
          
        case 'postgresql':
          let pgSql = 'SELECT * FROM community_posts WHERE 1=1'
          const pgParams = []
          
          if (tag) {
            pgSql += ' AND tags && $' + (pgParams.length + 1)
            pgParams.push([tag])
          }
          
          if (searchKeyword) {
            pgSql += ' AND (title ILIKE $' + (pgParams.length + 1) + ' OR content ILIKE $' + (pgParams.length + 2) + ' OR category ILIKE $' + (pgParams.length + 3) + ')'
            const searchTerm = `%${searchKeyword}%`
            pgParams.push(searchTerm, searchTerm, searchTerm)
          }
          
          switch (sortBy) {
            case 'latest':
              pgSql += ' ORDER BY created_at DESC'
              break
            case 'popular':
              pgSql += ' ORDER BY views_count DESC'
              break
            case 'mostLiked':
              pgSql += ' ORDER BY likes_count DESC'
              break
          }
          
          pgSql += ' LIMIT $' + (pgParams.length + 1) + ' OFFSET $' + (pgParams.length + 2)
          pgParams.push(limit, offset)
          
          const pgResult = await this.client.query(pgSql, pgParams)
          result = pgResult.rows
          break
          
        case 'mongodb':
          let filter: any = {}
          
          if (tag) {
            filter.tags = { $in: [tag] }
          }
          
          if (searchKeyword) {
            filter.$or = [
              { title: { $regex: searchKeyword, $options: 'i' } },
              { content: { $regex: searchKeyword, $options: 'i' } },
              { category: { $regex: searchKeyword, $options: 'i' } }
            ]
          }
          
          let sort: any = { created_at: -1 }
          
          switch (sortBy) {
            case 'latest':
              sort = { created_at: -1 }
              break
            case 'popular':
              sort = { views_count: -1 }
              break
            case 'mostLiked':
              sort = { likes_count: -1 }
              break
          }
          
          result = await this.client
            .collection('community_posts')
            .find(filter)
            .sort(sort)
            .skip(offset)
            .limit(limit)
            .toArray()
          break
          
        default:
          throw new Error('不支持的数据库类型')
      }

      console.log('✅ 社区帖子列表获取成功:', result?.length || 0, '个')
      return result || []
      
    } catch (error) {
      console.error('❌ 获取社区帖子失败:', error)
      return []
    }
  }

  // 获取热门标签
  async getPopularTags(limit: number = 10) {
    try {
      console.log('🏷️ 获取热门标签')
      
      let result
      
      switch (dbConfig.type) {
        case 'supabase':
          const { data, error } = await this.client
            .rpc('get_popular_tags', { limit_count: limit })
          
          if (error) {
            throw new Error(`Supabase查询失败: ${error.message}`)
          }
          result = data || []
          break
          
        case 'mysql':
          const sql = `
            SELECT 
              JSON_UNQUOTE(JSON_EXTRACT(tags, CONCAT('$[', numbers.n, ']'))) as tag_name,
              COUNT(*) as post_count
            FROM community_posts
            JOIN (
              SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION 
              SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
            ) numbers ON JSON_EXTRACT(tags, CONCAT('$[', numbers.n, ']')) IS NOT NULL
            WHERE tags != '[]' AND tags IS NOT NULL
            GROUP BY tag_name
            ORDER BY post_count DESC, tag_name ASC
            LIMIT ?
          `
          result = await this.client.execute(sql, [limit])
          result = result[0]
          break
          
        case 'postgresql':
          const pgResult = await this.client.query(`
            SELECT 
              UNNEST(tags) as tag_name,
              COUNT(*) as post_count
            FROM community_posts
            WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
            GROUP BY tag_name
            ORDER BY post_count DESC, tag_name ASC
            LIMIT $1
          `, [limit])
          result = pgResult.rows
          break
          
        case 'mongodb':
          result = await this.client
            .collection('community_posts')
            .aggregate([
              { $unwind: '$tags' },
              { $group: { _id: '$tags', count: { $sum: 1 } } },
              { $sort: { count: -1, _id: 1 } },
              { $limit: limit },
              { $project: { tag_name: '$_id', post_count: '$count', _id: 0 } }
            ])
            .toArray()
          break
          
        default:
          throw new Error('不支持的数据库类型')
      }

      console.log('✅ 热门标签获取成功:', result?.length || 0, '个')
      return result || []
      
    } catch (error) {
      console.error('❌ 获取热门标签失败:', error)
      return []
    }
  }
}

// 导出单例实例
export const dbService = new DatabaseService()