// 社区相关类型定义

export interface LinkedResource {
  id: string
  title: string
  description?: string | null
  category?: string | null
  url?: string | null
}

export interface Post {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
  view_count: number
  like_count: number
  comment_count: number
  favorite_count?: number
  is_favorited?: boolean
  is_liked?: boolean
  resource_id?: string | null
  resource?: LinkedResource | null
}

export interface Comment {
  id: string
  post_id: string
  content: string
  author_name: string
  created_at: string
}

// 帖子收藏类型
export interface PostFavorite {
  id: string
  user_id: string
  post_id: string
  created_at: string
}

// 帖子点赞类型
export interface PostLike {
  id: string
  user_id: string
  post_id: string
  created_at: string
}