<template>
  <div class="space-y-6">
    <!-- 搜索和筛选 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索用户名、昵称..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <button
          @click="loadUsers"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ isLoading ? '加载中...' : '刷新' }}
        </button>
      </div>
      
      <!-- 调试信息 -->
      <div v-if="isLoading || users.length === 0" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>
            {{ isLoading ? '正在从数据库加载用户数据...' : `当前已加载 ${users.length} 个用户` }}
          </span>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                用户信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                联系方式
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                注册时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isLoading" class="text-center py-8">
              <td colspan="5" class="text-gray-500 dark:text-gray-400">
                <div class="flex items-center justify-center space-x-2">
                  <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>加载中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0" class="text-center py-8">
              <td colspan="5" class="text-gray-500 dark:text-gray-400">
                暂无用户数据
              </td>
            </tr>
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400 font-medium">
                        {{ user.nickname?.charAt(0) || user.username?.charAt(0) || 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.nickname || user.username }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      @{{ user.username }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  <div v-if="user.email" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {{ user.email }}
                  </div>
                  <div v-else class="text-gray-400">未设置</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(user.created_at) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getUserStatusClass(user)">
                  {{ getUserStatusText(user) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewUserDetail(user)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                >
                  详情
                </button>
                <button
                  @click="suspendUser(user)"
                  class="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                >
                  {{ user.status === 'suspended' ? '激活' : '注销' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredUsers.length) }} 条，共 {{ filteredUsers.length }} 条
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white"
            >
              首页
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white"
            >
              上一页
            </button>
            
            <!-- 页数跳转 -->
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-700 dark:text-gray-300">跳转到</span>
              <input
                v-model.number="jumpPage"
                type="number"
                :min="1"
                :max="totalPages"
                class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                @input="validateJumpPage"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">页</span>
              <button
                @click="jumpToPage"
                :disabled="!isValidJumpPage || jumpPage === currentPage"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                跳转
              </button>
            </div>
            
            <span class="px-3 py-1 text-sm dark:text-white">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white"
            >
              下一页
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white"
            >
              末页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详情弹窗 -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">用户详情</h2>
            <button
              @click="selectedUser = null"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">基本信息</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
                  <p class="text-gray-900 dark:text-white">{{ selectedUser.username }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">昵称</label>
                  <p class="text-gray-900 dark:text-white">{{ selectedUser.nickname || '未设置' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">邮箱</label>
                  <p class="text-gray-900 dark:text-white">{{ selectedUser.email || '未设置' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">个人签名</label>
                  <p class="text-gray-900 dark:text-white whitespace-pre-wrap">{{ selectedUser.bio || '这个人很懒，还没有写个人签名~' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">活动统计</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">注册时间</label>
                  <p class="text-gray-900 dark:text-white">{{ formatDate(selectedUser.created_at) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">最后更新</label>
                  <p class="text-gray-900 dark:text-white">{{ formatDate(selectedUser.updated_at) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">账户状态</label>
                  <span :class="getUserStatusClass(selectedUser)">
                    {{ getUserStatusText(selectedUser) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { useDatabaseStore } from '@/stores/database'
import { showToast } from '@/utils/message'

const router = useRouter()

interface User {
  id: string
  username: string
  nickname?: string
  email?: string
  bio?: string
  avatar_url?: string
  status: 'active' | 'suspended' | 'deleted'
  created_at: string
  updated_at: string
}

const dbStore = useDatabaseStore()

const users = ref<User[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const jumpPage = ref(1)
const selectedUser = ref<User | null>(null)

// 定义 emits
const emit = defineEmits(['showConfirm', 'refresh'])

// 计算过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username?.toLowerCase().includes(query) ||
    user.nickname?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  )
})

// 计算分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value)
})

// 验证跳转页数是否有效
const isValidJumpPage = computed(() => {
  const page = jumpPage.value
  return Number.isInteger(page) && page >= 1 && page <= totalPages.value && page !== currentPage.value
})

// 获取用户状态样式
const getUserStatusClass = (user: User) => {
  const statusMap = {
    'active': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'suspended': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'deleted': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }
  return statusMap[user.status] || statusMap.active
}

// 获取用户状态文本
const getUserStatusText = (user: User) => {
  const statusMap = {
    'active': '正常',
    'suspended': '已注销',
    'deleted': '已删除'
  }
  return statusMap[user.status] || '未知'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '日期错误'
  }
}

// 加载用户列表
const loadUsers = async () => {
  isLoading.value = true
  try {
    console.log('🔄 开始加载用户列表...')
    
    // 首先确保数据库连接已初始化
    await dbStore.reconnect()
    
    const client = await dbStore.getClient()
    if (!client) {
      console.error('❌ 数据库客户端获取失败')
      showToast('数据库连接失败', 'error')
      return
    }

    console.log('✅ 数据库客户端获取成功，开始查询用户数据')
    
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 查询用户数据失败:', error)
      throw error
    }

    console.log('✅ 用户数据加载成功，共', data?.length || 0, '个用户')
    users.value = data || []
    
    if (users.value.length === 0) {
      console.warn('⚠️ 用户列表为空，可能数据库中没有用户数据')
    }
  } catch (error) {
    console.error('❌ 加载用户列表失败:', error)
    showToast('加载用户列表失败: ' + (error.message || '未知错误'), 'error')
  } finally {
    isLoading.value = false
  }
}

// 查看用户详情
const viewUserDetail = (user: User) => {
  // 跳转到用户详情页面
  router.push(`/admin/user/${user.id}`)
}

// 注销用户
const suspendUser = async (user: User) => {
  // 如果用户已经是注销状态，则执行激活操作
  if (user.status === 'suspended') {
    emit('showConfirm', {
      title: '激活用户',
      message: `确定要激活用户 "${user.nickname || user.username}" 吗？`,
      confirmText: '确认激活',
      cancelText: '取消',
      type: 'info',
      callback: async () => {
        try {
          const client = await dbStore.getClient()
          if (!client) {
            showToast('数据库连接失败', 'error')
            return
          }

          const { error } = await client
            .from('users')
            .update({ 
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

          if (error) {
            throw error
          }

          // 更新本地状态
          const index = users.value.findIndex(u => u.id === user.id)
          if (index > -1) {
            users.value[index].status = 'active'
          }

          showToast('用户激活成功', 'success')
        } catch (error) {
          console.error('激活用户失败:', error)
          showToast('激活用户失败', 'error')
        }
      }
    })
  } else {
    // 注销用户 - 删除用户数据
    emit('showConfirm', {
      title: '注销用户',
      message: `确认要注销用户 "${user.nickname || user.username}" 吗？`,
      confirmText: '确认注销',
      cancelText: '取消',
      type: 'warning',
      callback: async () => {
        try {
          const client = await dbStore.getClient()
          if (!client) {
            showToast('数据库连接失败', 'error')
            return
          }

          // 级联删除用户相关数据
          console.log('🔄 开始级联删除用户数据，用户ID:', user.id)
          
          // 1. 删除用户创建的资源
          const { error: resourcesError } = await client
            .from('resources')
            .delete()
            .eq('created_by', user.id)
          
          if (resourcesError) {
            console.error('❌ 删除用户资源失败:', resourcesError)
          } else {
            console.log('✅ 用户资源删除成功')
          }
          
          // 2. 删除用户的帖子
          const { error: postsError } = await client
            .from('community_posts')
            .delete()
            .eq('user_id', user.id)
          
          if (postsError) {
            console.error('❌ 删除用户帖子失败:', postsError)
          } else {
            console.log('✅ 用户帖子删除成功')
          }
          
          // 3. 删除用户的学习计划
          const { error: plansError } = await client
            .from('study_plans')
            .delete()
            .eq('user_id', user.id)
          
          if (plansError) {
            console.error('❌ 删除用户学习计划失败:', plansError)
          } else {
            console.log('✅ 用户学习计划删除成功')
          }
          
          // 4. 删除学习计划打卡记录
          const { error: checkinsError } = await client
            .from('study_plan_checkins')
            .delete()
            .eq('user_id', user.id)
          
          if (checkinsError) {
            console.error('❌ 删除用户打卡记录失败:', checkinsError)
          } else {
            console.log('✅ 用户打卡记录删除成功')
          }
          
          // 5. 删除用户的评论
          const { error: commentsError } = await client
            .from('post_comments')
            .delete()
            .eq('user_id', user.id)
          
          if (commentsError) {
            console.error('❌ 删除用户评论失败:', commentsError)
          } else {
            console.log('✅ 用户评论删除成功')
          }
          
          // 6. 删除用户的点赞记录
          const { error: likesError } = await client
            .from('post_likes')
            .delete()
            .eq('user_id', user.id)
          
          if (likesError) {
            console.error('❌ 删除用户点赞记录失败:', likesError)
          } else {
            console.log('✅ 用户点赞记录删除成功')
          }
          
          // 7. 删除用户的收藏记录
          const { error: favoritesError } = await client
            .from('post_favorites')
            .delete()
            .eq('user_id', user.id)
          
          if (favoritesError) {
            console.error('❌ 删除用户收藏记录失败:', favoritesError)
          } else {
            console.log('✅ 用户收藏记录删除成功')
          }
          
          // 8. 最后删除用户
          console.log('🗑️ 删除用户记录...')
          const { error } = await client
            .from('users')
            .delete()
            .eq('id', user.id)

          if (error) {
            throw error
          }
          
          console.log('✅ 用户删除成功')

          // 从本地列表中移除
          const index = users.value.findIndex(u => u.id === user.id)
          if (index > -1) {
            users.value.splice(index, 1)
          }

          // 如果删除的是当前查看的用户，关闭详情弹窗
          if (selectedUser.value?.id === user.id) {
            selectedUser.value = null
          }

          showToast('用户注销成功', 'success')
        } catch (error) {
          console.error('注销用户失败:', error)
          showToast('注销用户失败', 'error')
        }
      }
    })
  }
}



// 监听搜索变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})

// 验证跳转页数
const validateJumpPage = () => {
  const page = jumpPage.value
  if (page < 1) {
    jumpPage.value = 1
  } else if (page > totalPages.value) {
    jumpPage.value = totalPages.value
  }
  // 限制为整数
  if (!Number.isInteger(page)) {
    jumpPage.value = Math.floor(page)
  }
}

// 跳转到指定页面
const jumpToPage = () => {
  if (isValidJumpPage.value) {
    currentPage.value = jumpPage.value
  }
}

// 组件挂载时加载用户列表
onMounted(() => {
  loadUsers()
})
</script>