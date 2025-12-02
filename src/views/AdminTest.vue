<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">后台管理系统</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-lg">✅ 后台管理系统页面已成功加载！</p>
        <div class="mt-4 space-y-2">
          <p>• 页面可以正常访问</p>
          <p>• 无侧边栏导航</p>
          <p>• 独立的后台界面</p>
        </div>
        <button 
          @click="goBack"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>