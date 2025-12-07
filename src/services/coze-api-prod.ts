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
      note: '直接调用 Netlify Functions'
    })
  }

  /**
   * 搜索教育资源
   */
  async searchResources(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query,
          conversation_id: request.conversation_id,
          stream: false
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Coze API 调用失败:', response.status, errorText)
        throw new Error(`Coze API 调用失败: ${response.status}`)
      }

      const data = await response.json()
      
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
    try {
      // 检查是否有消息内容
      const messages = data?.messages || []
      if (messages.length === 0) {
        throw new Error('扣子API返回空响应')
      }

      const lastMessage = messages[messages.length - 1]
      const content = lastMessage?.content || ''
      
      // 尝试解析JSON内容
      const jsonData = this.extractJsonFromContent(content)
      
      if (!jsonData) {
        throw new Error('无法解析扣子返回的数据格式')
      }

      return {
        top_recommendation: jsonData.top_recommendation || {},
        other_recommendations: jsonData.other_recommendations || [],
        learning_advice: jsonData.learning_advice || ''
      }
    } catch (error) {
      console.error('解析扣子响应失败:', error)
      // 返回默认响应
      return {
        top_recommendation: {
          name: '解析失败',
          platform: '其他',
          difficulty: '入门',
          duration: '未知',
          study_data: '无法解析扣子API返回的数据'
        },
        other_recommendations: [],
        learning_advice: '请稍后重试或联系管理员'
      }
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