<template>
  <div :class="containerClasses">
    <!-- 搜索容器 -->
    <div :class="wrapperClasses">
      <!-- 搜索图标 -->
      <div :class="iconContainerClasses">
        <component 
          :is="searchIcon" 
          :class="iconClasses" 
        />
      </div>
      
      <!-- 输入框 -->
      <input
        ref="inputRef"
        v-model="searchQuery"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @keyup.esc="handleClear"
        @focus="handleFocus"
        @blur="handleBlur"
        :class="inputClasses"
      />
      
      <!-- 清除按钮 -->
      <transition name="fade">
        <button
          v-if="clearable && searchQuery && !disabled"
          @click="handleClear"
          :class="clearButtonClasses"
        >
          <component :is="clearIcon" :class="clearIconClasses" />
        </button>
      </transition>
      
      <!-- 加载指示器 -->
      <div v-if="loading" :class="loadingClasses">
        <component :is="loadingIcon" :class="loadingIconClasses" />
      </div>
      
      <!-- 搜索按钮 -->
      <button
        v-if="showSearchButton"
        @click="handleSearch"
        :disabled="disabled || !searchQuery.trim()"
        :class="searchButtonClasses"
      >
        <component :is="searchButtonIcon" :class="searchButtonIconClasses" />
        <span v-if="searchButtonText">{{ searchButtonText }}</span>
      </button>
    </div>
    
    <!-- 搜索建议下拉框 -->
    <transition name="dropdown">
      <div
        v-if="showSuggestions && suggestions.length > 0"
        :class="suggestionsClasses"
      >
        <!-- 建议列表 -->
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id || index"
          @click="selectSuggestion(suggestion)"
          :class="[
            'px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50',
            highlightedIndex === index ? 'bg-gray-50' : ''
          ]"
        >
          <!-- 建议项内容 -->
          <div class="flex items-center gap-3">
            <!-- 建议图标 -->
            <component 
              :is="suggestionIcon" 
              v-if="suggestion.icon"
              :class="suggestionItemIconClasses"
            />
            
            <!-- 建议文本 -->
            <div class="flex-1 min-w-0">
              <div 
                class="font-medium text-gray-900 truncate"
                v-html="highlightMatch(suggestion.title || suggestion.text || suggestion)"
              />
              <div 
                v-if="suggestion.description"
                class="text-sm text-gray-500 truncate"
                v-html="highlightMatch(suggestion.description)"
              />
            </div>
            
            <!-- 类型标签 -->
            <span 
              v-if="suggestion.type"
              class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
              :class="suggestionTypeClasses(suggestion.type)"
            >
              {{ suggestion.type }}
            </span>
          </div>
        </div>
        
        <!-- 无结果提示 -->
        <div
          v-if="suggestions.length === 0 && searchQuery"
          class="px-4 py-8 text-center text-gray-500"
        >
          <component :is="noResultsIcon" :class="noResultsIconClasses" />
          <p class="mt-2 text-sm">未找到相关结果</p>
        </div>
      </div>
    </transition>
    
    <!-- 快捷标签 -->
    <div v-if="quickTags.length > 0" class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="tag in quickTags"
        :key="tag"
        @click="selectTag(tag)"
        :class="quickTagClasses"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { 
  Search, 
  X, 
  Loader2, 
  Clock, 
  Hash,
  FileText,
  User,
  Package
} from 'lucide-vue-next'

interface Suggestion {
  id?: string
  title?: string
  text?: string
  description?: string
  type?: string
  icon?: any
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  loading?: boolean
  showSearchButton?: boolean
  searchButtonText?: string
  suggestions?: Suggestion[]
  quickTags?: string[]
  debounceTime?: number
  maxlength?: number
  inputType?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'filled' | 'outlined'
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  disabled: false,
  readonly: false,
  clearable: true,
  loading: false,
  showSearchButton: false,
  suggestions: () => [],
  quickTags: () => [],
  debounceTime: 300,
  maxlength: undefined,
  inputType: 'text',
  size: 'medium',
  variant: 'default',
  autoFocus: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  'select-suggestion': [suggestion: Suggestion]
  'select-tag': [tag: string]
}>()

const inputRef = ref<HTMLInputElement>()
const searchQuery = ref(props.modelValue || '')
const isFocused = ref(false)
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)

let debounceTimer: NodeJS.Timeout | null = null

const containerClasses = computed(() => {
  return 'relative w-full'
})

const wrapperClasses = computed(() => {
  const baseClasses = ['relative flex items-center transition-all']
  
  const variantClasses = {
    default: ['border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'],
    filled: ['bg-gray-100 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 border-2 border-transparent'],
    outlined: ['border-2 border-gray-300 bg-white focus-within:border-blue-500']
  }
  
  const sizeClasses = {
    small: ['rounded-md'],
    medium: ['rounded-lg'],
    large: ['rounded-xl']
  }
  
  const stateClasses = props.disabled ? ['opacity-50 cursor-not-allowed'] : ['cursor-text']
  
  return [...baseClasses, ...variantClasses[props.variant], ...sizeClasses[props.size], ...stateClasses]
})

const iconContainerClasses = computed(() => {
  const sizeClasses = {
    small: 'pl-3',
    medium: 'pl-4',
    large: 'pl-5'
  }
  
  return sizeClasses[props.size]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }
  
  return [...sizeClasses[props.size], 'text-gray-400']
})

const inputClasses = computed(() => {
  const baseClasses = [
    'flex-1 bg-transparent border-0 outline-none placeholder-gray-500 text-gray-900'
  ]
  
  const sizeClasses = {
    small: ['text-sm py-2 px-3'],
    medium: ['text-base py-2.5 px-4'],
    large: ['text-lg py-3 px-5']
  }
  
  const paddingClasses = props.clearable ? 'pr-10' : 'pr-4'
  
  return [...baseClasses, ...sizeClasses[props.size], paddingClasses]
})

const clearButtonClasses = computed(() => {
  return [
    'absolute right-3 text-gray-400 hover:text-gray-600 transition-colors',
    props.size === 'small' ? 'top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'
  ]
})

const clearIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  return sizeClasses[props.size]
})

const loadingClasses = computed(() => {
  return [
    'absolute right-3',
    props.size === 'small' ? 'top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2'
  ]
})

const loadingIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  return [...sizeClasses[props.size], 'text-gray-400 animate-spin']
})

const searchButtonClasses = computed(() => {
  const baseClasses = [
    'ml-2 flex items-center gap-2 bg-blue-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  ]
  
  const sizeClasses = {
    small: ['px-2 py-1.5 text-xs'],
    medium: ['px-3 py-2 text-sm'],
    large: ['px-4 py-2.5 text-base']
  }
  
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700'
  
  return [...baseClasses, ...sizeClasses[props.size], disabledClasses]
})

const searchButtonIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  return sizeClasses[props.size]
})

const suggestionsClasses = computed(() => {
  const sizeClasses = {
    small: 'mt-1 rounded-md shadow-lg',
    medium: 'mt-2 rounded-lg shadow-xl',
    large: 'mt-2 rounded-xl shadow-xl'
  }
  
  return [
    'absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 max-h-60 overflow-y-auto',
    ...sizeClasses[props.size]
  ]
})

const suggestionItemIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }
  
  return [...sizeClasses[props.size], 'text-gray-400 flex-shrink-0']
})

const noResultsIconClasses = computed(() => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }
  
  return [...sizeClasses[props.size], 'text-gray-400 mx-auto']
})

const quickTagClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors'
  ]
  
  const variantClasses = {
    default: ['bg-gray-100 text-gray-700 hover:bg-gray-200'],
    primary: ['bg-blue-100 text-blue-700 hover:bg-blue-200'],
    secondary: ['bg-gray-200 text-gray-600 hover:bg-gray-300']
  }
  
  return [...baseClasses, ...variantClasses.default]
})

const searchIcon = computed(() => Search)
const clearIcon = computed(() => X)
const loadingIcon = computed(() => Loader2)
const searchButtonIcon = computed(() => Search)
const suggestionIcon = computed(() => FileText)
const noResultsIcon = computed(() => Search)

const suggestionTypeClasses = (type: string) => {
  const typeMap: Record<string, string> = {
    user: 'bg-purple-100 text-purple-700',
    product: 'bg-blue-100 text-blue-700',
    article: 'bg-green-100 text-green-700',
    default: 'bg-gray-100 text-gray-700'
  }
  
  return typeMap[type] || typeMap.default
}

const highlightMatch = (text: string) => {
  if (!searchQuery.value.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  emit('update:modelValue', value)
  
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounceTime)
  
  showSuggestions.value = value.length > 0
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    showSuggestions.value = false
  }
}

const handleClear = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
  showSuggestions.value = false
  emit('search', '')
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  // 延迟隐藏建议，以便点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
  emit('blur', event)
}

const selectSuggestion = (suggestion: Suggestion) => {
  searchQuery.value = suggestion.title || suggestion.text || ''
  emit('update:modelValue', searchQuery.value)
  emit('select-suggestion', suggestion)
  showSuggestions.value = false
}

const selectTag = (tag: string) => {
  emit('select-tag', tag)
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// 监听外部modelValue变化
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue || ''
})

// 自动聚焦
if (props.autoFocus) {
  nextTick(() => {
    inputRef.value?.focus()
  })
}
</script>

<style scoped>
.mark {
  background-color: rgb(254 240 138);
  padding: 0 2px;
  border-radius: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.font-medium {
  font-weight: 500;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-full {
  border-radius: 9999px;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>