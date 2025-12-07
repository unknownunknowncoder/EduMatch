<template>
  <div :class="containerClasses">
    <!-- 总计信息 -->
    <div v-if="showInfo" class="text-sm text-gray-600 mb-4">
      显示第 {{ startItem }} - {{ endItem }} 条，共 {{ total }} 条记录
    </div>
    
    <!-- 分页控件 -->
    <div :class="paginationClasses">
      <!-- 上一页按钮 -->
      <button
        @click="goToPrev"
        :disabled="currentPage <= 1 || disabled"
        :class="navButtonClasses"
      >
        <component :is="prevIcon" :class="iconClasses" />
        <span v-if="showLabels">上一页</span>
      </button>
      
      <!-- 页码列表 -->
      <div class="flex items-center space-x-1">
        <!-- 第一页 -->
        <button
          v-if="showFirstLast && currentPage > 2"
          @click="goToPage(1)"
          :class="pageButtonClasses"
        >
          1
        </button>
        
        <!-- 省略号 -->
        <span
          v-if="showFirstLast && currentPage > 3"
          class="px-3 py-2 text-gray-400"
        >
          ...
        </span>
        
        <!-- 页码按钮 -->
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="[
              page === currentPage ? activePageClasses : pageButtonClasses
            ]"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="px-3 py-2 text-gray-400"
          >
            ...
          </span>
        </template>
        
        <!-- 省略号 -->
        <span
          v-if="showFirstLast && currentPage < totalPages - 2"
          class="px-3 py-2 text-gray-400"
        >
          ...
        </span>
        
        <!-- 最后一页 -->
        <button
          v-if="showFirstLast && currentPage < totalPages - 1"
          @click="goToPage(totalPages)"
          :class="pageButtonClasses"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <!-- 下一页按钮 -->
      <button
        @click="goToNext"
        :disabled="currentPage >= totalPages || disabled"
        :class="navButtonClasses"
      >
        <span v-if="showLabels">下一页</span>
        <component :is="nextIcon" :class="iconClasses" />
      </button>
    </div>
    
    <!-- 页面大小选择器 -->
    <div v-if="showPageSize" class="flex items-center space-x-2 mt-4">
      <span class="text-sm text-gray-600">每页显示</span>
      <select
        :value="pageSize"
        @change="handlePageSizeChange"
        :disabled="disabled"
        class="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option
          v-for="size in pageSizeOptions"
          :key="size"
          :value="size"
        >
          {{ size }}
        </option>
      </select>
      <span class="text-sm text-gray-600">条</span>
    </div>
    
    <!-- 跳转输入框 -->
    <div v-if="showJumpTo" class="flex items-center space-x-2 mt-4">
      <span class="text-sm text-gray-600">跳转至</span>
      <input
        :value="jumpToPage"
        @input="handleJumpInput"
        @keyup.enter="handleJump"
        type="number"
        :min="1"
        :max="totalPages"
        :disabled="disabled"
        class="w-20 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <span class="text-sm text-gray-600">页</span>
      <button
        @click="handleJump"
        :disabled="disabled || !isValidJumpPage"
        class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        跳转
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  total: number
  currentPage: number
  pageSize: number
  disabled?: boolean
  showInfo?: boolean
  showLabels?: boolean
  showFirstLast?: boolean
  showPageSize?: boolean
  showJumpTo?: boolean
  pageSizeOptions?: number[]
  maxVisiblePages?: number
  size?: 'small' | 'medium' | 'large'
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showInfo: true,
  showLabels: false,
  showFirstLast: true,
  showPageSize: false,
  showJumpTo: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  maxVisiblePages: 5,
  size: 'medium',
  align: 'center'
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

const jumpToPage = ref('')

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const startItem = computed(() => {
  return props.total === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = props.maxVisiblePages
  const total = totalPages.value
  const current = props.currentPage
  
  if (total <= maxVisible) {
    // 总页数少于最大显示页数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 计算显示范围
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, start + maxVisible - 1)
    
    // 调整范围，确保显示足够的页码
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const isValidJumpPage = computed(() => {
  const page = parseInt(jumpToPage.value)
  return !isNaN(page) && page >= 1 && page <= totalPages.value
})

const containerClasses = computed(() => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  return alignClasses[props.align]
})

const paginationClasses = computed(() => {
  const sizeClasses = {
    small: 'space-x-1',
    medium: 'space-x-1',
    large: 'space-x-2'
  }
  
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }
  
  return ['flex items-center', sizeClasses[props.size], alignClasses[props.align]]
})

const navButtonClasses = computed(() => {
  const baseClasses = [
    'flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  ]
  
  const sizeClasses = {
    small: ['px-2 py-1 text-xs'],
    medium: ['px-3 py-2 text-sm'],
    large: ['px-4 py-3 text-base']
  }
  
  const stateClasses = props.disabled ? 
    ['bg-gray-50 text-gray-400 cursor-not-allowed'] :
    ['bg-white text-gray-700 hover:bg-gray-50 cursor-pointer']
  
  return [...baseClasses, ...sizeClasses[props.size], ...stateClasses]
})

const pageButtonClasses = computed(() => {
  const sizeClasses = {
    small: ['px-2 py-1 text-xs min-w-[2rem]'],
    medium: ['px-3 py-2 text-sm min-w-[2.5rem]'],
    large: ['px-4 py-3 text-base min-w-[3rem]']
  }
  
  return [
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer',
    ...sizeClasses[props.size]
  ]
})

const activePageClasses = computed(() => {
  const sizeClasses = {
    small: ['px-2 py-1 text-xs min-w-[2rem]'],
    medium: ['px-3 py-2 text-sm min-w-[2.5rem]'],
    large: ['px-4 py-3 text-base min-w-[3rem]']
  }
  
  return [
    'border border-blue-500 bg-blue-500 text-white rounded-md cursor-pointer',
    ...sizeClasses[props.size]
  ]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  return sizeClasses[props.size]
})

const prevIcon = computed(() => ChevronLeft)
const nextIcon = computed(() => ChevronRight)

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage || props.disabled) {
    return
  }
  
  emit('update:currentPage', page)
  emit('page-change', page)
}

const goToPrev = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.currentPage < totalPages.value) {
    goToPage(props.currentPage + 1)
  }
}

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newPageSize = parseInt(target.value)
  
  emit('update:pageSize', newPageSize)
  emit('page-size-change', newPageSize)
  
  // 重置到第一页
  goToPage(1)
}

const handleJumpInput = (event: Event) => {
  jumpToPage.value = (event.target as HTMLInputElement).value
}

const handleJump = () => {
  if (isValidJumpPage.value) {
    const page = parseInt(jumpToPage.value)
    goToPage(page)
    jumpToPage.value = ''
  }
}

// 监听当前页变化，清空跳转输入
watch(() => props.currentPage, () => {
  jumpToPage.value = ''
})
</script>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-start {
  justify-content: flex-start;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: flex-end;
}

.space-x-1 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.25rem;
}

.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.5rem;
}

.space-x-1 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.25rem;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.min-w-2rem {
  min-width: 2rem;
}

.min-w-2\.5rem {
  min-width: 2.5rem;
}

.min-w-3rem {
  min-width: 3rem;
}

.w-20 {
  width: 5rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: rgb(209 213 219);
}

.border-blue-500 {
  border-color: rgb(59 130 246);
}

.rounded-md {
  border-radius: 0.375rem;
}

.bg-white {
  background-color: rgb(255 255 255);
}

.bg-gray-50 {
  background-color: rgb(249 250 251);
}

.bg-blue-500 {
  background-color: rgb(59 130 246);
}

.text-gray-400 {
  color: rgb(156 163 175);
}

.text-gray-600 {
  color: rgb(75 85 99);
}

.text-gray-700 {
  color: rgb(55 65 81);
}

.text-white {
  color: rgb(255 255 255);
}

.hover\:bg-gray-50:hover {
  background-color: rgb(249 250 251);
}

.hover\:bg-blue-700:hover {
  background-color: rgb(29 78 216);
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

.focus\:border-transparent:focus {
  border-color: transparent;
}
</style>