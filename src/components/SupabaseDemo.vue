<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
      Supabase 数据库测试
    </h3>
    
    <!-- 连接状态 -->
    <div class="mb-6 p-4 rounded-lg" :class="statusBgClass">
      <p class="font-medium">{{ statusText }}</p>
    </div>
    
    <!-- 测试按钮 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        @click="testConnection"
        :disabled="loading"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        {{ loading ? '测试中...' : '测试连接' }}
      </button>
      
      <button
        @click="fetchResources"
        :disabled="loading"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        {{ loading ? '获取中...' : '获取资源' }}
      </button>
    </div>
    
    <!-- 结果显示 -->
    <div v-if="resources.length > 0" class="space-y-4">
      <h4 class="font-semibold text-gray-900 dark:text-white">资源列表 ({{ resources.length }})</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="resource in resources"
          :key="resource.id"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <h5 class="font-medium text-gray-900 dark:text-white">{{ resource.title }}</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ resource.description }}</p>
          <div class="flex items-center mt-2 space-x-4">
            <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
              {{ resource.category }}
            </span>
            <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
              {{ resource.difficulty }}
            </span>
            <span class="text-xs text-gray-500">⭐ {{ resource.rating }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
      <p class="font-medium">错误: {{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { supabaseService } from '@/services/supabase'

const dbStore = useDatabaseStore()

// 响应式数据
const loading = ref(false)
const resources = ref<any[]>([])
const error = ref<string | null>(null)

// 计算属性
const statusText = computed(() => {
  if (!dbStore.isConnected) return '未连接'
  if (dbStore.isConnecting) return '连接中'
  if (dbStore.hasError) return '连接错误'
  return '已连接'
})

const statusBgClass = computed(() => {
  if (!dbStore.isConnected) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  if (dbStore.isConnecting) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  if (dbStore.hasError) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
})

// 测试连接
const testConnection = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 重新连接数据库
    await dbStore.reconnect()
    console.log('连接状态:', dbStore.isConnected)
    
    if (!dbStore.isConnected) {
      error.value = 'Supabase未配置或连接失败，请检查环境变量'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '连接测试失败'
  } finally {
    loading.value = false
  }
}

// 获取资源
const fetchResources = async () => {
  loading.value = true
  error.value = null
  
  try {
    resources.value = await supabaseService.getResources({ limit: 10 })
    console.log('获取到的资源:', resources.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取资源失败'
  } finally {
    loading.value = false
  }
}
</script>