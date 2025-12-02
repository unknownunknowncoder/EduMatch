<template>
  <div class="comment-wrapper" :class="getCommentClass()">
    <div class="comment-item">
      <div class="comment-header">
        <div class="comment-avatar">
          <img 
            :src="getUserAvatar(comment.user_id, comment.author_name)" 
            :alt="comment.author_name || '匿名用户'"
            class="avatar"
          />
        </div>
        <div class="comment-user-info">
          <span class="comment-author">{{ comment.author_name || '匿名用户' }}</span>
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
        </div>
      </div>
      <div class="comment-content">
        <span v-if="comment.parent_id" class="reply-prefix">回复：{{ getParentAuthorName() }}</span>
        <span :class="{ 'has-reply-prefix': comment.parent_id }">{{ comment.content }}</span>
      </div>
      <div class="comment-actions">
        <button 
          @click="handleReply" 
          class="reply-btn"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          回复
        </button>
        <span v-if="replies.length > 0" class="reply-count">
          {{ replies.length }} 条回复
        </span>
      </div>
      
      <!-- 回复输入框 -->
      <div v-if="showReplyInput" class="reply-input-section">
        <textarea 
          v-model="replyContent" 
          :placeholder="`回复 @${comment.author_name || '匿名用户'}...`"
          rows="2"
          class="reply-input"
        ></textarea>
        <div class="reply-input-actions">
          <button 
            @click="showReplyInput = false" 
            class="btn btn-secondary"
          >
            取消
          </button>
          <button 
            @click="addReply" 
            :disabled="!replyContent.trim()"
            class="btn btn-primary"
          >
            发表回复
          </button>
        </div>
      </div>
    </div>
    
    <!-- 递归显示回复 -->
    <div v-if="replies.length > 0" class="replies-section">
      <CommentComponent 
        v-for="reply in replies" 
        :key="reply.id"
        :comment="reply" 
        :all-comments="allComments"
        :level="level + 1"
        @reply="$emit('reply', $event)"
        @add-reply="$emit('add-reply', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Comment } from '@/types/community'

// Props
const props = defineProps({
  comment: {
    type: Object as () => Comment,
    required: true
  },
  allComments: {
    type: Array as () => Comment[],
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['reply', 'add-reply'])

// Reactive data
const showReplyInput = ref(false)
const replyContent = ref('')

// Computed
const replies = computed(() => {
  return props.allComments.filter(c => c.parent_id === props.comment.id)
})

// Methods
const getCommentClass = () => {
  if (!props.comment.parent_id) {
    return 'level-1' // 一级评论
  } else if (props.level <= 1) {
    return 'level-2' // 二级评论
  } else {
    return 'level-3-plus' // 三级及以上评论
  }
}

const handleReply = () => {
  showReplyInput.value = !showReplyInput.value
  emit('reply', props.comment.id)
}

const addReply = () => {
  if (!replyContent.value.trim()) return
  
  emit('add-reply', {
    parentCommentId: props.comment.id,
    content: replyContent.value.trim()
  })
  
  replyContent.value = ''
  showReplyInput.value = false
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 获取父评论作者名称
const getParentAuthorName = () => {
  if (!props.comment.parent_id) return ''
  
  const parentComment = props.allComments.find(c => c.id === props.comment.parent_id)
  return parentComment?.author_name || '匿名用户'
}

// 获取用户头像
const getUserAvatar = (userId: string, authorName: string) => {
  const bgColor = '#DBEAFE' // 浅蓝色，对应 bg-blue-100
  const textColor = '#2563EB' // 深蓝色，对应 text-blue-600
  
  const initial = authorName ? authorName.charAt(0).toUpperCase() : 'U'
  
  const svgContent = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${bgColor}"/>
      <text x="20" y="26" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `.trim()
  
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)))
}
</script>

<style scoped>
.comment-wrapper {
  margin-bottom: 16px;
}

/* 一级评论：无缩进 */
.comment-wrapper.level-1 {
  margin-left: 0;
}

/* 二级评论：有缩进 */
.comment-wrapper.level-2 {
  position: relative;
  margin-left: 40px;
  padding-left: 16px;
}

/* 三级及以上评论：与二级评论完全对齐 */
.comment-wrapper.level-3-plus {
  position: relative;
  margin-left: 40px !important; /* 与二级评论相同的缩进 */
  padding-left: 16px !important;
}

/* 关键：强制所有嵌套在level-3-plus中的评论都不额外缩进 */
.comment-wrapper.level-3-plus .comment-wrapper,
.comment-wrapper.level-3-plus .comment-wrapper.level-2,
.comment-wrapper.level-3-plus .comment-wrapper.level-3-plus {
  margin-left: 0 !important; /* 强制所有子级评论相对父级不缩进 */
  padding-left: 16px !important; /* 保持与父级的对齐 */
}

/* 特别确保replies-section不产生额外缩进 */
.comment-wrapper.level-3-plus .replies-section,
.level-3-plus .replies-section {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

/* 强制所有深层嵌套的评论都与二级评论对齐 */
.comment-wrapper .comment-wrapper .comment-wrapper {
  margin-left: 0 !important;
  padding-left: 16px !important;
}

.comment-wrapper .comment-wrapper .comment-wrapper .comment-wrapper {
  margin-left: 0 !important;
  padding-left: 16px !important;
}

/* 为二级及以上添加分隔线 */
.comment-wrapper.level-2::before,
.comment-wrapper.level-3-plus::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e9ecef;
  border-radius: 1px;
}

.comment-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-author {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.comment-date {
  color: #666;
  font-size: 0.8rem;
}

.comment-content {
  color: #444;
  line-height: 1.5;
  margin-bottom: 8px;
}

.reply-prefix {
  color: #007bff;
  font-weight: 500;
  margin-right: 8px;
}

.has-reply-prefix {
  margin-left: 4px;
}

.replies-section {
  margin-top: 16px;
  padding-left: 0 !important; /* 强制移除所有额外的缩进 */
  border-left: none; /* 移除左边框线 */
  margin-left: 0 !important; /* 强制移除所有margin */
}

/* 确保所有嵌套的replies-section都没有缩进 */
.level-3-plus .replies-section,
.level-2 .replies-section,
.level-3-plus .level-3-plus .replies-section,
.level-2 .level-3-plus .replies-section {
  padding-left: 0 !important;
  margin-left: 0 !important;
}

/* 强制所有深层嵌套的replies-section都不缩进 */
.replies-section .replies-section,
.replies-section .replies-section .replies-section {
  padding-left: 0 !important;
  margin-left: 0 !important;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.reply-btn {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.reply-btn:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.reply-count {
  font-size: 0.8rem;
  color: #666;
  background-color: #f8f9fa;
  padding: 2px 8px;
  border-radius: 12px;
}

.reply-input-section {
  margin-top: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.reply-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

.reply-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.reply-input-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

/* 深色模式支持 */
.dark .comment-wrapper {
  background-color: #2d3748;
}

.dark .comment-wrapper.reply-item::before {
  background-color: #4a5568; /* 深色模式分隔线 */
}

.dark .reply-btn:hover {
  background-color: #4a5568;
  color: #63b3ed;
}

.dark .reply-count {
  background-color: #4a5568;
  color: #a0aec0;
}

.dark .reply-input-section {
  background-color: #2d3748;
  border-color: #4a5568;
}

.dark .reply-input {
  background-color: #4a5568;
  border-color: #718096;
  color: #e2e8f0;
}

.dark .reply-input:focus {
  border-color: #63b3ed;
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comment-wrapper {
    margin-left: 0 !important;
  }
  
  .replies-section {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  
  /* 移动端所有评论都不缩进 */
  .comment-wrapper.level-2,
  .comment-wrapper.level-3-plus {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  
  .comment-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .reply-input-actions {
    justify-content: stretch;
  }
  
  .reply-input-actions .btn {
    flex: 1;
  }
}
</style>