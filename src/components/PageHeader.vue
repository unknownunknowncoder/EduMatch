<template>
  <div :class="headerClasses">
    <!-- 背景装饰 -->
    <div 
      v-if="showBackground"
      class="absolute inset-0"
      :class="backgroundClasses"
    >
      <img 
        v-if="backgroundImage"
        :src="backgroundImage"
        :alt="title"
        class="w-full h-full object-cover"
      />
    </div>
    
    <!-- 渐变遮罩 -->
    <div 
      v-if="showBackground || backgroundImage"
      class="absolute inset-0"
      :class="overlayClasses"
    ></div>
    
    <!-- 内容 -->
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto" :class="paddingClasses">
        <!-- 面包屑导航 -->
        <nav v-if="breadcrumbs.length > 0" class="mb-4">
          <ol class="flex items-center space-x-2 text-sm">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
              <component
                :is="crumb.to ? 'router-link' : 'span'"
                :to="crumb.to"
                :class="[
                  'transition-colors',
                  crumb.to ? 'hover:text-current/80 cursor-pointer' : 'text-current/60',
                  index === breadcrumbs.length - 1 ? 'text-current font-medium' : 'text-current/60'
                ]"
              >
                {{ crumb.label }}
              </component>
              <ChevronRight 
                v-if="index < breadcrumbs.length - 1" 
                class="w-4 h-4 text-current/40 mx-1" 
              />
            </li>
          </ol>
        </nav>
        
        <!-- 头部内容 -->
        <div :class="contentLayoutClasses">
          <!-- 左侧：标题和描述 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <!-- 徽章 -->
              <span 
                v-if="badge"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="badgeClasses"
              >
                {{ badge }}
              </span>
              
              <!-- 标签 -->
              <span 
                v-for="tag in tags" 
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded text-xs"
                :class="tagClasses"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- 标题 -->
            <h1 
              class="font-serif font-bold leading-tight mb-2"
              :class="titleClasses"
            >
              {{ title }}
            </h1>
            
            <!-- 副标题 -->
            <h2 
              v-if="subtitle"
              class="mb-3 font-serif"
              :class="subtitleClasses"
            >
              {{ subtitle }}
            </h2>
            
            <!-- 描述 -->
            <p 
              v-if="description"
              class="mb-4 leading-relaxed font-serif"
              :class="descriptionClasses"
            >
              {{ description }}
            </p>
            
            <!-- 操作按钮 -->
            <div v-if="$slots.actions" class="flex flex-wrap gap-2">
              <slot name="actions"></slot>
            </div>
          </div>
          
          <!-- 右侧：图标或其他内容 -->
          <div 
            v-if="$slots.right || icon"
            class="flex-shrink-0 ml-6"
            :class="rightSideClasses"
          >
            <slot name="right">
              <div 
                v-if="icon"
                class="flex items-center justify-center rounded-2xl"
                :class="iconContainerClasses"
              >
                <component :is="icon" :class="iconSizeClasses" />
              </div>
            </slot>
          </div>
        </div>
        
        <!-- 底部统计信息 -->
        <div v-if="$slots.stats" class="mt-6 pt-6 border-t border-current/10">
          <slot name="stats"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

interface Breadcrumb {
  label: string
  to?: string
}

interface Props {
  title: string
  subtitle?: string
  description?: string
  badge?: string
  tags?: string[]
  icon?: any
  backgroundImage?: string
  variant?: 'default' | 'primary' | 'secondary' | 'gradient' | 'minimal'
  size?: 'small' | 'medium' | 'large'
  breadcrumbs?: Breadcrumb[]
  showBackground?: boolean
  textAlign?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  breadcrumbs: () => [],
  showBackground: false,
  textAlign: 'left'
})

const headerClasses = computed(() => {
  const baseClasses = ['relative overflow-hidden']
  
  const variantClasses = {
    default: ['bg-[#f4f1ea] border-b border-[#d4c5a3]/30 text-[#1a3c34]'],
    forest: ['bg-[#1a3c34] text-[#f4f1ea]'],
    secondary: ['bg-[#f4f1ea] text-[#1a3c34] border border-[#d4c5a3]/50'],
    gradient: ['bg-gradient-to-r from-[#1a3c34] to-[#244838] text-[#f4f1ea]'],
    minimal: ['bg-[#f4f1ea] text-[#1a3c34] border-b border-[#d4c5a3]/20']
  }
  
  const sizeClasses = {
    small: ['py-8'],
    medium: ['py-12'],
    large: ['py-16']
  }
  
  return [...baseClasses, ...variantClasses[props.variant], ...sizeClasses[props.size]]
})

const backgroundClasses = computed(() => {
  if (props.backgroundImage) {
    return ['absolute inset-0']
  }
  
  const backgroundVariants = {
    default: [],
    primary: [],
    secondary: [],
    gradient: [],
    minimal: []
  }
  
  return backgroundVariants[props.variant]
})

const overlayClasses = computed(() => {
  const overlayVariants = {
    default: [],
    primary: [],
    secondary: [],
    gradient: [],
    minimal: []
  }
  
  return overlayVariants[props.variant]
})

const paddingClasses = computed(() => {
  const sizeClasses = {
    small: 'px-4 sm:px-6 lg:px-8',
    medium: 'px-6 sm:px-8 lg:px-12',
    large: 'px-8 sm:px-12 lg:px-16'
  }
  
  return sizeClasses[props.size]
})

const contentLayoutClasses = computed(() => {
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const baseClasses = ['flex items-start', textAlignClasses[props.textAlign]]
  
  if (props.textAlign === 'center') {
    return [...baseClasses, 'justify-center']
  } else if (props.textAlign === 'right') {
    return [...baseClasses, 'flex-row-reverse']
  }
  
  return baseClasses
})

const rightSideClasses = computed(() => {
  if (props.textAlign === 'center') {
    return 'mt-4 ml-0'
  } else if (props.textAlign === 'right') {
    return 'mr-6 ml-0'
  }
  return 'ml-6'
})

const titleClasses = computed(() => {
  const sizeClasses = {
    small: 'text-2xl sm:text-3xl',
    medium: 'text-3xl sm:text-4xl',
    large: 'text-4xl sm:text-5xl lg:text-6xl'
  }
  
  return sizeClasses[props.size]
})

const subtitleClasses = computed(() => {
  const sizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  }
  
  return [...sizeClasses[props.size], 'opacity-80']
})

const descriptionClasses = computed(() => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  
  return [...sizeClasses[props.size], 'opacity-70 max-w-3xl']
})

  const badgeClasses = computed(() => {
  const badgeVariants = {
    default: ['bg-[#1a3c34]/10 text-[#1a3c34] border border-[#1a3c34]/20'],
    forest: ['bg-[#f4f1ea]/20 text-[#f4f1ea]'],
    secondary: ['bg-[#d4c5a3]/10 text-[#1a3c34] border border-[#d4c5a3]/30'],
    gradient: ['bg-[#f4f1ea]/10 text-[#f4f1ea]'],
    minimal: ['bg-[#d4c5a3]/20 text-[#1a3c34] border border-[#d4c5a3]/30']
  }
  
  return badgeVariants[props.variant]
})

const tagClasses = computed(() => {
  const tagVariants = {
    default: ['bg-gray-100 text-gray-700'],
    primary: ['bg-white/10 text-white/80'],
    secondary: ['bg-gray-200 text-gray-600'],
    gradient: ['bg-white/10 text-white/80'],
    minimal: ['bg-white text-gray-600 border border-gray-300']
  }
  
  return tagVariants[props.variant]
})

const iconContainerClasses = computed(() => {
  const iconVariants = {
    default: ['bg-gray-100 text-gray-600'],
    primary: ['bg-white/20 text-white'],
    secondary: ['bg-gray-200 text-gray-700'],
    gradient: ['bg-white/20 text-white'],
    minimal: ['bg-white text-gray-600 border border-gray-300']
  }
  
  return [...iconVariants[props.variant], 'w-16 h-16']
})

const iconSizeClasses = computed(() => {
  return 'w-8 h-8'
})
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-10 {
  z-index: 10;
}

.max-w-7xl {
  max-width: 80rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.min-w-0 {
  min-width: 0;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.overflow-hidden {
  overflow: hidden;
}

.object-cover {
  object-fit: cover;
}
</style>