<template>
  <transition name="fade">
    <div v-if="visible" class="relative">
      <!-- 成功提示框 -->
      <div 
        class="rounded-sm border p-4 shadow-sm border-t-2"
        :class="[
          type === 'success' ? 'bg-[#f4f1ea] border-[#1a3c34] text-[#1a3c34]' : 
          type === 'complete' ? 'bg-[#f4f1ea] border-[#1a3c34] text-[#1a3c34]' :
          type === 'achievement' ? 'bg-[#f4f1ea] border-[#d4c5a3] text-[#1a3c34]' :
          'bg-[#f4f1ea] border-[#1a3c34] text-[#1a3c34]',
          size === 'small' ? 'p-3 text-sm' : size === 'large' ? 'p-5 text-base' : 'p-4 text-sm'
        ]"
      >
        <!-- 头部区域 -->
        <div class="flex items-start gap-3">
          <!-- 图标 -->
          <div 
            class="flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-sm border"
            :class="[
              type === 'success' ? 'bg-[#1a3c34]/10 border-[#1a3c34]/30 text-[#1a3c34]' : 
              type === 'complete' ? 'bg-[#1a3c34]/10 border-[#1a3c34]/30 text-[#1a3c34]' :
              type === 'achievement' ? 'bg-[#d4c5a3]/10 border-[#d4c5a3]/30 text-[#d4c5a3]' :
              'bg-[#1a3c34]/10 border-[#1a3c34]/30 text-[#1a3c34]'
            ]"
          >
            <CheckCircle 
              v-if="type === 'success' || type === 'complete'" 
              :class="size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'"
            />
            <Award 
              v-else-if="type === 'achievement'"
              :class="size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'"
            />
            <Check 
              v-else 
              :class="size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'"
            />
          </div>
          
          <!-- 内容区域 -->
          <div class="flex-1 min-w-0">
            <!-- 标题 -->
            <h3 
              v-if="title" 
              class="font-serif font-bold mb-1"
              :class="size === 'small' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-sm'"
            >
              {{ title }}
            </h3>
            
            <!-- 主要消息 -->
            <p 
              class="leading-relaxed font-serif"
              :class="size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-sm'"
            >
              {{ message }}
            </p>
            
            <!-- 详细信息 -->
            <p 
              v-if="details" 
              class="mt-2 text-xs opacity-60 font-serif italic"
              :class="size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'"
            >
              {{ details }}
            </p>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            v-if="closable"
            @click="close"
            class="flex-shrink-0 p-1 rounded-sm hover:bg-[#1a3c34]/10 transition-colors"
            :class="[
              type === 'success' ? 'text-[#1a3c34]/60 hover:text-[#1a3c34]' : 
              type === 'complete' ? 'text-[#1a3c34]/60 hover:text-[#1a3c34]' :
              type === 'achievement' ? 'text-[#d4c5a3]/60 hover:text-[#d4c5a3]' :
              'text-[#1a3c34]/60 hover:text-[#1a3c34]'
            ]"
          >
            <X :class="size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4'" />
          </button>
        </div>
        
        <!-- 操作按钮区域 -->
        <div v-if="$slots.actions" class="mt-3 pt-3 border-t border-current/20">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircle, Check, Award, X } from 'lucide-vue-next'

interface Props {
  message?: string
  title?: string
  details?: string
  type?: 'success' | 'complete' | 'achievement' | 'forest' // 深林主题
  size?: 'small' | 'medium' | 'large'
  closable?: boolean
  duration?: number // 自动关闭时间（毫秒），0表示不自动关闭
}

const props = withDefaults(defineProps<Props>(), {
  type: 'forest',
  size: 'medium',
  closable: true,
  duration: 3000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)
let timer: NodeJS.Timeout | null = null

const close = () => {
  visible.value = false
  emit('close')
}

const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>