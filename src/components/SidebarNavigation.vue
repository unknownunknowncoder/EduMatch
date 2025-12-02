<template>
  <aside class="hidden md:block fixed left-0 top-0 w-64 h-screen bg-gray-900 text-gray-100 shadow-sm border-r border-gray-800 overflow-y-auto">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-white mb-8">EduMatch</h1>
      
      <!-- 导航菜单 -->
      <nav class="space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
          :class="{ 'bg-gray-800 text-white': $route.path === item.path }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
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