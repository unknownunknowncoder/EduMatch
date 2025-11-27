// 社区相关类型定义

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
}

export interface Comment {
  id: string
  post_id: string
  content: string
  author_name: string
  created_at: string
  parent_id?: string | null
  user_id: string
  replies?: Comment[]
  reply_count?: number
  comment_type?: 'comment' | 'reply'
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