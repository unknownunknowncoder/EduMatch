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
  platform: '中国大学MOOC官网' | 'B站' | string
  institution?: string
  up_host?: string
  difficulty: '入门' | '进阶' | '高级'
  duration: string
  study_data: string
  bv_number?: string
  brief_description?: string
  reason?: string
  access_guide?: string // 添加访问指引字段
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
    const response = await fetch('http://localhost:3014/api/coze/chat', {
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
    const response = await fetch('http://localhost:3014/api/coze/chat', {
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
  private parseRecommendations(content: any): CozeSearchResponse {
    console.log('🔍 解析推荐内容:', content)
    
    // 如果是结构化对象，优先按结构化解析
    if (typeof content === 'object' && content !== null) {
      const structuredResult = this.parseStructuredRecommendations(content)
      if (structuredResult) {
        console.log('✅ 使用结构化解析结果:', structuredResult)
        return structuredResult
      }
    }

    // 如果是JSON字符串，尝试解析为对象
    if (typeof content === 'string') {
      const trimmed = content.trim()
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed)
          const structuredResult = this.parseStructuredRecommendations(parsed)
          if (structuredResult) {
            console.log('✅ 使用 JSON 结构化解析结果:', structuredResult)
            return structuredResult
          }
        } catch (error) {
          console.warn('⚠️ JSON解析失败，尝试文本解析:', error)
        }
      }
    }

    // 初始化结果（V9纯文本标签格式解析）
    const result: CozeSearchResponse = {
      top_recommendation: {
        name: '',
        platform: 'B站',
        reason: '暂无推荐',
        duration: '待确认',
        study_data: '暂无数据',
        difficulty: '入门'
      },
      other_recommendations: [],
      learning_advice: '建议结合理论学习和实际操作，制定合理的学习计划。'
    }
    
    try {
      const textContent = typeof content === 'string' ? content : JSON.stringify(content)
      // 解析V9纯文本标签格式内容
      const lines = textContent.split('\n').map(line => line.trim())
      
    let currentSection = '' // 当前板块：systematic, practical, external
    let currentRecommendation: any = {}
    let isFirstResource = true // 标记是否是第一个资源
    let isFirstSystematicResource = true // 标记是否是第一板块的第一个资源（最推荐）
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        // 识别资源聚合方案标题
        if (line.includes('全网资源聚合方案')) {
          // 提取一句话综述
          const nextLines = lines.slice(i + 1, i + 5)
          const summaryLine = nextLines.find(l => 
            l.includes('本方案整合了') || 
            l.includes('混合学习方案') ||
            l.includes('针对') && l.includes('学习目标')
          )
          if (summaryLine) {
            result.learning_advice = summaryLine.trim()
          }
          continue
        }
        
        // 提取学习路径建议
        if (line.includes('📅 学习路径建议') || line.includes('学习路径建议')) {
          // 提取建议内容（后续几行，直到遇到空行或新板块）
          let adviceLines: string[] = []
          for (let k = i + 1; k < Math.min(i + 15, lines.length); k++) {
            const adviceLine = lines[k].trim()
            // 遇到新板块、资源或空行时停止
            if (adviceLine.includes('第一板块') || 
                adviceLine.includes('第二板块') || 
                adviceLine.includes('第三板块') ||
                adviceLine.match(/^\d+\./) ||
                (adviceLine.startsWith('[') && adviceLine.endsWith(']') && adviceLine.length > 5) ||
                adviceLine === '') {
              // 如果遇到空行，再检查下一行，如果也是空行或新板块则停止
              if (adviceLine === '' && k + 1 < lines.length) {
                const nextLine = lines[k + 1].trim()
                if (nextLine === '' || 
                    nextLine.includes('第一板块') || 
                    nextLine.includes('第二板块') || 
                    nextLine.includes('第三板块')) {
                  break
                }
              } else if (adviceLine !== '') {
                break
              }
            }
            if (adviceLine && adviceLine.length > 5) {
              adviceLines.push(adviceLine)
            }
          }
          if (adviceLines.length > 0) {
            result.learning_advice = adviceLines.join(' ').trim()
          }
          continue
        }
        
        // 识别板块标题（V9格式使用纯文本标签）
        if (line.includes('第一板块：系统化课程') || 
            line.includes('第一板块：系统性课程') || 
            line.includes('(理论与基础)')) {
          currentSection = 'systematic'
          continue
        }
        else if (line.includes('第二板块：实战与专项') || 
                 line.includes('(视频为主)') ||
                 line.includes('第二板块：实战专项')) {
          currentSection = 'practical'
          isFirstSystematicResource = false // 第一板块已结束
          continue
        }
        else if (line.includes('第三板块：外部资源') || 
                 line.includes('(权威补充)') ||
                 line.includes('第三板块：外部补充')) {
          currentSection = 'external'
          isFirstSystematicResource = false // 第一板块已结束
          continue
        }
        
        // 解析编号资源（如：1. 课程名称）
        if (line.match(/^\d+\./)) {
          // 保存之前的推荐
          if (Object.keys(currentRecommendation).length > 1) {
            if (isFirstSystematicResource && currentSection === 'systematic') {
              // 第一板块的第一个资源作为最推荐
              result.top_recommendation = {
                name: currentRecommendation.name || '推荐课程',
                platform: currentRecommendation.platform || 'B站',
                reason: currentRecommendation.reason || currentRecommendation.brief_description || '优质学习资源',
                duration: currentRecommendation.duration || '',
                study_data: currentRecommendation.study_data || '推荐',
                difficulty: currentRecommendation.difficulty || '进阶',
                up_host: currentRecommendation.up_host,
                bv_number: currentRecommendation.bv_number,
                institution: currentRecommendation.institution,
                brief_description: currentRecommendation.brief_description,
                access_guide: currentRecommendation.access_guide
              }
              isFirstSystematicResource = false
              isFirstResource = false
            } else {
              // 确保reason字段有值，优先使用推荐理由，然后是内容简介，最后是资源名称的一部分
              if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源' || currentRecommendation.reason === '优质学习资源') {
                currentRecommendation.reason = currentRecommendation.brief_description || 
                                               (currentRecommendation.name && currentRecommendation.name.length > 20 ? 
                                                currentRecommendation.name.substring(0, 50) + '...' : 
                                                currentRecommendation.name) ||
                                               '优质学习资源'
              }
              
              // 对于非B站资源，如果没有访问指引，生成一个默认的
              if (currentRecommendation.platform && 
                  currentRecommendation.platform !== 'B站' && 
                  !currentRecommendation.access_guide && 
                  !currentRecommendation.bv_number) {
                // 根据平台和资源名称生成访问指引
                if (currentRecommendation.platform.includes('MOOC')) {
                  currentRecommendation.access_guide = `搜索"中国大学MOOC ${currentRecommendation.name}"`
                } else if (currentRecommendation.platform.includes('官方')) {
                  currentRecommendation.access_guide = `搜索"${currentRecommendation.name} 官方文档"`
                } else {
                  currentRecommendation.access_guide = `搜索"${currentRecommendation.name}"`
                }
              }
              
              result.other_recommendations.push({...currentRecommendation})
            }
          }
          
          const titleMatch = line.match(/^\d+\.\s*(.+)/)
          currentRecommendation = {
            name: titleMatch ? titleMatch[1].trim() : line.trim(),
            platform: 'B站',
            difficulty: '入门', // 改为默认入门
            duration: '', // 改为空字符串，不显示"待确认"
            study_data: '推荐',
            reason: '智能推荐资源'
          }
          
          // 向后查找该资源的详细信息（增加查找范围）
          let emptyLineCount = 0
          for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
            const detailLine = lines[j].trim()
            
            // 遇到新资源或新板块时停止
            if (detailLine.match(/^\d+\./) || 
                (detailLine.startsWith('[') && detailLine.endsWith(']') && detailLine.length > 5 && detailLine !== `[${currentRecommendation.name}]`) ||
                detailLine.includes('第一板块') || 
                detailLine.includes('第二板块') || 
                detailLine.includes('第三板块') ||
                detailLine.includes('🎯 最推荐') || 
                detailLine.includes('📚 其他推荐') ||
                detailLine.includes('📅 学习路径建议') ||
                detailLine.includes('全网资源聚合方案')) {
              break
            }
            
            // 如果连续遇到两个空行，可能表示资源信息结束
            if (detailLine === '') {
              emptyLineCount++
              if (emptyLineCount >= 2) {
                // 如果已经提取到一些信息，可以停止；否则继续查找
                if (currentRecommendation.reason && currentRecommendation.reason !== '智能推荐资源') {
                  break
                }
              }
              continue
            } else {
              emptyLineCount = 0
            }
            
            // 解析详细信息（V9格式，支持直接文本和-开头的列表）
            let cleanDetail = detailLine
            if (detailLine.startsWith('-') || detailLine.startsWith('•')) {
              cleanDetail = detailLine.replace(/^[-•*]\s*/, '')
            }
            
            // 来源平台
            if (cleanDetail.includes('来源平台：') || cleanDetail.includes('平台来源：')) {
              const platformMatch = cleanDetail.match(/(?:来源平台|平台来源)：\s*(.+)/)
              if (platformMatch) {
                const platform = platformMatch[1].trim()
                // 保留原始平台名称，只对特定平台进行标准化
                if (platform.includes('MOOC') || platform.includes('中国大学MOOC')) {
                  currentRecommendation.platform = '中国大学MOOC官网'
                } else if (platform.includes('Bilibili') || platform === 'B站') {
                  currentRecommendation.platform = 'B站'
                } else {
                  // 保留原始平台名称（如：官方文档、菜鸟教程、廖雪峰官网、垂直论坛等）
                  currentRecommendation.platform = platform
                }
              }
            }
            // 学习数据
            else if (cleanDetail.includes('学习数据：')) {
              const dataMatch = cleanDetail.match(/学习数据：\s*(.+)/)
              if (dataMatch) {
                currentRecommendation.study_data = dataMatch[1].trim()
              }
            }
            // 内容简介（优先于推荐理由，因为内容简介更具体）
            else if (cleanDetail.includes('内容简介：')) {
              const descMatch = cleanDetail.match(/内容简介：\s*(.+)/)
              if (descMatch) {
                const desc = descMatch[1].trim()
                // 如果还没有推荐理由，或者推荐理由是默认值，则使用内容简介
                if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源') {
                  currentRecommendation.reason = desc
                }
                // 同时保存为brief_description
                currentRecommendation.brief_description = desc
              }
            }
            // 推荐理由
            else if (cleanDetail.includes('推荐理由：')) {
              const reasonMatch = cleanDetail.match(/推荐理由：\s*(.+)/)
              if (reasonMatch) {
                currentRecommendation.reason = reasonMatch[1].trim()
              }
            }
            // 访问地址/访问观看（B站特有） - 移除平台限制，先提取BV号或URL
            else if (cleanDetail.includes('访问地址：') || cleanDetail.includes('访问/观看：')) {
              // 先检查是否是完整URL
              const urlMatch = cleanDetail.match(/https?:\/\/[^\s]+/)
              if (urlMatch) {
                const url = urlMatch[0]
                // 如果是B站URL，提取BV号；否则保存完整URL
                if (url.includes('bilibili.com')) {
                  const bvMatch = url.match(/BV[a-zA-Z0-9]+/)
                  if (bvMatch) {
                    currentRecommendation.bv_number = bvMatch[0]
                  } else {
                    // 保存完整URL作为bv_number（后续会处理）
                    currentRecommendation.bv_number = url
                  }
                  currentRecommendation.platform = 'B站'
                } else {
                  // 非B站URL，保存为access_guide
                  currentRecommendation.access_guide = url
                }
              } else {
                // 提取BV号
                const bvMatch = cleanDetail.match(/BV[a-zA-Z0-9]+/)
                if (bvMatch) {
                  currentRecommendation.bv_number = bvMatch[0]
                  // 确保平台设置为B站
                  if (!currentRecommendation.platform || currentRecommendation.platform !== 'B站') {
                    currentRecommendation.platform = 'B站'
                  }
                }
              }
            }
            // B站BV号
            else if (cleanDetail.includes('B站BV号：')) {
              const bvMatch = cleanDetail.match(/B站BV号：\s*(BV[a-zA-Z0-9]+)/)
              if (bvMatch) {
                currentRecommendation.bv_number = bvMatch[1]
                currentRecommendation.platform = 'B站'
              }
            }
            // UP主/讲师/机构信息
            else if (cleanDetail.includes('UP主：') || cleanDetail.includes('讲师：') || cleanDetail.includes('机构：')) {
              const hostMatch = cleanDetail.match(/(?:UP主|讲师|机构)：\s*(.+)/)
              if (hostMatch) {
                const hostName = hostMatch[1].trim()
                if (cleanDetail.includes('UP主：')) {
                  currentRecommendation.up_host = hostName !== '无' ? hostName : undefined
                } else {
                  currentRecommendation.institution = hostName !== '无' ? hostName : undefined
                }
              }
            }
            // 难度等级
            else if (cleanDetail.includes('难度等级：')) {
              const difficultyMatch = cleanDetail.match(/难度等级：\s*(.+)/)
              if (difficultyMatch) {
                const difficulty = difficultyMatch[1].trim()
                if (['入门', '进阶', '高级'].includes(difficulty)) {
                  currentRecommendation.difficulty = difficulty as '入门' | '进阶' | '高级'
                }
              }
            }
            // 学习时长
            else if (cleanDetail.includes('学习时长：')) {
              const durationMatch = cleanDetail.match(/学习时长：\s*(.+)/)
              if (durationMatch) {
                currentRecommendation.duration = durationMatch[1].trim()
              }
            }
            // 资源类型（用于非B站资源）
            else if (cleanDetail.includes('资源类型：')) {
              const typeMatch = cleanDetail.match(/资源类型：\s*(.+)/)
              if (typeMatch) {
                currentRecommendation.study_data = typeMatch[1].trim()
              }
            }
            // 访问指引（用于非B站资源） - 存储为访问路径
            else if (cleanDetail.includes('访问指引：')) {
              const guideMatch = cleanDetail.match(/访问指引：\s*(.+)/)
              if (guideMatch) {
                currentRecommendation.access_guide = guideMatch[1].trim()
                // 不要用访问指引覆盖推荐理由
              }
            }
            // 核心价值（用于非B站资源）
            else if (cleanDetail.includes('核心价值：')) {
              const valueMatch = cleanDetail.match(/核心价值：\s*(.+)/)
              if (valueMatch) {
                // 优先使用推荐理由，如果没有则使用核心价值
                if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源' || currentRecommendation.reason === '优质学习资源') {
                  currentRecommendation.reason = valueMatch[1].trim()
                }
              }
            }
            // 智能检测任何包含BV号的行（作为最后的备用检测，移除平台限制）
            else {
              const bvMatch = cleanDetail.match(/BV[a-zA-Z0-9]+/)
              if (bvMatch) {
                // 如果当前资源是B站或未设置平台，则设置BV号并标记为B站
                if (!currentRecommendation.platform || 
                    currentRecommendation.platform === 'B站' || 
                    currentRecommendation.platform === 'Bilibili') {
                  currentRecommendation.bv_number = bvMatch[0]
                  currentRecommendation.platform = 'B站'
                }
              }
            }
          }
        }
        
        // 解析方括号格式的独立资源（如：[课程名称] 或 [分类]：[课程]）
        else if (line && line.includes('[') && line.includes(']') && !line.includes('板块') && line.length > 5) {
          // 保存之前的推荐
          if (Object.keys(currentRecommendation).length > 1) {
            if (isFirstSystematicResource && currentSection === 'systematic') {
              // 第一板块的第一个资源作为最推荐
              result.top_recommendation = {
                name: currentRecommendation.name || '推荐课程',
                platform: currentRecommendation.platform || 'B站',
                reason: currentRecommendation.reason || currentRecommendation.brief_description || '优质学习资源',
                duration: currentRecommendation.duration || '',
                study_data: currentRecommendation.study_data || '推荐',
                difficulty: currentRecommendation.difficulty || '进阶',
                up_host: currentRecommendation.up_host,
                bv_number: currentRecommendation.bv_number,
                institution: currentRecommendation.institution,
                brief_description: currentRecommendation.brief_description,
                access_guide: currentRecommendation.access_guide
              }
              isFirstSystematicResource = false
              isFirstResource = false
            } else {
              // 确保reason字段有值，优先使用推荐理由，然后是内容简介，最后是资源名称的一部分
              if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源' || currentRecommendation.reason === '优质学习资源') {
                currentRecommendation.reason = currentRecommendation.brief_description || 
                                               (currentRecommendation.name && currentRecommendation.name.length > 20 ? 
                                                currentRecommendation.name.substring(0, 50) + '...' : 
                                                currentRecommendation.name) ||
                                               '优质学习资源'
              }
              
              // 对于非B站资源，如果没有访问指引，生成一个默认的
              if (currentRecommendation.platform && 
                  currentRecommendation.platform !== 'B站' && 
                  !currentRecommendation.access_guide && 
                  !currentRecommendation.bv_number) {
                // 根据平台和资源名称生成访问指引
                if (currentRecommendation.platform.includes('MOOC')) {
                  currentRecommendation.access_guide = `搜索"中国大学MOOC ${currentRecommendation.name}"`
                } else if (currentRecommendation.platform.includes('官方')) {
                  currentRecommendation.access_guide = `搜索"${currentRecommendation.name} 官方文档"`
                } else {
                  currentRecommendation.access_guide = `搜索"${currentRecommendation.name}"`
                }
              }
              
              result.other_recommendations.push({...currentRecommendation})
            }
          }
          
          // 提取资源名称，处理可能的 [分类]：[资源名] 格式
          let resourceName = ''
          if (line.includes(']：[')) {
            // [分类]：[资源名] 格式，提取最后的方括号内容
            const matches = line.match(/\[([^\]]+)\]$/)
            if (matches) {
              resourceName = matches[1].trim()
            }
          } else if (line.startsWith('[') && line.endsWith(']')) {
            // [资源名] 格式
            resourceName = line.slice(1, -1).trim()
          } else {
            // 其他包含方括号的格式，尝试提取有意义的内容
            resourceName = line.replace(/^[^[]*\[([^\]]+)\][^]]*$/, '$1').trim()
          }
          
          currentRecommendation = {
            name: resourceName || line.trim(),
            platform: 'B站',
            difficulty: '入门', // 改为默认入门
            duration: '', // 改为空字符串，不显示"待确认"
            study_data: '推荐',
            reason: '智能推荐资源'
          }
          
          // 向后查找该资源的详细信息（增加查找范围）
          let emptyLineCount = 0
          for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
            const detailLine = lines[j].trim()
            
            // 遇到新资源或新板块时停止
            if (detailLine.match(/^\d+\./) || 
                (detailLine.startsWith('[') && detailLine.endsWith(']') && detailLine.length > 5 && detailLine !== `[${currentRecommendation.name}]`) ||
                detailLine.includes('第一板块') || 
                detailLine.includes('第二板块') || 
                detailLine.includes('第三板块') ||
                detailLine.includes('🎯 最推荐') || 
                detailLine.includes('📚 其他推荐') ||
                detailLine.includes('📅 学习路径建议') ||
                detailLine.includes('全网资源聚合方案')) {
              break
            }
            
            // 如果连续遇到两个空行，可能表示资源信息结束
            if (detailLine === '') {
              emptyLineCount++
              if (emptyLineCount >= 2) {
                // 如果已经提取到一些信息，可以停止；否则继续查找
                if (currentRecommendation.reason && currentRecommendation.reason !== '智能推荐资源') {
                  break
                }
              }
              continue
            } else {
              emptyLineCount = 0
            }
            
            // 解析详细信息（V9格式）
            let cleanDetail = detailLine
            if (detailLine.startsWith('-') || detailLine.startsWith('•')) {
              cleanDetail = detailLine.replace(/^[-•*]\s*/, '')
            }
            
            // 来源平台
            if (cleanDetail.includes('来源平台：') || cleanDetail.includes('平台来源：')) {
              const platformMatch = cleanDetail.match(/(?:来源平台|平台来源)：\s*(.+)/)
              if (platformMatch) {
                const platform = platformMatch[1].trim()
                // 保留原始平台名称，只对特定平台进行标准化
                if (platform.includes('MOOC') || platform.includes('中国大学MOOC')) {
                  currentRecommendation.platform = '中国大学MOOC官网'
                } else if (platform.includes('Bilibili') || platform === 'B站') {
                  currentRecommendation.platform = 'B站'
                } else {
                  // 保留原始平台名称（如：官方文档、菜鸟教程、廖雪峰官网、垂直论坛等）
                  currentRecommendation.platform = platform
                }
              }
            }
            // 学习数据
            else if (cleanDetail.includes('学习数据：')) {
              const dataMatch = cleanDetail.match(/学习数据：\s*(.+)/)
              if (dataMatch) {
                currentRecommendation.study_data = dataMatch[1].trim()
              }
            }
            // 内容简介（优先于推荐理由，因为内容简介更具体）
            else if (cleanDetail.includes('内容简介：')) {
              const descMatch = cleanDetail.match(/内容简介：\s*(.+)/)
              if (descMatch) {
                const desc = descMatch[1].trim()
                // 如果还没有推荐理由，或者推荐理由是默认值，则使用内容简介
                if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源') {
                  currentRecommendation.reason = desc
                }
                // 同时保存为brief_description
                currentRecommendation.brief_description = desc
              }
            }
            // 推荐理由
            else if (cleanDetail.includes('推荐理由：')) {
              const reasonMatch = cleanDetail.match(/推荐理由：\s*(.+)/)
              if (reasonMatch) {
                currentRecommendation.reason = reasonMatch[1].trim()
              }
            }
            // 访问地址/访问观看（B站特有）- 移除平台限制
            else if (cleanDetail.includes('访问地址：') || cleanDetail.includes('访问/观看：')) {
              // 先检查是否是完整URL
              const urlMatch = cleanDetail.match(/https?:\/\/[^\s]+/)
              if (urlMatch) {
                const url = urlMatch[0]
                // 如果是B站URL，提取BV号；否则保存完整URL
                if (url.includes('bilibili.com')) {
                  const bvMatch = url.match(/BV[a-zA-Z0-9]+/)
                  if (bvMatch) {
                    currentRecommendation.bv_number = bvMatch[0]
                  } else {
                    // 保存完整URL作为bv_number（后续会处理）
                    currentRecommendation.bv_number = url
                  }
                  currentRecommendation.platform = 'B站'
                } else {
                  // 非B站URL，保存为access_guide
                  currentRecommendation.access_guide = url
                }
              } else {
                // 提取BV号
                const bvMatch = cleanDetail.match(/BV[a-zA-Z0-9]+/)
                if (bvMatch) {
                  currentRecommendation.bv_number = bvMatch[0]
                  currentRecommendation.platform = 'B站'
                }
              }
            }

          }
        }
      }
      
      // 添加最后一个推荐
      if (Object.keys(currentRecommendation).length > 1) {
        // 确保reason字段有值，优先使用推荐理由，然后是内容简介，最后是核心价值
        if (!currentRecommendation.reason || currentRecommendation.reason === '智能推荐资源' || currentRecommendation.reason === '优质学习资源') {
          currentRecommendation.reason = currentRecommendation.brief_description || 
                                         (currentRecommendation.study_data && currentRecommendation.study_data !== '推荐' ? currentRecommendation.study_data : '优质学习资源')
        }
        
        // 对于非B站资源，如果没有访问指引，生成一个默认的
        if (currentRecommendation.platform && 
            currentRecommendation.platform !== 'B站' && 
            !currentRecommendation.access_guide && 
            !currentRecommendation.bv_number) {
          // 根据平台和资源名称生成访问指引
          if (currentRecommendation.platform.includes('MOOC')) {
            currentRecommendation.access_guide = `搜索"中国大学MOOC ${currentRecommendation.name}"`
          } else if (currentRecommendation.platform.includes('官方')) {
            currentRecommendation.access_guide = `搜索"${currentRecommendation.name} 官方文档"`
          } else {
            currentRecommendation.access_guide = `搜索"${currentRecommendation.name}"`
          }
        }
        
        if (isFirstResource) {
          result.top_recommendation = {
            name: currentRecommendation.name || '推荐课程',
            platform: currentRecommendation.platform || 'B站',
            reason: currentRecommendation.reason || '优质学习资源',
            duration: currentRecommendation.duration || '',
            study_data: currentRecommendation.study_data || '推荐',
            difficulty: currentRecommendation.difficulty || '进阶',
            up_host: currentRecommendation.up_host,
            bv_number: currentRecommendation.bv_number,
            institution: currentRecommendation.institution,
            brief_description: currentRecommendation.brief_description,
            access_guide: currentRecommendation.access_guide
          }
        } else {
          result.other_recommendations.push({...currentRecommendation})
        }
      }
      
      // 如果没有找到最推荐的名称，尝试提取第一个有意义的内容
      if (!result.top_recommendation.name) {
        const firstLine = lines.find(line => 
          line.length > 10 && 
          !line.includes('第一板块') && 
          !line.includes('第二板块') && 
          !line.includes('第三板块') &&
          !line.includes('全网资源聚合方案') &&
          !line.match(/^\d+\./)
        )
        if (firstLine) {
          result.top_recommendation.name = firstLine.substring(0, 100).trim()
        }
      }
      
      // 如果最推荐没有设置基本信息，设置默认值
      if (!result.top_recommendation.reason) {
        result.top_recommendation.reason = 'AI智能推荐的学习资源'
      }
      
      // 如果还没有学习建议，尝试从文本末尾提取学习路径建议
      if (!result.learning_advice || result.learning_advice === '建议结合理论学习和实际操作，制定合理的学习计划。' || result.learning_advice.includes('本方案整合了')) {
        const textContent = typeof content === 'string' ? content : JSON.stringify(content)
        // 尝试多种匹配模式
        const patterns = [
          /📅\s*学习路径建议[：:]\s*([^\n]+(?:\n(?!第一板块|第二板块|第三板块|🎯|📚|\[)[^\n]+)*)/i,
          /学习路径建议[：:]\s*([^\n]+(?:\n(?!第一板块|第二板块|第三板块|🎯|📚|\[)[^\n]+)*)/i
        ]
        
        let found = false
        for (const pattern of patterns) {
          const adviceMatch = textContent.match(pattern)
          if (adviceMatch && adviceMatch[1].trim().length > 20) {
            result.learning_advice = adviceMatch[1].trim()
            found = true
            break
          }
        }
        
        if (!found) {
          // 尝试提取"学习路径建议"后面的内容
          const adviceIndex = textContent.indexOf('学习路径建议')
          if (adviceIndex > -1) {
            const afterAdvice = textContent.substring(adviceIndex + '学习路径建议'.length).trim()
            const nextSection = afterAdvice.match(/^[：:]\s*(.+?)(?:\n\n|\n第一板块|\n第二板块|\n第三板块|$)/s)
            if (nextSection && nextSection[1].trim().length > 20) {
              result.learning_advice = nextSection[1].trim()
            } else {
              // 提取后续几行作为建议
              const lines = afterAdvice.split('\n').slice(0, 5).filter(l => l.trim().length > 10)
              if (lines.length > 0) {
                result.learning_advice = lines.join(' ').trim()
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ 解析推荐内容失败:', error)
      throw new Error(`解析推荐内容失败: ${error.message}`)
    }
    
    console.log('✅ V9格式解析结果:', result)
    return result
  }

  /**
   * 解析结构化推荐内容（AI返回JSON对象时）
   */
  private parseStructuredRecommendations(data: any): CozeSearchResponse | null {
    if (!data || typeof data !== 'object') {
      return null
    }

    const result: CozeSearchResponse = {
      top_recommendation: this.mapStructuredResource(data['最推荐'] || {}, 'B站'),
      other_recommendations: [],
      learning_advice: data['学习建议'] || '建议结合理论学习和实际操作，制定合理的学习计划。'
    }

    if (data['其他推荐']) {
      const others = data['其他推荐']
      if (Array.isArray(others)) {
        result.other_recommendations = others.map(item => this.mapStructuredResource(item, 'B站'))
      } else if (typeof others === 'object') {
        const bilibiliList = Array.isArray(others['B站API资源']) ? others['B站API资源'] : []
        const moocList = Array.isArray(others['MOOC知识库资源']) ? others['MOOC知识库资源'] : []
        result.other_recommendations = [
          ...bilibiliList.map(item => this.mapStructuredResource(item, 'B站')),
          ...moocList.map(item => this.mapStructuredResource(item, '中国大学MOOC官网'))
        ]
      }
    }

    return result
  }

  private mapStructuredResource(item: any, defaultPlatform: '中国大学MOOC官网' | 'B站'): CozeResource {
    const platformSource = item?.['平台来源'] || ''
    const mapPlatform = (source: string): '中国大学MOOC官网' | 'B站' => {
      if (source.includes('MOOC') || source.includes('大学')) {
        return '中国大学MOOC官网'
      }
      return 'B站'
    }

    const mapDifficulty = (value: string): '入门' | '进阶' | '高级' => {
      if (value === '进阶' || value === '高级') {
        return value
      }
      return '入门'
    }

    const platform = platformSource ? mapPlatform(platformSource) : defaultPlatform

    return {
      name: item?.['资源名称'] || item?.name || '推荐学习资源',
      platform,
      institution: item?.['机构'],
      up_host: item?.['UP主'],
      difficulty: mapDifficulty(item?.['难度等级'] || ''),
      duration: item?.['学习时长'] || '',
      study_data: item?.['学习数据'] || '暂无数据',
      bv_number: item?.['B站BV号'] && item['B站BV号'] !== '待获取' ? item['B站BV号'] : undefined,
      brief_description: item?.['简要说明'],
      reason: item?.['推荐理由'] || item?.['简要说明'] || 'AI智能推荐的学习资源',
      access_guide: item?.['访问指引'] || item?.['访问路径']
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

// 导出单例实例
export const cozeAPIService = new CozeAPIService()