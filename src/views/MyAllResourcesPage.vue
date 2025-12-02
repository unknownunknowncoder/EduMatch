<template>
  <div class="p-6 md:p-8">
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
    <!-- 页面标题和返回按钮 -->
    <div class="flex items-center mb-8">
      <button 
        @click="goBack"
        class="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg class="h-8 w-8 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          我的全部资源
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">管理你创建的所有学习资源</p>
      </div>
    </div>



    <!-- 资源列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-purple-500 hover:bg-purple-400 transition ease-in-out duration-150">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="myResources.length === 0" class="text-center py-12">
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

        <!-- 资源列表 -->
        <div v-else class="space-y-4">
          <div 
            v-for="resource in myResources"
            :key="resource.id"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600"
            @click="navigateToResource(resource.id)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ resource.title }}</h4>
                  <span :class="`px-3 py-1 text-xs rounded-full ${getResourceTypeColor(resource.type)}`">
                    {{ resource.type }}
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-400">{{ resource.description }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="navigateToResource(resource.id)"
                  class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="查看详情"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button
                  @click.stop="showDeleteConfirm(resource)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="删除资源"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 资源详细信息 -->
            <div class="flex flex-wrap items-center gap-4 mb-4">
              <div v-if="resource.category" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                {{ resource.category }}
              </div>
              <div v-if="resource.difficulty" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {{ resource.difficulty }}
              </div>
              <div v-if="resource.duration" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ resource.duration }}
              </div>
              <div v-if="resource.provider" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ resource.provider }}
              </div>
            </div>
            
            <div class="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(resource.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 级联删除对话框 -->
    <CascadeDeleteDialog
      ref="cascadeDeleteDialog"
      title="删除资源确认"
      :message="`确定要删除资源「${selectedResource?.title}」吗？`"
      :relatedPosts="relatedPosts"
      @confirm="handleCascadeDelete"
      @cancel="hideDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import CascadeDeleteDialog from '@/components/CascadeDeleteDialog.vue'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon, getMessageStyles } from '@/utils/message'

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
const myResources = ref<MyResource[]>([])
const isLoading = ref(false)
const showDeleteDialog = ref(false)
const selectedResource = ref<MyResource | null>(null)
const relatedPosts = ref<any[]>([])
const cascadeDeleteDialog = ref<InstanceType<typeof CascadeDeleteDialog>>()



const goBack = () => {
  router.push('/profile')
}

const navigateToResource = (resourceId: string) => {
  router.push(`/resource/${resourceId}`)
}

const navigateToCreateResource = () => {
  router.push('/create-resource')
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

const showDeleteConfirm = async (resource: MyResource) => {
  selectedResource.value = resource
  
  // 检查关联的帖子
  try {
    const client = supabaseService.getClient()
    const { data: posts, error } = await client
      .from('community_posts')
      .select('id, title')
      .eq('resource_id', resource.id)
    
    if (error) {
      console.error('❌ 检查关联帖子失败:', error)
      relatedPosts.value = []
    } else {
      relatedPosts.value = posts || []
    }
  } catch (error) {
    console.error('❌ 检查关联帖子异常:', error)
    relatedPosts.value = []
  }
  
  // 显示级联删除对话框
  cascadeDeleteDialog.value?.show()
}

const hideDeleteConfirm = () => {
  showDeleteDialog.value = false
  selectedResource.value = null
}

const handleCascadeDelete = async (option: string) => {
  if (!selectedResource.value) return
  
  const resourceTitle = selectedResource.value.title
  const resourceId = selectedResource.value.id
  
  try {
    const client = supabaseService.getClient()
    
    if (option === 'cascade') {
      // 级联删除：先删除关联的帖子，再删除资源
      console.log('🔄 执行级联删除...')
      
      // 先删除所有关联的帖子
      if (relatedPosts.value.length > 0) {
        const { error: postsDeleteError } = await client
          .from('community_posts')
          .delete()
          .eq('resource_id', resourceId)
        
        if (postsDeleteError) {
          console.error('❌ 删除关联帖子失败:', postsDeleteError)
          showToast('删除关联帖子失败，请稍后重试', 'error')
          return
        }
        
        console.log(`✅ 已删除 ${relatedPosts.value.length} 个关联帖子`)
      }
      
      // 然后删除资源
      await performResourceDeletion(resourceId, resourceTitle)
      
    } else if (option === 'resource_only') {
      // 仅删除资源：先将关联帖子的resource_id设置为null，然后删除资源
      console.log('🔄 执行仅删除资源...')
      
      // 先将所有关联帖子的resource_id设置为null
      if (relatedPosts.value.length > 0) {
        const { error: updateError } = await client
          .from('community_posts')
          .update({ resource_id: null })
          .eq('resource_id', resourceId)
        
        if (updateError) {
          console.error('❌ 解除关联失败:', updateError)
          showToast('解除资源关联失败，请稍后重试', 'error')
          return
        }
        
        console.log(`✅ 已解除 ${relatedPosts.value.length} 个帖子的资源关联`)
      }
      
      // 然后删除资源
      await performResourceDeletion(resourceId, resourceTitle)
    }
    
  } catch (error) {
    console.error('❌ 级联删除失败:', error)
    showToast('删除失败，请稍后重试', 'error')
  }
}

const performResourceDeletion = async (resourceId: string, resourceTitle: string) => {
  const client = supabaseService.getClient()
  let retryCount = 0
  const maxRetries = 3
  let deleteError = null
  
  // 重试机制
  while (retryCount < maxRetries) {
    try {
      console.log(`🔄 尝试删除资源 (${retryCount + 1}/${maxRetries})...`)
      
      // 删除资源
      const { error } = await client
        .from('resources')
        .delete()
        .eq('id', resourceId)
      
      deleteError = error
      
      if (!error) {
        console.log('✅ 资源删除成功')
        break
      } else {
        console.error(`❌ 删除失败 (${retryCount + 1}/${maxRetries}):`, error)
        if (retryCount < maxRetries - 1) {
          // 等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (err) {
      console.error(`❌ 删除异常 (${retryCount + 1}/${maxRetries}):`, err)
      deleteError = err
      if (retryCount < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    retryCount++
  }
  
  if (deleteError) {
    console.error('❌ 删除资源最终失败:', deleteError)
    
    // 更详细的错误信息
    let errorMessage = '删除失败，请稍后重试'
    if (deleteError.message) {
      if (deleteError.message.includes('Failed to fetch')) {
        errorMessage = '网络连接失败，请检查网络连接后重试'
      } else if (deleteError.message.includes('permission')) {
        errorMessage = '没有删除权限，请联系管理员'
      } else if (deleteError.message.includes('row-level security')) {
        errorMessage = '安全策略阻止删除，请联系管理员'
      } else {
        errorMessage = `删除失败: ${deleteError.message}`
      }
    }
    
    showToast(errorMessage, 'error')
    return
  }
  
  // 从本地列表中移除
  myResources.value = myResources.value.filter(resource => resource.id !== resourceId)
  
  // 关闭对话框
  hideDeleteConfirm()
  
  // 显示成功提示
  showToast(`资源「${resourceTitle}」已成功删除`, 'success')
}

const loadMyResources = async () => {
  isLoading.value = true
  try {
    console.log('🔄 开始加载用户全部资源...')
    
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
      console.error('❌ 用户未登录，将显示空资源列表')
      myResources.value = []
      return
    }
    
    console.log('🔍 查询用户资源...')
    
    // 使用 Supabase 查询用户创建的资源
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('created_by', currentUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 获取我的资源失败:', error)
      // 如果获取失败，使用空数组
      myResources.value = []
      return
    }
    
    console.log('📊 原始资源数据:', data)
    
    if (!data || data.length === 0) {
      console.log('ℹ️ 该用户没有创建任何资源')
      myResources.value = []
      return
    }
    
    // 转换数据格式
    myResources.value = data.map(resource => ({
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
    
    console.log('✅ 成功加载我的资源:', myResources.value.length)
    console.log('📋 最终资源数据:', myResources.value)
    
  } catch (error) {
    console.error('❌ 加载我的资源时出错:', error)
    myResources.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMyResources()
})
</script>