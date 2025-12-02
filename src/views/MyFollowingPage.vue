<template>
  <div class="min-h-screen bg-[#F3F4F6] font-sans text-slate-800 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 返回按钮 -->
      <button 
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft class="w-5 h-5" />
        返回个人中心
      </button>

      <!-- 页面标题 -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <h1 class="text-2xl font-bold text-slate-900 mb-2">我的关注</h1>
        <p class="text-slate-600">共关注 {{ totalCount }} 位用户</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="n in 5" :key="n" class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-slate-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-200 w-32 rounded mb-2"></div>
              <div class="h-3 bg-slate-200 w-48 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="followingList.length === 0" class="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
        <Users class="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-slate-900 mb-2">还没有关注任何人</h3>
        <p class="text-slate-500 mb-6">去社区发现有趣的用户，关注他们吧！</p>
        <button 
          @click="$router.push('/community')"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          前往社区
        </button>
      </div>

      <!-- 关注列表 -->
      <div v-else class="space-y-4">
        <div 
          v-for="item in followingList" 
          :key="item.id"
          class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- 用户头像 -->
              <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User class="w-6 h-6 text-indigo-600" />
              </div>
              
              <!-- 用户信息 -->
              <div>
                <h3 class="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer" @click="goToUserProfile(item.user.id)">
                  {{ item.user.nickname || item.user.username || `用户${item.user.id.slice(0, 8)}` }}
                </h3>
                <p class="text-sm text-slate-500">
                  关注于 {{ formatDate(item.created_at) }}
                </p>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex items-center gap-3">
              <button 
                @click="unfollowUser(item.user.id)"
                class="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消关注
              </button>
              <button 
                @click="viewUserPosts(item.user.id)"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                查看动态
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button 
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="px-4 py-2 text-sm text-slate-600">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabaseService } from '@/services/supabase'
import { showToast } from '@/utils/message'
import { ChevronLeft, ChevronRight, User, Users } from 'lucide-vue-next'

const router = useRouter()

const isLoading = ref(true)
const followingList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const totalPages = ref(0)

// 获取关注列表
const loadFollowingList = async () => {
  try {
    isLoading.value = true
    
    // 获取当前用户ID
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) {
      router.push('/login')
      return
    }

    // 获取关注列表
    const data = await supabaseService.getFollowingList(currentUser.id, {
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    })

    followingList.value = data

    // 获取总数（这里简化处理，实际应该单独查询总数）
    totalCount.value = data.length + ((currentPage.value - 1) * pageSize.value)
    totalPages.value = Math.ceil(totalCount.value / pageSize.value)

  } catch (error) {
    console.error('获取关注列表失败:', error)
    showToast('获取关注列表失败', 'error')
  } finally {
    isLoading.value = false
  }
}

// 取消关注
const unfollowUser = async (followingId: string) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.id) return

    // 确保 ID 为字符串类型
    const followerId = currentUser.id.toString()
    const targetFollowingId = followingId.toString()

    await supabaseService.unfollowUser(followerId, targetFollowingId)
    
    // 重新加载列表
    await loadFollowingList()
    
    showToast('已取消关注', 'success')
  } catch (error) {
    console.error('取消关注失败:', error)
    showToast('取消关注失败', 'error')
  }
}

// 跳转到用户主页
const goToUserProfile = (userId: string) => {
  router.push(`/user/${userId}`)
}

// 查看用户动态
const viewUserPosts = (userId: string) => {
  router.push(`/user/${userId}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadFollowingList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadFollowingList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 返回个人中心
const goBack = () => {
  router.push('/profile')
}

onMounted(() => {
  loadFollowingList()
})
</script>