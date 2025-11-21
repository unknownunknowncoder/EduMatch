<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <Users class="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
        学习社区
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">与学习伙伴交流，分享学习经验</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧边栏 - 搜索和热门标签 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 搜索框 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div class="relative">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search class="h-4 w-4" />
            </div>
            <input 
              type="text" 
              placeholder="搜索社区内容" 
              v-model="searchKeyword"
              @input="searchPosts"
              class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none text-sm"
            />
          </div>
        </div>
        
        <!-- 发表我的经验按钮 -->
        <button 
          @click="showCreatePostModal = true"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl p-4 shadow-md transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
        >
          <Edit3 class="w-5 h-5" />
          <span>发表我的经验</span>
        </button>
        
        <!-- 热门标签 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h3 class="font-semibold mb-4 flex items-center">
            <Award class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            热门标签
          </h3>
          <div v-if="popularTags.length > 0" class="flex flex-wrap gap-2">
            <a 
              v-for="tag in popularTags"
              :key="tag.id"
              href="#" 
              @click="filterByTag(tag.name)"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {{ tag.name }}
              <span class="ml-1 text-xs opacity-70">({{ tag.count }})</span>
            </a>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
            暂无热门标签
          </div>
        </div>
      </div>
      
      <!-- 右侧主内容 - 帖子列表 -->
      <div class="lg:col-span-3">
        <!-- 排序选项 -->
        <div class="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h2 class="font-bold text-xl flex items-center">
            <MessageCircle class="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            最新讨论
          </h2>
          <div class="relative">
            <select 
              v-model="sortBy"
              @change="sortPosts"
              class="appearance-none bg-gray-100 dark:bg-gray-700 border-none outline-none rounded-lg px-3 py-2 pr-8 text-sm cursor-pointer"
            >
              <option value="latest">最新发布</option>
              <option value="popular">最热讨论</option>
              <option value="mostLiked">最多点赞</option>
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown class="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <!-- 帖子列表 -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="text-gray-500 dark:text-gray-400">加载中...</div>
        </div>

        <div v-else-if="posts.length === 0" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            暂无社区内容
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-500">
            成为第一个分享学习经验的人吧！
          </p>
        </div>
        
        <div v-else class="space-y-6">
          <div 
            v-for="(post, index) in posts"
            :key="post.id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <!-- 帖子头部 -->
            <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold mr-3">
                  {{ post.author[0] }}
                </div>
                <div>
                  <h4 class="font-medium">{{ post.author }}</h4>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(post.created_at) }}</span>
                    <span class="mx-1">•</span>
                    <span class="flex items-center">
                      <Clock class="h-3 w-3 mr-1" />
                      {{ post.views_count || 0 }} 浏览
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 帖子内容 -->
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                {{ post.content }}
              </p>
              
              <!-- 标签 -->
              <div v-if="post.category" class="flex flex-wrap gap-2 mb-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs">
                  {{ post.category }}
                </span>
              </div>
              
              <!-- 互动按钮 -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <button 
                  @click="handleLike(post.id)"
                  class="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <ThumbsUp class="h-4 w-4 mr-1" />
                  <span class="text-sm">{{ post.likes_count || 0 }}</span>
                </button>
                <button class="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <MessageCircle class="h-4 w-4 mr-1" />
                  <span class="text-sm">{{ post.comments_count || 0 }}</span>
                </button>
                <button class="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <BookOpen class="h-4 w-4 mr-1" />
                  <span class="text-sm">收藏</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多按钮 -->
        <div v-if="posts.length > 0" class="mt-8 text-center">
          <button 
            @click="loadMorePosts"
            :disabled="isLoading"
            class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 rounded-full text-gray-700 dark:text-gray-300 transition-colors shadow-sm"
          >
            {{ isLoading ? '加载中...' : '加载更多内容' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 创建帖子弹窗 -->
    <div v-if="showCreatePostModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">发表学习经验</h2>
          <button 
            @click="showCreatePostModal = false"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 表单内容 -->
        <form @submit.prevent="handleCreatePost" class="p-6 space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              经验标题 *
            </label>
            <input
              v-model="newPost.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="分享你的学习经验..."
            />
          </div>

          <!-- 内容 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              经验内容 *
            </label>
            <textarea
              v-model="newPost.content"
              rows="8"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="详细描述你的学习经验、技巧、心得..."
            ></textarea>
          </div>

          <!-- 分类标签 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分类标签
            </label>
            <div class="space-y-3">
              <!-- 预设标签 -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  type="button"
                  @click="toggleTag(tag)"
                  :class="`px-3 py-1 rounded-full text-sm transition-all ${
                    newPost.tags.includes(tag) 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`"
                >
                  {{ tag }}
                </button>
              </div>
              
              <!-- 自定义标签输入 -->
              <div class="flex items-center space-x-2">
                <input
                  v-model="customTag"
                  type="text"
                  @keyup.enter="addCustomTag"
                  placeholder="输入自定义标签，按回车添加"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  type="button"
                  @click="addCustomTag"
                  :disabled="!customTag.trim()"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  添加
                </button>
              </div>
              
              <!-- 已选择的标签 -->
              <div v-if="newPost.tags.length > 0" class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">已选择：</span>
                <span
                  v-for="(tag, index) in newPost.tags"
                  :key="index"
                  class="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreatePostModal"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C6.47 4 4 5.47 4 8s-.47 4-4 4 4.47 4 8zm0 0a8 8 0 1008z"></path>
              </svg>
              {{ isSubmitting ? '发布中...' : '发布经验' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { 
  Users, 
  Search, 
  MessageCircle, 
  BookOpen, 
  Award, 
  ThumbsUp, 
  ChevronDown, 
  Clock,
  Edit3 
} from 'lucide-vue-next'

const dbStore = useDatabaseStore()

// 响应式数据
const posts = ref<any[]>([])
const popularTags = ref<any[]>([])
const searchKeyword = ref('')
const sortBy = ref('latest')
const isLoading = ref(false)
const currentPage = ref(0)
const hasMore = ref(true)
const showCreatePostModal = ref(false)
const isSubmitting = ref(false)

// 新帖子数据
const newPost = ref({
  title: '',
  content: '',
  tags: []
})

// 自定义标签
const customTag = ref('')

// 可选标签
const availableTags = [
  '前端开发',
  '后端开发', 
  '数据库',
  '算法与数据结构',
  '系统设计',
  'DevOps',
  '学习资源',
  '项目经验',
  '求职面试'
]

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 加载社区帖子
// 获取 Supabase 客户端
const getSupabaseClient = async () => {
  const { supabaseService } = await import('@/services/supabase')
  return supabaseService.getClient()
}

const loadPosts = async () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  try {
    const client = await getSupabaseClient()
    
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(currentPage.value * 10, (currentPage.value + 1) * 10 - 1)
    
    if (error) {
      console.error('获取社区帖子失败:', error)
      return
    }
    
    if (currentPage.value === 0) {
      posts.value = data || []
    } else {
      posts.value = [...posts.value, ...(data || [])]
    }
    
    hasMore.value = (data || []).length === 10
    currentPage.value++
  } catch (error) {
    console.error('加载社区数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载热门标签
const loadPopularTags = async () => {
  try {
    // 这里应该从数据库获取真实的标签数据
    // 暂时使用空数组，等待真实数据
    popularTags.value = []
  } catch (error) {
    console.error('加载热门标签失败:', error)
    popularTags.value = []
  }
}

// 搜索帖子
const searchPosts = async () => {
  if (!searchKeyword.value.trim()) {
    await loadPosts()
    return
  }
  
  isLoading.value = true
  try {
    const { data, error } = await dbStore.getClient()
      .from('community_posts')
      .select('*')
      .or(`title.ilike.%${searchKeyword.value}%,content.ilike.%${searchKeyword.value}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('搜索帖子失败:', error)
      return
    }
    
    posts.value = data || []
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 排序帖子
const sortPosts = async () => {
  currentPage.value = 0
  hasMore.value = true
  isLoading.value = true
  
  try {
    const client = await getSupabaseClient()
    let query = client
      .from('community_posts')
      .select('*')
    
    switch (sortBy.value) {
      case 'latest':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.order('views_count', { ascending: false })
        break
      case 'mostLiked':
        query = query.order('likes_count', { ascending: false })
        break
    }
    
    const { data, error } = await query.range(0, 9)
    
    if (error) {
      console.error('排序失败:', error)
      return
    }
    
    posts.value = data || []
  } catch (error) {
    console.error('排序失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 按标签过滤
const filterByTag = async (tagName: string) => {
  isLoading.value = true
  try {
    const client = await getSupabaseClient()
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('category', tagName)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('按标签过滤失败:', error)
      return
    }
    
    posts.value = data || []
  } catch (error) {
    console.error('过滤失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载更多帖子
const loadMorePosts = () => {
  loadPosts()
}

// 点赞功能
const handleLike = async (postId: string) => {
  try {
    const client = await getSupabaseClient()
    const { error } = await client
      .from('community_posts')
      .update({ likes_count: (posts.value.find(p => p.id === postId)?.likes_count || 0) + 1 })
      .eq('id', postId)
    
    if (error) {
      console.error('点赞失败:', error)
      return
    }
    
    // 更新本地数据
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.likes_count = (post.likes_count || 0) + 1
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 创建帖子
const handleCreatePost = async () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim()) {
    alert('请填写标题和内容')
    return
  }

  isSubmitting.value = true

  try {
    const client = await getSupabaseClient()
    
    const postData = {
      title: newPost.value.title,
      content: newPost.value.content,
      category: newPost.value.tags.join(', ') || '学习经验',
      author: '管理员',
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('community_posts')
      .insert([postData])
      .select()
    
    if (error) {
      console.error('❌ 发布失败:', error)
      alert('发布失败：' + error.message)
      return
    }

    console.log('✅ 发布成功:', data)
    
    // 将新帖子添加到列表顶部
    if (data && data.length > 0) {
      posts.value.unshift({
        ...data[0],
        author: data[0].author || '管理员',
        likes_count: data[0].likes_count || 0,
        views_count: data[0].views_count || 0,
        comments_count: data[0].comments_count || 0
      })
    }
    
    // 关闭弹窗并重置表单
    showCreatePostModal.value = false
    newPost.value = {
      title: '',
      content: '',
      tags: []
    }
    
    // 显示成功提示
    const successDiv = document.createElement('div')
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    successDiv.textContent = '学习经验发布成功！'
    document.body.appendChild(successDiv)
    
    setTimeout(() => {
      document.body.removeChild(successDiv)
    }, 3000)
    
  } catch (error) {
    console.error('❌ 发布失败:', error)
    alert('发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 切换标签
const toggleTag = (tag: string) => {
  const index = newPost.value.tags.indexOf(tag)
  if (index > -1) {
    newPost.value.tags.splice(index, 1)
  } else {
    newPost.value.tags.push(tag)
  }
}

// 添加自定义标签
const addCustomTag = () => {
  const trimmedTag = customTag.value.trim()
  if (!trimmedTag) return
  
  // 检查标签是否已存在
  if (!newPost.value.tags.includes(trimmedTag)) {
    newPost.value.tags.push(trimmedTag)
  }
  
  // 清空输入框
  customTag.value = ''
}

// 移除标签
const removeTag = (index: number) => {
  newPost.value.tags.splice(index, 1)
}

// 关闭创建帖子弹窗
const closeCreatePostModal = () => {
  showCreatePostModal.value = false
  newPost.value = {
    title: '',
    content: '',
    tags: []
  }
  customTag.value = ''
}

// 初始化数据
onMounted(() => {
  loadPosts()
  loadPopularTags()
})
</script>