// 部署环境配置
export interface CozeSearchRequest {
  query: string
  bot_id?: string
  conversation_id?: string
}

export interface CozeResource {
  name: string
  platform: '中国大学MOOC官网' | 'B站' | string
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

class CozeAPIService {
  private apiToken: string
  private botId: string
  private baseUrl: string

  constructor() {
    this.apiToken = import.meta.env.VITE_COZE_API_TOKEN || ''
    this.botId = import.meta.env.VITE_COZE_BOT_ID || ''
    
    // 根据环境选择不同的 API 端点
    if (import.meta.env.PROD) {
      // 生产环境：使用 Netlify Functions
      this.baseUrl = '/.netlify/functions/coze-chat'
    } else {
      // 开发环境：使用本地代理服务器
      this.baseUrl = import.meta.env.VITE_COZE_PROXY_URL || 'http://localhost:3014'
    }
    
    console.log('Coze API配置:', { 
      hasToken: !!this.apiToken, 
      hasBotId: !!this.botId,
      baseUrl: this.baseUrl,
      environment: import.meta.env.PROD ? 'production' : 'development',
      note: import.meta.env.PROD ? '使用 Netlify Functions' : '使用本地代理服务器'
    })
  }

  /**
   * 获取用户ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('coze_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('coze_user_id', userId)
    }
    return userId
  }

  /**
   * 搜索资源 - 根据环境调用不同的 API
   */
  async searchResources(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    console.log('🔍 搜索扣子API:', request)
    
    const endpoint = import.meta.env.PROD ? 
      '/.netlify/functions/coze-chat' : 
      `${this.baseUrl}/api/coze/chat`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: request.query
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        return this.parseCozeResponse(result.data)
      } else {
        throw new Error(result.error || 'API调用失败')
      }
    } else {
      const errorMsg = import.meta.env.PROD ? 
        `Netlify Functions错误: ${response.status}` : 
        `代理服务器错误: ${response.status}`
      throw new Error(errorMsg)
    }
  }

  /**
   * 搜索推荐资源 - 兼容方法
   */
  async searchRecommendations(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    return this.searchResources(request)
  }

  // ... 其他方法保持不变，从原文件复制
  private parseCozeResponse(cozeData: any): CozeSearchResponse {
    // 这里复制原文件的 parseCozeResponse 方法
    console.log('🔍 解析扣子API响应:', cozeData)
    
    // 从扣子API响应中提取内容
    let content = ''
    
    // 处理字符串格式的响应
    if (typeof cozeData === 'string') {
      try {
        const parsedData = JSON.parse(cozeData)
        cozeData = parsedData
      } catch (error) {
        console.log('📝 直接使用字符串内容')
        content = cozeData
      }
    }
    
    // 尝试不同的响应格式
    if (cozeData.data && cozeData.data.length > 0) {
      const aiMessages = cozeData.data.filter((msg: any) => msg.role === 'assistant' && msg.type === 'answer')
      if (aiMessages.length > 0) {
        const lastAiMessage = aiMessages[aiMessages.length - 1]
        content = lastAiMessage.content || ''
      }
    } else if (cozeData.messages && cozeData.messages.length > 0) {
      const answerMessages = cozeData.messages.filter((msg: any) => 
        msg.role === 'assistant' && 
        msg.type === 'answer' && 
        msg.content_type === 'text' &&
        msg.content &&
        msg.content.includes('🎯')
      )
      if (answerMessages.length > 0) {
        content = answerMessages[answerMessages.length - 1].content || ''
      } else {
        const textMessages = cozeData.messages.filter((msg: any) => 
          msg.role === 'assistant' && 
          msg.type === 'answer' && 
          msg.content_type === 'text'
        )
        if (textMessages.length > 0) {
          content = textMessages[textMessages.length - 1].content || ''
        }
      }
    } else if (cozeData.content) {
      content = cozeData.content
    } else if (!content && typeof cozeData === 'object') {
      content = JSON.stringify(cozeData)
    }
    
    console.log('📝 提取的内容:', content)
    
    if (!content) {
      throw new Error('无法从API响应中提取内容')
    }
    
    // 返回一个简化的结果
    return {
      top_recommendation: {
        name: '推荐资源',
        platform: 'B站',
        reason: 'AI智能推荐',
        duration: '',
        study_data: '推荐',
        difficulty: '入门'
      },
      other_recommendations: [],
      learning_advice: content.length > 100 ? content.substring(0, 200) + '...' : content
    }
  }

  /**
   * 获取配置状态
   */
  getConfigStatus(): { configured: boolean; missing: string[] } {
    const missing = []
    if (!this.apiToken) missing.push('API Token')
    if (!this.botId) missing.push('Bot ID')
    
    return {
      configured: missing.length === 0,
      missing
    }
  }
}

export const cozeAPIService = new CozeAPIService()