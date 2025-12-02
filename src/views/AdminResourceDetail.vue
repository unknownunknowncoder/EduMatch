<template>
  <div class="min-h-screen bg-gray-50">
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
    
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 text-gray-600 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">资源详情管理</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="deleteResource"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              删除资源
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在加载资源详情...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-16">
        <div class="text-red-600 text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <button @click="loadResource" class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          重新加载
        </button>
      </div>

      <!-- 删除成功提示 -->
      <div v-if="deleteSuccess" class="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
        ✅ 资源删除成功
      </div>

      <!-- 资源详情 -->
      <div v-else-if="resource" class="space-y-8">
        <!-- 资源基本信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ resource.title }}</h2>
          
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {{ resource.user?.nickname?.charAt(0) || resource.user?.username?.charAt(0) || 'U' }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ resource.user?.nickname || resource.user?.username || '未知用户' }}
                  </p>
                  <p class="text-xs text-gray-500">{{ resource.created_by }}</p>
                </div>
              </div>
              
              <div class="text-sm text-gray-500">
                <span>创建时间：{{ formatTime(resource.created_at) }}</span>
                <span class="mx-2">|</span>
                <span>最后更新：{{ formatTime(resource.updated_at) }}</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ getCategoryText(resource.category) }}
              </span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {{ getTypeText(resource.type) }}
              </span>
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {{ getDifficultyText(resource.difficulty) }}
              </span>
            </div>
          </div>

          <div v-if="resource.description" class="prose max-w-none mb-6">
            <div class="whitespace-pre-wrap text-gray-700">
              {{ resource.description }}
            </div>
          </div>

          <!-- 资源链接 -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">资源链接</h4>
            <a :href="resource.url" target="_blank" 
               class="text-blue-600 hover:text-blue-800 underline break-all">
              {{ resource.url }}
            </a>
            <button @click="openResource" 
                    class="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              打开资源
            </button>
          </div>
        </div>



        <!-- 学习信息 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">学习信息</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">预计学习时长</h4>
              <p class="text-gray-700">{{ resource.duration || '未设置' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">难度等级</h4>
              <p class="text-gray-700">{{ getDifficultyText(resource.difficulty) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">提供者</h4>
              <p class="text-gray-700">{{ resource.provider || '未设置' }}</p>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="resource.tags && resource.tags.length > 0" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in resource.tags" :key="tag" 
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              #{{ tag }}
            </span>
          </div>
        </div>


      </div>
    </main>

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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

interface Resource {
  id: string
  title: string
  description?: string
  url: string
  created_by: string
  category?: string
  type?: string
  difficulty?: string
  duration?: string
  provider?: string
  tags?: string[]
  rating?: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    username: string
    nickname?: string
  }
}

const route = useRoute()
const router = useRouter()

const resourceId = route.params.id as string
const userId = route.query.user_id as string || null
const loading = ref(true)
const error = ref('')
const resource = ref<Resource | null>(null)
const deleteSuccess = ref(false)

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  message: '',
  onConfirm: () => {}
})

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 获取分类文本
const getCategoryText = (category?: string) => {
  switch (category) {
    case 'programming': return '编程'
    case 'design': return '设计'
    case 'language': return '语言学习'
    case 'business': return '商业'
    case 'science': return '科学'
    case 'technology': return '技术'
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
    case 'documentation': return '文档'
    default: return '其他'
  }
}

// 获取难度文本
const getDifficultyText = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner': return '初级'
    case 'intermediate': return '中级'
    case 'advanced': return '高级'
    case 'expert': return '专家级'
    default: return '未设置'
  }
}

// 加载资源详情
const loadResource = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔄 加载管理员资源详情，ID:', resourceId)
    
    const { supabaseService } = await import('@/services/supabase')
    
    // 获取资源基本信息
    const resourceData = await supabaseService.getResourceById(resourceId)
    
    console.log('🔍 原始资源数据:', resourceData)
    
    if (!resourceData) {
      error.value = '资源不存在或已被删除'
      return
    }
    
    // 获取用户信息
    let userInfo = null
    if (resourceData.created_by) {
      try {
        userInfo = await supabaseService.getUserById(resourceData.created_by)
      } catch (userError) {
        console.error('获取用户信息失败:', userError)
      }
    }
    
    const finalResource = {
      ...resourceData,
      user: userInfo
    }
    
    resource.value = finalResource
    
    console.log('✅ 资源详情加载成功:', resource.value)
    console.log('✅ 用户ID确认:', resource.value.user_id)
    
  } catch (err) {
    console.error('❌ 加载资源详情失败:', err)
    error.value = '加载资源详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  console.log('🔙 点击返回按钮')
  console.log('🔍 当前资源数据:', resource.value)
  console.log('🔍 用户ID:', resource.value?.user_id)
  
  try {
    // 优先返回到对应用户的管理详情页面
    const targetUserId = resource.value?.created_by || userId
    
    if (targetUserId) {
      const userDetailUrl = `/admin/user/${targetUserId}`
      console.log('📍 返回到用户详情页面:', userDetailUrl)
      console.log('📍 使用用户ID:', targetUserId, '(来自资源:', !!resource.value?.created_by, ', 来自URL:', !!userId, ')')
      router.push(userDetailUrl)
      return
    }
    
    console.log('❌ 没有找到用户ID，使用备选方案')
    
    // 如果没有用户信息，尝试返回上一页
    if (window.history.length > 1) {
      console.log('📍 使用 history.back() 返回')
      router.back()
    } else {
      // 最后备选：跳转到管理主页
      console.log('📍 跳转到管理主页')
      router.push('/admin')
    }
  } catch (error) {
    console.error('❌ 返回失败，跳转到管理页面:', error)
    router.push('/admin')
  }
}

// 打开资源
const openResource = () => {
  if (resource.value?.url) {
    window.open(resource.value.url, '_blank')
  }
}

// 删除资源
const deleteResource = async () => {
  if (!resource.value) return
  
  // 显示确认对话框
  confirmDialog.value = {
    show: true,
    message: '确定要删除这个资源吗？此操作不可撤销。',
    onConfirm: () => executeDeleteResource()
  }
}

// 实际执行删除的函数
const executeDeleteResource = async () => {
  try {
    console.log('🗑️ 删除资源，ID:', resource.value.id)
    
    const { supabaseService } = await import('@/services/supabase')
    await supabaseService.deleteResource(resource.value.id)
    
    console.log('✅ 资源删除成功')
    
    confirmDialog.value.show = false
    
    // 显示成功提示
    deleteSuccess.value = true
    showToast('资源删除成功！', 'success')
    
    // 延迟1.5秒后返回到对应用户的管理详情页面
    setTimeout(() => {
      if (resource.value.created_by) {
        const userDetailUrl = `/admin/user/${resource.value.created_by}`
        console.log('🗑️ 删除成功，返回到用户详情页面:', userDetailUrl)
        router.push(userDetailUrl)
      } else {
        console.log('🗑️ 删除成功，返回到管理主页')
        router.push('/admin')
      }
    }, 1500)
    
  } catch (err) {
    console.error('❌ 删除资源失败:', err)
    showNotification('删除资源失败，请稍后重试', 'error')
  }
}



onMounted(() => {
  loadResource()
})
</script>

<style>
/* 移除前端侧边栏和导航 */
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

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

div[class*="sidebar"],
div[class*="navigation"],
aside {
  display: none !important;
  visibility: hidden !important;
}

#app {
  width: 100%;
  height: 100%;
}

a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>