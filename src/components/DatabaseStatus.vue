<template>
  <div class="fixed top-4 right-4 z-50">
    <div
      :class="[
        'px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm',
        statusClasses[connection.status]
      ]"
    >
      <!-- 连接状态图标 -->
      <div class="w-2 h-2 rounded-full" :class="statusDotClasses[connection.status]"></div>
      
      <!-- 状态文字 -->
      <span v-if="isSupabaseConfigured()">{{ statusText[connection.status] }}</span>
      <span v-else class="text-yellow-600">未配置</span>
      
      <!-- 数据库类型 -->
      <span class="text-xs opacity-75">({{ dbConfig.type }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { connection } from '@/services/database'
import { dbConfig, ConnectionStatus, isSupabaseConfigured } from '@/config/database'

// 状态样式
const statusClasses = {
  [ConnectionStatus.CONNECTED]: 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20',
  [ConnectionStatus.CONNECTING]: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/20',
  [ConnectionStatus.DISCONNECTED]: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-500/20',
  [ConnectionStatus.ERROR]: 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
}

// 状态点样式
const statusDotClasses = {
  [ConnectionStatus.CONNECTED]: 'bg-green-500',
  [ConnectionStatus.CONNECTING]: 'bg-yellow-500 animate-pulse',
  [ConnectionStatus.DISCONNECTED]: 'bg-gray-500',
  [ConnectionStatus.ERROR]: 'bg-red-500'
}

// 状态文字
const statusText = {
  [ConnectionStatus.CONNECTED]: '已连接',
  [ConnectionStatus.CONNECTING]: '连接中',
  [ConnectionStatus.DISCONNECTED]: '未连接',
  [ConnectionStatus.ERROR]: `错误: ${connection.error || '未知错误'}`
}
</script>

<style scoped>
/* 组件样式 */
</style>