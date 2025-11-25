<template>
  <div class="p-6 md:p-8">
    <!-- 成功提示 -->
    <div 
      v-if="showSuccessMessage" 
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transition-all duration-300"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- 学习计划概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
            <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">进行中</h3>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ plans.inProgress }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">个学习计划</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
            <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">已完成</h3>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ plans.completed }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">个学习计划</p>
      </div>
    </div>

    <!-- 当前学习计划 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            当前学习计划
          </h2>
          <button 
            @click="showCreatePlanModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center text-sm font-medium"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            创建新的学习计划
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <!-- 学习计划列表 -->
        <div v-if="currentPlans.length === 0" class="text-center py-12">
          <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无学习计划</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有创建任何学习计划</p>
          <button 
            @click="showCreatePlanModal = true"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            创建第一个计划
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="plan in currentPlans"
            :key="plan.id"
            class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">{{ plan.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ plan.description }}</p>
              </div>
              <span :class="`px-3 py-1 rounded-full text-xs font-medium ${
                plan.status === 'in_progress' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`">
                {{ plan.status === 'in_progress' ? '进行中' : '已完成' }}
              </span>
            </div>



            <!-- 关联资源信息 -->
            <div v-if="plan.resourceName || plan.resourceUrl" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {{ plan.resourceName || '关联资源' }}
                  </p>
                  <a 
                    v-if="plan.resourceUrl && plan.resourceUrl.trim() !== ''"
                    :href="plan.resourceUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    访问资源
                  </a>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                    无资源链接
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">开始时间</span>
                <div class="font-medium">{{ plan.startDate }}</div>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">目标时间</span>
                <div class="font-medium">{{ plan.targetDate }}</div>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">每日时长</span>
                <div class="font-medium">{{ plan.dailyHours }}小时</div>
              </div>
            </div>

            <!-- 打卡信息和按钮 -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span class="font-medium">{{ plan.checkinCount || 0 }}</span> / 
                    <span class="font-medium">{{ plan.totalDays || 0 }}</span> 天
                    <span class="mx-2">•</span>
                    <span>剩余 {{ plan.remainingDays || 0 }} 天</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${plan.progress}%` }"
                    ></div>
                  </div>
                </div>
                <div class="ml-4">
                  <button
                    v-if="plan.status === 'in_progress' && !plan.isTodayChecked"
                    @click="handleCheckin(plan)"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center text-sm font-medium"
                    :disabled="isCheckingIn"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ isCheckingIn ? '打卡中...' : '今日打卡' }}
                  </button>
                  <button
                    v-else-if="plan.status === 'in_progress' && plan.isTodayChecked"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg flex items-center text-sm font-medium cursor-not-allowed"
                    disabled
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    今日已打卡
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建学习计划弹窗 -->
    <div v-if="showCreatePlanModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">创建学习计划</h2>
          <button 
            @click="showCreatePlanModal = false"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 表单内容 -->
        <form @submit.prevent="handleCreatePlan" class="p-6 space-y-4">
          <!-- 计划标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              计划标题 *
            </label>
            <input
              v-model="newPlan.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="例如：前端开发进阶"
            />
          </div>

          <!-- 计划描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              计划描述
            </label>
            <textarea
              v-model="newPlan.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="描述你的学习目标和内容（选填）"
            ></textarea>
          </div>



          <!-- 关联学习资源 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              关联学习资源
            </label>
            <div class="space-y-3">
              <!-- 资源名称 -->
              <div>
                <input
                  v-model="newPlan.resourceName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入关联的学习资源名称（选填）"
                />
              </div>
              <!-- 资源链接 -->
              <div>
                <input
                  v-model="newPlan.resourceUrl"
                  type="url"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入资源链接（选填）"
                />
              </div>
              <!-- 学习总时长 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  学习总时长（小时）
                </label>
                <div class="relative">
                  <input
                    v-model="newPlan.totalHours"
                    type="number"
                    min="0"
                    step="0.5"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white no-spinner"
                    placeholder="例如：10.5（选填）"
                  />
                  <span class="absolute right-4 top-2 text-gray-500 dark:text-gray-400">小时</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">填写该资源的总学习时长（可选）</p>
              </div>
              <!-- 从我的资源中选择 -->
              <div>
                  <button
                    type="button"
                    @click="handleOpenResourceModal"
                    class="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors flex items-center justify-center"
                  >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  从我的资源中选择
                </button>
              </div>
            </div>
          </div>

          <!-- 开始和目标日期 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                开始日期 *
              </label>
              <input
                v-model="newPlan.startDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标日期 *
              </label>
              <input
                v-model="newPlan.targetDate"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- 每日学习时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              每日学习时间（小时） *
            </label>
            <div class="relative">
              <input
                v-model="newPlan.dailyHours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                placeholder="例如：2.5"
                style="-moz-appearance: textfield; -webkit-appearance: none; appearance: none;"
              />
              <span class="absolute right-4 top-2 text-gray-500 dark:text-gray-400">小时</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">建议每日学习0.5到24小时</p>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreatePlanModal"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              创建计划
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 我的资源选择弹窗 -->
    <div v-if="showMyResourcesModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- 弹窗头部 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">选择学习资源</h2>
          <button 
            @click="showMyResourcesModal = false"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 资源列表 -->
        <div class="p-6">
          <div v-if="isLoadingMyResources" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400 mt-2">加载中...</p>
          </div>

          <div v-else-if="myResources.length === 0" class="text-center py-12">
            <svg class="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无创建的资源</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">您还没有创建任何学习资源</p>
            <button 
              @click="showMyResourcesModal = false"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              关闭
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="resource in myResources"
              :key="resource.id"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="selectResource(resource)"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ resource.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ resource.description }}</p>
                </div>
                <div class="ml-3">
                  <span :class="`px-2 py-1 text-xs rounded-full ${getResourceTypeColor(resource.type)}`">
                    {{ resource.type }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {{ formatDate(resource.created_at) }}
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ resource.views || 0 }}
                  </div>
                  <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {{ resource.likes || 0 }}
                  </div>
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
import { ref, onMounted } from 'vue'
import { supabaseService } from '@/services/supabase'

// 获取统一的 Supabase 客户端
const getSupabase = async () => {
  return supabaseService.getClient()
}

interface StudyPlan {
  id: string
  title: string
  description: string
  progress: number
  status: 'in_progress' | 'completed' | 'pending' | 'paused'
  startDate: string
  targetDate: string
  dailyHours: number
  totalHours?: number
  resourceName?: string
  resourceUrl?: string
  checkinCount?: number
  totalDays?: number
  remainingDays?: number
  isTodayChecked?: boolean
  checkins?: CheckinRecord[]
}

interface CheckinRecord {
  id: string
  study_plan_id: string
  checkin_date: string
  checkin_time: string
  notes?: string
  created_at: string
}

interface MyResource {
  id: string
  title: string
  description: string
  type: string
  category?: string
  difficulty?: string
  duration?: string
  provider?: string
  url?: string
  views?: number
  likes?: number
  created_at: string
}

const showSuccessMessage = ref(false)
const successMessage = ref('')
const showCreatePlanModal = ref(false)
const showMyResourcesModal = ref(false)
const myResources = ref<MyResource[]>([])
const isLoadingMyResources = ref(false)
const isCheckingIn = ref(false)

const plans = ref({
  inProgress: 0,
  completed: 0
})

// 新建学习计划表单数据
const newPlan = ref({
  title: '',
  description: '',
  startDate: '',
  targetDate: '',
  dailyHours: 2, // 默认每日学习2小时
  totalHours: '', // 学习总时长（可选）
  resourceName: '',
  resourceUrl: ''
})

// 学习计划数据（从数据库动态加载）
const currentPlans = ref<StudyPlan[]>([])

// 从数据库加载学习计划
const loadDatabasePlans = async () => {
  try {
    console.log('🔄 从数据库加载学习计划...')
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    // 如果没有登录用户，显示空列表
    if (!currentUser || !currentUser.id) {
      console.log('用户未登录，显示空学习计划列表')
      currentPlans.value = []
      updateStats()
      return
    }
    
    // 获取统一的 Supabase 客户端
    const supabase = await getSupabase()
    
    // 加载学习计划数据
    const { data: plansData, error: plansError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
    
    if (plansError) {
      console.error('❌ 数据库加载失败:', plansError)
      successMessage.value = '数据库加载失败，显示默认数据'
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      return
    }
    
    if (plansData && plansData.length > 0) {
      // 为每个学习计划加载打卡记录
      const plansWithCheckins = await Promise.all(
        plansData.map(async (plan: any) => {
          // 加载该学习计划的打卡记录
          const { data: checkinsData } = await supabase
            .from('study_plan_checkins')
            .select('*')
            .eq('study_plan_id', plan.id)
            .order('checkin_date', { ascending: false })
          
          // 计算学习进度相关信息
          const today = new Date().toISOString().split('T')[0]
          const totalHours = plan.total_hours || 0
          const dailyHours = plan.daily_hours || 2
          
          // 计算总天数（基于总时长和每日时长）
          const totalDays = totalHours > 0 ? Math.ceil(totalHours / dailyHours) : 0
          
          // 计算打卡次数
          const checkinCount = checkinsData?.length || 0
          
          // 计算剩余天数
          const remainingDays = Math.max(0, totalDays - checkinCount)
          
          // 计算进度百分比
          const progress = totalDays > 0 ? Math.min(100, Math.round((checkinCount / totalDays) * 100)) : 0
          
          // 检查今天是否已打卡
          const isTodayChecked = checkinsData?.some((checkin: any) => 
            checkin.checkin_date === today
          ) || false
          
          // 如果进度达到100%，自动更新状态为已完成
          if (progress >= 100 && plan.status !== 'completed') {
            await supabase
              .from('study_plans')
              .update({ status: 'completed', progress: 100 })
              .eq('id', plan.id)
            plan.status = 'completed'
            plan.progress = 100
          }
          
          return {
            id: plan.id,
            title: plan.title,
            description: plan.description || '',
            progress: progress,
            status: plan.status,
            startDate: plan.start_date,
            targetDate: plan.target_date,
            dailyHours: dailyHours,
            totalHours: totalHours,
            resourceName: plan.resource_name || '',
            resourceUrl: plan.resource_url || '',
            checkinCount: checkinCount,
            totalDays: totalDays,
            remainingDays: remainingDays,
            isTodayChecked: isTodayChecked,
            checkins: checkinsData || []
          }
        })
      )
      
      currentPlans.value = plansWithCheckins
      
      successMessage.value = `成功从数据库加载 ${plansData.length} 个学习计划！`
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }
    
    updateStats()
    
  } catch (error) {
    console.error('❌ 加载失败:', error)
    successMessage.value = '加载失败，使用硬编码数据'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}

// 更新统计信息
const updateStats = () => {
  const inProgress = currentPlans.value.filter(p => p.status === 'in_progress').length
  const completed = currentPlans.value.filter(p => p.status === 'completed').length
  
  plans.value = {
    inProgress: inProgress,
    completed: completed
  }
}

// 创建学习计划
const handleCreatePlan = async () => {
  // 验证表单数据
  if (!newPlan.value.title || newPlan.value.title.trim() === '') {
    alert('请填写计划标题')
    return
  }

  if (!newPlan.value.startDate || newPlan.value.startDate.trim() === '') {
    alert('请选择开始日期')
    return
  }

  if (!newPlan.value.targetDate || newPlan.value.targetDate.trim() === '') {
    alert('请选择目标日期')
    return
  }

  // 验证日期逻辑
  const start = new Date(newPlan.value.startDate)
  const target = new Date(newPlan.value.targetDate)
  
  if (isNaN(start.getTime())) {
    alert('开始日期格式不正确')
    return
  }

  if (isNaN(target.getTime())) {
    alert('目标日期格式不正确')
    return
  }

  if (target <= start) {
    alert('目标日期必须晚于开始日期')
    return
  }

  // 验证每日学习时间
  const dailyHours = parseFloat(newPlan.value.dailyHours)
  if (isNaN(dailyHours) || dailyHours < 0.5 || dailyHours > 24) {
    alert('每日学习时间必须在0.5到24小时之间')
    return
  }

  try {
    console.log('🔄 准备创建学习计划...')
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    // 如果没有登录用户，显示错误信息
    if (!currentUser || !currentUser.id) {
      alert('请先登录后再创建学习计划')
      return
    }
    
    // 获取统一的 Supabase 客户端
    const supabase = await getSupabase()
    
    // 准备数据库插入数据
    const dbPlanData = {
      user_id: currentUser.id,
      title: newPlan.value.title,
      description: newPlan.value.description,
      progress: 0,
      status: 'in_progress',
      start_date: newPlan.value.startDate,
      target_date: newPlan.value.targetDate,
      daily_hours: newPlan.value.dailyHours,
      total_hours: newPlan.value.totalHours ? parseFloat(newPlan.value.totalHours) : null,
      resource_name: newPlan.value.resourceName,
      resource_url: newPlan.value.resourceUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('📝 插入数据:', dbPlanData)
    
    // 保存到数据库
    const { data, error } = await supabase
      .from('study_plans')
      .insert([dbPlanData])
      .select()
    
    if (error) {
      console.error('❌ 数据库插入失败:', error)
      throw new Error(`数据库保存失败: ${error.message}`)
    }
    
    console.log('✅ 数据库保存成功:', data)
    
    // 使用数据库返回的数据
    const createdPlan = Array.isArray(data) ? data[0] : data
    
    if (!createdPlan || !createdPlan.id) {
      throw new Error('创建计划失败：返回数据无效')
    }

    // 转换为前端格式
    const planData = {
      id: createdPlan.id,
      title: createdPlan.title || newPlan.value.title,
      description: createdPlan.description || newPlan.value.description,
      progress: createdPlan.progress || 0,
      status: createdPlan.status || 'in_progress',
      startDate: createdPlan.start_date || newPlan.value.startDate,
      targetDate: createdPlan.target_date || newPlan.value.targetDate,
      dailyHours: createdPlan.daily_hours || newPlan.value.dailyHours,
      resourceName: createdPlan.resource_name || newPlan.value.resourceName,
      resourceUrl: createdPlan.resource_url || newPlan.value.resourceUrl
    }

    // 添加到当前计划列表
    currentPlans.value.unshift(planData)
    
    // 更新统计
    updateStats()
    
    // 关闭弹窗
    showCreatePlanModal.value = false
    
    // 显示成功提示
    successMessage.value = '学习计划创建成功！'
    showSuccessMessage.value = true
    
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    // 重置表单
    newPlan.value = {
      title: '',
      description: '',
      startDate: '',
      targetDate: '',
      dailyHours: 2, // 重置为默认值
      resourceName: '',
      resourceUrl: ''
    }
    
  } catch (error) {
    console.error('❌ 创建学习计划失败:', error)
    alert('创建学习计划失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 关闭创建计划弹窗
const closeCreatePlanModal = () => {
  showCreatePlanModal.value = false
  
    // 重置表单
    newPlan.value = {
      title: '',
      description: '',
      startDate: '',
      targetDate: '',
      dailyHours: 2, // 重置为默认值
      resourceName: '',
      resourceUrl: ''
    }
}

// 获取用户的资源列表
const fetchMyResources = async () => {
  isLoadingMyResources.value = true
  try {
    console.log('🔄 开始获取用户资源...')
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    if (!currentUser || !currentUser.id) {
      console.log('用户未登录')
      isLoadingMyResources.value = false
      return
    }

    console.log('当前用户ID:', currentUser.id)

    // 获取统一的 Supabase 客户端
    const supabase = await getSupabase()

    // 从resources表获取用户创建的资源
    let { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('created_by', currentUser.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 获取用户资源失败:', error)
      // 显示错误信息给用户
      successMessage.value = '获取资源失败，请检查数据库连接'
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
      return
    }

    console.log('📊 获取到的资源数据:', data)
    myResources.value = data || []
    
    if (myResources.value.length > 0) {
      console.log(`✅ 成功加载 ${myResources.value.length} 个资源`)
    } else {
      console.log('ℹ️ 用户没有创建任何资源')
    }
    
  } catch (error) {
    console.error('❌ 获取用户资源错误:', error)
  } finally {
    isLoadingMyResources.value = false
  }
}

// 选择资源
const selectResource = (resource: MyResource) => {
  newPlan.value.resourceName = resource.title
  newPlan.value.resourceUrl = resource.url || ''
  
  // 如果资源有学习时长信息，自动填充到学习总时长字段
  if (resource.duration) {
    // 从duration字段中提取数字部分（例如从"2小时"中提取"2"）
    const durationMatch = resource.duration.match(/\d+(\.\d+)?/)
    if (durationMatch) {
      newPlan.value.totalHours = durationMatch[0]
    }
  }
  
  showMyResourcesModal.value = false
  
  // 显示选择成功提示
  showSuccessMessage.value = true
  successMessage.value = `已选择资源: ${resource.title}${resource.duration ? `，学习时长: ${resource.duration}` : ''}`
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// 获取资源类型颜色
const getResourceTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    '视频': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    '文档': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    '课程': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    '书籍': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    '工具': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    '网站': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300'
  }
  return colorMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 打卡功能
const handleCheckin = async (plan: StudyPlan) => {
  if (isCheckingIn.value) return
  
  try {
    isCheckingIn.value = true
    
    // 从localStorage获取当前登录用户
    let currentUser = null
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        currentUser = JSON.parse(storedUser)
      }
    }
    
    if (!currentUser || !currentUser.id) {
      alert('请先登录后再打卡')
      return
    }
    
    // 获取统一的 Supabase 客户端
    const supabase = await getSupabase()
    
    // 检查今天是否已经打卡
    const today = new Date().toISOString().split('T')[0]
    const { data: existingCheckins } = await supabase
      .from('study_plan_checkins')
      .select('*')
      .eq('study_plan_id', plan.id)
      .eq('checkin_date', today)
    
    if (existingCheckins && existingCheckins.length > 0) {
      alert('今天已经打过卡了！')
      return
    }
    
    // 创建打卡记录
    const { data: checkinData, error: checkinError } = await supabase
      .from('study_plan_checkins')
      .insert([{
        study_plan_id: plan.id,
        user_id: currentUser.id,
        checkin_date: today,
        notes: `学习计划：${plan.title}`
      }])
      .select()
    
    if (checkinError) {
      console.error('❌ 打卡失败:', checkinError)
      alert('打卡失败，请重试')
      return
    }
    
    console.log('✅ 打卡成功:', checkinData)
    
    // 重新加载学习计划数据以更新进度
    await loadDatabasePlans()
    
    // 显示成功提示
    successMessage.value = '打卡成功！继续加油！'
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
  } catch (error) {
    console.error('❌ 打卡失败:', error)
    alert('打卡失败，请重试')
  } finally {
    isCheckingIn.value = false
  }
}

// 当打开资源选择弹窗时加载资源
const handleOpenResourceModal = () => {
  showMyResourcesModal.value = true
  fetchMyResources()
}

onMounted(() => {
  updateStats()
  // 自动从数据库加载
  loadDatabasePlans()
})
</script>

<style scoped>
/* 移除数字输入框的上下箭头 */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
  appearance: none;
}

/* 确保所有数字输入框都移除上下箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>