/**
 * 扣子智能体API服务 - 直接调用扣子API
 * 通过代理服务器调用扣子API
 */

export interface CozeSearchRequest {
  query: string
  bot_id?: string
  conversation_id?: string
}

export interface CozeResource {
  name: string
  platform: '中国大学MOOC官网' | 'B站'
  institution?: string
  up_host?: string
  difficulty: '入门' | '进阶' | '高级'
  duration: string
  study_data: string
  bv_number?: string
  brief_description?: string
}

export interface CozeSearchResponse {
  top_recommendation: CozeResource
  other_recommendations: CozeResource[]
  learning_advice: string
}

class CozeAPIService {
  private apiToken: string
  private botId: string

  constructor() {
    this.apiToken = import.meta.env.VITE_COZE_API_TOKEN || ''
    this.botId = import.meta.env.VITE_COZE_BOT_ID || ''
    console.log('Coze API配置:', { 
      hasToken: !!this.apiToken, 
      hasBotId: !!this.botId,
      note: '通过代理服务器调用扣子API'
    })
  }

  /**
   * 获取用户ID
   */
  private getUserId(): string {
    // 生成或获取唯一的用户ID
    let userId = localStorage.getItem('coze_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('coze_user_id', userId)
    }
    return userId
  }

  /**
   * 搜索扣子API - 直接调用真实API
   */
  async searchRecommendations(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    console.log('🔍 开始搜索扣子API:', request)
    
    const response = await fetch('http://localhost:3014/api/coze/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: request.query,
        bot_id: this.botId,
        user_id: this.getUserId()
      })
    })
    
    console.log('📊 代理请求状态:', {
      status: response.status,
      ok: response.ok
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 代理响应成功:', { success: result.success })
      
      if (result.success && result.data) {
        return this.parseCozeResponse(result.data)
      } else {
        throw new Error(result.error || 'API调用失败')
      }
    } else {
      const errorText = await response.text()
      console.error('❌ 代理响应错误:', response.status, errorText)
      throw new Error(`代理服务器错误: ${response.status}`)
    }
  }

  /**
   * 解析扣子API响应
   */
  private parseCozeResponse(cozeData: any): CozeSearchResponse {
    console.log('🔑 解析扣子API响应:', cozeData)
    
    // 从扣子API响应中提取内容
    let content = ''
    
    // 尝试不同的响应格式
    if (cozeData.messages && cozeData.messages.length > 0) {
      // 新版API格式
      const lastMessage = cozeData.messages[cozeData.messages.length - 1]
      content = lastMessage.content || ''
    } else if (cozeData.content) {
      // 直接内容格式
      content = cozeData.content
    } else if (typeof cozeData === 'string') {
      // 纯文本格式
      content = cozeData
    }
    
    console.log('📝 提取的内容:', content)
    
    const result: CozeSearchResponse = {
      top_recommendation: {
        name: '待推荐资源',
        platform: 'B站',
        reason: '智能推荐中',
        difficulty: '入门',
        duration: '待确认',
        study_data: '推荐'
      },
      other_recommendations: [],
      learning_advice: '建议结合理论学习和实践操作，制定合理的学习计划。'
    }
    
    // 尝试JSON解析
    try {
      if (content && typeof content === 'string') {
        // 尝试提取JSON部分
        const jsonMatch = content.match(/\\{[\\s\\S]*\\}/)
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0])
          if (jsonData.recommendations) {
            return jsonData
          }
        }
      }
    } catch (jsonError) {
      console.log('❌ JSON解析失败，使用默认响应:', jsonError.message)
    }
    
    return result
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

// 导出单例实例
export const cozeAPIService = new CozeAPIService()