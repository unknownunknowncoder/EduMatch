<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">扣子API配置检查</h3>
    
    <div v-if="configStatus.configured" class="text-green-600 dark:text-green-400 mb-4">
      ✅ 扣子API配置正确，可以使用AI推荐功能
    </div>
    
    <div v-else class="text-red-600 dark:text-red-400 mb-4">
      ❌ 扣子API配置不完整，缺少：{{ configStatus.missing.join('、') }}
    </div>
    
    <div class="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm">
      <h4 class="font-semibold mb-2">配置说明：</h4>
      <ol class="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
        <li>复制 <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">.env.example</code> 为 <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">.env.local</code></li>
        <li>填入扣子API Token和Bot ID</li>
        <li>重启开发服务 <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">npm run dev</code></li>
        <li>刷新页面重新检查配置</li>
      </ol>
    </div>
    
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <p>环境变量：</p>
      <ul class="list-disc list-inside">
        <li>VITE_COZE_API_TOKEN: {{ apiToken ? '已设置' : '未设置' }}</li>
        <li>VITE_COZE_BOT_ID: {{ botId ? '已设置' : '未设置' }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cozeAPIService } from '@/services/coze-api'

const configStatus = ref({ configured: false, missing: [] as string[] })
const apiToken = ref('')
const botId = ref('')

onMounted(() => {
  configStatus.value = cozeAPIService.getConfigStatus()
  const apiTokenValue = import.meta.env.VITE_COZE_API_TOKEN
  const botIdValue = import.meta.env.VITE_COZE_BOT_ID
  apiToken.value = apiTokenValue ? '已配置' : '未配置'
  botId.value = botIdValue ? '已配置' : '未配置'
})
</script>