<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
        
        <!-- 昵称编辑 -->
        <div class="mb-4" v-if="editType === 'nickname'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            昵称
          </label>
          <input 
            v-model="nicknameValue"
            type="text" 
            placeholder="请输入新昵称"
            maxlength="20"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
          <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ nicknameValue.length }}/20
          </div>
        </div>

        <!-- 个人签名编辑 -->
        <div class="mb-4" v-if="editType === 'bio'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            个人签名
          </label>
          <textarea
            v-model="bioValue"
            rows="3"
            maxlength="200"
            placeholder="向大家简单介绍一下自己~"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          ></textarea>
          <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
            {{ bioValue.length }}/200
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
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          :disabled="isConfirmDisabled"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  title?: string
  editType: 'nickname' | 'bio'
  initialValue?: string
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '编辑信息',
  confirmText: '保存'
})

const emit = defineEmits<{
  confirm: [value: string]
  cancel: []
}>()

const visible = ref(false)
const nicknameValue = ref('')
const bioValue = ref('')

const isConfirmDisabled = computed(() => {
  if (props.editType === 'nickname') {
    return !nicknameValue.value.trim()
  }
  if (props.editType === 'bio') {
    return bioValue.value.trim() === props.initialValue
  }
  return false
})

// 监听编辑类型变化，重置表单值
watch(() => props.editType, (newType) => {
  if (newType === 'nickname') {
    nicknameValue.value = props.initialValue || ''
  } else if (newType === 'bio') {
    bioValue.value = props.initialValue || ''
  }
}, { immediate: true })

const show = () => {
  visible.value = true
  // 重置表单值
  if (props.editType === 'nickname') {
    nicknameValue.value = props.initialValue || ''
  } else if (props.editType === 'bio') {
    bioValue.value = props.initialValue || ''
  }
}

const hide = () => {
  visible.value = false
}

const handleConfirm = () => {
  const value = props.editType === 'nickname' ? nicknameValue.value.trim() : bioValue.value.trim()
  emit('confirm', value)
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