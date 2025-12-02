<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
        
        <!-- 关联帖子列表 -->
        <div v-if="relatedPosts && relatedPosts.length > 0" class="mt-4">
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              发现关联的帖子：
            </h4>
            <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li v-for="post in relatedPosts.slice(0, 3)" :key="post.id" class="flex items-center">
                <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ post.title }}
              </li>
              <li v-if="relatedPosts.length > 3" class="text-yellow-600 dark:text-yellow-400 italic">
                ...还有 {{ relatedPosts.length - 3 }} 个帖子
              </li>
            </ul>
          </div>
          
          <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              ⚠️ 删除选项
            </h4>
            <div class="space-y-2">
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="deleteOption"
                  type="radio"
                  value="cancel"
                  class="mt-1 mr-2"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">取消删除</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">保留资源，先去删除关联的帖子</p>
                </div>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="deleteOption"
                  type="radio"
                  value="resource_only"
                  class="mt-1 mr-2"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    仅删除资源
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ relatedPosts.length > 0 ? '删除资源，帖子中将显示"发布者已删除"' : '删除资源本身' }}
                  </p>
                </div>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="deleteOption"
                  type="radio"
                  value="cascade"
                  class="mt-1 mr-2"
                />
                <div>
                  <span class="text-sm font-medium text-red-700 dark:text-red-300">
                    级联删除
                  </span>
                  <p class="text-xs text-red-600 dark:text-red-400">
                    删除资源的同时删除所有关联的帖子（此操作不可恢复）
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          @click="handleConfirm"
          :class="confirmButtonClass"
          :disabled="!canConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface RelatedPost {
  id: string
  title: string
}

interface Props {
  title?: string
  message: string
  relatedPosts?: RelatedPost[]
  confirmText?: string
  type?: 'warning' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认删除',
  confirmText: '确认',
  type: 'warning'
})

const emit = defineEmits<{
  confirm: [option: string]
  cancel: []
}>()

const visible = ref(false)
const deleteOption = ref('cancel')

const confirmButtonClass = computed(() => {
  const baseClass = 'px-4 py-2 rounded-lg transition-colors font-medium'
  
  if (!canConfirm.value) {
    return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`
  }
  
  if (deleteOption.value === 'cascade') {
    return `${baseClass} bg-red-600 hover:bg-red-700 text-white`
  }
  
  return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`
})

const canConfirm = computed(() => {
  return deleteOption.value !== 'cancel'
})

const show = () => {
  visible.value = true
  // 根据是否有关联帖子设置默认选项
  if (props.relatedPosts && props.relatedPosts.length > 0) {
    deleteOption.value = 'cancel'
  } else {
    deleteOption.value = 'resource_only'
  }
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  if (canConfirm.value) {
    emit('confirm', deleteOption.value)
    hide()
  }
}

const handleCancel = () => {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide
})
</script>