/**
 * 扣子AI智能体服务
 * 集成教育资源智能匹配功能
 */

export interface AISearchRequest {
  query: string
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  limit?: number
}

export interface CourseResource {
  id: string
  title: string
  description: string
  provider: 'MOOC' | 'Bilibili'
  url?: string
  difficulty: string
  duration?: string
  rating?: number
  tags: string[]
  thumbnail?: string
  instructor?: string
  matchScore: number
  recommendedReason: string
}

export interface AIRecommendationResponse {
  topRecommendation: CourseResource
  otherRecommendations: CourseResource[]
  learningAdvice: string
  relatedKeywords: string[]
}

class CozeAIService {
  private apiKey: string
  private baseUrl: string
  private knowledgeBaseIds: {
    mooc: string
    bilibili: string
  }

  constructor() {
    // 从环境变量读取配置
    this.apiKey = import.meta.env.VITE_COZE_API_KEY || ''
    this.baseUrl = 'https://api.coze.cn/v1'
    
    // 知识库ID配置
    this.knowledgeBaseIds = {
      mooc: import.meta.env.VITE_COZE_MOOC_KB_ID || '',
      bilibili: import.meta.env.VITE_COZE_BILIBILI_KB_ID || ''
    }
  }

  /**
   * 智能搜索教育资源
   */
  async searchResources(request: AISearchRequest): Promise<AIRecommendationResponse> {
    try {
      // 1. 分析用户查询意图
      const intentAnalysis = await this.analyzeUserIntent(request.query)
      
      // 2. 并行搜索多个知识库
      const [moocResults, bilibiliResults] = await Promise.all([
        this.searchKnowledgeBase(this.knowledgeBaseIds.mooc, intentAnalysis.searchQuery),
        this.searchKnowledgeBase(this.knowledgeBaseIds.bilibili, intentAnalysis.searchQuery)
      ])

      // 3. 合并和排序结果
      const allResults = this.mergeResults(moocResults, bilibiliResults, intentAnalysis)
      
      // 4. 智能匹配和推荐
      const recommendations = this.generateRecommendations(allResults, request)
      
      // 5. 生成学习建议
      const learningAdvice = await this.generateLearningAdvice(intentAnalysis, recommendations)

      return {
        topRecommendation: recommendations[0] || this.getFallbackResource(),
        otherRecommendations: recommendations.slice(1, 4),
        learningAdvice,
        relatedKeywords: intentAnalysis.relatedKeywords
      }

    } catch (error) {
      console.error('AI搜索失败:', error)
      return this.getFallbackResponse(request.query)
    }
  }

  /**
   * 分析用户查询意图
   */
  private async analyzeUserIntent(query: string): Promise<any> {
    const prompt = `
      分析以下用户查询，提取关键信息：
      
      用户查询："${query}"
      
      请提取：
      1. 核心关键词
      2. 用户技能水平（初学者/进阶/高级）
      3. 学习目标（就业/兴趣/提升）
      4. 相关扩展关键词
      
      返回JSON格式。
    `

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'coze-chat',
          messages: [
            {
              role: 'system',
              content: '你是专业的教育需求分析助手，擅长理解用户的学习需求和意图。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })
      })

      const result = await response.json()
      return JSON.parse(result.choices[0].message.content)
    } catch (error) {
      // 降级处理：使用基础关键词提取
      return {
        coreKeywords: [query],
        userLevel: 'beginner',
        learningGoal: 'interest',
        searchQuery: query,
        relatedKeywords: []
      }
    }
  }

  /**
   * 搜索知识库
   */
  private async searchKnowledgeBase(knowledgeBaseId: string, query: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/knowledge/retrieve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          knowledge_id: knowledgeBaseId,
          query: query,
          top_k: 20,
          score_threshold: 0.6
        })
      })

      const result = await response.json()
      return result.data?.matches || []
    } catch (error) {
      console.error('知识库搜索失败:', error)
      return []
    }
  }

  /**
   * 合并搜索结果
   */
  private mergeResults(moocResults: any[], bilibiliResults: any[], intent: any): any[] {
    const processedMooc = moocResults.map(item => ({
      ...item,
      provider: 'MOOC',
      providerName: '中国大学MOOC'
    }))

    const processedBilibili = bilibiliResults.map(item => ({
      ...item,
      provider: 'Bilibili',
      providerName: 'B站'
    }))

    return [...processedMooc, ...processedBilibili]
  }

  /**
   * 生成智能推荐
   */
  private generateRecommendations(results: any[], request: AISearchRequest): CourseResource[] {
    return results
      .map(result => this.transformToResource(result, request))
      .filter(resource => resource.matchScore > 0.5)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
  }

  /**
   * 转换为资源对象
   */
  private transformToResource(result: any, request: AISearchRequest): CourseResource {
    const score = this.calculateMatchScore(result, request)
    
    return {
      id: result.id || Math.random().toString(),
      title: result.title || result.name || '未知标题',
      description: result.description || result.summary || '暂无描述',
      provider: result.provider,
      url: result.url || result.link,
      difficulty: result.difficulty || '未知',
      duration: result.duration || result.total_time || '未知',
      rating: result.rating || result.score || 0,
      tags: result.tags || [],
      thumbnail: result.thumbnail || result.cover,
      instructor: result.instructor || result.teacher || result.uploader,
      matchScore: score,
      recommendedReason: this.generateRecommendReason(result, score)
    }
  }

  /**
   * 计算匹配分数
   */
  private calculateMatchScore(result: any, request: AISearchRequest): number {
    let score = 0.5 // 基础分数

    // 相关性分数
    if (result.score) {
      score += result.score * 0.3
    }

    // 质量分数
    if (result.rating && result.rating > 4) {
      score += 0.2
    }

    // 难度匹配
    if (request.userLevel) {
      const difficultyMap = {
        'beginner': ['入门', '基础', '初级'],
        'intermediate': ['进阶', '中级'],
        'advanced': ['高级', '深入', '精通']
      }
      
      const targetDifficulties = difficultyMap[request.userLevel] || []
      if (targetDifficulties.some(diff => result.difficulty?.includes(diff))) {
        score += 0.2
      }
    }

    return Math.min(score, 1.0)
  }

  /**
   * 生成推荐理由
   */
  private generateRecommendReason(result: any, score: number): string {
    const reasons = []
    
    if (score > 0.8) {
      reasons.push('高度匹配您的学习需求')
    }
    
    if (result.rating > 4.5) {
      reasons.push('用户评价优秀')
    }
    
    if (result.provider === 'MOOC') {
      reasons.push('权威机构认证')
    }
    
    return reasons.join('，') || '符合您的搜索条件'
  }

  /**
   * 生成学习建议
   */
  private async generateLearningAdvice(intent: any, recommendations: CourseResource[]): Promise<string> {
    if (recommendations.length === 0) {
      return '抱歉，暂时没有找到完全匹配的资源。建议尝试调整关键词或浏览更多类别。'
    }

    const advice = []
    
    // 基于用户水平给出建议
    if (intent.userLevel === 'beginner') {
      advice.push('建议从基础课程开始，循序渐进地学习。')
    } else if (intent.userLevel === 'advanced') {
      advice.push('可以结合多个高级课程，形成完整的知识体系。')
    }

    // 基于推荐内容给出建议
    if (recommendations[0]) {
      advice.push(`重点推荐《${recommendations[0].title}》，这是与您需求最匹配的资源。`)
    }

    advice.push('学习过程中记得多实践，遇到问题可以到社区寻求帮助。')

    return advice.join(' ')
  }

  /**
   * 获取备用资源
   */
  private getFallbackResource(): CourseResource {
    return {
      id: 'fallback',
      title: '暂无匹配资源',
      description: '建议尝试其他关键词或浏览全部资源',
      provider: 'MOOC',
      difficulty: '未知',
      matchScore: 0,
      recommendedReason: '请调整搜索条件'
    }
  }

  /**
   * 获取备用响应
   */
  private getFallbackResponse(query: string): AIRecommendationResponse {
    return {
      topRecommendation: this.getFallbackResource(),
      otherRecommendations: [],
      learningAdvice: '抱歉，搜索服务暂时不可用。请稍后重试或联系客服。',
      relatedKeywords: []
    }
  }
}

// 创建服务实例
export const cozeAIService = new CozeAIService()

// 导出类型
export type { AISearchRequest, CourseResource, AIRecommendationResponse }