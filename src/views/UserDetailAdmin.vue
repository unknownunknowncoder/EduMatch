<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 弹窗提示 -->
    <div v-if="notification.show" 
         :class="[
           'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse',
           notification.type === 'success' ? 'bg-green-600 text-white' : 
           notification.type === 'error' ? 'bg-red-600 text-white' : 
           'bg-blue-600 text-white'
         ]">
      {{ notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️' }}
      {{ notification.message }}
    </div>
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button 
              @click="goBack" 
              class="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">用户详情管理</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading.user" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">加载用户信息中...</p>
      </div>

      <div v-else-if="!user" class="text-center py-12">
        <p class="text-red-500 text-lg">用户不存在或已被删除</p>
        <button @click="goBack" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          返回用户管理
        </button>
      </div>

      <div v-else class="space-y-8">
        <!-- 用户基本信息卡片 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            基本信息
          </h2>
          
          <div class="flex items-center mb-6">
            <div class="flex-shrink-0 h-20 w-20">
              <div class="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-200">
                <span class="text-2xl font-bold text-white">
                  {{ (user.nickname || 'U').charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="ml-6 flex-1">
              <h3 class="text-2xl font-bold text-gray-900">{{ user.nickname || '未设置昵称' }}</h3>
              <p class="text-gray-500 mt-1">用户ID: {{ user.id }}</p>
              <div class="flex items-center mt-2 space-x-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                      :class="user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ user.email_confirmed_at ? '已激活' : '未激活' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">个性签名</p>
              <p class="font-medium text-gray-900">{{ user.bio || '暂无个性签名' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">注册时间</p>
              <p class="font-medium text-gray-900">{{ formatTime(user.created_at) }}</p>
            </div>

          </div>
        </div>

        <!-- 用户内容统计 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">发表帖子</p>
                <p class="text-2xl font-bold text-gray-900">{{ userStats.posts }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">学习计划</p>
                <p class="text-2xl font-bold text-gray-900">{{ userStats.plans }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-lg">
                <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">学习资源</p>
                <p class="text-2xl font-bold text-gray-900">{{ userStats.resources }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户内容详情 -->
        <div class="space-y-6">
          <!-- 发表的帖子 -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                发表的帖子 ({{ userPosts.length }})
              </h3>
            </div>
            <div class="p-6">
              <div v-if="loading.posts" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">加载帖子中...</p>
              </div>
              <div v-else-if="userPosts.length > 0" class="space-y-4">
                <div v-for="post in userPosts" :key="post.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">{{ post.title }}</h4>
                    <div class="flex items-center mt-2 text-xs text-gray-500">
                      <span class="mr-4">{{ formatTime(post.created_at) }}</span>
                      <span class="mr-4">{{ post.category || '其他' }}</span>
                      <span>❤️{{ post.likes_count || 0 }} 💬{{ post.comments_count || 0 }}</span>
                    </div>
                  </div>
                  <button @click="viewPost(post.id)" class="ml-4 px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500">该用户暂无发表帖子</p>
              </div>
            </div>
          </div>

          <!-- 学习计划 -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                学习计划 ({{ userPlans.length }})
              </h3>
            </div>
            <div class="p-6">
              <div v-if="loading.plans" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">加载计划中...</p>
              </div>
              <div v-else-if="userPlans.length > 0" class="space-y-4">
                <div v-for="plan in userPlans" :key="plan.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">{{ plan.title }}</h4>
                    <div class="flex items-center mt-2 text-xs text-gray-500">
                      <span class="mr-4">{{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}</span>
                      <span class="mr-4">进度: {{ plan.progress || 0 }}%</span>
                    </div>
                    <div class="w-full max-w-xs mt-2">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${plan.progress || 0}%` }"></div>
                      </div>
                    </div>
                  </div>
                  <button @click="viewPlan(plan.id)" class="ml-4 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500">该用户暂无学习计划</p>
              </div>
            </div>
          </div>

          <!-- 学习资源 -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                学习资源 ({{ userResources.length }})
              </h3>
            </div>
            <div class="p-6">
              <div v-if="loading.resources" class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p class="text-sm text-gray-500 mt-2">加载资源中...</p>
              </div>
              <div v-else-if="userResources.length > 0" class="space-y-4">
                <div v-for="resource in userResources" :key="resource.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">{{ resource.title }}</h4>
                    <div class="flex items-center mt-2 text-xs text-gray-500">
                      <span class="mr-4">{{ getCategoryText(resource.category) }}</span>
                      <span class="mr-4">{{ getTypeText(resource.type) }}</span>
                      <span>❤️{{ resource.likes_count || 0 }} 👁️{{ resource.views_count || 0 }}</span>
                    </div>
                  </div>
                  <button @click="viewResource(resource.id)" class="ml-4 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500">该用户暂无学习资源</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'

interface User {
  id: string
  nickname?: string
  bio?: string
  role?: string
  email_confirmed_at?: string
  created_at: string
}

interface Post {
  id: string
  title: string
  category?: string
  likes_count?: number
  comments_count?: number
  created_at: string
}

interface Plan {
  id: string
  title: string
  progress?: number
  start_date: string
  end_date: string
  created_at: string
}

interface Resource {
  id: string
  title: string
  description?: string
  category?: string
  type?: string
  difficulty?: string
  duration?: string
  provider?: string
  url?: string
  tags?: string[]
  rating?: number
  created_by: string
  created_at: string
}

const route = useRoute()
const router = useRouter()
const dbStore = useDatabaseStore()

const userId = route.params.userId as string
const currentTime = ref('')

const user = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const userPlans = ref<Plan[]>([])
const userResources = ref<Resource[]>([])

const userStats = ref({
  posts: 0,
  plans: 0,
  resources: 0
})

const loading = ref({
  user: false,
  posts: false,
  plans: false,
  resources: false
})

// 弹窗提示系统
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
})

// 显示弹窗提示
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  // 3秒后自动隐藏
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 加载用户基本信息
const loadUser = async () => {
  loading.value.user = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('加载用户信息失败:', error)
    } else {
      user.value = data
      console.log('用户信息加载完成:', user.value)
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  } finally {
    loading.value.user = false
  }
}

// 加载用户帖子
const loadUserPosts = async () => {
  loading.value.posts = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载用户帖子失败:', error)
    } else {
      userPosts.value = data || []
      userStats.value.posts = userPosts.value.length
      console.log('用户帖子加载完成:', userPosts.value.length, '条')
    }
  } catch (error) {
    console.error('加载用户帖子失败:', error)
  } finally {
    loading.value.posts = false
  }
}

// 加载用户学习计划
const loadUserPlans = async () => {
  loading.value.plans = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { data, error } = await client
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('加载用户学习计划失败:', error)
    } else {
      userPlans.value = data || []
      userStats.value.plans = userPlans.value.length
      console.log('用户学习计划加载完成:', userPlans.value.length, '条')
    }
  } catch (error) {
    console.error('加载用户学习计划失败:', error)
  } finally {
    loading.value.plans = false
  }
}

// 加载用户资源
const loadUserResources = async () => {
  loading.value.resources = true
  try {
    console.log('🔄 开始加载用户资源，用户ID:', userId)
    
    // 直接使用 supabaseService
    const { supabaseService } = await import('@/services/supabase')
    const client = supabaseService.getClient()
    
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('created_by', userId)  // 使用 created_by 字段而不是 user_id
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 加载用户资源失败:', error)
      console.error('错误详情:', error.message)
    } else {
      userResources.value = data || []
      userStats.value.resources = userResources.value.length
      console.log('✅ 用户资源加载完成:', userResources.value.length, '条')
      console.log('📋 资源列表:', userResources.value.map(r => ({ id: r.id, title: r.title, created_at: r.created_at })))
    }
  } catch (error) {
    console.error('❌ 加载用户资源异常:', error)
    console.error('异常详情:', error.message)
  } finally {
    loading.value.resources = false
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取分类文本
const getCategoryText = (category?: string) => {
  switch (category) {
    case 'programming': return '编程'
    case 'design': return '设计'
    case 'language': return '语言学习'
    case 'business': return '商业'
    case 'science': return '科学'
    default: return '其他'
  }
}

// 获取类型文本
const getTypeText = (type?: string) => {
  switch (type) {
    case 'video': return '视频'
    case 'article': return '文章'
    case 'book': return '书籍'
    case 'course': return '课程'
    case 'tool': return '工具'
    case 'website': return '网站'
    default: return '其他'
  }
}

// 返回上一页
const goBack = () => {
  // 返回到用户管理页面
  router.push('/admin/users')
}

// 查看帖子详情
const viewPost = async (postId: string) => {
  console.log('🔍 查看帖子详情（后台管理），ID:', postId)
  
  if (!postId) {
    console.error('❌ 帖子ID为空')
    showNotification('错误：帖子ID为空', 'error')
    return
  }
  
  // 验证帖子是否存在
  try {
    const { supabaseService } = await import('@/services/supabase')
    const postExists = await supabaseService.getPostById(postId)
    
    if (!postExists) {
      console.error('❌ 帖子不存在，ID:', postId)
      showNotification('帖子不存在或已被删除', 'error')
      return
    }
    
    // 在当前页面跳转到后台管理的帖子详情页面，传递用户ID参数
    const url = `/admin/post/${postId}?user_id=${userId}`
    console.log('🚀 即将在当前页面跳转到后台管理详情:', url)
    
    router.push(url)
    console.log('✅ 开始跳转到后台管理帖子详情页面')
    
  } catch (error) {
    console.error('❌ 验证帖子或跳转页面时发生错误:', error)
    showNotification('跳转失败：' + (error.message || '未知错误'), 'error')
  }
}

// 查看计划详情
const viewPlan = async (planId: string) => {
  console.log('🔍 查看学习计划详情（后台管理），ID:', planId)
  
  if (!planId) {
    console.error('❌ 学习计划ID为空')
    showNotification('错误：学习计划ID为空', 'error')
    return
  }
  
  // 验证计划是否存在
  try {
    const { supabaseService } = await import('@/services/supabase')
    const planExists = await supabaseService.getStudyPlanById(planId)
    
    if (!planExists) {
      console.error('❌ 学习计划不存在，ID:', planId)
      showNotification('学习计划不存在或已被删除', 'error')
      return
    }
    
    // 在当前页面跳转到后台管理的学习计划详情页面，传递用户ID参数
    const url = `/admin/plan/${planId}?user_id=${userId}`
    console.log('🚀 即将在当前页面跳转到后台管理详情:', url)
    
    router.push(url)
    console.log('✅ 开始跳转到后台管理学习计划详情页面')
    
  } catch (error) {
    console.error('❌ 验证计划或跳转页面时发生错误:', error)
    showNotification('跳转失败：' + (error.message || '未知错误'), 'error')
  }
}

// 查看资源详情
const viewResource = async (resourceId: string) => {
  console.log('🔍 查看资源详情（后台管理），ID:', resourceId)
  
  if (!resourceId) {
    console.error('❌ 资源ID为空')
    showNotification('错误：资源ID为空', 'error')
    return
  }
  
  // 验证资源是否存在
  try {
    const { supabaseService } = await import('@/services/supabase')
    const resourceExists = await supabaseService.getResourceById(resourceId)
    
    if (!resourceExists) {
      console.error('❌ 资源不存在，ID:', resourceId)
      showNotification('资源不存在或已被删除', 'error')
      return
    }
    
    // 在当前页面跳转到后台管理的资源详情页面，传递用户ID参数
    const url = `/admin/resource/${resourceId}?user_id=${userId}`
    console.log('🚀 即将在当前页面跳转到后台管理详情:', url)
    
    router.push(url)
    console.log('✅ 开始跳转到后台管理资源详情页面')
    
  } catch (error) {
    console.error('❌ 验证资源或跳转页面时发生错误:', error)
    showNotification('跳转失败：' + (error.message || '未知错误'), 'error')
  }
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(() => {
  console.log('用户详情页面初始化，用户ID:', userId)
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  // 并行加载所有数据
  Promise.all([
    loadUser(),
    loadUserPosts(),
    loadUserPlans(),
    loadUserResources()
  ])
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style>
/* 完全移除前端侧边栏和导航 */
.sidebar-navigation,
.bottom-navigation,
nav {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
}

/* 确保body没有前端相关的样式 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 只移除非管理后台的侧边栏元素 */
div[class*="sidebar"]:not(.admin-sidebar):not([class*="admin"]),
div[class*="navigation"]:not(.admin-sidebar):not([class*="admin"]),
aside:not(.admin-sidebar):not([class*="admin"]) {
  display: none !important;
  visibility: hidden !important;
}

/* 确保主容器是全屏的 */
#app {
  width: 100%;
  height: 100%;
}

/* 移除Vue Router Link可能造成的前端导航 */
a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>