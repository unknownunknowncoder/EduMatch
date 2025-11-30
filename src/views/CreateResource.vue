<template>
  <div class="p-6 md:p-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
        <svg class="h-8 w-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        创建资源
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">创建个人学习资源，保存到个人中心</p>
    </div>

    <!-- 创建表单 -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <form @submit.prevent="handleSubmit">
          <!-- 基本信息 -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              基本信息
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 资源标题 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源标题 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="请输入资源标题"
                />
              </div>
              
              <!-- 资源类型 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源类型 <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">请选择资源类型</option>
                  <option value="course">课程</option>
                  <option value="book">书籍</option>
                  <option value="video">视频</option>
                  <option value="article">文章</option>
                  <option value="tool">工具</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              详细信息
            </h2>
            
            <div class="space-y-6">
              <!-- 资源描述 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源描述
                </label>
                <textarea
                  v-model="formData.description"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="请详细描述这个资源的内容和特点..."
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 难度等级 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    难度等级
                  </label>
                  <select
                    v-model="formData.difficulty"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">请选择难度</option>
                    <option value="beginner">初级</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                
                <!-- 学习时长 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    学习时长（小时）
                  </label>
                  <input
                    v-model.number="formData.duration"
                    type="number"
                    min="0"
                    step="0.5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="预计学习时长"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 提供者 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    提供者
                  </label>
                  <input
                    v-model="formData.provider"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="资源提供者或机构"
                  />
                </div>
                
                <!-- 资源链接 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    资源链接
                  </label>
                  <input
                    v-model="formData.url"
                    type="url"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <!-- 标签 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <input
                  v-model="formData.tags"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="请输入标签，多个标签用逗号分隔"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">例如：JavaScript, 前端, 编程</p>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '创建中...' : '创建资源' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'

const router = useRouter()

// 表单数据
const formData = reactive({
  title: '',
  description: '',
  type: '',
  difficulty: '',
  duration: '',
  provider: '',
  url: '',
  tags: ''
})

// 提交状态
const isSubmitting = ref(false)



// 提交表单
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // 获取当前登录用户ID
    let currentUserId = null
    
    // 从localStorage获取当前登录用户
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user && user.id) {
          currentUserId = user.id
          console.log('使用当前登录用户ID:', currentUserId)
        }
      }
    }
    
    // 如果没有登录用户，提示登录
    if (!currentUserId) {
      showToast('请先登录后再发布资源', 'warning')
      isSubmitting.value = false
      return
    }
    
    // 准备要提交的数据
    const resourceData = {
      title: formData.title,
      description: formData.description,
      type: formData.type || 'other',
      category: formData.type, // 使用type作为category
      difficulty: formData.difficulty,
      duration: formData.duration,
      provider: formData.provider,
      url: formData.url,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [], // 处理标签
      created_by: currentUserId
    }
    
    console.log('提交资源数据:', resourceData)
    
    // 调用数据库服务创建资源
    const createdResource = await supabaseService.createResource(resourceData)
    
    console.log('✅ 资源创建成功:', createdResource)
    console.log('📊 资源ID:', createdResource.id)
    
    // 验证资源确实创建成功
    if (!createdResource || !createdResource.id) {
      throw new Error('资源创建失败：返回数据无效')
    }
    
    // 显示成功提示
    showToast('资源创建成功，请在\'个人中心-我的资源\'中查看', 'success')
    
    // 2秒后跳转到资源详情页面
    setTimeout(() => {
      router.push(`/resource/${createdResource.id}`)
    }, 2000)
  } catch (error) {
    console.error('提交失败:', error)
    showToast('资源创建失败，请重试: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/search')
}
</script>