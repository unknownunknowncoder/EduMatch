<template>
  <div class="space-y-6">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      :style="getMessageStyles()"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    <!-- 搜索和筛选栏 -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索帖子标题或内容..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="resetAndSearch"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="">全部分类</option>
            <option value="学习经验">学习经验</option>
            <option value="技术分享">技术分享</option>
            <option value="问题求助">问题求助</option>
            <option value="资源推荐">资源推荐</option>
            <option value="其他">其他</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="created_at">发布时间</option>
            <option value="likes_count">点赞数</option>
            <option value="comments_count">评论数</option>
            <option value="views_count">浏览数</option>
          </select>
          <button
            @click="loadPosts"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedPosts.length > 0" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          已选择 {{ selectedPosts.length }} 篇帖子
        </div>
        <div class="flex gap-2">
          <button
            @click="batchApprove"
            class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            批量通过
          </button>
          <button
            @click="batchHide"
            class="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            批量隐藏
          </button>
          <button
            @click="batchDelete"
            class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            批量删除
          </button>
          <button
            @click="clearSelection"
            class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            清空选择
          </button>
        </div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedPosts.length === posts.length && posts.length > 0"
                  :indeterminate="selectedPosts.length > 0 && selectedPosts.length < posts.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                帖子信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                作者
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                统计
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                发布时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :checked="selectedPosts.includes(post.id)"
                  @change="toggleSelect(post.id)"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ post.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                    {{ post.content || '无内容' }}
                  </div>
                  <div v-if="post.image_urls && post.image_urls.length > 0" class="flex items-center mt-1">
                    <svg class="h-4 w-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-xs text-gray-500">{{ post.image_urls.length }} 张图片</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      v-if="post.user?.avatar_url"
                      :src="post.user.avatar_url"
                      :alt="post.user.nickname || post.user.email"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div v-else class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {{ (post.user?.nickname || post.user.email || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ post.user?.nickname || post.user?.email || '未知用户' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ post.user_id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    getCategoryClass(post.category)
                  ]"
                >
                  {{ post.category || '其他' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white space-y-1">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                    </svg>
                    {{ post.likes_count || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    {{ post.comments_count || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ post.views_count || 0 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    post.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    post.status === 'hidden' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    post.status === 'deleted' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  ]"
                >
                  {{ getStatusText(post.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(post.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewPost(post)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="查看详情"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="post.status !== 'approved'"
                    @click="approvePost(post)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="审核通过"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    v-if="post.status !== 'hidden'"
                    @click="hidePost(post)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="隐藏帖子"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                  <button
                    @click="deletePost(post)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="删除帖子"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalCount) 条，共 {{ totalCount }} 条记录
          </div>
          <div class="flex items-center space-x-2">
            <button
              :disabled="currentPage <= 1"
              @click="changePage(currentPage - 1)"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </span>
            <button
              :disabled="currentPage >= totalPages"
              @click="changePage(currentPage + 1)"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- 自定义确认对话框 -->
    <div v-if="confirmDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">确认删除</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ confirmDialog.message }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="confirmDialog.show = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              @click="confirmDialog.onConfirm"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

interface Post {
  id: string
  title: string
  content: string | null
  category: string | null
  status: 'pending' | 'approved' | 'hidden' | 'deleted'
  likes_count: number
  comments_count: number
  views_count: number
  image_urls: string[] | null
  created_at: string
  user_id: string
  user?: {
    nickname: string | null
    email: string | null
    avatar_url: string | null
  }
}

const emit = defineEmits(['refresh'])
const dbStore = useDatabaseStore()

const posts = ref<Post[]>([])

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(0)
const selectedPosts = ref<string[]>([])

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('community_posts')
      .select(`
        *,
        user:users!user_id(nickname, email, avatar_url)
      `, { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,content.ilike.%${searchKeyword.value}%`)
    }

    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    // 排序
    query = query.order(sortBy.value, { ascending: false })

    // 分页
    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('加载帖子失败:', error)
      return
    }

    posts.value = data || []
    totalCount.value = count || 0
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置并搜索
const resetAndSearch = () => {
  currentPage.value = 1
  selectedPosts.value = []
  loadPosts()
}

// 选择帖子
const toggleSelect = (postId: string) => {
  const index = selectedPosts.value.indexOf(postId)
  if (index > -1) {
    selectedPosts.value.splice(index, 1)
  } else {
    selectedPosts.value.push(postId)
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedPosts.value.length === posts.value.length) {
    selectedPosts.value = []
  } else {
    selectedPosts.value = posts.value.map(post => post.id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedPosts.value = []
}

// 批量操作
const batchApprove = async () => {
  if (selectedPosts.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .update({ status: 'approved' })
      .in('id', selectedPosts.value)

    if (error) throw error

    clearSelection()
    loadPosts()
    emit('refresh')
  } catch (error) {
    console.error('批量审核失败:', error)
  }
}

const batchHide = async () => {
  if (selectedPosts.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .update({ status: 'hidden' })
      .in('id', selectedPosts.value)

    if (error) throw error

    clearSelection()
    loadPosts()
    emit('refresh')
  } catch (error) {
    console.error('批量隐藏失败:', error)
  }
}

const batchDelete = async () => {
  if (selectedPosts.value.length === 0) {
    showToast('请先选择要删除的帖子', 'warning')
    return
  }
  
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除选中的 ${selectedPosts.value.length} 篇帖子吗？此操作不可恢复！`,
    onConfirm: () => executeBatchDelete()
  }
  
// 实际执行批量删除的函数
const executeBatchDelete = async () => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .delete()
      .in('id', selectedPosts.value)

    if (error) throw error

    confirmDialog.value.show = false
    clearSelection()
    loadPosts()
    emit('refresh')
    showToast(`成功删除 ${selectedPosts.value.length} 篇帖子`, 'success')
  } catch (error) {
    console.error('批量删除失败:', error)
    showToast('批量删除失败，请稍后重试', 'error')
  }
}

// 单个操作
const viewPost = (post: Post) => {
  // 打开新窗口查看帖子详情
  window.open(`/community/post/${post.id}`, '_blank')
}

const approvePost = async (post: Post) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .update({ status: 'approved' })
      .eq('id', post.id)

    if (error) throw error

    loadPosts()
    emit('refresh')
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const hidePost = async (post: Post) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .update({ status: 'hidden' })
      .eq('id', post.id)

    if (error) throw error

    loadPosts()
    emit('refresh')
  } catch (error) {
    console.error('隐藏失败:', error)
  }
}

const deletePost = (post: Post) => {
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除帖子"${post.title}"吗？此操作不可恢复！`,
    onConfirm: () => executeDeletePost(post)
  }
}

// 实际执行单个删除的函数
const executeDeletePost = async (post: Post) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('community_posts')
      .delete()
      .eq('id', post.id)

    if (error) throw error

    confirmDialog.value.show = false
    loadPosts()
    emit('refresh')
    showToast(`帖子"${post.title}"删除成功`, 'success')
  } catch (error) {
    console.error('删除失败:', error)
    showToast('删除失败，请稍后重试', 'error')
  }
}

// 分页
const changePage = (page: number) => {
  currentPage.value = page
  loadPosts()
}

// 获取分类样式
const getCategoryClass = (category: string | null) => {
  switch (category) {
    case '学习经验':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case '技术分享':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case '问题求助':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case '资源推荐':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待审核'
    case 'approved':
      return '已通过'
    case 'hidden':
      return '已隐藏'
    case 'deleted':
      return '已删除'
    default:
      return '未知'
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
/* 确保表格内容不换行 */
table {
  table-layout: fixed;
}

/* 自定义复选框样式 */
input[type="checkbox"]:indeterminate {
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>