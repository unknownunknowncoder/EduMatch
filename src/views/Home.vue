<template>
  <div class="p-6 md:p-8">





      <!-- 大标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          学配智联平台
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          智能匹配您的学习需求，发现最适合的学习资源
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="mb-12">
        <div class="max-w-3xl mx-auto">
          <div class="relative">
            <Search class="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="搜索您感兴趣的学习资源、课程、文章..."
              @click="navigateToSearch"
              class="w-full pl-14 pr-6 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
          </div>
          <p class="text-center mt-4 text-gray-500 dark:text-gray-400">
            🔍 点击搜索框，开启您的学习之旅
          </p>
        </div>
      </div>

      <!-- 平台特色标签 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- 智能匹配 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <BookOpen class="h-8 w-8 text-blue-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">智能匹配</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            基于AI算法精准推荐最适合您的学习资源，让学习更高效
          </p>
        </div>

        <!-- 海量资源 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <PlusCircle class="h-8 w-8 text-green-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">海量资源</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            涵盖各领域的优质学习资料，从基础入门到高级进阶全覆盖
          </p>
        </div>



        <!-- 社区互动 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
          <div class="flex items-center mb-4">
            <BarChart3 class="h-8 w-8 text-orange-500 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">社区互动</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            与学习者交流分享，在互助社区中共同成长进步
          </p>
        </div>
      </div>

      <!-- 推荐资源 -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">推荐资源</h3>
          <button
            @click="navigateTo('/search')"
            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            查看全部
          </button>
        </div>

        <!-- 空状态：不显示任何模拟数据 -->
        <div class="text-center py-12">
          <BookOpen class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">暂无推荐资源</p>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  BookOpen, 
  PlusCircle, 
  BarChart3,
  Search
} from 'lucide-vue-next'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToSearch = () => {
  router.push('/search')
}
</script>