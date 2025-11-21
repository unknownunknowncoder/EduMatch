// 资源类型定义
export interface Resource {
  id: number
  name: string
  title?: string  // 兼容旧数据结构
  provider: string
  contentOutline: string[]
  duration: string
  rating: number
  url: string
  matchPoints: string
  type: string
  target: string
  description?: string  // 兼容旧数据结构
  category?: string   // 兼容旧数据结构
  difficulty?: string // 兼容旧数据结构
}

// 用户类型定义
export interface User {
  id: number
  username: string
  password: string
  nickname: string
}

// 点赞和收藏数据类型
export interface InteractionData {
  liked: boolean
  saved: boolean
  likesCount: number
}

// 历史记录类型
export interface HistoryItem {
  resource: Resource
  timestamp: number
}

// 主题类型
export type Theme = 'light' | 'dark'