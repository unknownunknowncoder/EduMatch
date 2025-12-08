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
    this.baseUrl = isProduction ? '/.netlify/functions/coze-api-fast' : 'http://localhost:9999/.netlify/functions/coze-api-fast'
    console.log('Coze API配置:', { 
      environment: isProduction ? 'production' : 'development',
      mode: import.meta.env.MODE,
      baseUrl: this.baseUrl,
      note: '使用快速响应的 Netlify Functions (45秒超时 + 优化请求)'
    })
  }

  /**
   * 搜索教育资源
   */
  async searchResources(request: CozeSearchRequest): Promise<CozeSearchResponse> {
    const maxRetries = 2
    let lastError: any = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 开始搜索资源 (尝试 ${attempt}/${maxRetries}):`, request.query)
        const startTime = Date.now()
        
        // 创建 AbortController，设置与Netlify Function一致的超时时间
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 48000) // 48秒超时，给Netlify Function留足时间
        
      // 直接调用优化的函数，不需要 /chat 路径
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query, // 保持查询简洁
          bot_id: request.bot_id,
          user_id: request.conversation_id || `user_${Date.now()}`,
          stream: false
        }),
        signal: controller.signal
      })

        clearTimeout(timeoutId)

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
        const result = this.parseCozeResponse(data)
        
        // 检查解析结果是否包含错误信息
        if (result.top_recommendation.name.includes('API响应解析失败') || 
            result.learning_advice.includes('系统暂时不可用') ||
            result.learning_advice.includes('请稍后重试')) {
          throw new Error('解析结果包含错误信息，可能需要重试')
        }
        
        // 成功返回结果
        return result
        
      } catch (error: any) {
        lastError = error
        console.error(`搜索教育资源失败 (尝试 ${attempt}/${maxRetries}):`, error)
        
        // 特殊处理请求中止错误
        if (error.name === 'AbortError') {
          lastError = new Error('AI响应超时，请稍后重试。扣子智能体正在为您处理中...')
        }
        
        // 如果是最后一次尝试，抛出错误
        if (attempt === maxRetries) {
          break
        }
        
        // 等待一段时间后重试
        console.log(`⏳ 等待2秒后重试...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    throw lastError || new Error('搜索教育资源失败')
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
      // 处理被 success/error 包裹的情况，保证拿到最内层有效载荷
      if (data?.success !== undefined && data?.data) {
        console.log('🧭 发现 success/data 包裹，解包后解析')
        data = data.data
      }
      if (data?.data?.success !== undefined && data?.data?.data) {
        console.log('🧭 发现嵌套 success/data 结构，解包后解析')
        data = data.data.data
      }

      // 优先展开一次 payload，避免嵌套 data 层导致遗漏
      const directPayload = (data && typeof data === 'object' && !Array.isArray(data) && data.data && typeof data.data === 'object')
        ? data.data
        : data

      // 如果直接是中文/标准结构则直接解析
      if (directPayload && typeof directPayload === 'object' && (directPayload['最推荐'] || directPayload['其他推荐'] || directPayload['学习建议'])) {
        console.log('✅ 检测到直接数据格式/中文字段')
        return this.normalizeToCozeResponse(directPayload)
      }

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
      console.log('📄 消息内容预览:', content.substring(0, 200))
      const jsonData = this.extractJsonFromContent(content)
      
      if (!jsonData) {
        console.log('⚠️ 无法解析JSON，返回基于文本的响应')
        console.log('📄 完整消息内容:', content)
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
      console.log('🔍 标准化数据格式，原始keys:', Object.keys(data))
      console.log('📊 数据结构检查:', {
        '最推荐类型': Array.isArray(data['最推荐']) ? 'array' : typeof data['最推荐'],
        '其他推荐类型': Array.isArray(data['其他推荐']) ? 'array' : typeof data['其他推荐'],
        '最推荐长度': Array.isArray(data['最推荐']) ? data['最推荐'].length : 'N/A',
        '其他推荐长度': Array.isArray(data['其他推荐']) ? data['其他推荐'].length : 'N/A'
      })
      
      // 处理中文字段格式：{ 最推荐: [...], 其他推荐: [...], 学习建议: "..." }
      if (data['最推荐'] || data['其他推荐'] || data['学习建议']) {
        console.log('✅ 检测到中文字段格式')
        let topRecommendations = data['最推荐'] || []
        let otherRecommendations = data['其他推荐'] || []
        let learningAdvice = data['学习建议'] || ''
        
        // 检测是否是错误响应数据
        if (learningAdvice && (
          learningAdvice.includes('网络连接暂时不稳定') || 
          learningAdvice.includes('系统暂时不可用') ||
          learningAdvice.includes('请稍后重试') ||
          learningAdvice.includes('无法解析')
        )) {
          console.log('⚠️ 检测到错误响应数据，重新获取数据')
          throw new Error('扣子API返回了错误响应，可能是网络超时导致的')
        }
        
        // 如果其他推荐为空，把最推荐里除第一个之外的项目兜底放入其他推荐
        if ((!otherRecommendations || (Array.isArray(otherRecommendations) && otherRecommendations.length === 0)) 
          && Array.isArray(topRecommendations) && topRecommendations.length > 1) {
          console.log('🔄 其他推荐为空，使用最推荐的剩余项填充')
          otherRecommendations = topRecommendations.slice(1)
        }
        
        // 处理"最推荐"可能是数组的第一个元素，或者直接是对象
        let topRec
        if (Array.isArray(topRecommendations)) {
          console.log('📊 最推荐是数组，取第一个元素')
          topRec = topRecommendations[0]
        } else if (typeof topRecommendations === 'object' && topRecommendations !== null) {
          console.log('📊 最推荐是对象，直接使用')
          topRec = topRecommendations
        }

        // 如果最推荐缺失但有其他推荐，则使用其他推荐的第一条作为顶级推荐
        if (!topRec && Array.isArray(otherRecommendations) && otherRecommendations.length > 0) {
          console.log('🧭 最推荐缺失，使用其他推荐的第一条作为顶级推荐')
          topRec = otherRecommendations[0]
          otherRecommendations = otherRecommendations.slice(1)
        }
        
        // 合并学习建议和权威资料
        if (data['权威资料与工具'] && Array.isArray(data['权威资料与工具'])) {
          const authoritativeResources = data['权威资料与工具'].map((item: any) => 
            `${item['网站/文档名称']}：${item['核心价值']}`
          ).join('；')
          learningAdvice += learningAdvice ? '\n\n权威资源：' + authoritativeResources : '权威资源：' + authoritativeResources
        }
        
        if (!learningAdvice) {
          learningAdvice = '建议制定合理的学习计划，循序渐进地学习。'
        }
        
        console.log('🎯 顶级推荐:', topRec?.['资源标题']?.substring(0, 50))
        console.log('📚 其他推荐数量:', otherRecommendations.length)
        console.log('🔍 调试信息:', {
          topRecommendations: Array.isArray(topRecommendations) ? topRecommendations.length : 'not array',
          topRec: topRec ? 'exists' : 'null/undefined',
          topRecKeys: topRec ? Object.keys(topRec) : [],
          topRecTitle: topRec?.['资源标题']
        })
        
        return {
          top_recommendation: {
            name: topRec?.['资源标题'] || topRec?.['网站/文档名称'] || '推荐资源',
            platform: topRec?.['来源平台'] || 'B站',
            difficulty: '入门',
            duration: '2小时',
            study_data: topRec?.['学习数据'] || '推荐学习资源',
            brief_description: topRec?.['推荐理由'] || '优质学习资源',
            reason: topRec?.['推荐理由'] || 'AI推荐',
            url: this.buildChineseUrl(topRec?.['访问/观看'], undefined, topRec?.['资源标题'])
          },
          other_recommendations: otherRecommendations.slice(0, 4).map((item: any) => ({
            name: item['资源标题'] || item['网站/文档名称'] || '其他资源',
            platform: item['来源平台'] || 'B站',
            difficulty: '入门',
            duration: this.extractChineseDuration(item['学习数据']),
            study_data: item['学习数据'] || item['核心价值'] || '学习资源',
            brief_description: item['推荐理由'] || '相关资源',
            url: this.buildChineseUrl(item['访问/观看'], undefined, item['资源标题'])
          })),
          learning_advice: learningAdvice
        }
      }
      
      // 处理英文字段格式：{ top: {...}, others: [...], advice: "..." }
      if (data.top || data.others || data.advice) {
        console.log('✅ 检测到英文字段格式')
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
   * 处理中文URL构建
   */
  private buildChineseUrl(accessWatch?: string, accessGuide?: string, title?: string): string {
    // 优先处理直接的URL
    if (accessWatch && accessWatch.startsWith('http')) {
      return accessWatch
    }
    
    // 处理B站BV号
    if (accessWatch && accessWatch.startsWith('BV')) {
      return `https://www.bilibili.com/video/${accessWatch}`
    }
    
    // 处理B站课程链接
    if (accessWatch && accessWatch.includes('bilibili.com/cheese')) {
      return accessWatch
    }
    
    // 根据标题生成搜索链接
    if (title) {
      return `https://www.bilibili.com/search?keyword=${encodeURIComponent(title)}`
    }
    
    return 'https://www.bilibili.com'
  }

  /**
   * 从中文学习数据中提取时长
   */
  private extractChineseDuration(studyData?: string): string {
    if (!studyData) return '2小时'
    
    // 匹配 "时长 2203:44" 格式
    const timeMatch = studyData.match(/时长\s*(\d+):(\d+)/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      return `${hours + Math.ceil(minutes / 60)}小时`
    }
    
    // 匹配 "播放量 13474759" 格式中的时长信息（如果有）
    const durationMatch = studyData.match(/(\d+(\.\d+)?)\s*[小时小时]/)
    if (durationMatch) {
      return durationMatch[1] + '小时'
    }
    
    // 匹配分钟格式
    const minuteMatch = studyData.match(/(\d+)\s*[分钟分]/)
    if (minuteMatch) {
      return Math.ceil(Number(minuteMatch[1]) / 60) + '小时'
    }
    
    return '2小时'
  }

  /**
   * 从内容中提取JSON数据
   */
  private extractJsonFromContent(content: string): any {
    try {
      console.log('🔍 尝试解析JSON，内容长度:', content.length)
      
      // 查找JSON块
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        console.log('✅ 找到JSON块，尝试解析')
        return JSON.parse(jsonMatch[1])
      }
      
      // 尝试直接解析整个内容
      console.log('🔄 尝试直接解析整个内容')
      return JSON.parse(content)
    } catch (error) {
      console.log('❌ JSON解析失败:', error)
      // 尝试查找对象模式
      const objectMatch = content.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        console.log('🔍 找到对象模式，尝试解析')
        try {
          const result = JSON.parse(objectMatch[0])
          console.log('✅ 对象模式解析成功')
          return result
        } catch (error) {
          console.log('❌ 对象模式解析失败:', error)
          return null
        }
      }
      console.log('❌ 未找到任何JSON对象')
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