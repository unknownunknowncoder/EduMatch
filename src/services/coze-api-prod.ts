/**
 * 扣子智能体API服务 - 生产环境版本
 * 直接通过 Netlify Functions 调用，无需本地代理
 */

export interface CozeSearchRequest {
  query: string
  bot_id?: string
  conversation_id?: string
}

export interface CozeResource {
  name: string
  platform: '中国大学MOOC官网' | 'B站' | 'Coursera' | 'edX' | string
  institution?: string
  up_host?: string
  difficulty: '入门' | '进阶' | '高级'
  duration: string
  study_data: string
  bv_number?: string
  brief_description?: string
  reason?: string
  access_guide?: string
}

export interface CozeSearchResponse {
  top_recommendation: CozeResource
  other_recommendations: CozeResource[]
  learning_advice: string
}

class CozeAPIServiceProduction {
  private baseUrl: string

  constructor() {
    // 生产环境直接调用 Netlify Functions，开发环境使用本地 Functions
    const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
    this.baseUrl = isProduction ? '/api/coze' : 'http://localhost:9999/.netlify/functions/coze-api'
    console.log('Coze API配置:', { 
      environment: isProduction ? 'production' : 'development',
      mode: import.meta.env.MODE,
      baseUrl: this.baseUrl,
      note: '直接调用优化的 Netlify Functions (30秒超时)'
    })
  }

  /**
   * 搜索教育资源
   */
  async searchResources(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    try {
      console.log('🔍 开始搜索资源:', request.query)
      const startTime = Date.now()
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query,
          bot_id: request.bot_id,
          user_id: request.conversation_id || `user_${Date.now()}`,
          stream: false
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        const elapsed = Date.now() - startTime
        console.error('Coze API 调用失败:', { 
          status: response.status, 
          errorText: errorText.substring(0, 200),
          elapsed: `${elapsed}ms`
        })
        
        if (response.status === 408) {
          throw new Error('请求超时，请稍后重试')
        }
        throw new Error(`Coze API 调用失败: ${response.status}`)
      }

      const data = await response.json()
      const elapsed = Date.now() - startTime
      console.log(`✅ API调用成功，耗时: ${elapsed}ms`)
      
      // 解析扣子返回的数据
      return this.parseCozeResponse(data)
      
    } catch (error) {
      console.error('搜索教育资源失败:', error)
      throw error
    }
  }

  /**
   * 获取对话历史
   */
  async getConversationHistory(conversationId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId
        })
      })

      if (!response.ok) {
        throw new Error(`获取对话历史失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取对话历史失败:', error)
      throw error
    }
  }

  /**
   * 解析扣子API返回的数据
   */
  private parseCozeResponse(data: any): CozeSearchResponse {
    console.log('🔍 开始解析扣子响应:', data)
    
    try {
      // 检查响应是否直接包含所需数据结构
      if (data.data && typeof data.data === 'object') {
        console.log('✅ 检测到直接数据格式')
        return this.normalizeToCozeResponse(data.data)
      }
      
      // 检查是否有消息内容
      const messages = data?.messages || []
      console.log('📝 消息数量:', messages.length)
      
      if (messages.length === 0) {
        console.log('⚠️ 没有消息内容，检查其他格式')
        // 尝试从其他字段提取数据
        if (data.content) {
          console.log('✅ 从content字段提取数据')
          const jsonData = this.extractJsonFromContent(data.content)
          if (jsonData) {
            return this.normalizeToCozeResponse(jsonData)
          }
        }
        
        if (data.raw_response) {
          console.log('✅ 从raw_response字段提取数据')
          const jsonData = this.extractJsonFromContent(data.raw_response)
          if (jsonData) {
            return this.normalizeToCozeResponse(jsonData)
          }
        }
        
        throw new Error('扣子API返回空响应，所有字段都为空')
      }

      const lastMessage = messages[messages.length - 1]
      const content = lastMessage?.content || ''
      console.log('📄 最后一条消息内容长度:', content.length)
      
      if (!content.trim()) {
        throw new Error('最后一条消息内容为空')
      }
      
      // 尝试解析JSON内容
      const jsonData = this.extractJsonFromContent(content)
      
      if (!jsonData) {
        console.log('⚠️ 无法解析JSON，返回基于文本的响应')
        return this.createTextBasedResponse(content)
      }

      console.log('✅ 成功解析JSON数据')
      return this.normalizeToCozeResponse(jsonData)
      
    } catch (error) {
      console.error('❌ 解析扣子响应失败:', error)
      console.log('📄 原始响应数据:', JSON.stringify(data, null, 2))
      // 返回默认响应
      return {
        top_recommendation: {
          name: 'API响应解析失败',
          platform: 'B站',
          difficulty: '入门',
          duration: '2小时',
          study_data: '系统暂时无法解析AI响应，请稍后重试',
          brief_description: '这是一个技术问题，我们正在修复'
        },
        other_recommendations: [],
        learning_advice: '建议稍后重试，或手动在B站搜索相关学习资源'
      }
    }
  }

  /**
   * 将各种数据格式标准化为CozeSearchResponse格式
   */
  private normalizeToCozeResponse(data: any): CozeSearchResponse {
    try {
      // 处理不同的数据格式
      
      // 格式1: { top: {...}, others: [...], advice: "..." }
      if (data.top || data.others || data.advice) {
        return {
          top_recommendation: {
            name: data.top?.title || data.top?.name || '推荐资源',
            platform: data.top?.platform || 'B站',
            difficulty: data.top?.difficulty || '入门',
            duration: data.top?.duration || '2小时',
            study_data: data.top?.study_data || data.top?.desc || '推荐学习资源',
            brief_description: data.top?.desc || data.top?.brief_description || '优质学习资源',
            reason: data.top?.reason || 'AI推荐',
            url: data.top?.url || `https://www.bilibili.com/search?keyword=${encodeURIComponent(data.top?.title || '学习')}`
          },
          other_recommendations: (data.others || []).map((item: any) => ({
            name: item.title || item.name || '其他资源',
            platform: item.platform || 'B站',
            difficulty: item.difficulty || '入门',
            duration: item.duration || '2小时',
            study_data: item.study_data || item.desc || '学习资源',
            brief_description: item.desc || item.brief_description || '相关资源',
            url: item.url || `https://www.bilibili.com/search?keyword=${encodeURIComponent(item.title || '学习')}`
          })),
          learning_advice: data.advice || data.learning_advice || '请制定合理的学习计划，循序渐进地学习。'
        }
      }
      
      // 格式2: { top_recommendation: {...}, other_recommendations: [...], learning_advice: "..." }
      if (data.top_recommendation || data.other_recommendations || data.learning_advice) {
        return {
          top_recommendation: data.top_recommendation || this.createDefaultTopRecommendation(),
          other_recommendations: data.other_recommendations || [],
          learning_advice: data.learning_advice || '坚持学习，持续进步！'
        }
      }
      
      // 格式3: 单个对象，可能是推荐资源
      if (data.name || data.title) {
        return {
          top_recommendation: {
            name: data.name || data.title || '推荐资源',
            platform: data.platform || 'B站',
            difficulty: data.difficulty || '入门',
            duration: data.duration || '2小时',
            study_data: data.study_data || data.description || '推荐学习资源',
            brief_description: data.description || data.brief_description || '优质学习资源',
            url: data.url || '#'
          },
          other_recommendations: [],
          learning_advice: '这是一个很好的学习资源，建议深入学习。'
        }
      }
      
      // 格式4: 其他情况，返回默认响应
      return {
        top_recommendation: this.createDefaultTopRecommendation(),
        other_recommendations: [],
        learning_advice: '请继续探索更多学习资源。'
      }
      
    } catch (error) {
      console.error('❌ 标准化数据失败:', error)
      return this.createDefaultResponse()
    }
  }

  /**
   * 创建基于文本的响应（当JSON解析失败时）
   */
  private createTextBasedResponse(content: string): CozeSearchResponse {
    const lines = content.split('\n').filter(line => line.trim())
    const firstLine = lines[0] || '学习资源推荐'
    
    return {
      top_recommendation: {
        name: firstLine.substring(0, 50),
        platform: 'B站',
        difficulty: '入门',
        duration: '2小时',
        study_data: content.substring(0, 200),
        brief_description: 'AI推荐的学习资源',
        reason: '基于您的需求分析',
        url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(firstLine)}`
      },
      other_recommendations: lines.slice(1, 4).map((line, index) => ({
        name: line.substring(0, 50),
        platform: index % 2 === 0 ? 'B站' : '中国大学MOOC',
        difficulty: '入门',
        duration: '2小时',
        study_data: line,
        brief_description: '相关学习资源',
        url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(line)}`
      })),
      learning_advice: '以上是AI为您推荐的学习资源，建议根据个人情况选择适合的内容。'
    }
  }

  /**
   * 创建默认的顶级推荐
   */
  private createDefaultTopRecommendation(): any {
    return {
      name: '优质学习资源',
      platform: 'B站',
      difficulty: '入门',
      duration: '2小时',
      study_data: '推荐学习资源',
      brief_description: '优质的学习内容',
      reason: 'AI智能推荐',
      url: 'https://www.bilibili.com'
    }
  }

  /**
   * 创建默认响应
   */
  private createDefaultResponse(): CozeSearchResponse {
    return {
      top_recommendation: this.createDefaultTopRecommendation(),
      other_recommendations: [],
      learning_advice: '请稍后重试或联系管理员获取帮助。'
    }
  }

  /**
   * 从内容中提取JSON数据
   */
  private extractJsonFromContent(content: string): any {
    try {
      // 查找JSON块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1])
      }
      
      // 尝试直接解析整个内容
      return JSON.parse(content)
    } catch {
      // 尝试查找对象模式
      const objectMatch = content.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0])
        } catch {
          return null
        }
      }
      return null
    }
  }
}

// 导出单例实例
let cozeAPIInstance: CozeAPIServiceProduction | null = null

export const getCozeAPI = (): CozeAPIServiceProduction => {
  if (!cozeAPIInstance) {
    cozeAPIInstance = new CozeAPIServiceProduction()
  }
  return cozeAPIInstance
}

// 向后兼容的导出
export const cozeAPI = getCozeAPI()