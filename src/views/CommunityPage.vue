<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      <!-- 左侧边栏 - 固定区域 -->
      <div class="lg:col-span-1 space-y-6 lg:sticky lg:top-0 lg:pt-6 lg:self-start lg:h-fit">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg class="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            学习社区
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">与学习伙伴交流，分享学习经验</p>
        </div>
        <!-- 搜索框 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div class="flex space-x-2">
            <div class="relative flex-1">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="搜索社区内容" 
                v-model="searchKeyword"
                @keyup.enter="performSearch"
                @input="handleSearchInput"
                @keyup.escape="clearSearch"
                class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg outline-none text-sm"
              />
            </div>
            <button
              @click="performSearch"
              :disabled="isSearching"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
            >
              <svg v-if="isSearching" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C6.47 4 4 5.47 4 8s-.47 4-4 4 4.47 4 4zm0 0a8 8 0 1008z"></path>
              </svg>
              <span v-else>搜索</span>
            </button>
          </div>
          
          <!-- 搜索结果提示 -->
          <div v-if="showSearchResults && searchKeyword" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between">
              <span class="text-sm text-blue-700 dark:text-blue-300">
                搜索 "{{ searchKeyword }}" 的结果：{{ filteredPosts.length }} 条
              </span>
              <button 
                @click="clearSearch"
                class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                清除搜索
              </button>
            </div>
          </div>
        </div>
        
        <!-- 发表我的经验按钮 -->
        <button 
          @click="showCreatePostModal = true"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl p-4 shadow-md transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5h-1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5H3a2 2 0 00-2-2V4a2 2 0 012-2h7m-1 4v4h8v-4m0 0V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1m5-1h7a2 2 0 012 2v4a2 2 0 01-2 2h-7a2 2 0 01-2-2v-4z"></path>
          </svg>
          <span>发表我的经验</span>
        </button>
        
        <!-- 热门标签 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <h3 class="font-semibold mb-4 flex items-center">
            <svg class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            热门标签
          </h3>
          <div v-if="popularTags.length > 0" class="flex flex-wrap gap-2">
            <a 
              v-for="tag in popularTags"
              :key="tag.id"
              href="#" 
              @click="filterByTag(tag.name)"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {{ tag.name }}
              <span class="ml-1 text-xs opacity-70">({{ tag.count }})</span>
            </a>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
            暂无热门标签
          </div>
        </div>
      </div>

      <!-- 主内容区 - 帖子列表 -->
      <div class="lg:col-span-3">
        <!-- 加载动画 - 优先显示 -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-lg text-gray-600 dark:text-gray-300">正在加载帖子...</span>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="hasError" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium mb-2 text-red-600">加载失败</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">{{ errorMessage || '无法加载帖子，请稍后重试' }}</p>
          <button 
            @click="retryLoading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            重新加载
          </button>
        </div>
        
        <!-- 搜索无结果 -->
        <div v-else-if="(showSearchResults && filteredPosts.length === 0)" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 class="text-lg font-medium mb-2">未找到相关内容</h3>
          <p class="text-gray-500 dark:text-gray-400">尝试使用其他关键词搜索</p>
        </div>

        <!-- 空状态（没有帖子且不在搜索状态） -->
        <div v-else-if="!showSearchResults && posts.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <h3 class="text-lg font-medium mb-2 text-gray-600 dark:text-gray-400">暂无社区帖子</h3>
          <p class="text-gray-500 dark:text-gray-500">快来发表你的第一个学习经验吧！</p>
        </div>

        <!-- 帖子列表 -->
        <div v-else class="space-y-6">
          <div 
            v-for="(post, index) in paginatedPosts"
            :key="post.id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer group"
            @click="viewPostDetail(post.id)"
          >
            <!-- 帖子内容 -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {{ post.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {{ post.content }}
                  </p>
                </div>
                
                <!-- 点赞和收藏按钮 - 右上角横向排列 -->
                <div class="ml-4 flex space-x-3">
                  <!-- 点赞按钮 -->
                  <button 
                    @click.stop="toggleLike(post)"
                    :disabled="isLiking"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    :class="post.is_liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span class="text-sm font-medium">{{ post.like_count || 0 }}</span>
                  </button>
                  
                  <!-- 收藏按钮 -->
                  <button 
                    @click.stop="toggleFavorite(post)"
                    :disabled="isFavoriting"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors disabled:opacity-50"
                    :class="post.is_favorited ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-700'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <span class="text-sm font-medium">{{ post.favorite_count || 0 }}</span>
                  </button>
                </div>
              </div>
              
              <!-- 帖子元信息 -->
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {{ post.author || '匿名用户' }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 002.828 0l.586-.586c.391-.39.586-.902.586-1.414V15a2 2 0 01-2 2H7a2 2 0 01-2-2v-4c0-.814.195-1.523.586-1.914L7.414 5.586C7.004 5.195 6.492 5 6 5z"></path>
                    </svg>
                    {{ post.category || '未分类' }}
                  </span>
                </div>
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              
              <!-- 标签 -->
              <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
                <span 
                  v-for="tag in post.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div v-if="totalPages > 0" class="mt-8 flex justify-center items-center">
          <!-- 多页时显示完整分页控件 -->
          <template v-if="totalPages > 1">
            <div class="flex items-center space-x-2">
              <!-- 上一页按钮 -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- 第一页 -->
              <button
                v-if="getPageNumbers()[0] > 1"
                @click="goToPage(1)"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                1
              </button>

              <!-- 省略号 -->
              <span v-if="getPageNumbers()[0] > 2" class="px-2 text-gray-500 dark:text-gray-400">...</span>

              <!-- 页码按钮 -->
              <button
                v-for="page in getPageNumbers()"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-lg border transition-colors',
                  currentPage === page
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>

              <!-- 省略号 -->
              <span v-if="getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1" class="px-2 text-gray-500 dark:text-gray-400">...</span>

              <!-- 最后一页 -->
              <button
                v-if="getPageNumbers()[getPageNumbers().length - 1] < totalPages"
                @click="goToPage(totalPages)"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {{ totalPages }}
              </button>

              <!-- 下一页按钮 -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <!-- 页面信息 -->
              <div class="ml-4 text-sm text-gray-500 dark:text-gray-400">
                第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
              </div>
            </div>
          </template>
          
          <!-- 只有一页时显示简化信息 -->
          <template v-else>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 创建帖子弹窗 -->
    <div v-if="showCreatePostModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">发表学习经验</h2>
          <button 
            @click="closeCreatePostModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="createPost" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
            <input
              v-model="newPost.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="分享你的学习心得..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">内容</label>
            <textarea
              v-model="newPost.content"
              rows="6"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="详细描述你的学习经验、遇到的问题和解决方法..."
            ></textarea>
            
            <!-- 从资源中选择按钮 -->
            <div class="mt-2">
              <button
                type="button"
                @click="showResourceSelector = true"
                class="flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>从我的资源中选择</span>
              </button>
            </div>
            
            <!-- 已选择的资源显示 -->
            <div v-if="selectedResource" class="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <span class="text-sm font-medium text-purple-700 dark:text-purple-300">已选择资源</span>
                  </div>
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">{{ selectedResource.title }}</span>
                    <span v-if="selectedResource.type" class="ml-2 px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                      {{ selectedResource.type }}
                    </span>
                  </div>
                  <div v-if="selectedResource.description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ selectedResource.description }}
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeSelectedResource"
                  class="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
            <select
              v-model="newPost.category"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">选择分类</option>
              <option value="前端开发">前端开发</option>
              <option value="后端开发">后端开发</option>
              <option value="算法与数据结构">算法与数据结构</option>
              <option value="数据库">数据库</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in newPost.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center"
                >
                  {{ tag }}
                  <button 
                    type="button"
                    @click="removeTag(tag)"
                    class="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex space-x-2">
                <input
                  v-model="customTag"
                  type="text"
                  @keyup.enter="addCustomTag"
                  class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="输入自定义标签..."
                />
                <button
                  type="button"
                  @click="addCustomTag"
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  添加
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreatePostModal"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C6.47 4 4 5.47 4 8s-.47 4-4 4 4.47 4 4zm0 0a8 8 0 1008z"></path>
              </svg>
              {{ isSubmitting ? '发布中...' : '发布经验' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 资源选择器模态框 -->
    <div v-if="showResourceSelector" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg class="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            选择资源进行经验分享
          </h2>
          <button 
            @click="showResourceSelector = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <!-- 加载状态 -->
          <div v-if="isLoadingResources" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-purple-500 hover:bg-purple-400 transition ease-in-out duration-150">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              加载我的资源...
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="myResources.length === 0" class="text-center py-8">
            <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无资源</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">您还没有创建任何学习资源</p>
            <button 
              @click="navigateToCreateResource"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              创建第一个资源
            </button>
          </div>

          <!-- 资源列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="resource in paginatedResources"
              :key="resource.id"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300 dark:hover:border-purple-600"
              @click="selectResource(resource)"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">{{ resource.title }}</h4>
                    <span :class="`px-2 py-1 text-xs rounded-full ${getResourceTypeColor(resource.type)}`">
                      {{ resource.type }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ resource.description }}
                  </p>
                </div>
              </div>
              
              <!-- 资源详细信息 -->
              <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div v-if="resource.category" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  {{ resource.category }}
                </div>
                <div v-if="resource.difficulty" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  {{ resource.difficulty }}
                </div>
                <div v-if="resource.duration" class="flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ resource.duration }}
                </div>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
          <div v-if="myResources.length > 0 && resourceTotalPages > 1" class="flex flex-col items-center space-y-4 mt-6">
            <!-- 第一行：导航按钮 -->
            <div class="flex justify-center items-center space-x-2">
              <!-- 上一页按钮 -->
              <button
                @click="changeResourcePage(resourceCurrentPage - 1)"
                :disabled="resourceCurrentPage <= 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- 页码按钮 -->
              <div class="flex space-x-1">
                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="changeResourcePage(page)"
                  :class="`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    resourceCurrentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`"
                >
                  {{ page }}
                </button>
              </div>

              <!-- 省略号和最后一页 -->
              <template v-if="resourceTotalPages > 5">
                <span class="text-sm text-gray-500 dark:text-gray-400">...</span>
                <button
                  @click="changeResourcePage(resourceTotalPages)"
                  :class="`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    resourceCurrentPage === resourceTotalPages
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`"
                >
                  {{ resourceTotalPages }}
                </button>
              </template>

              <!-- 下一页按钮 -->
              <button
                @click="changeResourcePage(resourceCurrentPage + 1)"
                :disabled="resourceCurrentPage >= resourceTotalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- 第二行：页面跳转输入框 -->
            <div class="flex items-center justify-center space-x-3">
              <span class="text-sm text-gray-500 dark:text-gray-400">跳转到页面：</span>
              
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="gotoPageInput"
                  @keyup.enter="handleGotoPage"
                  type="number"
                  :min="1"
                  :max="resourceTotalPages"
                  class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  placeholder="页码"
                />
                
                <button
                  @click="handleGotoPage"
                  :disabled="!gotoPageInput || gotoPageInput < 1 || gotoPageInput > resourceTotalPages"
                  class="px-3 py-1 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  跳转
                </button>
              </div>
              
              <span class="text-sm text-gray-400 dark:text-gray-500">（共{{ resourceTotalPages }}页）</span>
            </div>
          </div>

          <!-- 分页信息 -->
          <div v-if="myResources.length > 0" class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            显示第 {{ (resourceCurrentPage - 1) * resourcePageSize + 1 }} - {{ Math.min(resourceCurrentPage * resourcePageSize, myResources.length) }} 个资源，共 {{ myResources.length }} 个
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="showResourceSelector = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'

const router = useRouter()

// 响应式数据
const posts = ref<any[]>([])
const filteredPosts = ref<any[]>([])
const popularTags = ref<any[]>([])
const searchKeyword = ref('')
const isSearching = ref(false)
const showSearchResults = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const showCreatePostModal = ref(false)
const showResourceSelector = ref(false)
const isSubmitting = ref(false)
const isLiking = ref(false)
const isFavoriting = ref(false)
const newPost = ref({
  title: '',
  content: '',
  category: '',
  tags: []
})
const customTag = ref('')
const myResources = ref<any[]>([])
const selectedResource = ref<any>(null)
const isLoadingResources = ref(false)

// 资源选择器分页相关
const resourceCurrentPage = ref(1)
const resourcePageSize = ref(6) // 每页显示6个资源
const resourceTotalPages = ref(0)
const paginatedResources = ref<any[]>([])
const gotoPageInput = ref('') // 页面跳转输入框

const dbStore = useDatabaseStore()

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 计算当前页显示的帖子列表
const paginatedPosts = ref<any[]>([])

// 计算分页数据
const updatePagination = () => {
  const currentPosts = showSearchResults.value ? filteredPosts.value : posts.value
  totalPages.value = Math.ceil(currentPosts.length / pageSize.value)
  
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  paginatedPosts.value = currentPosts.slice(startIndex, endIndex)
  
  // 如果当前页超出了总页数，自动调整到最后一页
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
    updatePagination()
  }
  
  console.log(`📄 分页更新: 第${currentPage.value}页/共${totalPages.value}页, 显示${paginatedPosts.value.length}个帖子`)
}

// 分页控制方法
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    updatePagination()
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  goToPage(currentPage.value - 1)
}

const nextPage = () => {
  goToPage(currentPage.value + 1)
}

// 生成页码数组
const getPageNumbers = () => {
  const pages = []
  const maxVisiblePages = 5 // 最多显示5个页码
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 当前页靠近开始
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    }
    // 当前页靠近结束
    else if (currentPage.value >= totalPages.value - 2) {
      for (let i = totalPages.value - 4; i <= totalPages.value; i++) {
        pages.push(i)
      }
    }
    // 当前页在中间
    else {
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
}

// 处理搜索输入变化
const handleSearchInput = () => {
  if (!searchKeyword.value.trim()) {
    clearSearch()
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  showSearchResults.value = false
  filteredPosts.value = []
  isSearching.value = false
  currentPage.value = 1 // 清除搜索时重置到第一页
  updatePagination() // 更新分页显示
}

// 执行搜索
const performSearch = async () => {
  const keyword = searchKeyword.value.trim()
  
  if (!keyword) {
    clearSearch()
    return
  }
  
  isSearching.value = true
  showSearchResults.value = true
  
  try {
    if (posts.value.length === 0) {
      await loadPosts()
    }
    
    const keywordLower = keyword.toLowerCase()
    const matchedPosts = posts.value.filter(post => {
      if (post.title && post.title.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.content && post.content.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.category && post.category.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.author && post.author.toLowerCase().includes(keywordLower)) {
        return true
      }
      if (post.tags && Array.isArray(post.tags)) {
        const tagMatch = post.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
        )
        if (tagMatch) {
          return true
        }
      }
      return false
    })
    
    filteredPosts.value = matchedPosts
    currentPage.value = 1 // 搜索时重置到第一页
    updatePagination() // 更新分页
    
  } catch (error) {
    // 搜索失败处理
  } finally {
    isSearching.value = false
  }
}

// 查看帖子详情
const viewPostDetail = (postId: string) => {
  console.log('📖 查看帖子详情，ID:', postId)
  router.push(`/post/${postId}`)
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
    return date.toLocaleDateString('zh-CN')
  }
}

// 切换点赞
const toggleLike = async (post: any) => {
  if (isLiking.value) return
  
  isLiking.value = true
  try {
    // 获取当前用户ID
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再点赞')
      return
    }
    
    // 尝试使用Supabase数据库
    let databaseSuccess = false
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        
        if (post.is_liked) {
          // 取消点赞
          const { error } = await client
            .from('post_likes')
            .delete()
            .eq('user_id', currentUserId)
            .eq('post_id', post.id)
          
          if (error) {
            throw error
          }
          
          post.is_liked = false
          post.like_count = Math.max((post.like_count || 0) - 1, 0)
          console.log('✅ 数据库取消点赞成功')
        } else {
          // 添加点赞
          const { error } = await client
            .from('post_likes')
            .insert([{
              user_id: currentUserId,
              post_id: post.id
            }])
          
          if (error) {
            throw error
          }
          
          post.is_liked = true
          post.like_count = (post.like_count || 0) + 1
          console.log('✅ 数据库添加点赞成功')
        }
        
        databaseSuccess = true
        
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.warn('⚠️ 数据库连接失败，使用本地存储:', error.message)
      databaseSuccess = false
    }
    
    // 如果数据库操作失败，使用本地存储
    if (!databaseSuccess) {
      const localLikesKey = `edumatch_likes_${currentUserId}`
      let localLikes = JSON.parse(localStorage.getItem(localLikesKey) || '[]')
      
      if (post.is_liked) {
        // 取消点赞 - 从本地存储中移除
        localLikes = localLikes.filter(like => like.post_id !== post.id)
        post.is_liked = false
        post.like_count = Math.max((post.like_count || 0) - 1, 0)
        console.log('✅ 本地取消点赞成功')
      } else {
        // 添加点赞 - 添加到本地存储
        localLikes.push({
          post_id: post.id,
          user_id: currentUserId,
          timestamp: Date.now()
        })
        post.is_liked = true
        post.like_count = (post.like_count || 0) + 1
        console.log('✅ 本地添加点赞成功')
      }
      
      // 保存到本地存储
      localStorage.setItem(localLikesKey, JSON.stringify(localLikes))
    }
    
    // 操作完成后重新加载状态，确保数据一致性
    await reloadPostStatus(currentUserId)
    
  } catch (error) {
    console.error('点赞操作失败:', error)
    alert('操作失败，请稍后重试')
  } finally {
    isLiking.value = false
  }
}

// 切换收藏
const toggleFavorite = async (post: any) => {
  if (isFavoriting.value) return
  
  isFavoriting.value = true
  try {
    // 获取当前用户ID
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再收藏帖子')
      return
    }
    
    // 尝试使用Supabase数据库
    let databaseSuccess = false
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        
        if (post.is_favorited) {
          // 取消收藏
          const { error } = await client
            .from('post_favorites')
            .delete()
            .eq('user_id', currentUserId)
            .eq('post_id', post.id)
          
          if (error) {
            throw error
          }
          
          post.is_favorited = false
          post.favorite_count = Math.max((post.favorite_count || 0) - 1, 0)
          console.log('✅ 数据库取消收藏成功')
        } else {
          // 添加收藏
          const { error } = await client
            .from('post_favorites')
            .insert([{
              user_id: currentUserId,
              post_id: post.id
            }])
          
          if (error) {
            throw error
          }
          
          post.is_favorited = true
          post.favorite_count = (post.favorite_count || 0) + 1
          console.log('✅ 数据库添加收藏成功')
        }
        
        databaseSuccess = true
        
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.warn('⚠️ 数据库连接失败，使用本地存储:', error.message)
      databaseSuccess = false
    }
    
    // 如果数据库操作失败，使用本地存储
    if (!databaseSuccess) {
      const localFavoritesKey = `edumatch_favorites_${currentUserId}`
      let localFavorites = JSON.parse(localStorage.getItem(localFavoritesKey) || '[]')
      
      if (post.is_favorited) {
        // 取消收藏 - 从本地存储中移除
        localFavorites = localFavorites.filter(fav => fav.post_id !== post.id)
        post.is_favorited = false
        post.favorite_count = Math.max((post.favorite_count || 0) - 1, 0)
        console.log('✅ 本地取消收藏成功')
      } else {
        // 添加收藏 - 添加到本地存储
        localFavorites.push({
          post_id: post.id,
          user_id: currentUserId,
          timestamp: Date.now()
        })
        post.is_favorited = true
        post.favorite_count = (post.favorite_count || 0) + 1
        console.log('✅ 本地添加收藏成功')
      }
      
      // 保存到本地存储
      localStorage.setItem(localFavoritesKey, JSON.stringify(localFavorites))
    }
    
    // 操作完成后重新加载状态，确保数据一致性
    await reloadPostStatus(currentUserId)
    
  } catch (error) {
    console.error('收藏操作异常:', error)
    alert('操作失败，请稍后重试')
  } finally {
    isFavoriting.value = false
  }
}

// 按标签过滤
const filterByTag = async (tagName: string) => {
  isLoading.value = true
  showSearchResults.value = true
  
  try {
    const keywordLower = tagName.toLowerCase()
    const matchedPosts = posts.value.filter(post => {
      if (post.tags && Array.isArray(post.tags)) {
        const tagMatch = post.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
        )
        if (tagMatch) {
          return true
        }
      }
      return false
    })
    
    filteredPosts.value = matchedPosts
    currentPage.value = 1 // 搜索时重置到第一页
    updatePagination() // 更新分页
    searchKeyword.value = tagName
    
  } catch (error) {
    // 过滤失败处理
  } finally {
    isLoading.value = false
  }
}

// 加载帖子
const loadPosts = async () => {
  isLoading.value = true
  try {
    // 确保数据库已初始化
    let client = await dbStore.getClient()
    if (!client) {
      console.log('数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('数据库客户端初始化失败')
      return
    }
    
    console.log('🔄 开始加载帖子...')
    const { data, error } = await client
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 加载帖子失败:', error)
      console.error('错误详情:', error.details, error.hint)
      throw error // 抛出错误，让finally处理isLoading状态
    }
    
    // 获取当前用户ID以检查收藏状态
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    // 处理帖子数据，添加用户名显示和点赞收藏状态
    posts.value = (data || []).map((post: any) => ({
      ...post,
      // 优先使用昵称，如果没有昵称则使用用户名
      author: post.user?.nickname || post.user?.username || '匿名用户',
      // 默认点赞和收藏状态为false
      is_liked: false,
      is_favorited: false,
      // 使用默认的点赞和收藏数量
      like_count: 0, // 暂时使用默认值，因为数据库中likes_count字段不存在
      favorite_count: 0
    }))
    
    // 如果用户已登录，加载点赞和收藏状态
    if (currentUserId) {
      await loadLikesStatus(currentUserId)
      await loadFavoritesStatus(currentUserId)
    }
    
    console.log('✅ 成功加载帖子数量:', posts.value.length)
    console.log('📄 帖子列表:', posts.value)
    
    // 更新分页
    currentPage.value = 1
    updatePagination()
    
  } catch (error) {
    console.error('❌ 加载帖子异常:', error)
    hasError.value = true
    errorMessage.value = '加载帖子失败：' + (error.message || '未知错误')
    posts.value = [] // 清空帖子列表，避免显示过期数据
  } finally {
    isLoading.value = false
  }
}

// 加载点赞状态
const loadLikesStatus = async (userId: string) => {
  try {
    // 首先尝试使用数据库
    let databaseSuccess = false
    let likedPostIds: string[] = []
    
    try {
      // 使用简化的Supabase客户端
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        
        console.log('👍 开始从数据库加载用户点赞状态...')
        const { data, error } = await client
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
        
        if (error) {
          throw error
        }
        
        // 获取用户点赞的帖子ID列表
        likedPostIds = data.map((like: any) => like.post_id)
        databaseSuccess = true
        console.log('✅ 数据库点赞状态加载完成，已点赞帖子数量:', likedPostIds.length)
        
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.warn('⚠️ 数据库点赞状态加载失败，使用本地存储:', error.message)
      databaseSuccess = false
    }
    
    // 如果数据库失败，使用本地存储
    if (!databaseSuccess) {
      console.log('🔄 从本地存储加载点赞状态')
      const localLikesKey = `edumatch_likes_${userId}`
      const localLikes = JSON.parse(localStorage.getItem(localLikesKey) || '[]')
      likedPostIds = localLikes.map((like: any) => like.post_id)
      console.log('✅ 本地存储点赞状态加载完成，已点赞帖子数量:', likedPostIds.length)
    }
    
    // 更新帖子列表中的点赞状态
    posts.value.forEach(post => {
      post.is_liked = likedPostIds.includes(post.id)
    })
    
    console.log('✅ 点赞状态加载完成')
    
  } catch (error) {
    console.error('❌ 加载点赞状态异常:', error)
  }
}

// 加载收藏状态
const loadFavoritesStatus = async (userId: string) => {
  try {
    // 首先尝试使用数据库
    let databaseSuccess = false
    let favoritedPostIds: string[] = []
    
    try {
      // 使用简化的Supabase客户端
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        
        console.log('⭐ 开始从数据库加载用户收藏状态...')
        const { data, error } = await client
          .from('post_favorites')
          .select('post_id')
          .eq('user_id', userId)
        
        if (error) {
          throw error
        }
        
        // 获取用户收藏的帖子ID列表
        favoritedPostIds = data.map((fav: any) => fav.post_id)
        databaseSuccess = true
        console.log('✅ 数据库收藏状态加载完成，已收藏帖子数量:', favoritedPostIds.length)
        
      } else {
        throw new Error('Supabase环境变量未配置')
      }
    } catch (error) {
      console.warn('⚠️ 数据库收藏状态加载失败，使用本地存储:', error.message)
      databaseSuccess = false
    }
    
    // 如果数据库失败，使用本地存储
    if (!databaseSuccess) {
      console.log('🔄 从本地存储加载收藏状态')
      const localFavoritesKey = `edumatch_favorites_${userId}`
      const localFavorites = JSON.parse(localStorage.getItem(localFavoritesKey) || '[]')
      favoritedPostIds = localFavorites.map((fav: any) => fav.post_id)
      console.log('✅ 本地存储收藏状态加载完成，已收藏帖子数量:', favoritedPostIds.length)
    }
    
    // 更新帖子列表中的收藏状态
    posts.value.forEach(post => {
      post.is_favorited = favoritedPostIds.includes(post.id)
    })
    
    console.log('✅ 收藏状态加载完成')
    
  } catch (error) {
    console.error('❌ 加载收藏状态异常:', error)
  }
}

// 重新加载帖子状态
const reloadPostStatus = async (userId: string) => {
  console.log('🔄 重新加载帖子状态...')
  await loadLikesStatus(userId)
  await loadFavoritesStatus(userId)
  console.log('✅ 帖子状态重新加载完成')
}

// 重试加载
const retryLoading = async () => {
  hasError.value = false
  errorMessage.value = ''
  currentPage.value = 1 // 重试时重置到第一页
  await loadPosts()
}

// 加载热门标签
const loadPopularTags = async () => {
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('标签加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('标签加载：数据库客户端初始化失败')
      return
    }
    
    console.log('🏷️ 开始加载热门标签...')
    const { data, error } = await client
      .from('community_posts')
      .select('tags')
    
    if (error) {
      console.error('❌ 加载标签失败:', error)
      return
    }
    
    const tagCount: any = {}
    data?.forEach((post: any) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    popularTags.value = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count, id: name }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)
      
    console.log('✅ 热门标签加载完成:', popularTags.value)
      
  } catch (error) {
    console.error('❌ 加载标签异常:', error)
  }
}

// 创建帖子
const createPost = async () => {
  if (!newPost.value.title.trim() || !newPost.value.content.trim()) {
    return
  }
  
  isSubmitting.value = true
  try {
    let client = await dbStore.getClient()
    if (!client) {
      console.log('创建帖子：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('创建帖子：数据库客户端初始化失败')
      return
    }
    
    // 获取当前用户ID和用户信息
    let currentUserId = null
    let currentUserInfo = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
          currentUserInfo = user
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      alert('请先登录后再发布帖子')
      isSubmitting.value = false
      return
    }
    
    console.log('💾 开始创建帖子，用户ID:', currentUserId, '数据:', newPost.value)
    const { data, error } = await client
      .from('community_posts')
      .insert([{
        title: newPost.value.title,
        content: newPost.value.content,
        category: newPost.value.category || '学习经验',
        tags: newPost.value.tags,
        user_id: currentUserId
      }])
      .select(`
        *,
        user:user_id (
          id,
          username,
          nickname
        )
      `)
    
    if (error) {
      console.error('❌ 创建帖子失败:', error)
      throw error
    }
    
    console.log('✅ 帖子创建成功:', data)
    
    // 处理新帖子的用户信息
    if (data && data[0]) {
      const newPostData = {
        ...data[0],
        // 优先使用昵称，如果没有昵称则使用用户名
        author: data[0].user?.nickname || data[0].user?.username || '匿名用户',
        // 默认点赞和收藏状态为false
        is_liked: false,
        is_favorited: false,
        // 使用默认的点赞和收藏数量
        like_count: 0, // 暂时使用默认值，因为数据库中likes_count字段不存在
        favorite_count: 0
      }
      posts.value.unshift(newPostData)
      
      // 更新分页（新帖子添加到第一页）
      currentPage.value = 1
      updatePagination()
    }
    
    // 关闭弹窗
    closeCreatePostModal()
    
    // 重新加载热门标签
    loadPopularTags()
    
  } catch (error) {
    console.error('❌ 发布帖子异常:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 移除标签
const removeTag = (tag: string) => {
  const index = newPost.value.tags.indexOf(tag)
  if (index > -1) {
    newPost.value.tags.splice(index, 1)
  }
}

// 添加自定义标签
const addCustomTag = () => {
  const trimmedTag = customTag.value.trim()
  if (!trimmedTag) return
  
  if (!newPost.value.tags.includes(trimmedTag)) {
    newPost.value.tags.push(trimmedTag)
  }
  
  customTag.value = ''
}

// 关闭创建帖子弹窗
const closeCreatePostModal = () => {
  showCreatePostModal.value = false
  newPost.value = {
    title: '',
    content: '',
    category: '',
    tags: []
  }
  customTag.value = ''
  selectedResource.value = null
}

// 加载用户资源
const loadMyResources = async () => {
  isLoadingResources.value = true
  try {
    console.log('🔄 开始加载用户资源...')
    
    // 重置分页状态
    resourceCurrentPage.value = 1
    paginatedResources.value = []
    
    // 获取当前用户ID
    let currentUserId = null
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id) {
          currentUserId = user.id
        }
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
    
    if (!currentUserId) {
      console.log('⚠️ 用户未登录')
      myResources.value = []
      return
    }
    
    // 使用数据库客户端
    let client = await dbStore.getClient()
    if (!client) {
      console.log('资源加载：数据库客户端未初始化，尝试重新连接...')
      await dbStore.reconnect()
      client = await dbStore.getClient()
    }
    
    if (!client) {
      console.error('资源加载：数据库客户端初始化失败')
      myResources.value = []
      return
    }
    
    console.log('🔍 查询用户资源...')
    const { data, error } = await client
      .from('resources')
      .select('*')
      .eq('created_by', currentUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 获取我的资源失败:', error)
      myResources.value = []
      return
    }
    
    if (!data || data.length === 0) {
      console.log('ℹ️ 该用户没有创建任何资源')
      myResources.value = []
      return
    }
    
    // 转换数据格式
    myResources.value = data.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description || '',
      type: resource.type || 'other',
      category: resource.category,
      difficulty: resource.difficulty,
      duration: resource.duration,
      provider: resource.provider,
      url: resource.url,
      views: resource.views || 0,
      likes: resource.likes || 0,
      created_at: resource.created_at
    }))
    
    // 计算分页
    updateResourcePagination()
    
    console.log('✅ 成功加载我的资源:', myResources.value.length)
    
  } catch (error) {
    console.error('❌ 加载我的资源时出错:', error)
    myResources.value = []
  } finally {
    isLoadingResources.value = false
  }
}

// 更新资源分页
const updateResourcePagination = () => {
  const total = myResources.value.length
  resourceTotalPages.value = Math.ceil(total / resourcePageSize.value)
  
  // 确保当前页不超出范围
  if (resourceCurrentPage.value > resourceTotalPages.value && resourceTotalPages.value > 0) {
    resourceCurrentPage.value = resourceTotalPages.value
  }
  
  // 计算当前页的数据
  const startIndex = (resourceCurrentPage.value - 1) * resourcePageSize.value
  const endIndex = startIndex + resourcePageSize.value
  paginatedResources.value = myResources.value.slice(startIndex, endIndex)
  
  console.log(`📄 资源分页: 第${resourceCurrentPage.value}/${resourceTotalPages.value}页，显示${paginatedResources.value.length}个资源`)
}

// 切换资源页码
const changeResourcePage = (page: number) => {
  if (page >= 1 && page <= resourceTotalPages.value) {
    resourceCurrentPage.value = page
    updateResourcePagination()
  }
}

// 获取可见的页码列表（智能显示）
const getVisiblePages = () => {
  const total = resourceTotalPages.value
  const current = resourceCurrentPage.value
  
  if (total <= 5) {
    // 如果总页数不超过5页，显示所有页码
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  // 否则智能显示页码
  const pages = []
  const half = Math.floor(5 / 2) // 一边显示2个，中间是当前页
  
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + 4)
  
  // 如果当前页靠近开头，从1开始
  if (current <= 3) {
    start = 1
    end = 5
  }
  
  // 如果当前页靠近结尾，显示最后5页
  if (current >= total - 2) {
    start = total - 4
    end = total
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

// 处理页面跳转
const handleGotoPage = () => {
  const targetPage = parseInt(gotoPageInput.value)
  
  if (!targetPage || isNaN(targetPage)) {
    gotoPageInput.value = ''
    return
  }
  
  if (targetPage < 1) {
    gotoPageInput.value = '1'
    return
  }
  
  if (targetPage > resourceTotalPages.value) {
    gotoPageInput.value = resourceTotalPages.value.toString()
    return
  }
  
  changeResourcePage(targetPage)
  gotoPageInput.value = '' // 清空输入框
}

// 选择资源
const selectResource = (resource: any) => {
  selectedResource.value = resource
  
  // 根据选择的资源自动填充表单
  if (resource.title) {
    newPost.value.title = `基于《${resource.title}》的学习经验分享`
  }
  
  if (resource.description) {
    newPost.value.content = `我在学习《${resource.title}》时，有了一些心得体会想和大家分享：

${resource.description}

通过这个资源，我学到了很多，希望对大家也有帮助！`
  }
  
  if (resource.category) {
    newPost.value.category = resource.category
  }
  
  if (resource.type) {
    if (!newPost.value.tags.includes(resource.type)) {
      newPost.value.tags.push(resource.type)
    }
  }
  
  // 关闭资源选择器
  showResourceSelector.value = false
  
  console.log('✅ 已选择资源:', resource)
}

// 移除选中的资源
const removeSelectedResource = () => {
  selectedResource.value = null
  
  // 清空相关字段但保留用户已输入的内容
  if (selectedResource.value && newPost.value.title.includes(`基于《${selectedResource.value.title}》`)) {
    newPost.value.title = ''
  }
}

// 获取资源类型颜色
const getResourceTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    video: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    article: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    book: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    course: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    tool: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return colors[type] || colors.other
}

// 跳转到创建资源页面
const navigateToCreateResource = () => {
  router.push('/create-resource')
  showResourceSelector.value = false
}

// 全局键盘事件处理
const handleGlobalKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showSearchResults.value) {
    clearSearch()
  }
}

// 初始化
onMounted(async () => {
  console.log('🚀 CommunityPage 组件挂载')
  
  // 重置状态，确保干净的初始状态
  hasError.value = false
  errorMessage.value = ''
  
  // 立即开始加载数据，不等待固定时间
  console.log('⏳ 开始初始化数据加载...')
  
  try {
    // 检查数据库连接状态
    if (dbStore.isConnected) {
      console.log('✅ 数据库已连接，开始加载数据')
    } else {
      console.log('⚠️ 数据库未连接，尝试重新连接')
      await dbStore.reconnect()
    }
    
    // 并行加载数据以提高性能
    await Promise.all([
      loadPosts(),
      loadPopularTags(),
      loadMyResources()
    ])
    
    console.log('🎉 CommunityPage 初始化完成')
  } catch (error) {
    console.error('❌ 初始化过程中发生错误:', error)
    hasError.value = true
    errorMessage.value = '初始化失败：' + (error.message || '未知错误')
  } finally {
    // 确保加载动画在任何情况下都被移除
    isLoading.value = false
    document.addEventListener('keyup', handleGlobalKeyup)
  }
})

onUnmounted(() => {
  document.removeEventListener('keyup', handleGlobalKeyup)
})
</script>