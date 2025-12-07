<template>
  <!-- 
    评论容器 
    根据层级添加左侧边距和连接线
  -->
  <div class="comment-wrapper font-sans text-[#1a3c34]" :class="getCommentClass()">
    
    <!-- 单条评论主体 (The Note) -->
    <div class="comment-item group relative">
      
      <!-- 装饰：层级连接线 (仅二级及以上显示) -->
      <div v-if="level > 0" class="absolute -left-6 top-6 w-4 h-px bg-[#d4c5a3]"></div>
      <div v-if="level > 0" class="absolute -left-6 top-0 h-6 w-px bg-[#d4c5a3]"></div>

      <div class="flex gap-4">
        <!-- 头像 (Square Style) -->
        <div class="flex-shrink-0 relative z-10">
          <div class="w-10 h-10 bg-[#f2f0e9] border border-[#1a3c34]/20 rounded-sm shadow-sm overflow-hidden">
            <img 
              :src="getUserAvatar(comment.user_id, comment.author_name)" 
              :alt="comment.author_name || 'Anonymous'"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 min-w-0">
          <!-- Header -->
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-[#1a3c34] text-sm tracking-wide">
                {{ comment.author_name || 'Anonymous Scholar' }}
              </span>
              <span class="text-[10px] font-mono text-[#1a3c34]/40 bg-[#1a3c34]/5 px-1 rounded-sm">
                {{ formatDate(comment.created_at) }}
              </span>
            </div>
          </div>

          <!-- Body -->
          <div class="text-[#1a3c34]/80 text-sm leading-relaxed mb-2 font-serif">
            <span v-if="comment.parent_id" class="text-[#d4c5a3] font-bold text-xs uppercase tracking-wider mr-1">
              @{{ getParentAuthorName() }}
            </span>
            {{ comment.content }}
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <button 
              @click="handleReply" 
              class="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#1a3c34]/40 hover:text-[#1a3c34] transition-colors group/btn"
            >
              <Reply class="w-3 h-3 group-hover/btn:-scale-x-100 transition-transform" />
              Reply
            </button>
            <span v-if="replies.length > 0" class="text-[10px] font-mono text-[#d4c5a3]">
              {{ replies.length }} responses
            </span>
          </div>

          <!-- 回复输入框 (Drawer Style) -->
          <div v-if="showReplyInput" class="mt-4 bg-[#f9f9f7] border-l-2 border-[#1a3c34] p-4 animate-fade-in">
            <textarea 
              v-model="replyContent" 
              :placeholder="`Annotating on @${comment.author_name || 'scholar'}...`"
              rows="3"
              class="w-full bg-white border border-[#1a3c34]/10 p-3 text-sm text-[#1a3c34] font-serif placeholder-slate-400 focus:outline-none focus:border-[#1a3c34] transition-colors resize-none mb-3"
            ></textarea>
            <div class="flex justify-end gap-3">
              <button 
                @click="showReplyInput = false" 
                class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1a3c34]/60 hover:text-[#1a3c34] transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="addReply" 
                :disabled="!replyContent.trim()"
                class="px-5 py-1.5 bg-[#1a3c34] text-[#d4c5a3] text-[10px] font-bold uppercase tracking-widest hover:bg-[#235246] transition-colors disabled:opacity-50"
              >
                Submit Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 递归显示回复 (Tree Structure) -->
    <div v-if="replies.length > 0" class="replies-section border-l border-[#d4c5a3]/30 ml-5 pl-5 mt-4 space-y-4">
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
import { Reply } from 'lucide-vue-next'

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
  // 仅用于顶层边距控制，内部递归通过 CSS border-l 处理
  return props.level === 0 ? 'mb-6 border-b border-[#1a3c34]/5 pb-6 last:border-0' : ''
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
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  })
}

// 获取父评论作者名称
const getParentAuthorName = () => {
  if (!props.comment.parent_id) return ''
  const parentComment = props.allComments.find(c => c.id === props.comment.parent_id)
  return parentComment?.author_name || 'Scholar'
}

// 获取用户头像 (Deep Forest Theme)
const getUserAvatar = (userId: string, authorName: string) => {
  // 背景：深墨绿，文字：淡金
  const bgColor = '#1a3c34' 
  const textColor = '#d4c5a3' 
  const initial = authorName ? authorName.charAt(0).toUpperCase() : 'U'
  
  const svgContent = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="65%" text-anchor="middle" fill="${textColor}" font-family="serif" font-size="20" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `.trim()
  
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)))
}
</script>

<style scoped>
/* 淡入动画 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 递归层级视觉优化 */
.replies-section {
  /* 确保每一级递归都有左侧线条，形成“树状”结构 */
  position: relative;
}
</style>