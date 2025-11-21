<template>
  <aside class="hidden md:block fixed left-0 top-0 w-64 h-screen bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">EduMatch</h1>
      
      <!-- 导航菜单 -->
      <nav class="space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === item.path }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3 group-hover:text-blue-500" />
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>


    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { 
  Home, 
  PlusCircle, 
  Users, 
  User, 
  BookOpen, 
  History,
  Heart,
  Calendar
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()




const navigationItems = [
  {
    name: '首页',
    path: '/',
    icon: Home
  },
  {
    name: '创建资源',
    path: '/create-resource',
    icon: PlusCircle
  },
  {
    name: '学习社区',
    path: '/community',
    icon: Users
  },
  {
    name: '学习记录',
    path: '/history',
    icon: History
  },
  {
    name: '点赞收藏',
    path: '/liked',
    icon: Heart
  },
  {
    name: '学习计划',
    path: '/study-plan',
    icon: Calendar
  },
  {
    name: '个人中心',
    path: '/profile',
    icon: User
  }
]


</script>