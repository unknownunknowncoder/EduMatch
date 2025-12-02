<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ message }}</p>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {{ cancelText === '取消' ? '手滑了' : cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :class="confirmButtonClass"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认操作',
  confirmText: '确认',
  cancelText: '取消',
  type: 'info'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const visible = ref(false)

const confirmButtonClass = computed(() => {
  const baseClass = 'px-4 py-2 rounded-lg transition-colors font-medium'
  
  switch (props.type) {
    case 'danger':
      return `${baseClass} bg-red-600 hover:bg-red-700 text-white`
    case 'warning':
      return `${baseClass} bg-yellow-600 hover:bg-yellow-700 text-white`
    default:
      return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white`
  }
})

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm')
  hide()
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