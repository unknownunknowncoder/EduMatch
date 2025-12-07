<template>
  <div 
    :class="cn(
      'h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 group',
      'border-2 border-dashed border-[#1a3c34]/10 hover:border-[#1a3c34]/30',
      'bg-[#f9f9f7] hover:bg-[#1a3c34]/5',
      'rounded-sm relative overflow-hidden'
    )" 
    @click="handleClick"
  >
    <!-- 装饰性背景水印 -->
    <Ghost class="absolute -right-8 -bottom-8 w-40 h-40 text-[#1a3c34]/5 -z-0 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />

    <!-- 核心图标 -->
    <div class="w-16 h-16 bg-[#1a3c34]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1a3c34] group-hover:text-[#d4c5a3] transition-colors duration-300 relative z-10">
      <Inbox class="w-8 h-8 text-[#1a3c34]/40 group-hover:text-[#d4c5a3] transition-colors" />
    </div>

    <!-- 文本内容 -->
    <div class="relative z-10 space-y-2">
      <h3 class="text-xl font-serif font-bold text-[#1a3c34] group-hover:text-[#1a3c34] transition-colors">
        The Archive is Empty
      </h3>
      <p class="text-[#1a3c34]/60 font-serif italic text-sm max-w-xs mx-auto">
        No manuscripts or records found in this section.
      </p>
    </div>

    <!-- 伪装成印章的按钮提示 -->
    <div class="mt-8 px-6 py-2 border border-[#1a3c34]/20 text-[#1a3c34]/60 text-[10px] font-bold uppercase tracking-widest rounded-sm group-hover:bg-[#1a3c34] group-hover:text-[#d4c5a3] group-hover:border-[#1a3c34] transition-all relative z-10">
      Click to Initialize
    </div>

  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import { Inbox, Ghost } from 'lucide-vue-next'

const handleClick = () => {
  // 使用符合主题的 Toast 文案
  toast.success('Feature Request Logged', {
    description: 'This section is currently under development.',
    style: {
      background: '#f2f0e9',
      border: '1px solid #1a3c34',
      color: '#1a3c34',
      fontFamily: 'serif'
    }
  })
}
</script>

<style scoped>
/* 确保父容器有高度时，组件能撑开 */
:host {
  display: block;
  height: 100%;
}
</style>