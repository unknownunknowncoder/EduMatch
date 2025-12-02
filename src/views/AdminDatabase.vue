<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 弹窗提示 -->
    <div v-if="notification.show" 
         :class="[
           'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse',
           notification.type === 'success' ? 'bg-green-600 text-white' : 
           notification.type === 'error' ? 'bg-red-600 text-white' : 
           'bg-blue-600 text-white'
         ]">
      {{ notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️' }}
      {{ notification.message }}
    </div>
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">EduMatch 后台管理系统</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
              Admin Panel
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              管理员：{{ currentUser?.nickname || currentUser?.email || 'Admin' }}
            </div>
            <div class="text-sm text-gray-500">
              {{ currentTime }}
            </div>
            <button
              @click="logout"
              class="px-3 py-2 text-sm text-red-600 hover:text-red-900 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0v-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 10-6 0v1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">总用户数</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">总帖子数</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalPosts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">学习计划</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalPlans }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">学习资源</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalResources }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理功能区 -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center">
                <span class="w-4 h-4 mr-2 inline-flex items-center justify-center">
                  <!-- 用户管理图标 -->
                  <svg v-if="tab.id === 'users'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1m0 0a6 6 0 00-12 0v1m0 0V9a4 4 0 1112 0v-1m6 0a3 3 0 100-6 0v1m0 0a3 3 0 10-6 0v1"></path>
                  </svg>
                  <!-- 内容管理图标 -->
                  <svg v-else-if="tab.id === 'content'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <!-- 学习计划图标 -->
                  <svg v-else-if="tab.id === 'plans'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <!-- 资源管理图标 -->
                  <svg v-else-if="tab.id === 'resources'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </span>
                {{ tab.name }}
                <span v-if="tab.count" class="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                  {{ tab.count }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <!-- 标签页内容 -->
        <div class="p-6">
          <!-- 用户管理内容 -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">用户管理</h3>
              <button
                @click="loadUsers"
                :disabled="loading.users"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading.users ? '加载中...' : '刷新用户数据' }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">个性签名</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading.users">
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                      <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                        加载用户数据中...
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="users.length === 0">
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">暂无用户数据</td>
                  </tr>
                  <tr v-for="user in users" :key="user.id!" class="hover:bg-gray-50 transition-colors cursor-pointer" @click="viewUserDetail(user.id!)">
                    <td class="px-4 py-4">
                      <div class="flex items-center min-w-0">
                        <div class="flex-shrink-0 h-12 w-12">
                          <div
                            class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-200"
                          >
                            <span class="text-lg font-bold text-white">
                              {{ (user.nickname || 'U').charAt(0).toUpperCase() }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4 min-w-0 flex-1">
                          <div class="text-sm font-medium text-gray-900 truncate">{{ user.nickname || '未设置昵称' }}</div>
                          <div class="text-xs text-gray-500 truncate">ID: {{ user.id }}</div>
                          <div v-if="user.role" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1" 
                               :class="user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">
                            {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      <div class="text-sm text-gray-500">{{ formatTime(user.created_at) }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <div class="text-sm text-gray-500 max-w-xs truncate">{{ user.bio || '暂无个性签名' }}</div>
                    </td>
                    <td class="px-4 py-4">
                      <div class="flex items-center justify-between">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              :class="user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                          {{ user.email_confirmed_at ? '已激活' : '未激活' }}
                        </span>
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 内容管理内容 -->
          <div v-if="activeTab === 'content'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">内容管理</h3>
              <button
                @click="loadPosts"
                :disabled="loading.posts"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {{ loading.posts ? '加载中...' : '刷新帖子数据' }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">统计</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading.posts">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">加载帖子数据中...</td>
                  </tr>
                  <tr v-else-if="posts.length === 0">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">暂无帖子数据</td>
                  </tr>
                  <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ post.title }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ post.user_id }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {{ post.category || '其他' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        已发布
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      ❤️{{ post.likes_count || 0 }} 💬{{ post.comments_count || 0 }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ formatTime(post.created_at) }}</td>
                    <td class="px-6 py-4">
                      <button
                        @click.stop="handlePostDetailClick(post.id)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded hover:bg-gray-100 transition-colors"
                        title="查看详情"
                        style="cursor: pointer; pointer-events: auto;"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 学习计划管理内容 -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">学习计划管理</h3>
              <button
                @click="loadPlans"
                :disabled="loading.plans"
                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {{ loading.plans ? '加载中...' : '刷新计划数据' }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">计划标题</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建者</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进度</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间范围</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading.plans">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">加载计划数据中...</td>
                  </tr>
                  <tr v-else-if="plans.length === 0">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">暂无计划数据</td>
                  </tr>
                  <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ plan.title }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ plan.user_id }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-full max-w-xs">
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-sm font-medium text-gray-900">
                              {{ plan.progress || 0 }}%
                            </span>
                          </div>
                          <div class="w-full bg-gray-200 rounded-full h-2">
                            <div
                              class="bg-blue-600 h-2 rounded-full"
                              :style="{ width: `${plan.progress || 0}%` }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        进行中
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      {{ formatDate(plan.start_date) }} - {{ formatDate(plan.end_date) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ formatTime(plan.created_at) }}</td>
                    <td class="px-6 py-4">
                      <button
                        @click.stop="handlePlanDetailClick(plan.id)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded hover:bg-gray-100 transition-colors"
                        title="查看详情"
                        style="cursor: pointer; pointer-events: auto;"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 资源管理内容 -->
          <div v-if="activeTab === 'resources'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">资源管理</h3>
              <button
                @click="loadResources"
                :disabled="loading.resources"
                class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {{ loading.resources ? '加载中...' : '刷新资源数据' }}
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资源标题</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布者</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">统计</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">添加时间</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading.resources">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">加载资源数据中...</td>
                  </tr>
                  <tr v-else-if="resources.length === 0">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">暂无资源数据</td>
                  </tr>
                  <tr v-for="resource in resources" :key="resource.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ resource.title }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {{ getCategoryText(resource.category) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                        {{ getTypeText(resource.type) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ resource.user_id }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      ❤️{{ resource.likes_count || 0 }} 👁️{{ resource.views_count || 0 }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ formatTime(resource.created_at) }}</td>
                    <td class="px-6 py-4">
                      <button
                        @click.stop="handleResourceDetailClick(resource.id)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded hover:bg-gray-100 transition-colors"
                        title="查看详情"
                        style="cursor: pointer; pointer-events: auto;"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'

interface User {
  id: string
  email: string
  nickname?: string
  bio?: string
  avatar_url?: string
  created_at: string
  last_sign_in_at?: string
  phone?: string
  role?: string
  email_confirmed_at?: string
}

interface Post {
  id: string
  title: string
  user_id: string
  category?: string
  likes_count: number
  comments_count: number
  created_at: string
}

interface Plan {
  id: string
  title: string
  user_id: string
  progress?: number
  start_date: string
  end_date: string
  created_at: string
}

interface Resource {
  id: string
  title: string
  user_id: string
  category?: string
  type?: string
  likes_count: number
  views_count: number
  created_at: string
}

interface Stats {
  totalUsers: number
  totalPosts: number
  totalPlans: number
  totalResources: number
}

interface Tab {
  id: string
  name: string
  count?: number
}

interface CurrentUser {
  id: string
  nickname?: string
  email?: string
}

const router = useRouter()
const dbStore = useDatabaseStore()

const activeTab = ref('users')
const currentTime = ref('')
const stats = ref<Stats>({
  totalUsers: 0,
  totalPosts: 0,
  totalPlans: 0,
  totalResources: 0
})

const currentUser = ref<CurrentUser | null>(null)
const users = ref<User[]>([])
const posts = ref<Post[]>([])
const plans = ref<Plan[]>([])
const resources = ref<Resource[]>([])

const loading = ref({
  users: false,
  posts: false,
  plans: false,
  resources: false
})

// 弹窗提示系统
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
})

// 显示弹窗提示
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  // 3秒后自动隐藏
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const tabs = ref<Tab[]>([
  { id: 'users', name: '用户管理' },
  { id: 'content', name: '内容管理' },
  { id: 'plans', name: '学习计划' },
  { id: 'resources', name: '资源管理' }
])

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取当前用户信息
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      currentUser.value = JSON.parse(userStr)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const client = await dbStore.getClient()
    if (!client) {
      console.error('数据库连接失败')
      return
    }

    console.log('开始加载统计数据...')

    // 加载用户统计
    const { count: userCount, error: userError } = await client
      .from('users')
      .select('*', { count: 'exact', head: true })
    if (userError) console.error('用户统计加载失败:', userError)
    
    // 加载帖子统计
    const { count: postCount, error: postError } = await client
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
    if (postError) console.error('帖子统计加载失败:', postError)
    
    // 加载学习计划统计
    const { count: planCount, error: planError } = await client
      .from('study_plans')
      .select('*', { count: 'exact', head: true })
    if (planError) console.error('计划统计加载失败:', planError)
    
    // 加载资源统计
    const { count: resourceCount, error: resourceError } = await client
      .from('resources')
      .select('*', { count: 'exact', head: true })
    if (resourceError) console.error('资源统计加载失败:', resourceError)

    stats.value = {
      totalUsers: userCount || 0,
      totalPosts: postCount || 0,
      totalPlans: planCount || 0,
      totalResources: resourceCount || 0
    }

    // 更新标签计数
    tabs.value[0].count = stats.value.totalUsers
    tabs.value[1].count = stats.value.totalPosts
    tabs.value[2].count = stats.value.totalPlans
    tabs.value[3].count = stats.value.totalResources

    console.log('统计数据加载完成:', stats.value)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载用户数据
const loadUsers = async () => {
  loading.value.users = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    console.log('开始加载用户数据...')
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('加载用户数据失败:', error)
    } else {
      users.value = data || []
      console.log('用户数据加载完成:', users.value.length, '条记录')
      // 打印前几条用户数据用于调试
      if (users.value.length > 0) {
        console.log('用户样例数据:', users.value[0])
      }
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  } finally {
    loading.value.users = false
  }
}

// 加载帖子数据
const loadPosts = async () => {
  loading.value.posts = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    console.log('开始加载帖子数据...')
    const { data, error } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('加载帖子数据失败:', error)
    } else {
      posts.value = data || []
      console.log('帖子数据加载完成:', posts.value.length, '条记录')
    }
  } catch (error) {
    console.error('加载帖子数据失败:', error)
  } finally {
    loading.value.posts = false
  }
}

// 加载学习计划数据
const loadPlans = async () => {
  loading.value.plans = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    console.log('开始加载学习计划数据...')
    const { data, error } = await client
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('加载学习计划数据失败:', error)
    } else {
      plans.value = data || []
      console.log('学习计划数据加载完成:', plans.value.length, '条记录')
    }
  } catch (error) {
    console.error('加载学习计划数据失败:', error)
  } finally {
    loading.value.plans = false
  }
}

// 加载资源数据
const loadResources = async () => {
  loading.value.resources = true
  try {
    const client = await dbStore.getClient()
    if (!client) return

    console.log('开始加载资源数据...')
    const { data, error } = await client
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('加载资源数据失败:', error)
    } else {
      resources.value = data || []
      console.log('资源数据加载完成:', resources.value.length, '条记录')
    }
  } catch (error) {
    console.error('加载资源数据失败:', error)
  } finally {
    loading.value.resources = false
  }
}



// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取分类文本
const getCategoryText = (category?: string) => {
  switch (category) {
    case 'programming': return '编程'
    case 'design': return '设计'
    case 'language': return '语言学习'
    case 'business': return '商业'
    case 'science': return '科学'
    default: return '其他'
  }
}

// 获取类型文本
const getTypeText = (type?: string) => {
  switch (type) {
    case 'video': return '视频'
    case 'article': return '文章'
    case 'book': return '书籍'
    case 'course': return '课程'
    case 'tool': return '工具'
    case 'website': return '网站'
    default: return '其他'
  }
}

// 跳转到用户详情页面
const viewUserDetail = (userId: string) => {
  console.log('跳转到用户详情:', userId)
  router.push(`/admin/user/${userId}`)
}



// 查看帖子详情
const viewPost = (postId: string) => {
  console.log('查看帖子:', postId)
  // 这里可以实现跳转到帖子详情页面或弹出详情模态框
}

// 处理帖子详情点击
const handlePostDetailClick = (postId: string) => {
  console.log('🔍 帖子详情按钮被点击（后台管理），ID:', postId)
  
  if (!postId) {
    console.error('❌ 帖子ID为空')
    showNotification('错误：帖子ID为空', 'error')
    return
  }
  
  // 在新窗口中打开后台管理的帖子详情页面
  const url = `/admin/post/${postId}`
  console.log('🚀 即将在新窗口中打开后台管理详情:', url)
  
  try {
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      console.log('✅ 后台管理帖子详情页面打开成功')
    } else {
      console.log('❌ 新窗口打开失败，可能被浏览器阻止')
      showNotification('无法打开新窗口，请检查浏览器弹窗设置', 'error')
    }
  } catch (error) {
    console.error('❌ 打开后台管理详情失败:', error)
    showNotification('打开详情页面失败，请稍后重试', 'error')
  }
}

// 处理计划详情点击
const handlePlanDetailClick = (planId: string) => {
  console.log('🔍 学习计划详情按钮被点击（后台管理），ID:', planId)
  
  if (!planId) {
    console.error('❌ 学习计划ID为空')
    showNotification('错误：学习计划ID为空', 'error')
    return
  }
  
  // 在新窗口中打开后台管理的学习计划详情页面
  const url = `/admin/plan/${planId}`
  console.log('🚀 即将在新窗口中打开后台管理详情:', url)
  
  try {
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      console.log('✅ 后台管理学习计划详情页面打开成功')
    } else {
      console.log('❌ 新窗口打开失败，可能被浏览器阻止')
      showNotification('无法打开新窗口，请检查浏览器弹窗设置', 'error')
    }
  } catch (error) {
    console.error('❌ 打开后台管理详情失败:', error)
    showNotification('打开详情页面失败，请稍后重试', 'error')
  }
}

// 处理资源详情点击
const handleResourceDetailClick = (resourceId: string) => {
  console.log('🔍 资源详情按钮被点击（后台管理），ID:', resourceId)
  
  if (!resourceId) {
    console.error('❌ 资源ID为空')
    showNotification('错误：资源ID为空', 'error')
    return
  }
  
  // 在新窗口中打开后台管理的资源详情页面
  const url = `/admin/resource/${resourceId}`
  console.log('🚀 即将在新窗口中打开后台管理详情:', url)
  
  try {
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      console.log('✅ 后台管理资源详情页面打开成功')
    } else {
      console.log('❌ 新窗口打开失败，可能被浏览器阻止')
      showNotification('无法打开新窗口，请检查浏览器弹窗设置', 'error')
    }
  } catch (error) {
    console.error('❌ 打开后台管理详情失败:', error)
    showNotification('打开详情页面失败，请稍后重试', 'error')
  }
}

// 保留原始方法以防万一
const viewPostDetail = handlePostDetailClick
const viewPlanDetail = handlePlanDetailClick
const viewResourceDetail = handleResourceDetailClick

// 退出登录
const logout = () => {
  showNotification('正在退出登录...', 'info')
  localStorage.removeItem('currentUser')
  window.location.href = '/login'
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(() => {
  console.log('后台系统初始化...')
  getCurrentUser()
  updateTime()
  loadStats()
  loadUsers() // 自动加载用户数据
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style>
/* 完全移除前端侧边栏和导航 */
.sidebar-navigation,
.bottom-navigation,
nav {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
}

/* 确保body没有前端相关的样式 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 移除所有可能的侧边栏元素 */
div[class*="sidebar"],
div[class*="navigation"],
aside {
  display: none !important;
  visibility: hidden !important;
}

/* 确保主容器是全屏的 */
#app {
  width: 100%;
  height: 100%;
}

/* 移除Vue Router Link可能造成的前端导航 */
a[href*="/community"],
a[href*="/profile"],
a[href*="/search"],
a[href*="/study-plan"] {
  display: none !important;
}
</style>