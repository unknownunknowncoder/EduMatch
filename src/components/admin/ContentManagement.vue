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
          <button
            @click="loadPosts"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
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
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {{ post.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                    {{ post.content || '无内容' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ post.user_id }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {{ post.category || '其他' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  已发布
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

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
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('community_posts')
      .select('*', { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,content.ilike.%${searchKeyword.value}%`)
    }

    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    // 排序
    query = query.order('created_at', { ascending: false })

    // 分页
    query = query.range(0, 19)

    const { data, error } = await query

    if (error) {
      console.error('加载帖子失败:', error)
      return
    }

    posts.value = data || []
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置并搜索
const resetAndSearch = () => {
  loadPosts()
}

// 查看帖子
const viewPost = (post: Post) => {
  window.open(`/community/post/${post.id}`, '_blank')
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
</style>