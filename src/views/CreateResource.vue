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
      <p class="text-gray-600 dark:text-gray-400 mt-2">分享你的学习资源，帮助更多人成长</p>
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
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源标题 *
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">(描述选填)</span>
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入资源标题"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源类型 *
                </label>
                <select
                  v-model="formData.type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">请选择</option>
                  <option value="video">视频课程</option>
                  <option value="article">文章教程</option>
                  <option value="book">电子书籍</option>
                  <option value="course">在线课程</option>
                  <option value="tool">学习工具</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                资源描述
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="详细描述你的学习资源内容（选填）..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  学习时长
                </label>
                <input
                  v-model="formData.duration"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="例如：2小时"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  难度等级
                </label>
                <select
                  v-model="formData.difficulty"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源标签
                </label>
                <input
                  v-model="formData.tags"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="用逗号分隔，如：前端,React,JavaScript"
                />
              </div>
            </div>
          </div>

          <!-- 链接信息 -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              链接信息
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  资源链接 *
                </label>
                <input
                  v-model="formData.url"
                  type="url"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/resource"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提供者
                </label>
                <input
                  v-model="formData.provider"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="个人或机构名称"
                />
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? '提交中...' : '发布资源' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'

const router = useRouter()
const isSubmitting = ref(false)

const formData = reactive({
  title: '',
  type: '',
  description: '',
  duration: '',
  difficulty: 'intermediate',
  tags: '',
  url: '',
  provider: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // 获取当前用户ID - 统一使用admin用户
    let currentUserId = 'demo-user-id'
    
    try {
      // 使用Supabase服务的方法获取admin用户
      const adminUser = await supabaseService.getUserByUsername('admin')
      
      if (adminUser) {
        currentUserId = adminUser.id
        console.log('使用admin用户ID:', currentUserId)
      } else {
        // 如果获取失败，使用硬编码的ID作为后备方案
        currentUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
        console.log('admin用户不存在，使用后备用户ID:', currentUserId)
      }
    } catch (error) {
      console.error('获取admin用户失败:', error)
      // 使用硬编码的ID作为后备方案
      currentUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'
      console.log('使用后备用户ID:', currentUserId)
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
    
    // 同时创建一个社区帖子，让资源显示在学习社区中
    const postData = {
      user_id: currentUserId,
      title: formData.title,
      content: formData.description || '分享了一个学习资源',
      category: formData.type || 'other',
      likes_count: 0,
      views_count: 0
    }
    
    try {
      console.log('🔄 准备创建社区帖子，数据:', postData)
      const createdPost = await supabaseService.createCommunityPost(postData)
      console.log('✅ 社区帖子创建成功:', createdPost)
      console.log('📊 帖子ID:', createdPost.id)
      console.log('📊 帖子标题:', createdPost.title)
      
      // 显示成功消息
      alert('发布成功！资源已添加到学习社区')
      
    } catch (postError) {
      console.error('❌ 创建社区帖子失败:', postError)
      console.error('❌ 错误详情:', postError.message)
      console.error('❌ 错误代码:', postError.code)
      
        // 如果是RLS策略错误，提示用户执行SQL脚本
        if (postError.code === '42501' || postError.message.includes('row-level security policy')) {
          alert('发布成功！但由于数据库安全策略，资源暂时无法显示在学习社区中。\n\n请执行以下操作：\n1. 打开 Supabase SQL Editor\n2. 执行 fix-community-posts-rls.sql 文件中的SQL语句\n3. 重新发布资源')
        } else {
          // 其他错误
          alert('资源发布成功！但未能添加到学习社区，请稍后手动分享')
        }
    }
    
    // 提交成功后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('提交失败:', error)
    alert('资源创建失败，请重试: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/search')
}
</script>