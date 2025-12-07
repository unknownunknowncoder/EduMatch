<template>
  <div class="bg-white shadow-xl border-t-8 border-[#1a3c34] mt-8">
    
    <!-- 评论头部 -->
    <div class="p-6 border-b border-[#1a3c34]/10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <MessageSquare class="w-6 h-6 text-[#1a3c34]" />
          <h3 class="text-xl font-serif font-bold text-[#1a3c34]">
            学术讨论 ({{ comments.length }})
          </h3>
        </div>
        <div class="text-sm text-[#1a3c34]/60 font-mono">
          {{ comments.length }} 条评论
        </div>
      </div>
    </div>

    <!-- 发表评论 -->
    <div v-if="currentUser" class="p-6 border-b border-[#1a3c34]/10 bg-[#f2f0e9]/30">
      <div class="flex gap-4">
        <div class="w-10 h-10 bg-[#1a3c34] p-0.5 rounded-sm flex-shrink-0">
          <div class="w-full h-full bg-[#f2f0e9] flex items-center justify-center text-[#1a3c34] font-serif font-bold">
            {{ currentUser.nickname?.charAt(0) || currentUser.username?.charAt(0) || 'U' }}
          </div>
        </div>
        <div class="flex-1">
          <textarea
            v-model="newComment"
            placeholder="分享您的学术见解..."
            class="w-full bg-white border border-[#1a3c34]/20 rounded-sm p-3 text-[#1a3c34] focus:outline-none focus:border-[#d4c5a3] transition-colors font-serif resize-none"
            rows="3"
            :disabled="isSubmitting"
          ></textarea>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-[#1a3c34]/40">
              {{ newComment.length }}/500 字符
            </span>
            <button
              @click="submitComment"
              :disabled="!newComment.trim() || isSubmitting"
              class="px-4 py-2 bg-[#1a3c34] text-white font-serif text-sm font-medium hover:bg-[#235246] disabled:bg-[#1a3c34]/40 disabled:cursor-not-allowed transition-colors rounded-sm"
            >
              {{ isSubmitting ? '发布中...' : '发布评论' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-else class="p-6 border-b border-[#1a3c34]/10 bg-[#f2f0e9]/30 text-center">
      <MessageSquare class="w-8 h-8 text-[#1a3c34]/40 mx-auto mb-3" />
      <p class="text-[#1a3c34]/60 font-serif">登录后参与学术讨论</p>
      <button
        @click="$router.push('/login')"
        class="mt-3 px-4 py-2 bg-[#1a3c34] text-white font-serif text-sm font-medium hover:bg-[#235246] transition-colors rounded-sm"
      >
        立即登录
      </button>
    </div>

    <!-- 评论列表 -->
    <div class="divide-y divide-[#1a3c34]/10">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="p-8 text-center">
        <div class="w-8 h-8 border-2 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
        <p class="mt-3 text-[#1a3c34]/60 font-serif text-sm">加载讨论中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="comments.length === 0" class="p-12 text-center">
        <MessageSquare class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
        <h3 class="text-lg font-serif font-bold text-[#1a3c34] mb-2">暂无讨论</h3>
        <p class="text-[#1a3c34]/60 font-serif">成为第一个分享见解的学者</p>
      </div>

      <!-- 评论项 -->
      <div v-else v-for="comment in comments" :key="comment.id" class="p-6 hover:bg-[#f2f0e9]/30 transition-colors">
        <div class="flex gap-4">
          <!-- 用户头像 -->
          <div class="w-10 h-10 bg-[#1a3c34] p-0.5 rounded-sm flex-shrink-0 cursor-pointer" @click="goToUser(comment.user.id)">
            <div class="w-full h-full bg-[#f2f0e9] flex items-center justify-center text-[#1a3c34] font-serif font-bold">
              {{ (comment.user?.nickname || comment.user?.username || '?').charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- 评论内容 -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-serif font-medium text-[#1a3c34] hover:text-[#d4c5a3] cursor-pointer" @click="goToUser(comment.user.id)">
                    {{ comment.user?.nickname || comment.user?.username || '未知学者' }}
                  </span>
                  <span class="text-xs text-[#1a3c34]/40 font-mono">
                    {{ formatDate(comment.created_at) }}
                  </span>
                </div>
              </div>

              <!-- 操作菜单 -->
              <div v-if="currentUser && currentUser.id === comment.user_id" class="relative comment-actions-menu">
                <button
                  @click="toggleActions(comment.id)"
                  class="p-1 text-[#1a3c34]/40 hover:text-[#1a3c34] transition-colors"
                >
                  <MoreHorizontal class="w-4 h-4" />
                </button>

                <!-- 下拉菜单 -->
                <div
                  v-if="activeActions === comment.id"
                  class="absolute right-0 top-8 bg-white border border-[#1a3c34]/20 rounded-sm shadow-lg z-10 min-w-[100px]"
                >
                  <button
                    @click="startEdit(comment)"
                    class="w-full text-left px-3 py-2 text-sm text-[#1a3c34] hover:bg-[#f2f0e9] transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteComment(comment)"
                    class="w-full text-left px-3 py-2 text-sm text-[#b03e3e] hover:bg-[#f2f0e9] transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>

            <!-- 评论内容 -->
            <div v-if="editingComment?.id !== comment.id" class="text-[#1a3c34] leading-relaxed font-serif whitespace-pre-wrap">
              {{ comment.content }}
            </div>

            <!-- 编辑模式 -->
            <div v-else class="space-y-2">
              <textarea
                v-model="editContent"
                class="w-full bg-white border border-[#1a3c34]/20 rounded-sm p-2 text-[#1a3c34] focus:outline-none focus:border-[#d4c5a3] transition-colors font-serif resize-none"
                rows="3"
              ></textarea>
              <div class="flex gap-2">
                <button
                  @click="cancelEdit"
                  class="px-3 py-1 text-sm border border-[#1a3c34] text-[#1a3c34] hover:bg-[#1a3c34] hover:text-white transition-colors rounded-sm"
                >
                  取消
                </button>
                <button
                  @click="updateComment"
                  :disabled="!editContent.trim() || isUpdating"
                  class="px-3 py-1 text-sm bg-[#1a3c34] text-white hover:bg-[#235246] disabled:bg-[#1a3c34]/40 disabled:cursor-not-allowed transition-colors rounded-sm"
                >
                  {{ isUpdating ? '更新中...' : '更新' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && !isLoading" class="p-4 text-center border-t border-[#1a3c34]/10">
      <button
        @click="loadMore"
        class="px-4 py-2 border border-[#1a3c34] text-[#1a3c34] hover:bg-[#1a3c34] hover:text-white transition-colors rounded-sm font-serif"
      >
        加载更多评论
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessageSquare, MoreHorizontal } from 'lucide-vue-next'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import { supabaseService } from '@/services/supabase'

interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user: {
    id: string
    username: string
    nickname: string
    avatar_url?: string
  }
}

const props = defineProps<{
  postId: string
}>()

const router = useRouter()

// State
const comments = ref<Comment[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isUpdating = ref(false)
const hasMore = ref(false)
const currentPage = ref(0)
const pageSize = 10

const currentUser = computed(() => {
  const userData = localStorage.getItem('currentUser')
  return userData ? JSON.parse(userData) : null
})

const newComment = ref('')
const editingComment = ref<Comment | null>(null)
const editContent = ref('')
const activeActions = ref<string | null>(null)

// Methods
const loadComments = async (reset = false) => {
  try {
    if (reset) {
      currentPage.value = 0
      comments.value = []
    }
    
    isLoading.value = true
    
    const data = await supabaseService.getPostComments(props.postId, {
      limit: pageSize,
      offset: currentPage.value * pageSize
    })
    
    if (reset) {
      comments.value = data
    } else {
      comments.value.push(...data)
    }
    
    // 检查是否还有更多
    hasMore.value = data.length === pageSize
    
    currentPage.value++
  } catch (error) {
    console.error('加载评论失败:', error)
    showToast('加载评论失败', 'error')
  } finally {
    isLoading.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    isSubmitting.value = true
    
    const comment = await supabaseService.addComment({
      post_id: props.postId,
      user_id: currentUser.value.id,
      content: newComment.value.trim()
    })
    
    // 添加到评论列表顶部
    comments.value.unshift(comment)
    
    // 清空输入框
    newComment.value = ''
    
    showToast('评论发布成功', 'success')
  } catch (error) {
    console.error('发布评论失败:', error)
    showToast('发布评论失败', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (comment: Comment) => {
  editingComment.value = comment
  editContent.value = comment.content
  activeActions.value = null
}

const cancelEdit = () => {
  editingComment.value = null
  editContent.value = ''
}

const updateComment = async () => {
  if (!editingComment.value || !editContent.value.trim()) return
  
  try {
    isUpdating.value = true
    
    const updatedComment = await supabaseService.updateComment(
      editingComment.value.id,
      currentUser.value.id,
      editContent.value.trim()
    )
    
    // 更新评论列表中的内容
    const index = comments.value.findIndex(c => c.id === editingComment.value!.id)
    if (index !== -1) {
      comments.value[index] = updatedComment
    }
    
    editingComment.value = null
    editContent.value = ''
    
    showToast('评论更新成功', 'success')
  } catch (error) {
    console.error('更新评论失败:', error)
    showToast('更新评论失败', 'error')
  } finally {
    isUpdating.value = false
  }
}

const deleteComment = async (comment: Comment) => {
  if (!confirm('确定要删除这条评论吗？')) return
  
  try {
    await supabaseService.deleteComment(comment.id, currentUser.value.id)
    
    // 从评论列表中移除
    const index = comments.value.findIndex(c => c.id === comment.id)
    if (index !== -1) {
      comments.value.splice(index, 1)
    }
    
    activeActions.value = null
    showToast('评论删除成功', 'success')
  } catch (error) {
    console.error('删除评论失败:', error)
    showToast('删除评论失败', 'error')
  }
}

const toggleActions = (commentId: string) => {
  activeActions.value = activeActions.value === commentId ? null : commentId
}

const goToUser = (userId: string) => {
  router.push(`/user/${userId}`)
}

const loadMore = () => {
  loadComments(false)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('.comment-actions-menu')) {
    activeActions.value = null
  }
}

onMounted(() => {
  loadComments(true)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>