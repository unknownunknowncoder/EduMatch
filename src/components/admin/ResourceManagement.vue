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
            placeholder="搜索资源标题或描述..."
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
            <option value="programming">编程</option>
            <option value="design">设计</option>
            <option value="language">语言学习</option>
            <option value="business">商业</option>
            <option value="science">科学</option>
            <option value="other">其他</option>
          </select>
          <select
            v-model="selectedType"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="">全部类型</option>
            <option value="video">视频</option>
            <option value="article">文章</option>
            <option value="book">书籍</option>
            <option value="course">课程</option>
            <option value="tool">工具</option>
            <option value="website">网站</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            @change="resetAndSearch"
          >
            <option value="created_at">创建时间</option>
            <option value="likes_count">点赞数</option>
            <option value="title">标题</option>
          </select>
          <button
            @click="loadResources"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-800 dark:text-purple-200">总资源数</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ stats.totalResources }}</p>
          </div>
          <svg class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-800 dark:text-green-200">总点赞数</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ stats.totalLikes }}</p>
          </div>
          <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">平均评分</p>
            <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ stats.avgRating }}</p>
          </div>
          <svg class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedResources.length > 0" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center justify-between">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          已选择 {{ selectedResources.length }} 个资源
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

    <!-- 资源列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedResources.length === resources.length && resources.length > 0"
                  :indeterminate="selectedResources.length > 0 && selectedResources.length < resources.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                资源信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类/类型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                发布者
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
            <tr v-for="resource in resources" :key="resource.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :checked="selectedResources.includes(resource.id)"
                  @change="toggleSelect(resource.id)"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="resource.thumbnail_url"
                      :src="resource.thumbnail_url"
                      :alt="resource.title"
                      class="h-12 w-12 rounded-lg object-cover"
                    />
                    <div v-else class="h-12 w-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ resource.title }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {{ resource.description || '无描述' }}
                    </div>
                    <div class="flex items-center mt-1">
                      <a
                        v-if="resource.url"
                        :href="resource.url"
                        target="_blank"
                        class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate max-w-xs"
                      >
                        {{ resource.url }}
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full block',
                      getCategoryClass(resource.category)
                    ]"
                  >
                    {{ getCategoryText(resource.category) }}
                  </span>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full block',
                      getTypeClass(resource.type)
                    ]"
                  >
                    {{ getTypeText(resource.type) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      v-if="resource.user?.avatar_url"
                      :src="resource.user.avatar_url"
                      :alt="resource.user.nickname || resource.user.email"
                      class="h-8 w-8 rounded-full object-cover"
                    />
                    <div v-else class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {{ (resource.user?.nickname || resource.user?.email || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ resource.user?.nickname || resource.user?.email || '未知用户' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ resource.user_id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white space-y-1">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                    </svg>
                    {{ resource.likes_count || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ resource.views_count || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {{ resource.average_rating || 0 }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    resource.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    resource.status === 'hidden' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    resource.status === 'deleted' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  ]"
                >
                  {{ getStatusText(resource.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(resource.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewResource(resource)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="查看详情"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    v-if="resource.status !== 'approved'"
                    @click="approveResource(resource)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="审核通过"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    v-if="resource.status !== 'hidden'"
                    @click="hideResource(resource)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="隐藏资源"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteResource(resource)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="删除资源"
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

    <!-- 确认删除对话框 -->
    <div v-if="confirmDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">确认删除</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="confirmDialog.show = false"
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDialog.onConfirm"
            class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
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

interface Resource {
  id: string
  title: string
  description: string | null
  url: string | null
  thumbnail_url: string | null
  category: 'programming' | 'design' | 'language' | 'business' | 'science' | 'other' | null
  type: 'video' | 'article' | 'book' | 'course' | 'tool' | 'website' | null
  status: 'pending' | 'approved' | 'hidden' | 'deleted'
  likes_count: number
  views_count: number
  average_rating: number
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

const resources = ref<Resource[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedType = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const totalPages = ref(0)
const selectedResources = ref<string[]>([])

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})

const stats = ref({
  totalResources: 0,
  totalLikes: 0,
  totalViews: 0,
  avgRating: 0
})

// 加载资源列表
const loadResources = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    let query = client
      .from('resources')
      .select(`
        *,
        user:users!user_id(nickname, email, avatar_url)
      `, { count: 'exact' })

    // 搜索条件
    if (searchKeyword.value.trim()) {
      query = query.or(`title.ilike.%${searchKeyword.value}%,description.ilike.%${searchKeyword.value}%,url.ilike.%${searchKeyword.value}%`)
    }

    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    if (selectedType.value) {
      query = query.eq('type', selectedType.value)
    }

    // 排序
    query = query.order(sortBy.value, { ascending: false })

    // 分页
    const from = (currentPage.value - 1) * pageSize.value
    const to = from + pageSize.value - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('加载资源失败:', error)
      return
    }

    resources.value = data || []
    totalCount.value = count || 0
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)

    // 计算统计数据
    calculateStats()
  } catch (error) {
    console.error('加载资源失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算统计数据
const calculateStats = () => {
  const totalResources = resources.value.length
  const totalLikes = resources.value.reduce((sum, r) => sum + (r.likes_count || 0), 0)
  const totalViews = resources.value.reduce((sum, r) => sum + (r.views_count || 0), 0)
  const avgRating = resources.value.length > 0
    ? (resources.value.reduce((sum, r) => sum + (r.average_rating || 0), 0) / resources.value.length).toFixed(1)
    : 0

  stats.value = { totalResources, totalLikes, totalViews, avgRating }
}

// 重置并搜索
const resetAndSearch = () => {
  currentPage.value = 1
  selectedResources.value = []
  loadResources()
}

// 选择资源
const toggleSelect = (resourceId: string) => {
  const index = selectedResources.value.indexOf(resourceId)
  if (index > -1) {
    selectedResources.value.splice(index, 1)
  } else {
    selectedResources.value.push(resourceId)
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedResources.value.length === resources.value.length) {
    selectedResources.value = []
  } else {
    selectedResources.value = resources.value.map(resource => resource.id)
  }
}

// 清空选择
const clearSelection = () => {
  selectedResources.value = []
}

// 批量操作
const batchApprove = async () => {
  if (selectedResources.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .update({ status: 'approved' })
      .in('id', selectedResources.value)

    if (error) throw error

    clearSelection()
    loadResources()
    emit('refresh')
  } catch (error) {
    console.error('批量审核失败:', error)
  }
}

const batchHide = async () => {
  if (selectedResources.value.length === 0) return
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .update({ status: 'hidden' })
      .in('id', selectedResources.value)

    if (error) throw error

    clearSelection()
    loadResources()
    emit('refresh')
  } catch (error) {
    console.error('批量隐藏失败:', error)
  }
}

const batchDelete = async () => {
  if (selectedResources.value.length === 0) {
    showToast('请先选择要删除的资源', 'warning')
    return
  }
  
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除选中的 ${selectedResources.value.length} 个资源吗？此操作不可恢复！`,
    onConfirm: () => executeBatchDelete()
  }
  
// 实际执行批量删除的函数
const executeBatchDelete = async () => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .delete()
      .in('id', selectedResources.value)

    if (error) throw error

    confirmDialog.value.show = false
    clearSelection()
    loadResources()
    emit('refresh')
    showToast(`成功删除 ${selectedResources.value.length} 个资源`, 'success')
  } catch (error) {
    console.error('批量删除失败:', error)
    showToast('批量删除失败，请稍后重试', 'error')
  }
}

// 单个操作
const viewResource = (resource: Resource) => {
  // 打开新窗口查看资源详情
  if (resource.url) {
    window.open(resource.url, '_blank')
  } else {
    window.open(`/resource/${resource.id}`, '_blank')
  }
}

const approveResource = async (resource: Resource) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .update({ status: 'approved' })
      .eq('id', resource.id)

    if (error) throw error

    loadResources()
    emit('refresh')
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const hideResource = async (resource: Resource) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .update({ status: 'hidden' })
      .eq('id', resource.id)

    if (error) throw error

    loadResources()
    emit('refresh')
  } catch (error) {
    console.error('隐藏失败:', error)
  }
}

const deleteResource = (resource: Resource) => {
  // 显示自定义确认对话框
  confirmDialog.value = {
    show: true,
    message: `确定要删除资源"${resource.title}"吗？此操作不可恢复！`,
    onConfirm: () => executeDeleteResource(resource)
  }
}

// 实际执行单个删除的函数
const executeDeleteResource = async (resource: Resource) => {
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { error } = await client
      .from('resources')
      .delete()
      .eq('id', resource.id)

    if (error) throw error

    confirmDialog.value.show = false
    loadResources()
    emit('refresh')
    showToast(`资源"${resource.title}"删除成功`, 'success')
  } catch (error) {
    console.error('删除失败:', error)
    showToast('删除失败，请稍后重试', 'error')
  }
}

// 分页
const changePage = (page: number) => {
  currentPage.value = page
  loadResources()
}

// 获取分类样式
const getCategoryClass = (category: string | null) => {
  switch (category) {
    case 'programming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'design':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'language':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'business':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'science':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

// 获取分类文本
const getCategoryText = (category: string | null) => {
  switch (category) {
    case 'programming':
      return '编程'
    case 'design':
      return '设计'
    case 'language':
      return '语言学习'
    case 'business':
      return '商业'
    case 'science':
      return '科学'
    default:
      return '其他'
  }
}

// 获取类型样式
const getTypeClass = (type: string | null) => {
  switch (type) {
    case 'video':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'article':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'book':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'course':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'tool':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'website':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

// 获取类型文本
const getTypeText = (type: string | null) => {
  switch (type) {
    case 'video':
      return '视频'
    case 'article':
      return '文章'
    case 'book':
      return '书籍'
    case 'course':
      return '课程'
    case 'tool':
      return '工具'
    case 'website':
      return '网站'
    default:
      return '其他'
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
  loadResources()
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