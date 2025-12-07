<template>
  <div class="min-h-screen bg-[#f4f1ea] p-6">
    <div class="max-w-4xl mx-auto">
      <PageHeader
        title="Supabase 连接测试"
        description="测试数据库连接和表结构"
        :breadcrumbs="[
          { label: '首页', to: '/' },
          { label: '连接测试' }
        ]"
      />
      
      <div class="space-y-6">
        <!-- 连接状态卡片 -->
        <div class="bg-white rounded-sm border border-[#d4c5a3]/30 p-6">
          <h2 class="text-lg font-serif font-bold text-[#1a3c34] mb-4">连接状态</h2>
          
          <div v-if="loading" class="flex items-center gap-2">
            <LoadingSpinner size="small" />
            <span class="text-[#1a3c34]/70">正在测试连接...</span>
          </div>
          
          <div v-else-if="connectionStatus" class="space-y-2">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-3 h-3 rounded-full',
                connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              <span class="font-serif text-[#1a3c34]">
                {{ connectionStatus.connected ? '已连接' : '连接失败' }}
              </span>
            </div>
            <p v-if="connectionStatus.message" class="text-sm text-[#1a3c34]/60">
              {{ connectionStatus.message }}
            </p>
          </div>
          
          <div class="mt-4">
            <button
              @click="testConnection"
              :disabled="loading"
              class="px-4 py-2 bg-[#1a3c34] text-[#f4f1ea] rounded-sm font-serif hover:bg-[#244838] disabled:opacity-50"
            >
              重新测试连接
            </button>
          </div>
        </div>

        <!-- 表结构测试 -->
        <div class="bg-white rounded-sm border border-[#d4c5a3]/30 p-6">
          <h2 class="text-lg font-serif font-bold text-[#1a3c34] mb-4">数据库表结构</h2>
          
          <div v-if="tablesStatus" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="table in tablesStatus"
              :key="table.name"
              class="p-3 rounded-sm border text-center"
              :class="[
                table.exists 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              ]"
            >
              <div class="text-sm font-serif font-medium">{{ table.name }}</div>
              <div class="text-xs mt-1">
                {{ table.exists ? '✅ 存在' : '❌ 不存在' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 用户数据测试 -->
        <div class="bg-white rounded-sm border border-[#d4c5a3]/30 p-6">
          <h2 class="text-lg font-serif font-bold text-[#1a3c34] mb-4">用户数据测试</h2>
          
          <div v-if="userData" class="space-y-2">
            <p class="text-sm font-serif text-[#1a3c34]">找到 {{ userData.length }} 个用户:</p>
            <div class="space-y-1">
              <div
                v-for="user in userData.slice(0, 3)"
                :key="user.id"
                class="p-2 bg-[#f4f1ea] rounded-sm text-sm"
              >
                <span class="font-serif font-medium">{{ user.username }}</span>
                <span v-if="user.nickname" class="text-[#1a3c34]/60 ml-2">
                  ({{ user.nickname }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dbService } from '@/services/database'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

interface ConnectionStatus {
  connected: boolean
  message?: string
}

interface TableStatus {
  name: string
  exists: boolean
}

const loading = ref(false)
const connectionStatus = ref<ConnectionStatus | null>(null)
const tablesStatus = ref<TableStatus[] | null>(null)
const userData = ref<any[]>([])

const testConnection = async () => {
  loading.value = true
  
  try {
    // 测试基本连接
    const client = dbService.getClient()
    
    // 测试用户表查询
    const { data, error } = await client
      .from('users')
      .select('id, username, nickname')
      .limit(5)
    
    if (error) {
      connectionStatus.value = {
        connected: false,
        message: `查询失败: ${error.message}`
      }
    } else {
      connectionStatus.value = {
        connected: true,
        message: '连接正常，可以正常查询数据'
      }
      userData.value = data || []
    }
    
    // 测试各个表
    const tables = ['users', 'study_plans', 'community_posts', 'resources', 'comments']
    const tableResults: TableStatus[] = []
    
    for (const tableName of tables) {
      try {
        const { error } = await client
          .from(tableName)
          .select('id')
          .limit(1)
        
        tableResults.push({
          name: tableName,
          exists: !error
        })
      } catch (err) {
        tableResults.push({
          name: tableName,
          exists: false
        })
      }
    }
    
    tablesStatus.value = tableResults
    
  } catch (error: any) {
    connectionStatus.value = {
      connected: false,
      message: `连接失败: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  testConnection()
})
</script>