<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center py-12 px-4">
    <div class="max-w-md mx-auto text-center">
      <!-- 图标 -->
      <div class="mb-8">
        <div class="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
          <Lock class="h-12 w-12 text-red-600" />
        </div>
      </div>

      <!-- 标题和描述 -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">访问受限</h1>
      <p class="text-lg text-gray-600 mb-8">
        请先登录账号以访问此页面
      </p>

      <!-- 操作按钮 -->
      <div class="space-y-4">
        <router-link 
          to="/login"
          class="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          立即登录
        </router-link>
        
        <router-link 
          to="/register"
          class="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          注册新账号
        </router-link>
      </div>

      <!-- 返回首页链接 -->
      <div class="mt-8">
        <p class="text-sm text-gray-500">
          返回
          <router-link to="/login" class="text-blue-600 hover:underline">
            登录页面
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
</script>