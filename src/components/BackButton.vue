<template>
  <button
    @click="handleBack"
    :disabled="disabled"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <component 
      :is="icon" 
      :class="iconClasses" 
      v-if="icon"
    />
    <span v-if="showText">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  text?: string
  fallbackRoute?: string // 如果没有历史记录时的回退路由
  variant?: 'default' | 'ghost' | 'outline' | 'solid'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  showText?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  text: '返回',
  variant: 'ghost',
  size: 'medium',
  disabled: false,
  showText: true,
  icon: () => import('lucide-vue-next').then(mod => mod.ArrowLeft)
})

const emit = defineEmits<{
  click: []
  back: []
}>()

const router = useRouter()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
  ]
  
  const sizeClasses = props.size === 'small' ? 'px-2 py-1.5 text-xs' :
                       props.size === 'large' ? 'px-4 py-3 text-base' :
                       'px-3 py-2 text-sm'
  
  const variantClasses = {
    default: ['text-[#1a3c34] hover:bg-[#1a3c34]/10 focus:ring-[#1a3c34]'],
    ghost: ['text-[#1a3c34]/70 hover:bg-[#1a3c34]/10 focus:ring-[#1a3c34]'],
    outline: ['border border-[#d4c5a3]/30 text-[#1a3c34] hover:bg-[#f4f1ea] focus:ring-[#1a3c34]'],
    solid: ['bg-[#1a3c34] text-[#f4f1ea] hover:bg-[#244838] focus:ring-[#1a3c34]']
  }
  
  return [...baseClasses, ...sizeClasses, ...variantClasses[props.variant]]
})

const iconClasses = computed(() => {
  return props.size === 'small' ? 'w-3 h-3' :
         props.size === 'large' ? 'w-5 h-5' :
         'w-4 h-4'
})

const handleBack = () => {
  if (props.disabled) return
  
  emit('click')
  
  // 尝试使用浏览器历史记录回退
  if (window.history.length > 1) {
    router.back()
    emit('back')
  } else if (props.fallbackRoute) {
    router.push(props.fallbackRoute)
  } else {
    // 如果没有历史记录也没有回退路由，回到首页
    router.push('/')
  }
}
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:focus {
  outline: none;
}

button:disabled {
  transform: none !important;
}
</style>