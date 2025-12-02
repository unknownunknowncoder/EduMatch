<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">正在加载用户信息...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-red-500 mb-4">
          <UserX class="h-16 w-16 mx-auto" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">用户信息加载失败</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{{ error }}</p>
        <button
          @click="router.back()"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mr-4"
        >
          返回上一页
        </button>
        <button
          @click="fetchUserInfo"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>

    <!-- 正常内容 -->
    <div v-else>
      <!-- 返回导航 -->
      <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <button
            @click="router.back()"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft class="h-5 w-5 mr-2" />
            返回
          </button>
        </div>
      </div>

      <!-- 用户信息区域 -->
      <div class="bg-white dark:bg-gray-800 shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <!-- 用户头像 -->
            <div class="flex-shrink-0">
              <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <img
                  v-if="userInfo.avatar_url"
                  :src="userInfo.avatar_url"
                  :alt="userInfo.nickname || userInfo.username"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <User v-else class="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <!-- 用户基本信息 -->
            <div class="flex-1 text-center md:text-left">
              <div class="mb-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ userInfo.nickname || userInfo.username }}
                </h1>
                <p class="text-gray-500 dark:text-gray-400">
                  @{{ userInfo.username }}
                </p>
              </div>

              <!-- 个人签名 -->
              <div v-if="userInfo.bio" class="mb-6">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ userInfo.bio }}
                </p>
              </div>

              <!-- 统计信息 -->
              <div class="flex flex-wrap justify-center md:justify-start gap-8 mb-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.resourceCount }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">发布资源</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.postCount }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">发布帖子</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatDate(userInfo.created_at) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">加入时间</div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  v-if="isCurrentUser"
                  @click="router.push('/profile')"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  编辑资料
                </button>
                <button
                  v-else
                  @click="toggleFollow"
                  :disabled="isFollowing || followLoading"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 内容标签页 -->
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <!-- 标签页导航 -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8">
              <button
                @click="activeTab = 'resources'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                <BookOpen class="inline-block h-5 w-5 mr-2" />
                发布资源
              </button>
              <button
                @click="activeTab = 'posts'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                <MessageSquare class="inline-block h-5 w-5 mr-2" />
                发布帖子
              </button>
            </nav>
          </div>

          <!-- 内容区域 -->
          <div class="p-6">
            <!-- 资源列表 -->
            <div v-if="activeTab === 'resources'">
              <div v-if="loading" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
              </div>
              <div v-else-if="userResources.length === 0" class="text-center py-12">
                <BookOpen class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400">该用户还没有发布任何资源</p>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  v-for="resource in userResources"
                  :key="resource.id"
                  :resource="resource"
                  @click="navigateToResource(resource.id)"
                />
              </div>
            </div>

            <!-- 帖子列表 -->
            <div v-else>
              <div v-if="loading" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
              </div>
              <div v-else-if="userPosts.length === 0" class="text-center py-12">
                <MessageSquare class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400">该用户还没有发布任何帖子</p>
              </div>
              <div v-else class="space-y-6">
                <div
                  v-for="post in userPosts"
                  :key="post.id"
                  class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  @click="navigateToPost(post.id)"
                >
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ post.title }}
                    </h3>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(post.created_at) }}
                    </span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {{ post.content }}
                  </p>
                  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center space-x-4">
                      <span class="flex items-center">
                        <Heart class="h-4 w-4 mr-1" />
                        {{ post.likes_count || 0 }}
                      </span>
                      <span class="flex items-center">
                        <MessageCircle class="h-4 w-4 mr-1" />
                        {{ post.comments_count || 0 }}
                      </span>
                    </div>
                    <span>{{ post.category || '未分类' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import ResourceCard from '@/components/ResourceCard.vue'
import { showToast } from '@/utils/message'
import { 
  ArrowLeft, 
  User, 
  UserX,
  BookOpen, 
  MessageSquare, 
  Heart, 
  MessageCircle 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

// 响应式数据
const userInfo = ref({
  id: '',
  username: '',
  nickname: '',
  email: '',
  avatar_url: '',
  bio: '',
  created_at: ''
})

const stats = ref({
  resourceCount: 0,
  postCount: 0
})

const userResources = ref([])
const userPosts = ref([])
const loading = ref(true)
const error = ref('')
const activeTab = ref('resources')
const isFollowing = ref(false)
const followLoading = ref(false)

// 计算属性
const isCurrentUser = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  return currentUser.id === userInfo.value.id
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userId = route.params.userId as string
    console.log('正在获取用户信息，用户ID:', userId)
    
    const user = await dbStore.getUserById(userId)
    
    if (!user) {
      console.error('用户不存在，用户ID:', userId)
      error.value = '用户不存在'
      return
    }

    userInfo.value = {
      ...user,
      bio: user.bio || '这个人很懒，还没有写个人签名~'
    }

    console.log('成功获取用户信息:', userInfo.value)

    // 获取用户统计信息
    await fetchUserStats()
    await fetchUserContent()
    
    // 检查关注状态
    if (!isCurrentUser.value) {
      await checkFollowStatus()
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    error.value = '获取用户信息失败'
  } finally {
    loading.value = false
  }
}

// 获取用户统计信息
const fetchUserStats = async () => {
  try {
    const [resourceCount, postCount] = await Promise.all([
      dbStore.getUserResourceCount(userInfo.value.id),
      dbStore.getUserPostCount(userInfo.value.id)
    ])
    
    stats.value = {
      resourceCount: resourceCount || 0,
      postCount: postCount || 0
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
  }
}

// 检查关注状态
const checkFollowStatus = async () => {
  if (!isCurrentUser.value) {
    try {
      const currentUserStr = localStorage.getItem('currentUser')
      if (!currentUserStr) {
        // 用户未登录，不需要检查关注状态
        isFollowing.value = false
        return
      }
      const currentUser = JSON.parse(currentUserStr)
      if (currentUser && currentUser.id) {
        isFollowing.value = await dbStore.isFollowing(currentUser.id, userInfo.value.id)
      }
    } catch (error) {
      console.error('检查关注状态失败:', error)
      isFollowing.value = false
    }
  }
}

// 获取用户内容
const fetchUserContent = async () => {
  try {
    const [resources, posts] = await Promise.all([
      dbStore.getUserResources(userInfo.value.id),
      dbStore.getUserPosts(userInfo.value.id)
    ])
    
    userResources.value = resources || []
    userPosts.value = posts || []
  } catch (error) {
    console.error('获取用户内容失败:', error)
  }
}

// 切换关注状态
const toggleFollow = async () => {
  if (!isCurrentUser.value) {
    // 检查用户是否登录
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      // 用户未登录，跳转到登录页面
      router.push('/login')
      return
    }
    
    followLoading.value = true
    try {
      if (isFollowing.value) {
        await dbStore.unfollowUser(userInfo.value.id)
        isFollowing.value = false
      } else {
        await dbStore.followUser(userInfo.value.id)
        isFollowing.value = true
      }
    } catch (error) {
      console.error('关注操作失败:', error)
      const message = error instanceof Error ? error.message : '关注操作失败，请稍后再试'
      showToast(message, 'error')
    } finally {
      followLoading.value = false
    }
  }
}

// 导航方法
const navigateToResource = (resourceId: string) => {
  router.push(`/resource/${resourceId}`)
}

const navigateToPost = (postId: string) => {
  router.push(`/post/${postId}`)
}

// 工具方法
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 监听标签页切换
const handleTabChange = async () => {
  if (activeTab.value === 'resources' && userResources.value.length === 0) {
    await fetchUserContent()
  } else if (activeTab.value === 'posts' && userPosts.value.length === 0) {
    await fetchUserContent()
  }
}

// 生命周期
onMounted(() => {
  fetchUserInfo()
})

// 监听标签页变化
watch(activeTab, handleTabChange)
</script>

