<template>
  <div class="p-6 md:p-8">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
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
          <div class="flex-1">
            <!-- 昵称行 -->
            <div class="flex items-center mb-2">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userInfo.name }}</h2>
              <button
                @click="editNickname"
                class="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="编辑昵称"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
            
            <!-- 状态标签行 -->
            <div class="flex items-center mb-3">
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                活跃学习者
              </span>
            </div>
            
            <!-- 个人签名行 -->
            <div class="flex items-start">
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                {{ userInfo.bio || '这个人很懒，还没有写个人签名~' }}
                <button
                  @click="editBio"
                  class="ml-1 inline-flex p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors align-middle"
                  title="编辑个人签名"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
              </p>
            </div>
          </div>
        </div>


      </div>

        <!-- 关注统计 -->
        <div class="flex justify-around mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ followStats.followings_count }}</div>
            <button @click="goToFollowing" class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mt-1">关注</button>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ followStats.followers_count }}</div>
            <button @click="goToFollowers" class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mt-1">粉丝</button>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ myPosts.length }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">帖子</div>
          </div>
        </div>


    </div>

    <!-- 我的资源 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 cursor-pointer" @click="navigateToAllResources">
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
            v-for="resource in displayResources"
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
            
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(resource.created_at) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 查看全部按钮 -->
        <div v-if="myResources.length > 3" class="text-center mt-6">
          <button 
            @click="navigateToAllResources"
            class="px-6 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            查看全部 {{ myResources.length }} 个资源
          </button>
        </div>
      </div>
    </div>

    <!-- 我的帖子 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700 cursor-pointer" @click="navigateToAllPosts">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          我的帖子
        </h3>
      </div>
      
      <div class="p-6">
        <div v-if="myPosts.length === 0" class="text-center py-12">
          <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无发布的帖子</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有在社区发布任何帖子</p>
          <button 
            @click="navigateToCommunity"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            去社区发帖
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="post in displayPosts"
            :key="post.id"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateToPost(post.id)"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{{ post.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{{ post.content }}</p>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="post.category" class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mr-2">
                    {{ post.category }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(post.created_at) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 查看全部按钮 -->
        <div v-if="myPosts.length > 3" class="text-center mt-6">
          <button 
            @click="navigateToAllPosts"
            class="px-6 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          >
            查看全部 {{ myPosts.length }} 个帖子
          </button>
        </div>
      </div>
    </div>

    <!-- 系统设置 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          系统设置
        </h3>
      </div>
      
      <!-- 账户管理 -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4">账户管理</h4>
        <div class="space-y-4">
          <!-- 修改密码 -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">修改密码</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">定期更换密码保护账户安全</p>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="space-y-3">
              <input 
                v-model="passwordForm.currentPassword"
                type="password" 
                placeholder="当前密码"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
              <input 
                v-model="passwordForm.newPassword"
                type="password" 
                placeholder="新密码"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
              <input 
                v-model="passwordForm.confirmPassword"
                type="password" 
                placeholder="确认新密码"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
              <button 
                @click="updatePassword"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- 编辑用户信息弹窗 -->
    <EditUserDialog
      ref="editDialog"
      :title="editDialogTitle"
      :edit-type="editType"
      :initial-value="editInitialValue"
      @confirm="handleEditConfirm"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { supabaseService } from '@/services/supabase'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import EditUserDialog from '@/components/EditUserDialog.vue'

interface UserInfo {
  name: string
  email: string
  avatar?: string
  bio?: string
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

interface MyPost {
  id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  status: 'published'
  views?: number
  likes?: number
  comments?: number
  created_at: string
  updated_at?: string
}

const router = useRouter()
const databaseStore = useDatabaseStore()

// 编辑对话框的引用
const editDialog = ref<InstanceType<typeof EditUserDialog>>()

// 编辑弹窗相关状态
const editType = ref<'nickname' | 'bio'>('nickname')
const editDialogTitle = ref('')
const editInitialValue = ref('')

const myResources = ref<MyResource[]>([])
const myPosts = ref<MyPost[]>([])
const isLoadingResources = ref(false)
const isLoadingPosts = ref(false)

// 关注统计
const followStats = ref({
  followers_count: 0,
  followings_count: 0
})

// 从localStorage获取当前用户信息
const getUserInfo = (): UserInfo => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return {
        name: user.nickname || user.username || '演示用户',
        email: user.email || 'demo@example.com',
        bio: user.bio || ''
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
  }
  
  // 如果没有用户信息，返回默认值
  return {
    name: '演示用户',
    email: 'demo@example.com',
    bio: ''
  }
}

const userInfo = ref<UserInfo>(getUserInfo())

// 账户管理状态
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})





const userAvatar = computed(() => {
  return userInfo.value.name.charAt(0).toUpperCase()
})



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

const navigateToPost = (postId: string) => {
  router.push(`/post/${postId}`)
}

const navigateToCommunity = () => {
  router.push('/community')
}

const navigateToAllPosts = () => {
  router.push('/my-all-posts')
}

const navigateToAllResources = () => {
  router.push('/my-all-resources')
}

// 关注相关导航
const goToFollowing = () => {
  router.push('/profile/following')
}

const goToFollowers = () => {
  router.push('/profile/followers')
}

// 计算属性：只显示最新3个帖子
const displayPosts = computed(() => {
  return myPosts.value.slice(0, 3)
})

// 计算属性：只显示最新3个资源
const displayResources = computed(() => {
  return myResources.value.slice(0, 3)
})

// 获取帖子状态颜色
const getPostStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    published: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    deleted: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  }
  return colors[status] || colors.draft
}

// 获取帖子状态文本
const getPostStatusText = (status: string) => {
  const texts: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    deleted: '已删除'
  }
  return texts[status] || '草稿'
}

const loadMyPosts = async () => {
  isLoadingPosts.value = true
  try {
    console.log('🔄 开始加载用户帖子...')
    
    // 获取当前用户ID - 使用当前登录用户
    const client = supabaseService.getClient()
    let currentUserId = null
    
    // 从localStorage获取当前登录用户
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) {
        currentUserId = user.id
        console.log('✅ 当前用户ID:', currentUserId)
      } else {
        console.error('❌ 用户数据中没有ID字段:', user)
      }
    } else {
      console.error('❌ localStorage中没有用户信息')
    }
    
    // 如果没有登录用户，显示空列表
    if (!currentUserId) {
      console.error('❌ 用户未登录，将显示空帖子列表')
      myPosts.value = []
      return
    }
    
    console.log('🔍 查询用户帖子...')
    
    // 使用 Supabase 查询用户发布的帖子
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 获取我的帖子失败:', error)
      // 如果获取失败，使用空数组
      myPosts.value = []
      return
    }
    
    console.log('📊 原始帖子数据:', data)
    
    if (!data || data.length === 0) {
      console.log('ℹ️ 该用户没有发布任何帖子')
      myPosts.value = []
      return
    }
    
    // 转换数据格式
    const postsWithComments = []
    
    for (let i = 0; i < data.length; i++) {
      const post = data[i]
      
      // 为每个帖子查询评论数
      const { data: commentData, error: commentError } = await client
        .from('post_comments')
        .select('id')
        .eq('post_id', post.id)
      
      const commentCount = commentError ? 0 : (commentData ? commentData.length : 0)
      
      const transformedPost = {
        id: post.id,
        title: post.title,
        content: post.content || '',
        category: post.category,
        tags: [], // 社区帖子表没有tags字段，设为空数组
        status: 'published', // 社区帖子表没有status字段，默认为已发布
        views: post.views_count || 0, // 使用正确的字段名
        likes: post.likes_count || 0, // 使用正确的字段名
        comments: commentCount,
        created_at: post.created_at,
        updated_at: post.updated_at
      }
      
      postsWithComments.push(transformedPost)
      console.log(`📝 帖子 ${i+1}: ${post.title} (评论数: ${commentCount})`)
    }
    
    myPosts.value = postsWithComments
    console.log('✅ 成功加载我的帖子:', myPosts.value.length)
    console.log('📋 最终帖子数据:', myPosts.value)
    
  } catch (error) {
    console.error('❌ 加载我的帖子时出错:', error)
    myPosts.value = []
  } finally {
    isLoadingPosts.value = false
  }
}

// 加载关注统计
const loadFollowStats = async () => {
  try {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      return
    }
    const currentUser = JSON.parse(currentUserStr)
    if (!currentUser?.id) {
      return
    }

    const stats = await supabaseService.getFollowStats(currentUser.id)
    followStats.value = stats
  } catch (error) {
    console.error('❌ 加载关注统计失败:', error)
  }
}

const loadUserProfile = async () => {
  try {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      return
    }
    const currentUser = JSON.parse(currentUserStr)
    if (!currentUser?.id) {
      console.error('无法获取当前用户ID')
      return
    }

    const client = supabaseService.getClient()
    const { data, error } = await client
      .from('users')
      .select('id, username, nickname, bio')
      .eq('id', currentUser.id)
      .single()

    if (error) {
      console.error('加载用户资料失败:', error)
      return
    }

    if (data) {
      userInfo.value = {
        name: data.nickname || data.username || '演示用户',
        email: userInfo.value.email, // 保持原有的email值
        bio: data.bio || ''
      }
      bioInput.value = userInfo.value.bio || ''

      const updatedLocalUser = {
        ...currentUser,
        nickname: data.nickname || currentUser.nickname,
        username: data.username || currentUser.username,
        bio: data.bio || ''
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedLocalUser))
    }
  } catch (error) {
    console.error('加载用户资料时出错:', error)
  }
}

const loadMyResources = async () => {
  isLoadingResources.value = true
  try {
    // 获取当前用户ID - 使用当前登录用户
    const client = supabaseService.getClient()
    let currentUserId = null
    
    // 从localStorage获取当前登录用户
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) {
        currentUserId = user.id
        console.log('个人中心使用当前用户ID:', currentUserId)
      }
    }
    
    // 如果没有登录用户，显示空列表
    if (!currentUserId) {
      console.error('用户未登录，将显示空列表')
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



// 修改密码
const updatePassword = async () => {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    showToast('请填写所有密码字段', 'warning')
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('新密码和确认密码不一致', 'warning')
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    showToast('新密码长度至少为6位', 'warning')
    return
  }
  
  try {
    // 获取当前用户ID
    const client = supabaseService.getClient()
    let currentUserId = 'demo-user-id'
    
    // 从localStorage获取当前用户信息
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) {
        currentUserId = user.id
      }
    } else {
      // 如果没有本地用户信息，尝试获取admin用户
      try {
        const adminUser = await supabaseService.getUserByUsername('admin')
        
        if (adminUser) {
          // 验证当前密码
          const isCurrentPasswordValid = await supabaseService.verifyPassword(passwordForm.currentPassword, adminUser.password_hash)
          if (!isCurrentPasswordValid) {
            showToast('当前密码不正确', 'error')
            return
          }
          currentUserId = adminUser.id
        } else {
          showToast('无法获取用户信息', 'error')
          return
        }
      } catch (error) {
        console.error('获取admin用户失败:', error)
        showToast('无法获取用户信息', 'error')
        return
      }
    }
    
    // 如果是通过localStorage获取的用户，需要先验证当前密码
    if (currentUser) {
      try {
        const userData = await supabaseService.getUserById(currentUserId)
        
        if (!userData) {
          showToast('无法获取用户信息', 'error')
          return
        }
        
        const isCurrentPasswordValid = await supabaseService.verifyPassword(passwordForm.currentPassword, userData.password_hash)
        if (!isCurrentPasswordValid) {
          showToast('当前密码不正确', 'error')
          return
        }
      } catch (error) {
        console.error('获取用户数据失败:', error)
        showToast('获取用户信息失败', 'error')
        return
      }
    }
    
    // 更新密码
    await supabaseService.updateUserPassword(currentUserId, passwordForm.newPassword)
    
    showToast('密码修改成功！', 'success')
    
    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
  } catch (error) {
    console.error('修改密码失败:', error)
    showToast('密码修改失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error')
  }
}



// 编辑昵称
const editNickname = () => {
  editType.value = 'nickname'
  editDialogTitle.value = '编辑昵称'
  editInitialValue.value = userInfo.value.name
  editDialog.value?.show()
}

// 编辑个人签名
const editBio = () => {
  editType.value = 'bio'
  editDialogTitle.value = '编辑个人签名'
  editInitialValue.value = userInfo.value.bio || ''
  editDialog.value?.show()
}

// 处理编辑确认
const handleEditConfirm = async (value: string) => {
  if (editType.value === 'nickname') {
    await updateNicknameFromDialog(value)
  } else if (editType.value === 'bio') {
    await updateBioFromDialog(value)
  }
}

// 从弹窗更新昵称
const updateNicknameFromDialog = async (newNickname: string) => {
  if (!newNickname.trim()) {
    showToast('请输入新昵称', 'warning')
    return
  }
  
  try {
    // 获取当前用户ID
    const client = supabaseService.getClient()
    let currentUserId = 'demo-user-id'
    
    // 从localStorage获取当前用户信息
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.id) {
        currentUserId = user.id
      }
    } else {
      showToast('无法获取用户信息', 'error')
      return
    }
    
    // 尝试更新昵称到数据库
    try {
      await supabaseService.updateUserNickname(currentUserId, newNickname.trim())
    } catch (dbError: any) {
      // 如果nickname列不存在，使用username作为替代方案
      if (dbError.message && dbError.message.includes('nickname')) {
        console.log('nickname列不存在，暂时更新username')
        const { error: updateError } = await client
          .from('users')
          .update({ username: newNickname.trim() })
          .eq('id', currentUserId)
        
        if (updateError) {
          throw new Error('数据库中缺少nickname列，且username更新失败: ' + updateError.message)
        }
        
        // 同时更新本地存储中的用户名
        if (currentUser) {
          const user = JSON.parse(currentUser)
          user.username = newNickname.trim()
          user.nickname = newNickname.trim() // 本地存储中保存昵称
          localStorage.setItem('currentUser', JSON.stringify(user))
        }
        
        showToast('用户名更新成功！（数据库中暂无昵称列，已更新用户名作为替代）', 'success')
        userInfo.value.name = newNickname.trim()
        return
      }
      throw dbError
    }
    
    showToast('昵称更新成功！', 'success')
    
    // 更新本地存储中的用户信息
    if (currentUser) {
      const user = JSON.parse(currentUser)
      user.nickname = newNickname.trim()
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
    
    userInfo.value.name = newNickname.trim()
    
  } catch (error) {
    console.error('更新昵称失败:', error)
    showToast('更新失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error')
  }
}

// 从弹窗更新个人签名
const updateBioFromDialog = async (newBio: string) => {
  try {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      showToast('请先登录后再编辑个人签名', 'warning')
      return
    }

    const currentUser = JSON.parse(currentUserStr)
    if (!currentUser?.id) {
      showToast('无法获取当前用户信息', 'error')
      return
    }

    const client = supabaseService.getClient()
    const trimmedBio = newBio.trim()

    const { error } = await client
      .from('users')
      .update({ bio: trimmedBio })
      .eq('id', currentUser.id)

    if (error) {
      throw error
    }

    userInfo.value.bio = trimmedBio
    currentUser.bio = trimmedBio
    localStorage.setItem('currentUser', JSON.stringify(currentUser))

    showToast('个人签名已更新！', 'success')
  } catch (error) {
    console.error('更新个人签名失败:', error)
    showToast('更新失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error')
  }
}

onMounted(() => {
  loadUserProfile()
  loadMyResources()
  loadMyPosts()
  loadFollowStats()
})
</script>