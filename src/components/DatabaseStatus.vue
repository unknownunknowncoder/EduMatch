<template>
  <div class="fixed top-4 right-4 z-[100]">
    <div
      :class="[
        'px-4 py-2 rounded-sm shadow-xl flex items-center gap-3 transition-all duration-300 border-l-4 backdrop-blur-md',
        statusClasses[connection.status]
      ]"
    >
      <!-- 图标指示器 -->
      <div class="relative flex items-center justify-center">
        <component :is="statusIcon[connection.status]" class="w-4 h-4" />
        <!-- 呼吸灯效果 (仅连接中) -->
        <span v-if="connection.status === ConnectionStatus.CONNECTING" class="absolute inset-0 rounded-full bg-current opacity-30 animate-ping"></span>
      </div>
      
      <!-- 文本信息 (Monospace Typewriter Style) -->
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
           <span class="text-[10px] font-bold uppercase tracking-widest font-mono leading-none">
             {{ isSupabaseConfigured() ? statusText[connection.status] : 'Config Missing' }}
           </span>
        </div>
        <!-- 数据库类型 -->
        <span class="text-[9px] opacity-60 font-mono uppercase tracking-wider mt-0.5">
           System: {{ dbConfig.type }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { connection } from '@/services/database'
import { dbConfig, ConnectionStatus, isSupabaseConfigured } from '@/config/database'
import { Database, Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-vue-next'

// 状态样式配置 (Deep Forest Theme)
// 已连接: 墨绿边框 + 白底
// 连接中: 金色边框 + 浅黄底
// 错误: 红边框 + 浅红底
const statusClasses = {
  [ConnectionStatus.CONNECTED]: 'bg-white border-[#1a3c34] text-[#1a3c34] shadow-[#1a3c34]/10',
  [ConnectionStatus.CONNECTING]: 'bg-[#fffdf5] border-[#d4c5a3] text-[#8c734b] shadow-[#d4c5a3]/10',
  [ConnectionStatus.DISCONNECTED]: 'bg-[#f3f4f6] border-slate-400 text-slate-500',
  [ConnectionStatus.ERROR]: 'bg-[#fff5f5] border-[#b03e3e] text-[#b03e3e] shadow-[#b03e3e]/10'
}

// 状态图标映射
const statusIcon = {
  [ConnectionStatus.CONNECTED]: Wifi,
  [ConnectionStatus.CONNECTING]: RefreshCw, // 使用旋转图标
  [ConnectionStatus.DISCONNECTED]: WifiOff,
  [ConnectionStatus.ERROR]: AlertTriangle
}

// 状态文字 (英文/学术风)
const statusText = {
  [ConnectionStatus.CONNECTED]: 'System Online',
  [ConnectionStatus.CONNECTING]: 'Connecting...',
  [ConnectionStatus.DISCONNECTED]: 'Offline',
  [ConnectionStatus.ERROR]: `Error: ${connection.error || 'Unknown'}`
}
</script>

<style scoped>
/* 旋转动画用于连接中状态 */
.lucide-refresh-cw {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>