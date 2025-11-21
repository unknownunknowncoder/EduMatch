<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
    <div class="grid grid-cols-5 gap-1">
      <!-- 首页 -->
      <router-link
        to="/"
        class="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span class="text-xs mt-1">首页</span>
      </router-link>

      <!-- 搜索 -->
      <router-link
        to="/search"
        class="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/search' }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <span class="text-xs mt-1">搜索</span>
      </router-link>

      <!-- 创建资源 -->
      <router-link
        to="/create-resource"
        class="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/create-resource' }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span class="text-xs mt-1">创建</span>
      </router-link>

      <!-- 社区 -->
      <router-link
        to="/community"
        class="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/community' }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <span class="text-xs mt-1">社区</span>
      </router-link>

      <!-- 个人中心 -->
      <router-link
        to="/profile"
        class="flex flex-col items-center py-2 px-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/profile' }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span class="text-xs mt-1">我的</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 底部导航组件，不需要额外的逻辑
</script>