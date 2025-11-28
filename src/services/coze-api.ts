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
  reason?: string
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
   * 搜索资源 - 通过代理服务器调用
   */
  async searchResources(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    console.log('🔍 通过代理服务器搜索扣子API:', request)
    
    // 直接使用代理服务器
    const response = await fetch('http://localhost:3003/api/coze/chat', {
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
      throw new Error(`代理服务器错误: ${response.status}`)
    }
  }

  /**
   * 搜索扣子API - 通过代理服务器调用 (兼容方法)
   */
  async searchRecommendations(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    console.log('🔍 通过代理服务器搜索扣子API:', request)
    
    // 直接使用代理服务器
    const response = await fetch('http://localhost:3003/api/coze/chat', {
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
      throw new Error(`代理服务器错误: ${response.status}`)
    }
  }

  /**
   * 解析扣子API响应
   */
  private parseCozeResponse(cozeData: any): CozeSearchResponse {
    console.log('🔍 解析扣子API响应:', cozeData)
    
    // 从扣子API响应中提取内容
    let content = ''
    
    // 处理字符串格式的响应（来自代理服务器）
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
      // 消息列表格式 - 查找AI的回复
      const aiMessages = cozeData.data.filter((msg: any) => msg.role === 'assistant' && msg.type === 'answer')
      if (aiMessages.length > 0) {
        const lastAiMessage = aiMessages[aiMessages.length - 1]
        content = lastAiMessage.content || ''
      }
    } else if (cozeData.messages && cozeData.messages.length > 0) {
      // 新版API格式 - 查找包含实际推荐内容的answer消息
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
        // 如果没有找到格式化的推荐内容，尝试最后一个文本消息
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
      // 直接内容格式
      content = cozeData.content
    } else if (!content && typeof cozeData === 'object') {
      // 尝试从对象中提取内容
      content = JSON.stringify(cozeData)
    }
    
    console.log('📝 提取的内容:', content)
    
    if (!content) {
      throw new Error('无法从API响应中提取内容')
    }
    
    // 解析推荐内容
    return this.parseRecommendations(content)
  }

  /**
   * 解析推荐内容
   */
  private parseRecommendations(content: string): CozeSearchResponse {
    console.log('🔍 解析推荐内容:', content)
    
    // 初始化结果
    const result: CozeSearchResponse = {
      top_recommendation: {
        name: '',
        platform: 'B站',
        reason: '暂无推荐',
        duration: '待确认',
        study_data: '暂无数据'
      },
      other_recommendations: [],
      learning_advice: '建议结合理论学习和实际操作，制定合理的学习计划。'
    }
    
    try {
      // 智能解析AI返回的格式化内容
      const lines = content.split('\n').map(line => line.trim())
      
      let currentSection = ''
      let currentRecommendation: any = {}
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // 识别章节标题
        if (line.includes('🎯') && line.includes('最推荐')) {
          currentSection = 'top'
          const titleMatch = line.match(/🎯\s*\*?\*?最推荐\*?\*?[：:]\s*(.+)/)
          if (titleMatch) {
            result.top_recommendation.name = titleMatch[1].trim()
          }
        }
        else if (line.includes('📚') && line.includes('其他推荐')) {
          currentSection = 'others'
        }
        else if (line.includes('💡') && line.includes('学习建议')) {
          currentSection = 'advice'
          const adviceMatch = line.match(/💡\s*\*?\*?学习建议\*?\*?[：:]\s*(.+)/)
          if (adviceMatch) {
            result.learning_advice = adviceMatch[1].trim()
          }
        }
        // 解析详细字段
        else if (line.startsWith('-') || line.startsWith('•')) {
          const cleanLine = line.replace(/^[-•*]\s*/, '')
          if (cleanLine.includes('**平台来源**')) {
            const platformMatch = cleanLine.match(/\*\*平台来源\*\*[：:]\s*(.+)/)
            if (platformMatch) {
              const platform = platformMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.platform = platform.includes('MOOC') ? '中国大学MOOC官网' : 'B站'
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.platform = platform.includes('MOOC') ? '中国大学MOOC官网' : 'B站'
              }
            }
          }
          else if (cleanLine.includes('**UP主**')) {
            const upMatch = cleanLine.match(/\*\*UP主\*\*[：:]\s*(.+)/)
            if (upMatch) {
              const upHost = upMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.up_host = upHost !== '无' ? upHost : undefined
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.up_host = upHost !== '无' ? upHost : undefined
              }
            }
          }
          else if (cleanLine.includes('**推荐理由**')) {
            const reasonMatch = cleanLine.match(/\*\*推荐理由\*\*[：:]\s*(.+)/)
            if (reasonMatch) {
              const reason = reasonMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.reason = reason
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.reason = reason
              }
            }
          }
          else if (cleanLine.includes('**难度等级**')) {
            const difficultyMatch = cleanLine.match(/\*\*难度等级\*\*[：:]\s*(.+)/)
            if (difficultyMatch) {
              const difficulty = difficultyMatch[1].trim()
              if (['入门', '进阶', '高级'].includes(difficulty)) {
                if (currentSection === 'top') {
                  result.top_recommendation.difficulty = difficulty as '入门' | '进阶' | '高级'
                } else if (currentSection === 'others' && currentRecommendation) {
                  currentRecommendation.difficulty = difficulty as '入门' | '进阶' | '高级'
                }
              }
            }
          }
          else if (cleanLine.includes('**学习时长**')) {
            const durationMatch = cleanLine.match(/\*\*学习时长\*\*[：:]\s*(.+)/)
            if (durationMatch) {
              const duration = durationMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.duration = duration
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.duration = duration
              }
            }
          }
          else if (cleanLine.includes('**学习数据**')) {
            const dataMatch = cleanLine.match(/\*\*学习数据\*\*[：:]\s*(.+)/)
            if (dataMatch) {
              const studyData = dataMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.study_data = studyData
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.study_data = studyData
              }
            }
          }
          else if (cleanLine.includes('**B站BV号**')) {
            const bvMatch = cleanLine.match(/\*\*B站BV号\*\*[：:]\s*(.+)/)
            if (bvMatch) {
              const bvNumber = bvMatch[1].trim()
              if (bvNumber && bvNumber !== '无') {
                if (currentSection === 'top') {
                  result.top_recommendation.bv_number = bvNumber
                } else if (currentSection === 'others' && currentRecommendation) {
                  currentRecommendation.bv_number = bvNumber
                }
              }
            }
          }
          else if (cleanLine.includes('**机构**')) {
            const institutionMatch = cleanLine.match(/\*\*机构\*\*[：:]\s*(.+)/)
            if (institutionMatch) {
              const institution = institutionMatch[1].trim()
              if (currentSection === 'top') {
                result.top_recommendation.institution = institution
              } else if (currentSection === 'others' && currentRecommendation) {
                currentRecommendation.institution = institution
              }
            }
          }
        }
        // 处理其他推荐的编号条目
        else if (/^\d+\./.test(line) && currentSection === 'others') {
          const titleMatch = line.match(/^\d+\.\s*\*?\*?([^*]+)\*?\*?/)
          if (titleMatch) {
            if (Object.keys(currentRecommendation).length > 0) {
              result.other_recommendations.push({...currentRecommendation})
            }
            currentRecommendation = {
              name: titleMatch[1].trim(),
              platform: 'B站',
              difficulty: '入门',
              duration: '待确认',
              study_data: '推荐',
              reason: '智能推荐资源'
            }
          }
        }
        
        // 尝试解析后续几行，查找当前推荐项的详细信息
        if (currentSection === 'others' && Object.keys(currentRecommendation).length > 0 && line.trim()) {
          const nextLines = lines.slice(i + 1, Math.min(i + 8, lines.length))
          for (let j = 0; j < nextLines.length; j++) {
            const nextLine = nextLines[j].trim()
            if ((nextLine.startsWith('-') || nextLine.startsWith('•')) && 
                (nextLine.includes('**平台来源**') || nextLine.includes('**B站BV号**') || 
                 nextLine.includes('**学习数据**') || nextLine.includes('**学习时长**') ||
                 nextLine.includes('**机构**') || nextLine.includes('**UP主**'))) {
              // 这些信息会在主循环中处理
              continue
            }
            // 如果遇到新的推荐项或章节，停止解析当前项
            if (/^\d+\./.test(nextLine) || nextLine.includes('📚') || nextLine.includes('💡')) {
              break
            }
          }
        }
      }
      
      // 添加最后一个推荐
      if (Object.keys(currentRecommendation).length > 0) {
        result.other_recommendations.push({...currentRecommendation})
      }
      
      // 如果没有找到最推荐的名称，使用整个内容的开头
      if (!result.top_recommendation.name) {
        const firstLine = lines.find(line => line.length > 10 && !line.includes('🎯') && !line.includes('📚') && !line.includes('💡'))
        if (firstLine) {
          result.top_recommendation.name = firstLine.substring(0, 100).trim()
        }
      }
      
      // 如果最推荐没有设置基本信息，设置默认值
      if (!result.top_recommendation.reason) {
        result.top_recommendation.reason = 'AI智能推荐的学习资源'
      }
      
    } catch (error) {
      console.error('❌ 解析推荐内容失败:', error)
      throw new Error(`解析推荐内容失败: ${error.message}`)
    }
    
    console.log('✅ 最终解析结果:', result)
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