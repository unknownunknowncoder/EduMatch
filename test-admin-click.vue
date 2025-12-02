<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-2xl font-bold mb-6">测试页面</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">用户列表</h2>
      
      <div v-if="loading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2">加载中...</p>
      </div>
      
      <div v-else>
        <div v-for="user in users" :key="user.id" 
             class="border-b border-gray-200 py-3 cursor-pointer hover:bg-gray-50"
             @click="toggleUser(user.id)">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium">{{ user.nickname || '未设置昵称' }}</h3>
              <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-2">{{ user.created_at }}</span>
              <svg class="w-4 h-4 text-gray-400" :class="{'rotate-180': expandedUsers.includes(user.id)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <div v-if="expandedUsers.includes(user.id)" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium mb-2">用户详情</h4>
            <p><strong>角色:</strong> {{ user.role || '普通用户' }}</p>
            <p><strong>状态:</strong> {{ user.email_confirmed_at ? '已激活' : '未激活' }}</p>
            <p><strong>个性签名:</strong> {{ user.bio || '暂无' }}</p>
            
            <div class="mt-4">
              <h5 class="font-medium mb-2">用户帖子 ({{ userPosts[user.id]?.length || 0 }})</h5>
              <div v-if="loadingPosts[user.id]" class="text-center py-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
              </div>
              <div v-else-if="userPosts[user.id]?.length > 0" class="space-y-2">
                <div v-for="post in userPosts[user.id]" :key="post.id" class="p-2 bg-white rounded border">
                  <h6 class="font-medium text-sm">{{ post.title }}</h6>
                  <p class="text-xs text-gray-500">{{ post.created_at }} ❤️{{ post.likes_count || 0 }}</p>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">暂无帖子</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button @click="loadUsers" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      刷新用户
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDatabaseStore } from '@/stores/database'

interface User {
  id: string
  nickname?: string
  role?: string
  email_confirmed_at?: string
  bio?: string
  created_at: string
}

interface Post {
  id: string
  title: string
  created_at: string
  likes_count?: number
}

const dbStore = useDatabaseStore()

const loading = ref(false)
const users = ref<User[]>([])
const expandedUsers = ref<string[]>([])
const userPosts = ref<Record<string, Post[]>>({})
const loadingPosts = ref<Record<string, boolean>>({})

const loadUsers = async () => {
  loading.value = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('加载用户失败:', error)
    } else {
      users.value = data || []
      console.log('用户加载完成:', users.value.length, '条')
    }
  } catch (error) {
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleUser = async (userId: string) => {
  console.log('toggleUser called with:', userId)
  
  const index = expandedUsers.value.indexOf(userId)
  if (index > -1) {
    expandedUsers.value.splice(index, 1)
  } else {
    expandedUsers.value.push(userId)
    await loadUserPosts(userId)
  }
}

const loadUserPosts = async (userId: string) => {
  loadingPosts.value[userId] = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('加载用户帖子失败:', error)
    } else {
      userPosts.value[userId] = data || []
      console.log(`用户 ${userId} 帖子加载完成:`, userPosts.value[userId].length, '条')
    }
  } catch (error) {
    console.error('加载用户帖子失败:', error)
  } finally {
    loadingPosts.value[userId] = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>