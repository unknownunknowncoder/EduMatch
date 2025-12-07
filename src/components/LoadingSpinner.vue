<template>
  <div 
    class="flex items-center justify-center"
    :class="[
      size === 'small' ? 'p-4' : size === 'large' ? 'p-8' : 'p-6',
      fullscreen ? 'fixed inset-0 bg-[#1a3c34]/80 backdrop-blur-sm z-50' : ''
    ]"
  >
    <div class="flex flex-col items-center space-y-4">
      <!-- 加载圆环 -->
      <div 
        class="relative"
        :class="[
          size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
        ]"
      >
        <div 
          class="absolute inset-0 border-2 border-[#d4c5a3]/20 border-t-[#1a3c34] rounded-full animate-spin"
          :class="[
            color === 'primary' ? 'border-t-[#1a3c34]' : 
            color === 'success' ? 'border-t-[#1a3c34]' : 
            color === 'warning' ? 'border-t-[#d4c5a3]' : 
            color === 'error' ? 'border-t-[#b03e3e]' : 
            'border-t-[#1a3c34]'
          ]"
        ></div>
        <div 
          class="absolute inset-0 border-2 border-[#d4c5a3]/30 border-t-transparent rounded-full animate-pulse"
          :class="size === 'large' ? 'border-4' : 'border-2'"
        ></div>
      </div>
      
      <!-- 加载文本 -->
      <div v-if="text" class="text-center">
        <p 
          class="text-sm font-serif font-medium animate-pulse"
          :class="[
            color === 'primary' ? 'text-[#1a3c34]' : 
            color === 'success' ? 'text-[#1a3c34]' : 
            color === 'warning' ? 'text-[#d4c5a3]' : 
            color === 'error' ? 'text-[#b03e3e]' : 
            'text-[#1a3c34]'
          ]"
        >
          {{ text }}
        </p>
        <p v-if="subText" class="text-xs text-[#1a3c34]/60 font-serif mt-1 italic">
          {{ subText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  subText?: string
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'success' | 'warning' | 'error' | 'forest' // 深林主题专用
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'forest',
  fullscreen: false
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>