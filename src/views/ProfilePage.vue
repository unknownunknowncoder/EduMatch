<template>
  <div class="p-6 md:p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <svg class="h-8 w-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        个人中心
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">管理你的学习记录和个人信息</p>
    </div>

    <!-- 用户信息卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6">
        <div class="flex items-center mb-6">
          <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mr-6">
            {{ userAvatar }}
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ userInfo.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ userInfo.email }}</p>
            <div class="flex items-center mt-2">
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                活跃学习者
              </span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalHours }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">学习时长</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedCourses }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">完成课程</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.streakDays }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">连续天数</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.achievements }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">获得成就</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          学习进度
        </h3>
      </div>
      
      <div class="p-6">
        <div class="space-y-4">
          <div 
            v-for="course in currentCourses"
            :key="course.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center flex-1">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                <span class="text-blue-600 dark:text-blue-400 font-bold">{{ course.title.charAt(0) }}</span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ course.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ course.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ course.progress }}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ course.completedLessons }}/{{ course.totalLessons }} 课时</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的资源 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          我的资源
        </h3>
      </div>
      
      <div class="p-6">
        <div v-if="myResources.length === 0" class="text-center py-12">
          <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无创建的资源</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有创建任何学习资源</p>
          <button 
            @click="navigateToCreateResource"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            创建第一个资源
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="resource in myResources"
            :key="resource.id"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToResource(resource.id)"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ resource.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ resource.description }}</p>
              </div>
              <div class="ml-3">
                <span :class="`px-2 py-1 text-xs rounded-full ${getResourceTypeColor(resource.type)}`">
                  {{ resource.type }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(resource.created_at) }}
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  {{ resource.views || 0 }}
                </div>
                <div class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  {{ resource.likes || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          最近活动
        </h3>
      </div>
      
      <div class="p-6">
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg"
          >
            <div class="flex items-center">
              <div :class="`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getActivityColor(activity.type)}`">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.type)"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { supabaseService } from '@/services/supabase'

interface UserInfo {
  name: string
  email: string
  avatar?: string
}

interface Stats {
  totalHours: number
  completedCourses: number
  streakDays: number
  achievements: number
}

interface Course {
  id: number
  title: string
  description: string
  progress: number
  completedLessons: number
  totalLessons: number
}

interface Activity {
  id: number
  type: 'course' | 'achievement' | 'study'
  title: string
  description: string
  time: string
}

interface MyResource {
  id: string
  title: string
  description: string
  type: string
  category?: string
  difficulty?: string
  duration?: string
  provider?: string
  url?: string
  views?: number
  likes?: number
  created_at: string
}

const router = useRouter()
const databaseStore = useDatabaseStore()
const myResources = ref<MyResource[]>([])
const isLoadingResources = ref(false)

const userInfo: UserInfo = {
  name: '演示用户',
  email: 'demo@example.com'
}

const stats: Stats = {
  totalHours: 0,
  completedCourses: 0,
  streakDays: 0,
  achievements: 0
}

const currentCourses: Course[] = []

const recentActivities: Activity[] = []

const userAvatar = computed(() => {
  return userInfo.name.charAt(0).toUpperCase()
})

const getActivityColor = (type: string) => {
  switch (type) {
    case 'course':
      return 'bg-blue-500'
    case 'achievement':
      return 'bg-yellow-500'
    case 'study':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'course':
      return 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    case 'achievement':
      return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 01-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 01.806-1.946 3.42 3.42 0 013.138-3.138z'
    case 'study':
      return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const getResourceTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    video: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    article: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    book: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    course: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    tool: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return colors[type] || colors.other
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const navigateToCreateResource = () => {
  router.push('/create-resource')
}

const navigateToResource = (resourceId: string) => {
  router.push(`/resource/${resourceId}`)
}

const loadMyResources = async () => {
  isLoadingResources.value = true
  try {
    // 获取当前用户ID - 统一使用admin用户
    const client = supabaseService.getClient()
    let currentUserId = 'demo-user-id'
    
    // 获取admin用户的真实ID
    const { data: adminUser, error: adminError } = await client
      .from('users')
      .select('id')
      .eq('username', 'admin')
      .single()
    
    if (adminUser && !adminError) {
      currentUserId = adminUser.id
      console.log('个人中心使用admin用户ID:', currentUserId)
    } else {
      console.error('无法获取admin用户ID，将显示空列表')
      myResources.value = []
      return
    }
    
    // 使用 Supabase 查询用户创建的资源
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('created_by', currentUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取我的资源失败:', error)
      // 如果获取失败，使用空数组
      myResources.value = []
    } else {
      // 转换数据格式
      myResources.value = (data || []).map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description || '',
        type: resource.type || 'other',
        category: resource.category,
        difficulty: resource.difficulty,
        duration: resource.duration,
        provider: resource.provider,
        url: resource.url,
        views: resource.views || 0,
        likes: resource.likes || 0,
        created_at: resource.created_at
      }))
    }
  } catch (error) {
    console.error('加载我的资源时出错:', error)
    myResources.value = []
  } finally {
    isLoadingResources.value = false
  }
}

onMounted(() => {
  loadMyResources()
})
</script>