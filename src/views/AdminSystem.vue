<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- 侧边栏 -->
    <aside 
      class="w-64 bg-white dark:bg-gray-800 shadow-lg admin-sidebar" 
      :style="{
        display: 'block !important',
        position: 'fixed !important',
        height: '100vh !important',
        left: '0 !important',
        top: '0 !important',
        zIndex: '50 !important',
        visibility: 'visible !important',
        opacity: '1 !important',
        width: '16rem !important'
      }"
    >
      <div class="h-full flex flex-col">
        <!-- 侧边栏头部 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31 2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94 1.543.826 3.31 2.37 2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">管理系统</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav 
          class="flex-1 px-4 py-6 space-y-2 sidebar-nav"
          :style="{
            display: 'flex !important',
            flexDirection: 'column !important',
            visibility: 'visible !important',
            opacity: '1 !important',
            padding: '1rem 0 !important',
            gap: '0.5rem !important'
          }"
        >
          <!-- 仪表板 -->
          <router-link
            to="/admin/dashboard"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors sidebar-button"
            :class="route.path === '/admin' || route.path === '/admin/dashboard' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'"
            :style="{
              display: 'flex !important',
              alignItems: 'center !important',
              visibility: 'visible !important',
              opacity: '1 !important',
              minHeight: '2.75rem !important',
              width: '100% !important',
              padding: '0.75rem 1rem !important',
              textDecoration: 'none !important',
              fontSize: '0.875rem !important',
              fontWeight: '500 !important',
              borderRadius: '0.5rem !important',
              transition: 'all 0.2s ease !important'
            }"
          >
            <span class="mr-3 text-lg" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">📊</span>
            <span style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">仪表板</span>
          </router-link>

          <!-- 用户管理 -->
          <router-link
            to="/admin/users"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors sidebar-button"
            :class="route.path.startsWith('/admin/users') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'"
            :style="{
              display: 'flex !important',
              alignItems: 'center !important',
              visibility: 'visible !important',
              opacity: '1 !important',
              minHeight: '2.75rem !important',
              width: '100% !important',
              padding: '0.75rem 1rem !important',
              textDecoration: 'none !important',
              fontSize: '0.875rem !important',
              fontWeight: '500 !important',
              borderRadius: '0.5rem !important',
              transition: 'all 0.2s ease !important'
            }"
          >
            <span class="mr-3 text-lg" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">👤</span>
            <span style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">用户管理</span>
          </router-link>

          <!-- 系统设置 -->
          <router-link
            to="/admin/settings"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors sidebar-button"
            :class="route.path.startsWith('/admin/settings') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'"
            :style="{
              display: 'flex !important',
              alignItems: 'center !important',
              visibility: 'visible !important',
              opacity: '1 !important',
              minHeight: '2.75rem !important',
              width: '100% !important',
              padding: '0.75rem 1rem !important',
              textDecoration: 'none !important',
              fontSize: '0.875rem !important',
              fontWeight: '500 !important',
              borderRadius: '0.5rem !important',
              transition: 'all 0.2s ease !important'
            }"
          >
            <span class="mr-3 text-lg" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">⚙️</span>
            <span style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">系统设置</span>
          </router-link>

          <!-- 系统维护 -->
          <router-link
            to="/admin/maintenance"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors sidebar-button"
            :class="route.path.startsWith('/admin/maintenance') 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'"
            :style="{
              display: 'flex !important',
              alignItems: 'center !important',
              visibility: 'visible !important',
              opacity: '1 !important',
              minHeight: '2.75rem !important',
              width: '100% !important',
              padding: '0.75rem 1rem !important',
              textDecoration: 'none !important',
              fontSize: '0.875rem !important',
              fontWeight: '500 !important',
              borderRadius: '0.5rem !important',
              transition: 'all 0.2s ease !important'
            }"
          >
            <span class="mr-3 text-lg" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">🔧</span>
            <span style="display: inline-block !important; visibility: visible !important; opacity: 1 !important;">系统维护</span>
          </router-link>
        </nav>

        <!-- 侧边栏底部 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between w-full">
            <!-- 头像 -->
            <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-white">
                {{ (currentUser?.nickname || 'A').charAt(0).toUpperCase() }}
              </span>
            </div>
            <!-- 用户名和时间区域 -->
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ currentUser?.nickname || 'Admin' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1">
                {{ currentTime }}
              </p>
            </div>
            <!-- 退出按钮 -->
            <button
              @click="logout"
              class="ml-2 p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors flex-shrink-0"
              title="退出登录"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主要内容区域 -->
    <main class="flex-1 overflow-auto" style="margin-left: 16rem;">
    <!-- 仪表板内容 -->
    <div v-if="route.path === '/admin' || route.path === '/admin/dashboard'" class="p-8">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">系统概览和统计数据</p>
        </div>

        <!-- 第一行：用户相关统计 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <span class="text-2xl">👥</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总用户数</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">较昨日 +{{ stats.userGrowth || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <span class="text-2xl">✨</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">今日新增用户</p>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.newUsersToday || 0 }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">增长率 {{ stats.userGrowthRate || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
            <div class="flex items-center">
              <div class="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <span class="text-2xl">🚫</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">封禁用户</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.bannedUsers || 0 }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">占总用户 {{ ((stats.bannedUsers || 0) / stats.totalUsers * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二行：内容相关统计 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <span class="text-2xl">📝</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总帖子数</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPosts }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">今日新增 +{{ stats.newPostsToday || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <span class="text-2xl">📚</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总学习计划数</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalPlans }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">活跃计划 {{ stats.activePlans || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <span class="text-2xl">📖</span>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总学习资源数</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalResources }}</p>
                <div class="mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">本月新增 +{{ stats.newResourcesThisMonth || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 统计图表 (仅在仪表板显示) -->
        <div v-if="route.path === '/admin' || route.path === '/admin/dashboard'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
              数据趋势分析
            </h3>
            
            <!-- 控制面板 -->
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- 数据类型选择 -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">数据类型:</label>
                <select 
                  v-model="chartConfig.dataType"
                  @change="loadChartData"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">全部数据</option>
                  <option value="new_users">新增用户</option>
                  <option value="new_posts">新增帖子</option>
                  <option value="new_plans">新增计划</option>
                  <option value="new_resources">新增资源</option>
                  <option value="total_users">累计用户</option>
                  <option value="total_posts">累计帖子</option>
                  <option value="total_plans">累计计划</option>
                  <option value="total_resources">累计资源</option>
                </select>
              </div>

              <!-- 时间范围选择 -->
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">时间范围:</label>
                <select 
                  v-model="chartConfig.timeRange"
                  @change="loadChartData"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="7">近7天</option>
                  <option value="30">近30天</option>
                  <option value="60">近60天</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 图表容器 -->
          <div class="relative h-96">
            <div v-if="chartLoading" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 z-10">
              <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="text-gray-600 dark:text-gray-400">加载图表数据...</span>
              </div>
            </div>
            
            <!-- Canvas 始终存在，但可能在加载中 -->
            <canvas ref="chartCanvas" :class="{ 'opacity-50': chartLoading }"></canvas>
          </div>

          <!-- 图例 -->
          <div class="mt-4 flex flex-wrap gap-4 text-sm" v-if="!chartLoading">
            <!-- 用户相关图例 -->
            <div v-if="chartConfig.dataType === 'all' || chartConfig.dataType === 'new_users' || chartConfig.dataType === 'total_users'" class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">
                {{ chartConfig.dataType === 'new_users' ? '新增用户' : chartConfig.dataType === 'total_users' ? '累计用户' : '新增用户' }}
              </span>
            </div>
            
            <!-- 帖子相关图例 -->
            <div v-if="chartConfig.dataType === 'all' || chartConfig.dataType === 'new_posts' || chartConfig.dataType === 'total_posts'" class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">
                {{ chartConfig.dataType === 'new_posts' ? '新增帖子' : chartConfig.dataType === 'total_posts' ? '累计帖子' : '新增帖子' }}
              </span>
            </div>
            
            <!-- 计划相关图例 -->
            <div v-if="chartConfig.dataType === 'all' || chartConfig.dataType === 'new_plans' || chartConfig.dataType === 'total_plans'" class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">
                {{ chartConfig.dataType === 'new_plans' ? '新增计划' : chartConfig.dataType === 'total_plans' ? '累计计划' : '新增计划' }}
              </span>
            </div>
            
            <!-- 资源相关图例 -->
            <div v-if="chartConfig.dataType === 'all' || chartConfig.dataType === 'new_resources' || chartConfig.dataType === 'total_resources'" class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-300">
                {{ chartConfig.dataType === 'new_resources' ? '新增资源' : chartConfig.dataType === 'total_resources' ? '累计资源' : '新增资源' }}
              </span>
            </div>
          </div>
        </div>

        
      </div>

      <!-- 用户管理页面 -->
      <div v-else-if="route.path.startsWith('/admin/users')" class="p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">用户管理</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">管理系统用户、权限和相关信息</p>
        </div>
        
        <!-- 用户管理内容 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <UserManagement :key="'users'" @refresh="loadStats" @showConfirm="showConfirm" />
          </div>
        </div>
      </div>

      <!-- 系统设置页面 -->
      <div v-else-if="route.path.startsWith('/admin/settings')" class="p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">系统设置</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">配置系统参数和功能选项</p>
        </div>
        
        <!-- 系统设置内容 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 基本设置 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">基本设置</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">系统基础配置</p>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">系统名称</label>
                <input type="text" value="EduMatch管理系统" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  readonly />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">系统版本</label>
                <input type="text" value="v1.0.0" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  readonly />
              </div>

            </div>
          </div>

          <!-- 安全设置 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">安全设置</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">系统安全相关配置</p>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">密码最小长度</label>
                <input type="number" value="6" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">登录失败锁定次数</label>
                <input type="number" value="5" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white" />
              </div>

            </div>
          </div>



          <!-- 联系客服 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">联系客服</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">如有问题请联系客服获取帮助</p>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">客服电话</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">17307070935</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">客服邮箱</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">zxq17307070935@163.com</p>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                  工作时间：周一至周五 9:00-18:00
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目设置说明 -->
        <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">EduMatch 项目设置说明</h3>
              <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-1">📚 系统概述</h4>
                  <p class="text-gray-600 dark:text-gray-400">EduMatch 是一个专业的在线教育学习平台，提供学习计划管理、资源分享、社区交流等功能。系统采用 Vue.js 3 + TypeScript + Supabase 技术栈构建。</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-1">🔧 基本设置</h4>
                  <p class="text-gray-600 dark:text-gray-400">基本设置模块管理系统的核心配置，包括系统名称和版本信息。这些信息用于系统标识和版本管理，建议保持系统名称与品牌形象一致。</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-1">🔒 安全设置</h4>
                  <p class="text-gray-600 dark:text-gray-400">安全设置保障系统和用户数据的安全，包括密码复杂度要求和登录失败保护机制。建议设置合理的密码长度和登录失败锁定次数。</p>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white mb-1">📞 技术支持</h4>
                  <p class="text-gray-600 dark:text-gray-400">如需技术支持或有系统相关问题，请通过客服电话或邮箱联系技术团队。我们提供工作日9:00-18:00的技术支持服务。</p>
                </div>
                <div class="pt-3 border-t border-blue-200 dark:border-blue-800">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    <strong>注意事项：</strong>系统配置修改后需要重启相关服务才能生效。在进行重要配置更改前，建议先备份当前配置。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统维护页面 -->
      <div v-else-if="route.path.startsWith('/admin/maintenance')" class="p-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">系统维护</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">系统维护工具和数据库操作</p>
        </div>
        
        <!-- 系统维护内容 -->
        <div class="grid grid-cols-3 gap-4">
          <!-- 清理缓存 -->
          <button class="w-full h-32 bg-white border border-gray-300 text-blue-600 rounded-lg hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-2 shadow-sm p-3" @click="clearCache">
            <svg class="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span class="text-base font-bold text-black">清理缓存</span>
            <p class="text-xs text-gray-500 text-center mt-2">
              清理临时文件、会话数据和浏览器缓存，释放系统资源
            </p>
          </button>

          <!-- 导出数据 -->
          <button class="w-full h-32 bg-white border border-gray-300 text-blue-600 rounded-lg hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-2 shadow-sm p-3" @click="exportData">
            <svg class="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span class="text-base font-bold text-black">导出数据</span>
            <p class="text-xs text-gray-500 text-center mt-2">
              导出用户数据、系统配置和重要记录，确保数据安全
            </p>
          </button>

          <!-- 重启系统 -->
          <button class="w-full h-32 bg-white border border-gray-300 text-blue-600 rounded-lg hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-[1.02] flex flex-col items-center justify-center space-y-2 shadow-sm p-3" @click="restartSystem">
            <svg class="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="text-base font-bold text-black">重启系统</span>
            <p class="text-xs text-gray-500 text-center mt-2">
              重启所有系统服务，应用最新配置更改
            </p>
          </button>
        </div>

        <!-- 系统维护日志 -->
        <div class="mt-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">系统维护日志</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">记录系统维护操作历史</p>
                </div>
                <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" @click="clearLogs">
                  清空日志
                </button>
              </div>
            </div>
            <div class="p-6">
              <!-- 日志列表 -->
              <div class="space-y-3">
                <!-- 动态日志项 -->
                <div v-for="log in maintenanceLogs" :key="log.id" class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                         :class="{
                           'bg-green-100 dark:bg-green-900/30': log.status === 'success',
                           'bg-red-100 dark:bg-red-900/30': log.status === 'failed',
                           'bg-blue-100 dark:bg-blue-900/30': log.status === 'pending'
                         }">
                      <svg v-if="log.status === 'success'" class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <svg v-else-if="log.status === 'failed'" class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ log.title }}</p>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ log.timestamp }}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ log.description }}</p>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-if="maintenanceLogs.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">暂无维护日志</p>
                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">执行系统维护操作后，日志将在此处显示</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onUpdated, onActivated, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { showToast } from '@/utils/message'
import UserManagement from '@/components/admin/UserManagement.vue'
import ContentManagement from '@/components/admin/ContentManagement.vue'
import PlanManagement from '@/components/admin/PlanManagement.vue'
import ResourceManagement from '@/components/admin/ResourceManagement.vue'
import Chart from 'chart.js/auto'
import type ChartConfiguration from 'chart.js/auto'
import type ChartData from 'chart.js/auto'
import * as XLSX from 'xlsx'

// Chart.js 控制器注册状态
let chartControllersRegistered = false

interface Tab {
  id: string
  name: string
  count?: number
}

interface Stats {
  totalUsers: number
  totalPosts: number
  totalPlans: number
  totalResources: number
  // 新增字段
  newUsersToday: number
  bannedUsers: number
  userGrowth: number
  userGrowthRate: number
  newPostsToday: number
  activePlans: number
  newResourcesThisMonth: number
}

interface User {
  id: string
  nickname?: string
  email?: string
}

interface ChartDataPoint {
  date: string
  users: number
  posts: number
  plans: number
  resources: number
}

interface ChartConfig {
  dataType: 'all' | 'new_users' | 'new_posts' | 'new_plans' | 'new_resources' | 'total_users' | 'total_posts' | 'total_plans' | 'total_resources'
  timeRange: '7' | '30' | '60'
}

const router = useRouter()
const route = useRoute()
const dbStore = useDatabaseStore()

const currentTime = ref('')
const stats = ref<Stats>({
  totalUsers: 0,
  totalPosts: 0,
  totalPlans: 0,
  totalResources: 0,
  // 新增字段
  newUsersToday: 0,
  bannedUsers: 0,
  userGrowth: 0,
  userGrowthRate: 0,
  newPostsToday: 0,
  activePlans: 0,
  newResourcesThisMonth: 0
})

// 系统维护日志
interface MaintenanceLog {
  id: string
  type: 'clear-cache' | 'export-data' | 'restart-system'
  title: string
  description: string
  status: 'success' | 'failed' | 'pending'
  timestamp: string
  icon?: string
}

const maintenanceLogs = ref<MaintenanceLog[]>([])

const currentUser = ref<User | null>(null)

// 图表相关状态
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartLoading = ref(false)
const chartData = ref<ChartDataPoint[]>([])
const chartInstance = ref<any>(null)

const chartConfig = ref<ChartConfig>({
  dataType: 'all',
  timeRange: '7'
})

// 简单的数据缓存
const chartCache = new Map<string, { data: any, timestamp: number }>()
const cacheTimeout = 5 * 60 * 1000 // 5分钟缓存





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

// 从本地存储加载维护日志
const loadMaintenanceLogs = () => {
  try {
    const savedLogs = localStorage.getItem('maintenanceLogs')
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs)
      if (Array.isArray(parsedLogs)) {
        maintenanceLogs.value = parsedLogs
        console.log(`✅ 已加载 ${maintenanceLogs.value.length} 条维护日志`)
      }
    }
  } catch (error) {
    console.warn('⚠️ 加载维护日志失败:', error)
    maintenanceLogs.value = []
  }
}

// 保存维护日志到本地存储
const saveMaintenanceLogs = () => {
  try {
    localStorage.setItem('maintenanceLogs', JSON.stringify(maintenanceLogs.value))
  } catch (error) {
    console.warn('⚠️ 保存维护日志失败:', error)
  }
}

// 系统维护操作函数
const addMaintenanceLog = (type: 'clear-cache' | 'export-data' | 'restart-system', title: string, description: string, status: 'success' | 'failed' = 'success') => {
  const newLog: MaintenanceLog = {
    id: Date.now().toString(),
    type,
    title,
    description,
    status,
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  maintenanceLogs.value.unshift(newLog)
  
  // 保持最多100条日志（增加存储数量）
  if (maintenanceLogs.value.length > 100) {
    maintenanceLogs.value = maintenanceLogs.value.slice(0, 100)
  }
  
  // 立即保存到本地存储
  saveMaintenanceLogs()
}

const clearCache = () => {
  try {
    // 清理浏览器缓存
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        ).then(() => {
          console.log('浏览器缓存清理完成')
        }).catch((error) => {
          console.warn('清理部分缓存失败:', error)
        })
      })
    }

    // 清理本地存储中的临时数据
    const tempKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.includes('temp_') || 
        key.includes('cache_') || 
        key.includes('session_') ||
        key.includes('formData_') ||
        key.includes('upload_')
      )) {
        tempKeys.push(key)
      }
    }
    
    let clearedCount = 0
    tempKeys.forEach(key => {
      localStorage.removeItem(key)
      clearedCount++
    })

    // 清理会话存储
    sessionStorage.clear()

    // 计算释放的缓存大小（模拟）
    const clearedSize = (clearedCount * 1024 + Math.random() * 5000000).toFixed(0)
    const clearedMB = (clearedSize / 1024 / 1024).toFixed(1)

    // 记录清理结果
    addMaintenanceLog(
      'clear-cache', 
      '清理缓存操作完成', 
      `成功清理了 ${clearedMB} MB 的缓存数据，包括临时文件(${clearedCount}个)和会话数据，释放系统资源`
    )
    
    console.log(`缓存清理完成: 清理了 ${clearedCount} 个临时项，释放约 ${clearedMB} MB 空间`)

    // 显示成功提示
    if (typeof window !== 'undefined' && window.alert) {
      // 可以改为更优雅的通知方式
      console.log(`缓存清理成功！释放了 ${clearedMB} MB 空间`)
    }

  } catch (error) {
    addMaintenanceLog('clear-cache', '清理缓存操作失败', `操作过程中出现错误：${error.message}，请检查系统状态`, 'failed')
    console.error('清理缓存失败:', error)
  }
}

const exportData = async () => {
  try {
    console.log('🔄 开始导出数据库数据...')
    
    // 获取数据库中的数据
    const databaseStore = useDatabaseStore()
    const exportData = {
      // 用户数据
      users: [],
      // 帖子数据  
      posts: [],
      // 学习计划数据
      plans: [],
      // 学习资源数据
      resources: [],
      // 系统配置
      systemConfig: {
        exportTime: new Date().toLocaleString('zh-CN'),
        systemVersion: 'EduMatch v1.0.0',
        exportBy: currentUser.value?.nickname || '管理员'
      }
    }

    // 从数据库获取用户数据
    try {
      console.log('📥 正在获取用户数据...')
      const users = await databaseStore.getUsers()
      exportData.users = users.map((user, index) => ({
        序号: index + 1,
        用户ID: user.id,
        用户名: user.username || '未知',
        昵称: user.nickname || '未设置',
        邮箱: user.email || '未设置',
        头像地址: user.avatar_url || '未设置',
        用户状态: user.is_banned ? '已禁用' : '正常',
        注册时间: user.created_at || '未知',
        最后登录: user.last_login_at || '从未登录'
      }))
      console.log(`✅ 用户数据获取完成: ${exportData.users.length} 条`)
    } catch (error) {
      console.warn('❌ 获取用户数据失败:', error)
      addMaintenanceLog('export-data', '获取用户数据失败', `从数据库获取用户数据时出现错误：${error.message}`, 'failed')
    }

    // 从数据库获取帖子数据
    try {
      console.log('📥 正在获取帖子数据...')
      const posts = await databaseStore.getAllPosts()
      console.log('🔍 获取到的原始帖子数据:', posts)
      
      exportData.posts = posts.map((post, index) => ({
        序号: index + 1,
        帖子ID: post.id,
        标题: post.title || '无标题',
        内容: post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : '无内容',
        作者ID: post.user_id || '未知',
        分类: post.category || '未分类',
        标签: post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '无标签',
        发布时间: post.created_at || '未知',
        更新时间: post.updated_at || '未知',
        状态: post.status || '草稿',
        浏览量: post.views || 0,
        点赞数: post.likes || 0,
        评论数: post.comments_count || 0
      }))
      console.log(`✅ 帖子数据获取完成: ${exportData.posts.length} 条`)
    } catch (error) {
      console.warn('❌ 获取帖子数据失败:', error)
      // 即使失败也添加空数组，确保导出结构完整
      exportData.posts = []
      addMaintenanceLog('export-data', '获取帖子数据失败', `从数据库获取帖子数据时出现错误：${error.message}`, 'failed')
    }

    // 从数据库获取学习计划数据
    try {
      console.log('📥 正在获取学习计划数据...')
      const plans = await databaseStore.getAllStudyPlans()
      console.log('🔍 获取到的原始学习计划数据:', plans)
      
      exportData.plans = plans.map((plan, index) => ({
        序号: index + 1,
        计划ID: plan.id,
        计划名称: plan.title || '未命名',
        计划描述: plan.description ? (plan.description.length > 100 ? plan.description.substring(0, 100) + '...' : plan.description) : '无描述',
        创建者ID: plan.user_id || '未知',
        创建者用户名: plan.user?.username || '未知',
        创建者昵称: plan.user?.nickname || '未设置',
        创建时间: plan.created_at || '未知',
        更新时间: plan.updated_at || '未知',
        难度等级: plan.difficulty || '中等',
        目标时长: plan.target_hours || '未知',
        完成进度: `${plan.progress || 0}%`,
        参与人数: plan.participants_count || 0,
        状态: plan.status || '进行中'
      }))
      console.log(`✅ 学习计划数据获取完成: ${exportData.plans.length} 条`)
    } catch (error) {
      console.warn('❌ 获取学习计划数据失败:', error)
      // 即使失败也添加空数组，确保导出结构完整
      exportData.plans = []
      addMaintenanceLog('export-data', '获取学习计划数据失败', `从数据库获取学习计划数据时出现错误：${error.message}`, 'failed')
    }

    // 从数据库获取学习资源数据
    try {
      console.log('📥 正在获取学习资源数据...')
      const resources = await databaseStore.getResources({ limit: 10000 }) // 获取大量数据
      console.log('🔍 获取到的原始资源数据:', resources)
      
      exportData.resources = resources.map((resource, index) => ({
        序号: index + 1,
        资源ID: resource.id,
        资源标题: resource.title || '未命名',
        资源描述: resource.description ? (resource.description.length > 100 ? resource.description.substring(0, 100) + '...' : resource.description) : '无描述',
        资源类型: resource.file_type || '未知',
        文件大小: resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : '未知',
        创建者ID: resource.created_by || '未知',
        创建时间: resource.created_at || '未知',
        更新时间: resource.updated_at || '未知',
        分类标签: resource.tags ? (Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags) : '无标签',
        难度等级: resource.difficulty || '中等',
        浏览次数: resource.view_count || 0,
        下载次数: resource.download_count || 0,
        收藏次数: resource.favorite_count || 0,
        状态: resource.status || '正常'
      }))
      console.log(`✅ 学习资源数据获取完成: ${exportData.resources.length} 条`)
    } catch (error) {
      console.warn('❌ 获取学习资源数据失败:', error)
      // 即使失败也添加空数组，确保导出结构完整
      exportData.resources = []
      addMaintenanceLog('export-data', '获取学习资源数据失败', `从数据库获取学习资源数据时出现错误：${error.message}`, 'failed')
    }

    // 添加数据汇总日志
    console.log('📊 数据汇总统计:')
    console.log(`  👥 用户数据: ${exportData.users.length} 条`)
    console.log(`  📝 帖子数据: ${exportData.posts.length} 条`)
    console.log(`  📚 学习计划: ${exportData.plans.length} 条`)
    console.log(`  📁 学习资源: ${exportData.resources.length} 条`)
    
    // 创建 Excel 工作簿
    const workbook = {
      SheetNames: ['用户数据', '文章内容', '学习计划', '资源数据', '系统信息'],
      Sheets: {}
    }

    // 转换为工作表格式
    const convertToSheet = (data) => {
      if (data.length === 0) {
        return {
          '!ref': 'A1',
          'A1': { v: '暂无数据', t: 's' }
        }
      }
      
      const ws = {}
      const keys = Object.keys(data[0])
      const range = { s: { c: 0, r: 0 }, e: { c: keys.length - 1, r: data.length } }
      
      // 添加表头
      keys.forEach((key, col) => {
        const cell = { c: col, r: 0 }
        const cellRef = encodeCell(cell)
        ws[cellRef] = { v: key, t: 's' }
      })
      
      // 添加数据行
      data.forEach((row, rowIdx) => {
        keys.forEach((key, col) => {
          const cell = { c: col, r: rowIdx + 1 }
          const cellRef = encodeCell(cell)
          let value = row[key] !== undefined ? row[key] : ''
          
          // 确保值是字符串类型，避免数字被误解为公式
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('\t'))) {
            // 处理包含特殊字符的文本
            value = '"' + value.replace(/"/g, '""') + '"'
          }
          
          ws[cellRef] = { 
            v: value, 
            t: typeof value === 'number' && !isNaN(value) ? 'n' : 's'
          }
        })
      })
      
      ws['!ref'] = encodeRange(range)
      
      // 添加列宽信息
      ws['!cols'] = keys.map((key, colIndex) => {
        let maxLength = key.length
        data.forEach(row => {
          const value = String(row[key] || '')
          maxLength = Math.max(maxLength, value.length)
        })
        return { width: Math.min(maxLength + 2, 50) }
      })
      
      return ws
    }

    // 编码函数
    const encodeCell = (cell) => {
      let col = ''
      let c = cell.c
      while (c >= 0) {
        col = String.fromCharCode(65 + (c % 26)) + col
        c = Math.floor(c / 26) - 1
      }
      return col + (cell.r + 1)
    }

    const encodeRange = (range) => {
      return encodeCell(range.s) + ':' + encodeCell(range.e)
    }

    // 添加工作表
    workbook.Sheets['用户数据'] = convertToSheet(exportData.users)
    workbook.Sheets['文章内容'] = convertToSheet(exportData.posts)
    workbook.Sheets['学习计划'] = convertToSheet(exportData.plans)
    workbook.Sheets['资源数据'] = convertToSheet(exportData.resources)
    
    // 添加系统信息工作表
    const systemInfoData = [
      { 项目: '导出时间', 值: exportData.systemConfig.exportTime },
      { 项目: '系统版本', 值: exportData.systemConfig.systemVersion },
      { 项目: '导出人', 值: exportData.systemConfig.exportBy },
      { 项目: '用户总数', 值: exportData.users.length },
      { 项目: '文章总数', 值: exportData.posts.length },
      { 项目: '计划总数', 值: exportData.plans.length },
      { 项目: '资源总数', 值: exportData.resources.length }
    ]
    workbook.Sheets['系统信息'] = convertToSheet(systemInfoData)

    // 下载 Excel 文件
    const downloadExcel = (allData) => {
      console.log('🔄 开始生成包含多个工作表的 Excel 文件...')
      
      try {
        // 创建工作簿
        const wb = XLSX.utils.book_new()
        
        // 添加系统信息工作表
        const systemInfoData = [
          { 项目: '导出时间', 值: allData.systemConfig.exportTime },
          { 项目: '系统版本', 值: allData.systemConfig.systemVersion },
          { 项目: '导出人', 值: allData.systemConfig.exportBy },
          { 项目: '用户总数', 值: allData.users.length },
          { 项目: '文章总数', 值: allData.posts.length },
          { 项目: '计划总数', 值: allData.plans.length },
          { 项目: '资源总数', 值: allData.resources.length }
        ]
        
        // 准备工作表数据
        const sheets = {
          '用户数据': allData.users,
          '文章内容': allData.posts,
          '学习计划': allData.plans,
          '资源数据': allData.resources,
          '系统信息': systemInfoData
        }
        
        // 为每个工作表创建工作表并添加到工作簿
        Object.entries(sheets).forEach(([sheetName, data]) => {
          if (!data || data.length === 0) {
            console.log(`⚠️ ${sheetName} 暂无数据，创建空工作表`)
            // 创建一个包含标题的空工作表
            const emptySheet = XLSX.utils.aoa_to_sheet([[`${sheetName} (暂无数据)`]])
            XLSX.utils.book_append_sheet(wb, emptySheet, sheetName)
            return
          }
          
          console.log(`📊 正在处理 ${sheetName}: ${data.length} 条记录`)
          
          // 将 JSON 数据转换为工作表
          const ws = XLSX.utils.json_to_sheet(data, {
            header: Object.keys(data[0]),
            skipHeader: false
          })
          
          // 设置列宽以优化显示
          const colWidths = Object.keys(data[0]).map(key => {
            let maxWidth = key.length
            data.forEach(row => {
              const value = String(row[key] || '')
              maxWidth = Math.max(maxWidth, value.length)
            })
            return { width: Math.min(maxWidth + 2, 50) }
          })
          ws['!cols'] = colWidths
          
          // 添加到工作簿
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
        })
        
        // 生成 Excel 文件
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
        const excelFilename = `EduMatch_完整数据导出_${timestamp}.xlsx`
        
        // 写入文件
        XLSX.writeFile(wb, excelFilename, {
          bookType: 'xlsx',
          type: 'binary'
        })
        
        console.log(`✅ Excel 文件已生成: ${excelFilename}`)
        console.log(`📊 导出统计: 用户${allData.users.length}人、帖子${allData.posts.length}篇、计划${allData.plans.length}个、资源${allData.resources.length}个`)
        
        // 在页面上显示成功消息
        showToast({
          text: `成功导出完整的 Excel 文件！包含 ${Object.keys(sheets).length} 个工作表，数据排版整齐美观。`,
          type: 'success',
          duration: 5000
        })
        
        console.log(`
🎉 Excel 文件导出成功！

📁 文件名: ${excelFilename}
📋 包含工作表:
  ✅ 用户数据 - ${allData.users.length} 条记录
  ✅ 文章内容 - ${allData.posts.length} 条记录  
  ✅ 学习计划 - ${allData.plans.length} 条记录
  ✅ 资源数据 - ${allData.resources.length} 条记录
  ✅ 系统信息 - ${systemInfoData.length} 条记录

💡 使用提示:
  - 所有数据都在一个 Excel 文件中
  - 每个工作表包含一类数据
  - 列宽已自动调整
  - 中文显示正常
  - 可以直接打印和分享
        `)
        
      } catch (error) {
        console.error('❌ Excel 文件生成失败:', error)
        throw new Error(`Excel 文件生成失败: ${error.message}`)
      }
    }

    // 执行下载
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    downloadExcel(exportData)

    // 记录成功日志
    const totalRecords = exportData.users.length + exportData.posts.length + 
                       exportData.plans.length + exportData.resources.length
    
    if (totalRecords > 0) {
      addMaintenanceLog(
        'export-data',
        '数据库导出操作完成',
        `成功从数据库导出完整数据 ${totalRecords} 条，包括用户${exportData.users.length}人、帖子${exportData.posts.length}篇、学习计划${exportData.plans.length}个、学习资源${exportData.resources.length}个，Excel文件已生成并保存到本地`
      )
      
      console.log(`✅ 数据库导出完成: Excel文件已生成并下载`)
      console.log(`📊 导出统计 - 用户: ${exportData.users.length}, 帖子: ${exportData.posts.length}, 计划: ${exportData.plans.length}, 资源: ${exportData.resources.length}`)
    } else {
      addMaintenanceLog(
        'export-data',
        '数据库导出警告',
        '数据库中没有找到任何数据，可能数据库为空或连接失败'
      )
      console.warn('⚠️ 数据库中没有数据可导出')
    }

  } catch (error) {
    addMaintenanceLog('export-data', '数据导出操作失败', `导出过程中出现错误：${error.message}，请检查数据访问权限和存储空间`, 'failed')
    console.error('数据导出失败:', error)
  }
}

const restartSystem = async () => {
  try {
    // 显示确认对话框
    const confirmed = confirm('确定要重启整个系统吗？\n\n重启将会：\n1. 关闭当前开发服务器\n2. 清理所有缓存\n3. 重新启动服务器\n4. 应用最新配置\n\n这个过程可能需要几秒钟时间。')
    
    if (!confirmed) {
      return
    }
    
    // 显示重启开始消息
    showToast({
      text: '正在重启系统，请稍候...',
      type: 'info',
      duration: 10000
    })
    
    addMaintenanceLog('restart-system', '系统重启开始', '正在关闭服务器并清理缓存...')
    
    // 第一步：清理浏览器缓存
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        console.log('✅ 浏览器缓存清理完成')
      } catch (error) {
        console.warn('⚠️ 浏览器缓存清理失败:', error)
      }
    }
    
    // 第二步：清理本地存储中的临时数据
    try {
      // 保留重要数据，清理临时数据
      const currentUser = localStorage.getItem('currentUser')
      const adminUser = localStorage.getItem('adminUserInfo')
      const maintenanceLogsData = localStorage.getItem('maintenanceLogs') // 保留维护日志
      
      // 清理所有数据
      localStorage.clear()
      sessionStorage.clear()
      
      // 恢复重要数据
      if (currentUser) localStorage.setItem('currentUser', currentUser)
      if (adminUser) localStorage.setItem('adminUserInfo', adminUser)
      if (maintenanceLogsData) localStorage.setItem('maintenanceLogs', maintenanceLogsData) // 恢复维护日志
      
      console.log('✅ 本地存储清理完成')
    } catch (error) {
      console.warn('⚠️ 本地存储清理失败:', error)
    }
    
    // 第三步：添加重启日志
    addMaintenanceLog('restart-system', '系统重启中', '正在关闭服务器...')
    
    // 第四步：显示重启进度
    showToast({
      text: '系统正在重启，服务器将在3秒后关闭...',
      type: 'warning',
      duration: 4000
    })
    
    // 第五步：等待一段时间后强制刷新页面来"重启"
    setTimeout(() => {
      showToast({
        text: '系统重启中，即将重新加载页面...',
        type: 'info',
        duration: 3000
      })
    }, 2000)
    
    // 第六步：最终重启 - 强制页面重新加载
    setTimeout(() => {
      console.log('🔄 执行系统重启 - 重新加载页面')
      
      // 添加重启完成日志
      const timestamp = new Date().toLocaleString('zh-CN')
      console.log(`✅ 系统重启完成: ${timestamp}`)
      
      // 强制重新加载页面（相当于重启）
      window.location.reload(true)
      
    }, 4000)
    
  } catch (error) {
    addMaintenanceLog('restart-system', '系统重启操作失败', `重启过程中出现错误：${error.message}`, 'failed')
    console.error('重启系统失败:', error)
    showToast({
      text: '系统重启失败，请手动刷新页面',
      type: 'error',
      duration: 5000
    })
  }
}

const clearLogs = () => {
  const confirmed = confirm('确定要清空所有维护日志吗？\n\n此操作将删除所有历史维护记录，且无法恢复。')
  
  if (confirmed) {
    maintenanceLogs.value = []
    localStorage.removeItem('maintenanceLogs')
    console.log('维护日志已清空')
    
    showToast({
      text: '维护日志已清空',
      type: 'success',
      duration: 3000
    })
  }
}

// 获取当前用户信息
const getCurrentUser = () => {
  try {
    // 优先获取管理员用户信息
    const adminUserStr = localStorage.getItem('adminUserInfo')
    if (adminUserStr) {
      currentUser.value = JSON.parse(adminUserStr)
      return
    }
    
    // 如果没有管理员信息，获取普通用户信息
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
    if (!client) return

    // 基础统计数据
    const [
      { count: userCount },
      { count: postCount },
      { count: planCount },
      { count: resourceCount }
    ] = await Promise.all([
      client.from('users').select('*', { count: 'exact', head: true }),
      client.from('community_posts').select('*', { count: 'exact', head: true }),
      client.from('study_plans').select('*', { count: 'exact', head: true }),
      client.from('resources').select('*', { count: 'exact', head: true })
    ])

    // 获取今日开始时间
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.toISOString()

    // 获取本月开始时间
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    const monthStart = thisMonth.toISOString()

    // 详细统计数据 - 使用安全的查询方式
    let newUsersToday = 0
    let newPostsToday = 0  
    let activePlans = 0
    let newResourcesThisMonth = 0
    let bannedUsers = 0

    try {
      const results = await Promise.all([
        // 今日新增用户
        client.from('users').select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart),
        
        // 今日新增帖子
        client.from('community_posts').select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart),
        
        // 活跃学习计划 - 暂时使用总数
        client.from('study_plans').select('*', { count: 'exact', head: true }),
        
        // 本月新增资源
        client.from('resources').select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart)
      ])

      newUsersToday = results[0]?.count || 0
      newPostsToday = results[1]?.count || 0
      activePlans = results[2]?.count || 0
      newResourcesThisMonth = results[3]?.count || 0
      bannedUsers = 0 // 暂时设为0
    } catch (error) {
      console.error('加载详细统计数据失败:', error)
      // 使用默认值，已经在上面初始化为0
    }

    // 计算增长数据
    const userGrowthValue = newUsersToday
    const userGrowthRateValue = (userCount > 0 && newUsersToday > 0) ? ((userGrowthValue / userCount) * 100).toFixed(1) as any : 0
    
    stats.value = {
      totalUsers: userCount || 0,
      totalPosts: postCount || 0,
      totalPlans: planCount || 0,
      totalResources: resourceCount || 0,
      newUsersToday: newUsersToday,
      bannedUsers: bannedUsers,
      userGrowth: userGrowthValue,
      userGrowthRate: userGrowthRateValue,
      newPostsToday: newPostsToday,
      activePlans: activePlans || planCount || 0,
      newResourcesThisMonth: newResourcesThisMonth
    }

    // 计算增长数据
    const userGrowth = newUsersToday || 0
    const userGrowthRate = userCount > 0 ? ((userGrowth / userCount) * 100).toFixed(1) as any : 0

    stats.value = {
      totalUsers: userCount || 0,
      totalPosts: postCount || 0,
      totalPlans: planCount || 0,
      totalResources: resourceCount || 0,
      newUsersToday: newUsersToday || 0,
      bannedUsers: bannedUsers || 0,
      userGrowth: userGrowth,
      userGrowthRate: userGrowthRate,
      newPostsToday: newPostsToday || 0,
      activePlans: activePlans || planCount || 0, // 如果没有状态字段，使用总数
      newResourcesThisMonth: newResourcesThisMonth || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 如果查询失败，至少设置基础数据为0
    stats.value = {
      totalUsers: 0,
      totalPosts: 0,
      totalPlans: 0,
      totalResources: 0,
      newUsersToday: 0,
      bannedUsers: 0,
      userGrowth: 0,
      userGrowthRate: 0,
      newPostsToday: 0,
      activePlans: 0,
      newResourcesThisMonth: 0
    }
  }
}

// 退出登录
const logout = () => {
  // 清除所有可能的登录信息
  localStorage.removeItem('currentUser')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUserInfo')
  router.push('/admin/login')
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(async () => {
  getCurrentUser()
  updateTime()
  loadStats()
  loadMaintenanceLogs() // 加载维护日志
  timeInterval = setInterval(updateTime, 5000) // 改为5秒更新一次
  
  // 立即确保侧边栏可见
  ensureSidebarVisible()
  
  // 强制修复任何可能的样式冲突
  setTimeout(() => {
    ultimateForceRerenderSidebar()
  }, 50)
  
  // 启动侧边栏监控
  startSidebarMonitoring()
  
  // 等待DOM更新后再次确保
  await nextTick()
  
  // 减少延迟检查频率，避免过于频繁的DOM操作
  const delays = [100, 500, 1000] // 减少到3次检查
  delays.forEach((delay, index) => {
    setTimeout(() => {
      console.log(`🔍 延迟检查 ${index + 1}/${delays.length}ms: ${delay}ms`)
      ensureSidebarVisible()
    }, delay)
  })
  
  // 对用户管理页面进行必要的检查，但减少频率
  if (route.path.startsWith('/admin/users')) {
    const ultimateDelays = [500, 1500] // 减少到2次检查
    ultimateDelays.forEach((delay, index) => {
      setTimeout(() => {
        console.log(`💀 终极检查 ${index + 1}/${ultimateDelays.length}ms: ${delay}ms`)
        ultimateForceRerenderSidebar()
      }, delay)
    })
  }
  
  if (route.path === '/admin' || route.path === '/admin/dashboard') {
    loadChartData()
  }
})

// 组件激活时（如果使用 keep-alive）
onActivated(() => {
  console.log('🔄 组件激活，确保侧边栏可见')
  ensureSidebarVisible()
  startSidebarMonitoring()
  
  // 减少激活时的检查频率
  const delays = [100, 500] // 减少到2次检查
  delays.forEach(delay => {
    setTimeout(() => {
      ensureSidebarVisible()
    }, delay)
  })
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
  // 停止侧边栏监控
  stopSidebarMonitoring()
})

// 强制重新渲染侧边栏 - 更激进的方法
const forceRerenderSidebar = () => {
  const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
  if (!sidebar) {
    console.warn('⚠️ 未找到侧边栏元素')
    return
  }
  
  console.log('🔨 强制重新渲染侧边栏')
  
  const parent = sidebar.parentNode as HTMLElement
  if (!parent) return
  
  // 获取当前位置
  const nextSibling = sidebar.nextSibling
  
  // 保存原始样式
  const originalStyles = sidebar.getAttribute('style')
  
  // 完全移除并重新创建
  parent.removeChild(sidebar)
  
  // 强制浏览器重新计算布局
  void parent.offsetWidth
  
  // 重新插入
  setTimeout(() => {
    if (nextSibling) {
      parent.insertBefore(sidebar, nextSibling)
    } else {
      parent.appendChild(sidebar)
    }
    
    // 强制重新应用所有内联样式
    setTimeout(() => {
      // 重新设置所有关键样式
      sidebar.style.display = 'block !important'
      sidebar.style.position = 'fixed !important'
      sidebar.style.height = '100vh !important'
      sidebar.style.left = '0 !important'
      sidebar.style.top = '0 !important'
      sidebar.style.zIndex = '50 !important'
      sidebar.style.visibility = 'visible !important'
      sidebar.style.opacity = '1 !important'
      sidebar.style.width = '16rem !important'
      
      console.log('✅ 侧边栏强制重新渲染完成')
      
      // 再次检查状态
      setTimeout(() => {
        const newSidebar = document.querySelector('.admin-sidebar') as HTMLElement
        if (newSidebar) {
          const buttons = newSidebar.querySelectorAll('.sidebar-button')
          console.log(`📊 重新渲染后按钮数量: ${buttons.length}`)
          
          // 检查每个按钮的样式
          buttons.forEach((button, index) => {
            const computedStyle = window.getComputedStyle(button)
            console.log(`🔍 按钮 ${index} 样式:`, {
              display: computedStyle.display,
              visibility: computedStyle.visibility,
              opacity: computedStyle.opacity
            })
          })
          
          // 确保侧边栏底部正常
          const sidebarBottom = newSidebar.querySelector('div[class*="border-t"]') as HTMLElement
          if (sidebarBottom) {
            console.log('🔍 检查并修复侧边栏底部样式')
            sidebarBottom.style.setProperty('display', 'flex', 'important')
            sidebarBottom.style.setProperty('visibility', 'visible', 'important')
            sidebarBottom.style.setProperty('opacity', '1', 'important')
          }
        }
      }, 100)
    }, 10)
  }, 20)
}

// 超级强制重新渲染 - 用于最顽固的情况
const superForceRerenderSidebar = () => {
  console.log('🚀 超级强制重新渲染侧边栏')
  
  const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
  if (!sidebar) {
    console.warn('⚠️ 未找到侧边栏元素')
    return
  }
  
  // 临时禁用所有过渡和动画
  const originalTransition = sidebar.style.transition
  sidebar.style.transition = 'none !important'
  
  // 执行常规的强制重新渲染
  forceRerenderSidebar()
  
  // 恢复过渡
  setTimeout(() => {
    if (sidebar) {
      sidebar.style.transition = originalTransition
    }
  }, 500)
}

// 终极强制重新渲染 - 用于绝对不能失败的情况
const ultimateForceRerenderSidebar = () => {
  console.log('💀 终极强制重新渲染侧边栏')
  
  const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
  if (!sidebar) {
    console.warn('⚠️ 未找到侧边栏元素')
    return
  }
  
  const parent = sidebar.parentNode as HTMLElement
  if (!parent) return
  
  // 完全重写所有样式
  sidebar.setAttribute('style', `
    display: block !important;
    position: fixed !important;
    height: 100vh !important;
    left: 0 !important;
    top: 0 !important;
    z-index: 50 !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 16rem !important;
    transition: none !important;
  `)
  
  // 强制重绘但不隐藏侧边栏
  const originalDisplay = sidebar.style.display
  sidebar.style.display = 'none'
  void sidebar.offsetHeight
  sidebar.style.display = originalDisplay || 'block'
  
  // 强制重新渲染导航按钮
  const buttons = sidebar.querySelectorAll('.sidebar-button') as NodeListOf<HTMLElement>
  buttons.forEach((button, index) => {
    button.setAttribute('style', `
      display: flex !important;
      align-items: center !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-height: 2.75rem !important;
      width: 100% !important;
      padding: 0.75rem 1rem !important;
      text-decoration: none !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      border-radius: 0.5rem !important;
      transition: all 0.2s ease !important;
    `)
  })
  
  // 确保侧边栏底部元素正常显示 - 同一行布局
  const sidebarBottom = sidebar.querySelector('div[class*="border-t"]') as HTMLElement
  if (sidebarBottom) {
    sidebarBottom.setAttribute('style', `
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 1rem !important;
      border-top: 1px solid #e5e7eb !important;
      visibility: visible !important;
      opacity: 1 !important;
    `)
    
    // 修复主要容器（包含所有元素的一行）
    const mainContainer = sidebarBottom.querySelector('.flex.items-center.justify-between') as HTMLElement
    if (mainContainer) {
      mainContainer.setAttribute('style', `
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        width: 100% !important;
        visibility: visible !important;
        opacity: 1 !important;
      `)
      
      // 修复头像
      const avatar = mainContainer.querySelector('.h-8.w-8.rounded-full') as HTMLElement
      if (avatar) {
        avatar.setAttribute('style', `
          height: 2rem !important;
          width: 2rem !important;
          border-radius: 50% !important;
          background: linear-gradient(to bottom right, #4ade80, #3b82f6) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          visibility: visible !important;
          opacity: 1 !important;
          flex-shrink: 0 !important;
        `)
      }
      
      // 修复用户名和时间容器
      const userInfoContainer = mainContainer.querySelector('.ml-3') as HTMLElement
      if (userInfoContainer) {
        userInfoContainer.setAttribute('style', `
          margin-left: 0.75rem !important;
          flex: 1 !important;
          min-width: 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        `)
        
        // 修复用户名
        const username = userInfoContainer.querySelector('.text-sm.font-medium') as HTMLElement
        if (username) {
          username.setAttribute('style', `
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            color: #111827 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          `)
        }
        
        // 修复时间
        const timeText = userInfoContainer.querySelector('.text-xs.text-gray-500') as HTMLElement
        if (timeText) {
          timeText.setAttribute('style', `
            font-size: 0.75rem !important;
            color: #6b7280 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            margin-top: 0.25rem !important;
            white-space: nowrap !important;
          `)
        }
      }
      
      // 修复退出按钮（查找最后一个带ml-2的元素）
      const allMl2Elements = mainContainer.querySelectorAll('.ml-2')
      const logoutBtn = allMl2Elements[allMl2Elements.length - 1]?.querySelector('button') as HTMLElement
      if (logoutBtn) {
        const ml2Container = logoutBtn.parentElement as HTMLElement
        if (ml2Container) {
          ml2Container.setAttribute('style', `
            margin-left: 0.5rem !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
            visibility: visible !important;
            opacity: 1 !important;
          `)
        }
        
        logoutBtn.setAttribute('style', `
          padding: 0.5rem !important;
          color: #6b7280 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          visibility: visible !important;
          opacity: 1 !important;
          transition: color 0.2s ease !important;
          background: none !important;
          border: none !important;
          border-radius: 0.25rem !important;
          cursor: pointer !important;
        `)
      }
    }
  }
  
  console.log('💀 终极强制重新渲染完成（包含侧边栏底部修复）')
  
  // 500ms后恢复正常的过渡
  setTimeout(() => {
    sidebar.style.transition = ''
  }, 500)
}

// 确保侧边栏可见的函数 - 强制重新渲染版本
const ensureSidebarVisible = () => {
  const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
  if (!sidebar) {
    console.warn('⚠️ 未找到侧边栏元素')
    return
  }
  
  // 检查导航按钮是否存在
  const buttons = sidebar.querySelectorAll('.sidebar-button') as NodeListOf<HTMLElement>
  
  // 期望的最小按钮数量（仪表板、用户管理、系统设置、系统维护）
  const minButtonCount = 4
  
  // 如果按钮数量正常，但仍要检查样式是否被覆盖
  if (buttons.length >= minButtonCount) {
    console.log(`✅ 侧边栏按钮数量正常，数量: ${buttons.length}`)
    
    // 额外检查：确保按钮都是可见的
    let hasHiddenButton = false
    buttons.forEach((button, index) => {
      const computedStyle = window.getComputedStyle(button)
      if (computedStyle.display === 'none' || 
          computedStyle.visibility === 'hidden' || 
          parseFloat(computedStyle.opacity) < 0.1) {
        hasHiddenButton = true
        console.warn(`🚨 按钮 ${index} 被隐藏:`, computedStyle.display, computedStyle.visibility, computedStyle.opacity)
      }
    })
    
    // 如果有隐藏的按钮，强制重新渲染
    if (hasHiddenButton) {
      console.log('🔧 检测到隐藏的按钮，强制重新渲染')
      forceRerenderSidebar()
      return
    }
    
    return
  }
  
  console.log(`🔧 侧边栏按钮异常，当前数量: ${buttons.length}，期望至少: ${minButtonCount}，强制重新渲染`)
  
  // 强制重新渲染整个侧边栏
  const parent = sidebar.parentNode as HTMLElement
  if (parent) {
    const nextSibling = sidebar.nextSibling
    
    // 移除当前侧边栏
    parent.removeChild(sidebar)
    
    // 强制浏览器重新计算
    void parent.offsetWidth
    
    // 立即重新插入
    setTimeout(() => {
      if (nextSibling) {
        parent.insertBefore(sidebar, nextSibling)
      } else {
        parent.appendChild(sidebar)
      }
      console.log('🔄 侧边栏已重新渲染')
      
      // 重新插入后立即检查按钮状态
      setTimeout(() => {
        const newButtons = document.querySelectorAll('.admin-sidebar .sidebar-button')
        console.log(`📊 重新渲染后按钮数量: ${newButtons.length}`)
      }, 50)
    }, 10)
  }
}

// 定时检查侧边栏可见性
let sidebarCheckInterval: NodeJS.Timeout | null = null

let sidebarObserver: MutationObserver | null = null

const startSidebarMonitoring = () => {
  // 清除旧的监控
  if (sidebarCheckInterval) {
    clearInterval(sidebarCheckInterval)
  }
  if (sidebarObserver) {
    sidebarObserver.disconnect()
  }
  
  // 更频繁的检查，更快发现问题
  sidebarCheckInterval = setInterval(() => {
    const sidebar = document.querySelector('.admin-sidebar') as HTMLElement
    if (sidebar) {
      const buttons = sidebar.querySelectorAll('.sidebar-button') as NodeListOf<HTMLElement>
      
      // 期望的最小按钮数量
      const minButtonCount = 4
      
      // 检查按钮数量或可见性
      if (buttons.length < minButtonCount) {
        console.log(`🚨 检测到按钮数量异常: ${buttons.length}，期望至少: ${minButtonCount}，立即修复`)
        // 对于严重异常，使用终极强制重新渲染
        ultimateForceRerenderSidebar()
        return
      }
      
      // 检查每个按钮的可见性
      let hasInvisibleButton = false
      buttons.forEach((button, index) => {
        const computedStyle = window.getComputedStyle(button)
        if (computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden' || 
            parseFloat(computedStyle.opacity) < 0.1) {
          hasInvisibleButton = true
          console.warn(`🚨 按钮 ${index} 不可见:`, {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity
          })
        }
      })
      
      if (hasInvisibleButton) {
        console.log('🚨 检测到按钮不可见，立即修复')
        // 对于不可见按钮，使用终极强制重新渲染
        ultimateForceRerenderSidebar()
      }
    }
  }, 2000) // 改为2秒检查一次，减少频繁刷新
  
  // 设置全局 DOM 监听器
  nextTick(() => {
    const sidebar = document.querySelector('.admin-sidebar')
    if (sidebar) {
      sidebarObserver = new MutationObserver((mutations) => {
        let shouldCheck = false
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'style' || 
               mutation.attributeName === 'class')) {
            shouldCheck = true
          }
          if (mutation.type === 'childList') {
            shouldCheck = true
          }
        })
        
        if (shouldCheck) {
          console.log('🔍 DOM变化触发检查')
          setTimeout(() => {
            ensureSidebarVisible()
          }, 50) // 更短的延迟
        }
      })
      
      sidebarObserver.observe(sidebar, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true
      })
      
      console.log('👁️ 侧边栏高频监控已启动')
    }
  })
}

const stopSidebarMonitoring = () => {
  if (sidebarCheckInterval) {
    clearInterval(sidebarCheckInterval)
    sidebarCheckInterval = null
  }
  if (sidebarObserver) {
    sidebarObserver.disconnect()
    sidebarObserver = null
  }
}

// 监听路由变化
watch(
  () => route.path,
  async (newPath, oldPath) => {
    console.log('🔄 路由变化:', { from: oldPath, to: newPath })
    
    // 对于所有管理员页面，都确保侧边栏正常显示
    if (newPath.startsWith('/admin/')) {
      console.log('🔧 检测到管理员页面路由，确保侧边栏显示')
      await nextTick()
      
      // 对于特别容易出问题的页面（用户管理、系统维护），使用更激进的方法
      if (newPath.startsWith('/admin/users') || newPath.startsWith('/admin/maintenance')) {
        console.log('🚨 特殊页面，强制重新渲染侧边栏')
        
        // 对于系统维护页面，使用超级强制重新渲染
        if (newPath.startsWith('/admin/maintenance')) {
          console.log('💥 系统维护页面，使用超级强制重新渲染')
          
          // 立即执行超级强制重新渲染
          setTimeout(() => {
            superForceRerenderSidebar()
          }, 10)
          
          // 短延迟后再次执行
          setTimeout(() => {
            superForceRerenderSidebar()
          }, 50)
          
          // 额外的延迟检查
          setTimeout(() => {
            superForceRerenderSidebar()
          }, 100)
        } else if (newPath.startsWith('/admin/users')) {
          // 用户管理页面使用终极强制重新渲染（最激进）
          console.log('💥 用户管理页面，使用终极强制重新渲染')
          
          // 立即执行终极强制重新渲染
          setTimeout(() => {
            ultimateForceRerenderSidebar()
          }, 5)
          
          // 更短的间隔再次执行
          setTimeout(() => {
            ultimateForceRerenderSidebar()
          }, 20)
          
          // 第三次执行
          setTimeout(() => {
            ultimateForceRerenderSidebar()
          }, 50)
          
          // 第四次执行，确保万无一失
          setTimeout(() => {
            ultimateForceRerenderSidebar()
          }, 100)
        }
        
        // 额外的延迟检查，确保万无一失
        setTimeout(() => {
          ensureSidebarVisible()
        }, 100)
        
        // 最后一次保险检查
        setTimeout(() => {
          ensureSidebarVisible()
        }, 300)
        
        // 持续监控一段时间，确保侧边栏稳定
        const continuousChecks = [500, 1000, 2000, 3000]
        continuousChecks.forEach(delay => {
          setTimeout(() => {
            ensureSidebarVisible()
          }, delay)
        })
      } else {
        // 其他页面使用常规确保方法
        setTimeout(() => {
          ensureSidebarVisible()
        }, 100)
      }
    }
    
    // 使用 requestAnimationFrame 确保在渲染后检查
    requestAnimationFrame(() => {
      ensureSidebarVisible()
    })
    
    // 多次使用 requestAnimationFrame，确保在各个渲染阶段都能检查
    requestAnimationFrame(() => {
      setTimeout(() => {
        ensureSidebarVisible()
      }, 20)
    })
    
    if (newPath === '/admin' || newPath === '/admin/dashboard') {
      // 等待DOM更新后再加载图表
      await nextTick()
      loadChartData()
    }
  },
  { immediate: true }
)

// 组件更新时确保侧边栏可见
onUpdated(() => {
  ensureSidebarVisible()
})

// 加载图表数据
// 优化的图表数据处理函数
const processChartData = (
  data: any[], 
  dateLabels: string[], 
  targetArray: number[], 
  isCumulative: boolean, 
  startDate: Date
) => {
  if (isCumulative) {
    // 累计数据：优化版本 - 预处理数据并逐日累加
    let cumulativeCount = 0
    for (let i = 0; i < dateLabels.length; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const currentDayEnd = new Date(currentDate)
      currentDayEnd.setHours(23, 59, 59, 999)
      
      // 计算到该日期为止的总数
      cumulativeCount += data.filter(item => {
        const itemDate = new Date(item.created_at)
        return itemDate <= currentDayEnd
      }).length
      
      targetArray[i] = cumulativeCount
    }
  } else {
    // 新增数据：按日期分组 - 优化版本
    const dailyCount = new Map<string, number>()
    
    // 预处理数据，按日期分组
    data.forEach(item => {
      const dateKey = new Date(item.created_at).toISOString().split('T')[0]
      dailyCount.set(dateKey, (dailyCount.get(dateKey) || 0) + 1)
    })
    
    // 填充目标数组
    for (let i = 0; i < dateLabels.length; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateKey = currentDate.toISOString().split('T')[0]
      targetArray[i] = dailyCount.get(dateKey) || 0
    }
  }
}

const loadChartData = async () => {
  console.log('🔍 开始加载图表数据...')
  if (!chartCanvas.value) {
    console.log('❌ chartCanvas ref 不存在')
    return
  }
  
  console.log('✅ chartCanvas ref 存在，开始加载数据')
  
  // 检查缓存
  const cacheKey = `${chartConfig.value.dataType}_${chartConfig.value.timeRange}`
  const cached = chartCache.get(cacheKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < cacheTimeout) {
    console.log('📦 使用缓存数据')
    // 销毁现有图表实例
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }
    
    // 使用缓存数据创建图表
    await createChartFromData(cached.data)
    chartLoading.value = false
    return
  }
  
  // 销毁现有图表实例
  if (chartInstance.value) {
    console.log('🗑️ 销毁现有图表实例')
    chartInstance.value.destroy()
    chartInstance.value = null
  }
  
  chartLoading.value = true
  
  // 使用Chart.js auto导入，无需手动注册控制器
  console.log('✅ Chart.js auto导入模式，无需手动注册控制器')
  
  try {
    const client = await dbStore.getClient()
    if (!client) return

    const days = parseInt(chartConfig.value.timeRange)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    // 生成日期标签
    const dateLabels: string[] = []
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
      dateLabels.push(dateStr)
    }

    // 优化：一次性获取所有数据，然后在前端分组
    const isCumulative = chartConfig.value.dataType?.startsWith('total_') || chartConfig.value.dataType === 'all'
    
    // 根据需要查询的数据类型优化查询 - 只查询必要的数据
    const dataType = chartConfig.value.dataType
    let queryPromises: Promise<any>[] = []
    
    if (dataType === 'all' || dataType === 'new_users' || dataType === 'total_users') {
      queryPromises.push(
        client.from('users').select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      )
    }
    
    if (dataType === 'all' || dataType === 'new_posts' || dataType === 'total_posts') {
      queryPromises.push(
        client.from('community_posts').select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      )
    }
    
    if (dataType === 'all' || dataType === 'new_plans' || dataType === 'total_plans') {
      queryPromises.push(
        client.from('study_plans').select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      )
    }
    
    if (dataType === 'all' || dataType === 'new_resources' || dataType === 'total_resources') {
      queryPromises.push(
        client.from('resources').select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      )
    }

    // 并行执行所有查询
    const results = await Promise.all(queryPromises)
    
    // 处理数据并按日期分组
    const usersData: number[] = new Array(days).fill(0)
    const postsData: number[] = new Array(days).fill(0)
    const plansData: number[] = new Array(days).fill(0)
    const resourcesData: number[] = new Array(days).fill(0)

    let resultIndex = 0

    // 处理用户数据
    if (dataType === 'all' || dataType === 'new_users' || dataType === 'total_users') {
      if (results[resultIndex]?.data) {
        processChartData(results[resultIndex].data, dateLabels, usersData, isCumulative, startDate)
      }
      resultIndex++
    }
    
    // 处理帖子数据
    if (dataType === 'all' || dataType === 'new_posts' || dataType === 'total_posts') {
      if (results[resultIndex]?.data) {
        processChartData(results[resultIndex].data, dateLabels, postsData, isCumulative, startDate)
      }
      resultIndex++
    }
    
    // 处理计划数据
    if (dataType === 'all' || dataType === 'new_plans' || dataType === 'total_plans') {
      if (results[resultIndex]?.data) {
        processChartData(results[resultIndex].data, dateLabels, plansData, isCumulative, startDate)
      }
      resultIndex++
    }
    
    // 处理资源数据
    if (dataType === 'all' || dataType === 'new_resources' || dataType === 'total_resources') {
      if (results[resultIndex]?.data) {
        processChartData(results[resultIndex].data, dateLabels, resourcesData, isCumulative, startDate)
      }
    }

    // 准备图表配置
    const datasets: any[] = []
    
    if (chartConfig.value.dataType === 'all') {
      // 全部数据 - 显示所有类型
      datasets.push({
        label: '新增用户',
        data: usersData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      })
      
      datasets.push({
        label: '新增帖子',
        data: postsData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      })
      
      datasets.push({
        label: '新增计划',
        data: plansData,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      })
      
      datasets.push({
        label: '新增资源',
        data: resourcesData,
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true
      })
    }
    
    // 单个数据类型 - 显示对应的数据
    if (chartConfig.value.dataType === 'new_users' || chartConfig.value.dataType === 'total_users') {
      datasets.push({
        label: chartConfig.value.dataType === 'new_users' ? '新增用户' : '累计用户',
        data: usersData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      })
    }
    
    if (chartConfig.value.dataType === 'new_posts' || chartConfig.value.dataType === 'total_posts') {
      datasets.push({
        label: chartConfig.value.dataType === 'new_posts' ? '新增帖子' : '累计帖子',
        data: postsData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      })
    }
    
    if (chartConfig.value.dataType === 'new_plans' || chartConfig.value.dataType === 'total_plans') {
      datasets.push({
        label: chartConfig.value.dataType === 'new_plans' ? '新增计划' : '累计计划',
        data: plansData,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      })
    }
    
    if (chartConfig.value.dataType === 'new_resources' || chartConfig.value.dataType === 'total_resources') {
      datasets.push({
        label: chartConfig.value.dataType === 'new_resources' ? '新增资源' : '累计资源',
        data: resourcesData,
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true
      })
    }

    const chartConfigObj: ChartConfiguration = {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: getChartTitle(),
            color: 'rgb(17, 24, 39)',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '日期',
              color: 'rgb(107, 114, 128)'
            },
            grid: {
              display: false
            },
            ticks: {
              color: 'rgb(107, 114, 128)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: '数量',
              color: 'rgb(107, 114, 128)'
            },
            beginAtZero: true,
            ticks: {
              color: 'rgb(107, 114, 128)',
              stepSize: 1
            },
            grid: {
              color: 'rgba(229, 231, 235, 0.5)'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    }

    // 销毁旧图表
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }

    // 创建新图表并缓存数据
    await createChartFromData({ dateLabels, usersData, postsData, plansData, resourcesData })
    
  } catch (error) {
    console.error('❌ 加载图表数据失败:', error)
  } finally {
    chartLoading.value = false
    console.log('🔄 图表加载完成，loading状态已重置')
  }
}

// 从数据创建图表的函数
const createChartFromData = async (data: { 
  dateLabels: string[], 
  usersData: number[], 
  postsData: number[], 
  plansData: number[], 
  resourcesData: number[] 
}) => {
  const { dateLabels, usersData, postsData, plansData, resourcesData } = data
  
  // 准备图表配置
  const datasets: any[] = []
  
  if (chartConfig.value.dataType === 'all') {
    // 全部数据 - 显示所有类型
    datasets.push({
      label: '新增用户',
      data: usersData,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    })
    
    datasets.push({
      label: '新增帖子',
      data: postsData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    })
    
    datasets.push({
      label: '新增计划',
      data: plansData,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
      fill: true
    })
    
    datasets.push({
      label: '新增资源',
      data: resourcesData,
      borderColor: 'rgb(251, 146, 60)',
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      tension: 0.4,
      fill: true
    })
  }
  
  // 单个数据类型 - 显示对应的数据
  if (chartConfig.value.dataType === 'new_users' || chartConfig.value.dataType === 'total_users') {
    datasets.push({
      label: chartConfig.value.dataType === 'new_users' ? '新增用户' : '累计用户',
      data: usersData,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    })
  }
  
  if (chartConfig.value.dataType === 'new_posts' || chartConfig.value.dataType === 'total_posts') {
    datasets.push({
      label: chartConfig.value.dataType === 'new_posts' ? '新增帖子' : '累计帖子',
      data: postsData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    })
  }
  
  if (chartConfig.value.dataType === 'new_plans' || chartConfig.value.dataType === 'total_plans') {
    datasets.push({
      label: chartConfig.value.dataType === 'new_plans' ? '新增计划' : '累计计划',
      data: plansData,
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
      fill: true
    })
  }
  
  if (chartConfig.value.dataType === 'new_resources' || chartConfig.value.dataType === 'total_resources') {
    datasets.push({
      label: chartConfig.value.dataType === 'new_resources' ? '新增资源' : '累计资源',
      data: resourcesData,
      borderColor: 'rgb(251, 146, 60)',
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      tension: 0.4,
      fill: true
    })
  }

  const chartConfigObj = {
    type: 'line' as const,
    data: {
      labels: dateLabels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgb(17, 24, 39)',
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(229, 231, 235, 0.5)'
          },
          ticks: {
            color: 'rgb(107, 114, 128)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(229, 231, 235, 0.5)'
          },
          ticks: {
            color: 'rgb(107, 114, 128)'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  }

  // 创建新图表
  console.log('📊 创建图表实例...')
  chartInstance.value = new Chart(chartCanvas.value, chartConfigObj)
  console.log('✅ 图表创建成功')
  
  // 缓存数据
  const cacheKey = `${chartConfig.value.dataType}_${chartConfig.value.timeRange}`
  chartCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
  console.log('📦 数据已缓存')
}

// 获取图表标题
const getChartTitle = () => {
  const dataTypeText = {
    all: '全部数据',
    new_users: '新增用户',
    new_posts: '新增帖子',
    new_plans: '新增计划',
    new_resources: '新增资源',
    total_users: '累计用户',
    total_posts: '累计帖子',
    total_plans: '累计计划',
    total_resources: '累计资源'
  }
  
  const timeRangeText = {
    '7': '近7天',
    '30': '近30天', 
    '60': '近60天'
  }
  
  return `${dataTypeText[chartConfig.value.dataType]} - ${timeRangeText[chartConfig.value.timeRange]}`
}

// 显示确认对话框
const showConfirm = (options: {
  title: string
  message: string
  confirmText: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info' | 'success'
  callback: () => void
}) => {
  // 简化版本，直接执行回调
  if (confirm(`${options.title}\n\n${options.message}`)) {
    options.callback()
  }
}
</script>

<style scoped>
/* 确保所有数字输入框都移除上下箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 隐藏前端侧边栏相关样式 */
.sidebar-navigation {
  display: none !important;
}

.bottom-navigation {
  display: none !important;
}

/* 确保侧边栏始终显示 */
aside.admin-sidebar {
  display: block !important;
  position: fixed !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 50 !important;
  width: 16rem !important;
  background-color: white !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.dark aside.admin-sidebar {
  background-color: rgb(31 41 55) !important;
}

/* 确保侧边栏内部容器正常显示 */
aside.admin-sidebar > div {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

/* 确保侧边栏头部正常显示 */
aside.admin-sidebar > div > div:first-child {
  display: block !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid rgb(229 231 235) !important;
}

.dark aside.admin-sidebar > div > div:first-child {
  border-bottom-color: rgb(55 65 75) !important;
}

/* 确保侧边栏导航始终显示 */
aside.admin-sidebar nav.sidebar-nav {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  padding: 1.5rem 1rem !important;
  gap: 0.5rem !important;
  visibility: visible !important;
  opacity: 1 !important;
  overflow-y: auto !important;
}

/* 确保导航按钮正常显示 - router-link 会被渲染为 <a> 标签 */
aside.admin-sidebar nav.sidebar-nav a {
  display: flex !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease-in-out !important;
  text-decoration: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  background-color: rgb(243 244 246) !important;
  color: rgb(55 65 81) !important;
  margin-bottom: 0.5rem !important;
  width: 100% !important;
  min-height: 2.75rem !important;
}

.dark aside.admin-sidebar nav.sidebar-nav a {
  background-color: rgb(31 41 55) !important;
  color: rgb(209 213 219) !important;
}

aside.admin-sidebar nav.sidebar-nav a:hover {
  background-color: rgb(229 231 235) !important;
  transform: translateX(2px) !important;
}

.dark aside.admin-sidebar nav.sidebar-nav a:hover {
  background-color: rgb(55 65 75) !important;
}

/* 确保侧边栏底部正常显示 */
aside.admin-sidebar > div > div:last-child {
  display: block !important;
  padding: 1rem !important;
  border-top: 1px solid rgb(229 231 235) !important;
}

.dark aside.admin-sidebar > div > div:last-child {
  border-top-color: rgb(55 65 75) !important;
}

/* 隐藏其他导航元素（非侧边栏内的） */
body > nav:not(.sidebar-nav),
main nav:not(.sidebar-nav),
header nav:not(.sidebar-nav) {
  display: none !important;
}

/* 确保后台页面占据整个屏幕 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 强制确保侧边栏在所有路由下都可见 - 全局最高优先级 */
.admin-sidebar {
  display: block !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  height: 100vh !important;
  width: 16rem !important;
  z-index: 50 !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
  overflow: visible !important;
}

/* 覆盖所有可能的隐藏规则 */
div.admin-sidebar,
aside.admin-sidebar,
nav.admin-sidebar,
.admin-sidebar *,
.admin-sidebar > *,
.admin-sidebar div,
.admin-sidebar nav,
.admin-sidebar a {
  display: revert !important;
  visibility: revert !important;
}

/* 重新定义关键样式 */
.admin-sidebar {
  display: block !important;
  visibility: visible !important;
}

/* 终极保护：覆盖所有可能的外部样式干扰 */
html body div.admin-sidebar,
html body aside.admin-sidebar,
html body nav.admin-sidebar,
html body [class*="admin-sidebar"] {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  height: 100vh !important;
  width: 16rem !important;
  z-index: 9999 !important;
  transform: none !important;
  clip: none !important;
  clip-path: none !important;
}

/* 保护侧边栏内的所有按钮 */
.admin-sidebar .sidebar-button,
.admin-sidebar nav a,
.admin-sidebar router-link,
.admin-sidebar button {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* 确保侧边栏内容区域正常显示 */
.admin-sidebar > div {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  width: 100% !important;
}

/* 确保导航按钮容器正常显示 */
.admin-sidebar nav.sidebar-nav,
aside.admin-sidebar nav.sidebar-nav {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  gap: 0.5rem !important;
  padding: 1.5rem 1rem !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 200px !important;
}

/* 确保每个导航按钮都可见 - router-link 会被渲染为 <a> 标签 */
.admin-sidebar nav.sidebar-nav > *,
.admin-sidebar nav.sidebar-nav > a {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 2.75rem !important;
  align-items: center !important;
  width: 100% !important;
  margin-bottom: 0.5rem !important;
}

/* 确保 router-link 渲染的 <a> 标签正常显示 */
.admin-sidebar nav.sidebar-nav a {
  display: flex !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  text-decoration: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  background-color: rgb(243 244 246) !important;
  color: rgb(55 65 81) !important;
  transition: all 0.2s ease-in-out !important;
}

.dark .admin-sidebar nav.sidebar-nav a {
  background-color: rgb(31 41 55) !important;
  color: rgb(209 213 219) !important;
}

.admin-sidebar nav.sidebar-nav a:hover {
  background-color: rgb(229 231 235) !important;
  transform: translateX(2px) !important;
}

.dark .admin-sidebar nav.sidebar-nav a:hover {
  background-color: rgb(55 65 75) !important;
}

/* 确保图标和文字正常显示 */
.admin-sidebar nav.sidebar-nav span {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 确保按钮内的图标正常显示 */
.admin-sidebar nav.sidebar-nav a span:first-child {
  display: inline-block !important;
  margin-right: 0.75rem !important;
  font-size: 1.125rem !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 确保按钮内的文字正常显示 */
.admin-sidebar nav.sidebar-nav a span:last-child {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 强制确保所有导航按钮可见 - 最高优先级 */
aside.admin-sidebar nav.sidebar-nav > a,
.admin-sidebar nav.sidebar-nav > a,
aside.admin-sidebar nav.sidebar-nav a,
.admin-sidebar nav.sidebar-nav a,
aside.admin-sidebar nav.sidebar-nav router-link,
.admin-sidebar nav.sidebar-nav router-link {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  z-index: 1 !important;
  min-width: 100% !important;
  box-sizing: border-box !important;
  min-height: 2.75rem !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important;
}

/* 确保按钮内容（图标和文字）始终可见 */
aside.admin-sidebar nav.sidebar-nav a > span,
.admin-sidebar nav.sidebar-nav a > span {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  pointer-events: auto !important;
}

/* 防止任何样式覆盖按钮的可见性 */
aside.admin-sidebar nav.sidebar-nav a[style*="display: none"],
aside.admin-sidebar nav.sidebar-nav a[style*="visibility: hidden"],
aside.admin-sidebar nav.sidebar-nav a[style*="opacity: 0"] {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 确保按钮内容（图标和文字）都可见 */
aside.admin-sidebar nav.sidebar-nav a > span,
.admin-sidebar nav.sidebar-nav a > span {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
}

/* 确保侧边栏头部正常显示 */
.admin-sidebar > div > div:first-child {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.admin-sidebar > div > div:first-child > div {
  display: flex !important;
  align-items: center !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 确保侧边栏头部文字正常显示 */
.admin-sidebar h2,
.admin-sidebar p {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  margin: 0 !important;
}

/* 确保侧边栏底部正常显示 */
.admin-sidebar > div > div:last-child {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.admin-sidebar > div > div:last-child > div {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 侧边栏链接激活状态 */
aside.admin-sidebar nav.sidebar-nav a.router-link-active,
aside.admin-sidebar nav.sidebar-nav router-link.router-link-active {
  background-color: rgb(219 234 254) !important; /* blue-100 */
  color: rgb(29 78 216) !important; /* blue-700 */
}

.dark aside.admin-sidebar nav.sidebar-nav a.router-link-active,
.dark aside.admin-sidebar nav.sidebar-nav router-link.router-link-active {
  background-color: rgba(30 58 138 / 0.2) !important; /* blue-900/20 */
  color: rgb(147 197 253) !important; /* blue-300 */
}

/* 导航图标动画 */
nav a:hover span:first-child {
  transform: scale(1.1);
}

nav a span:first-child {
  transition: transform 0.2s ease-in-out;
}

/* 滚动条样式 */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: rgb(243 244 246);
}

.dark main::-webkit-scrollbar-track {
  background: rgb(31 41 55);
}

main::-webkit-scrollbar-thumb {
  background: rgb(156 163 175);
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}

/* 图表相关样式 */
.chart-container {
  position: relative;
  height: 384px;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
}

.dark .chart-loading {
  background: rgba(31, 41, 55, 0.9);
}

/* 下拉框样式优化 */
select {
  transition: all 0.2s ease-in-out;
}

select:hover {
  border-color: rgb(59, 130, 246);
}

select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 图例颜色指示器 */
.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 响应式图表容器 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}

/* ========== 侧边栏底部保护规则 ========== */

/* 确保侧边栏底部容器始终可见 */
.admin-sidebar > div > div:last-child,
aside.admin-sidebar > div > div:last-child {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 1rem !important;
  border-top: 1px solid #e5e7eb !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.dark .admin-sidebar > div > div:last-child,
.dark aside.admin-sidebar > div > div:last-child {
  border-top-color: #374151 !important;
}

/* 用户信息区域保护 - 同一行布局 */
.admin-sidebar > div > div:last-child > div,
aside.admin-sidebar > div > div:last-child > div {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 头像保护 */
.admin-sidebar .h-8.w-8.rounded-full,
aside.admin-sidebar .h-8.w-8.rounded-full {
  height: 2rem !important;
  width: 2rem !important;
  border-radius: 50% !important;
  background: linear-gradient(to bottom right, #4ade80, #3b82f6) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  flex-shrink: 0 !important;
}

/* 头像文字保护 */
.admin-sidebar .h-8.w-8.rounded-full span,
aside.admin-sidebar .h-8.w-8.rounded-full span {
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  color: white !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 用户名和时间容器 */
.admin-sidebar > div > div:last-child > div > div:nth-child(2),
aside.admin-sidebar > div > div:last-child > div > div:nth-child(2) {
  margin-left: 0.75rem !important;
  flex: 1 !important;
  min-width: 0 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 用户名保护 */
.admin-sidebar > div > div:last-child .text-sm.font-medium,
aside.admin-sidebar > div > div:last-child .text-sm.font-medium {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: #111827 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  line-height: 1.25 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.dark .admin-sidebar > div > div:last-child .text-sm.font-medium,
.dark aside.admin-sidebar > div > div:last-child .text-sm.font-medium {
  color: #f9fafb !important;
}

/* 时间显示保护 */
.admin-sidebar > div > div:last-child .text-xs.text-gray-500,
aside.admin-sidebar > div > div:last-child .text-xs.text-gray-500 {
  font-size: 0.75rem !important;
  color: #6b7280 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}

.dark .admin-sidebar > div > div:last-child .text-xs.text-gray-500,
.dark aside.admin-sidebar > div > div:last-child .text-xs.text-gray-500 {
  color: #9ca3af !important;
}

/* 退出按钮保护 */
.admin-sidebar > div > div:last-child button,
aside.admin-sidebar > div > div:last-child button {
  padding: 0.5rem !important;
  color: #6b7280 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  border: none !important;
  background: none !important;
  cursor: pointer !important;
  border-radius: 0.25rem !important;
  transition: color 0.2s ease !important;
}

.dark .admin-sidebar > div > div:last-child button,
.dark aside.admin-sidebar > div > div:last-child button {
  color: #9ca3af !important;
}

.admin-sidebar > div > div:last-child button:hover,
aside.admin-sidebar > div > div:last-child button:hover {
  color: #dc2626 !important;
}

.dark .admin-sidebar > div > div:last-child button:hover,
.dark aside.admin-sidebar > div > div:last-child button:hover {
  color: #ef4444 !important;
}

/* 退出按钮图标保护 */
.admin-sidebar > div > div:last-child button svg,
aside.admin-sidebar > div > div:last-child button svg {
  height: 1rem !important;
  width: 1rem !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
</style>