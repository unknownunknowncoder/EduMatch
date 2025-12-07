<template>
  <div :class="containerClasses">
    <!-- 图标区域 -->
    <div class="flex justify-center mb-6">
      <div 
        class="flex items-center justify-center rounded-full"
        :class="iconContainerClasses"
      >
        <component 
          :is="icon" 
          :class="iconClasses" 
          v-if="icon"
        />
        <component 
          :is="defaultIcon" 
          :class="iconClasses" 
          v-else
        />
      </div>
    </div>
    
    <!-- 标题 -->
    <h3 
      class="text-center font-bold mb-2"
      :class="titleClasses"
    >
      {{ title }}
    </h3>
    
    <!-- 描述 -->
    <p 
      class="text-center leading-relaxed mb-6"
      :class="descriptionClasses"
    >
      {{ description }}
    </p>
    
    <!-- 操作按钮 -->
    <div class="flex justify-center">
      <slot name="actions">
        <button
          v-if="actionText && onAction"
          @click="onAction"
          :class="actionButtonClasses"
        >
          <component 
            :is="actionIcon" 
            :class="actionIconClasses" 
            v-if="actionIcon"
          />
          {{ actionText }}
        </button>
      </slot>
    </div>
    
    <!-- 额外内容 -->
    <div v-if="$slots.default" class="mt-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  FileX, 
  Inbox, 
  Search, 
  Users, 
  BookOpen, 
  MessageSquare,
  Package,
  FolderOpen,
  Database
} from 'lucide-vue-next'

interface Props {
  title?: string
  description?: string
  actionText?: string
  actionIcon?: any
  onAction?: () => void
  icon?: any
  variant?: 'default' | 'primary' | 'secondary' | 'muted'
  size?: 'small' | 'medium' | 'large'
  type?: 'empty' | 'search' | 'error' | 'no-data' | 'no-results' | 'no-connection'
}

const props = withDefaults(defineProps<Props>(), {
  title: '暂无内容',
  description: '这里还没有任何内容，稍后再来看看吧。',
  variant: 'default',
  size: 'medium',
  type: 'empty'
})

// 默认图标映射
const defaultIconMap = {
  empty: Inbox,
  search: Search,
  error: FileX,
  'no-data': Database,
  'no-results': Search,
  'no-connection': MessageSquare
}

const defaultTitleMap = {
  empty: '暂无内容',
  search: '没有搜索结果',
  error: '出现错误',
  'no-data': '暂无数据',
  'no-results': '未找到匹配结果',
  'no-connection': '连接失败'
}

const defaultDescriptionMap = {
  empty: '这里还没有任何内容，稍后再来看看吧。',
  search: '尝试调整搜索关键词或筛选条件。',
  error: '抱歉，加载内容时出现了问题，请稍后重试。',
  'no-data': '系统暂无可用数据，请稍后再试。',
  'no-results': '没有找到匹配的内容，请尝试其他搜索词。',
  'no-connection': '无法连接到服务器，请检查网络连接后重试。'
}

const defaultIcon = computed(() => {
  return props.icon || defaultIconMap[props.type]
})

const displayTitle = computed(() => {
  return props.title || defaultTitleMap[props.type]
})

const displayDescription = computed(() => {
  return props.description || defaultDescriptionMap[props.type]
})

const containerClasses = computed(() => {
  const baseClasses = ['flex flex-col items-center justify-center text-center']
  
  const sizeClasses = {
    small: ['py-8 px-4'],
    medium: ['py-12 px-6'],
    large: ['py-16 px-8']
  }
  
  return [...baseClasses, ...sizeClasses[props.size]]
})

const iconContainerClasses = computed(() => {
  const variantClasses = {
    default: ['bg-gray-100 text-gray-400'],
    primary: ['bg-blue-100 text-blue-400'],
    secondary: ['bg-gray-100 text-gray-500'],
    muted: ['bg-gray-50 text-gray-300']
  }
  
  const sizeClasses = {
    small: ['w-12 h-12'],
    medium: ['w-16 h-16'],
    large: ['w-20 h-20']
  }
  
  return [...variantClasses[props.variant], ...sizeClasses[props.size]]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    small: ['w-6 h-6'],
    medium: ['w-8 h-8'],
    large: ['w-10 h-10']
  }
  
  return sizeClasses[props.size]
})

const titleClasses = computed(() => {
  const sizeClasses = {
    small: ['text-base'],
    medium: ['text-lg'],
    large: ['text-xl']
  }
  
  return [...sizeClasses[props.size], 'text-gray-900']
})

const descriptionClasses = computed(() => {
  const sizeClasses = {
    small: ['text-sm'],
    medium: ['text-base'],
    large: ['text-lg']
  }
  
  return [...sizeClasses[props.size], 'text-gray-600 max-w-md']
})

const actionButtonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  ]
  
  const variantClasses = {
    default: ['bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'],
    primary: ['bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'],
    secondary: ['bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'],
    muted: ['bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500']
  }
  
  const sizeClasses = {
    small: ['px-3 py-1.5 text-xs'],
    medium: ['px-4 py-2 text-sm'],
    large: ['px-6 py-3 text-base']
  }
  
  return [...baseClasses, ...variantClasses[props.variant], ...sizeClasses[props.size]]
})

const actionIconClasses = computed(() => {
  const sizeClasses = {
    small: ['w-3 h-3'],
    medium: ['w-4 h-4'],
    large: ['w-5 h-5']
  }
  
  return sizeClasses[props.size]
})
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.inline-flex {
  display: inline-flex;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-md {
  border-radius: 0.375rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.gap-2 {
  gap: 0.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.w-12 {
  width: 3rem;
}

.h-12 {
  height: 3rem;
}

.w-16 {
  width: 4rem;
}

.h-16 {
  height: 4rem;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.w-3 {
  width: 0.75rem;
}

.h-3 {
  height: 0.75rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.leading-relaxed {
  line-height: 1.625;
}

.max-w-md {
  max-width: 28rem;
}

.bg-gray-50 {
  background-color: rgb(249 250 251);
}

.bg-gray-100 {
  background-color: rgb(243 244 246);
}

.bg-blue-100 {
  background-color: rgb(219 234 254);
}

.bg-gray-200 {
  background-color: rgb(229 231 235);
}

.bg-blue-600 {
  background-color: rgb(37 99 235);
}

.bg-gray-600 {
  background-color: rgb(75 85 99);
}

.text-gray-300 {
  color: rgb(209 213 219);
}

.text-gray-400 {
  color: rgb(156 163 175);
}

.text-gray-500 {
  color: rgb(107 114 128);
}

.text-gray-600 {
  color: rgb(75 85 99);
}

.text-gray-700 {
  color: rgb(55 65 81);
}

.text-gray-900 {
  color: rgb(17 24 39);
}

.text-blue-400 {
  color: rgb(96 165 250);
}

.text-white {
  color: rgb(255 255 255);
}

.hover\:bg-blue-700:hover {
  background-color: rgb(29 78 216);
}

.hover\:bg-gray-300:hover {
  background-color: rgb(209 213 219);
}

.hover\:bg-gray-700:hover {
  background-color: rgb(55 65 81);
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

.focus\:ring-gray-500:focus {
  --tw-ring-color: rgb(107 114 128);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>