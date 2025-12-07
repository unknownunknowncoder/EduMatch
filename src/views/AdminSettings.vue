<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">后台管理系统</h1>
            <span class="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
              Admin Panel
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="goToUserView"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              返回前台
            </button>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 导航标签 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <router-link
            v-for="tab in navigationTabs"
            :key="tab.id"
            :to="tab.path"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="[
              $route.path === tab.path || ($route.path.startsWith(tab.path) && tab.id !== 'dashboard')
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <div class="flex items-center">
              <span class="mr-2">{{ tab.icon }}</span>
              {{ tab.name }}
            </div>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧菜单 -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">设置分类</h3>
            <nav class="space-y-2">
              <button
                v-for="category in settingCategories"
                :key="category.id"
                @click="activeCategory = category.id"
                class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="[
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                ]"
              >
                <div class="flex items-center">
                  <span class="mr-3">{{ category.icon }}</span>
                  {{ category.name }}
                </div>
              </button>
            </nav>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <!-- 系统基本信息 -->
            <div v-if="activeCategory === 'basic'">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">系统基本信息</h3>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">系统名称</label>
                  <input
                    v-model="settings.systemName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">系统描述</label>
                  <textarea
                    v-model="settings.systemDescription"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">版本号</label>
                  <input
                    v-model="settings.version"
                    type="text"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>



            <!-- 安全设置 -->
            <div v-if="activeCategory === 'security'">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">安全配置</h3>
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">双因素认证</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">启用双因素认证以提高账户安全性</div>
                  </div>
                  <button
                    @click="settings.enable2FA = !settings.enable2FA"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                    :class="settings.enable2FA ? 'bg-blue-600' : 'bg-gray-200'"
                  >
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.enable2FA ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">强制密码复杂度</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">要求用户使用复杂密码</div>
                  </div>
                  <button
                    @click="settings.forcePasswordComplexity = !settings.forcePasswordComplexity"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                    :class="settings.forcePasswordComplexity ? 'bg-blue-600' : 'bg-gray-200'"
                  >
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="settings.forcePasswordComplexity ? 'translate-x-6' : 'translate-x-1'"
                    ></span>
                  </button>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">会话超时（分钟）</label>
                  <input
                    v-model="settings.sessionTimeout"
                    type="number"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- 存储设置 -->
            <div v-if="activeCategory === 'storage'">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">存储配置</h3>
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">存储类型</label>
                  <select
                    v-model="settings.storageType"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="local">本地存储</option>
                    <option value="cloud">云存储</option>
                  </select>
                </div>
                <div v-if="settings.storageType === 'cloud'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">云服务商</label>
                  <select
                    v-model="settings.cloudProvider"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="aliyun">阿里云</option>
                    <option value="tencent">腾讯云</option>
                    <option value="aws">AWS</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">最大文件大小（MB）</label>
                  <input
                    v-model="settings.maxFileSize"
                    type="number"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- 保存按钮 -->
            <div class="mt-8 flex justify-end space-x-4">
              <button
                @click="resetSettings"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                重置
              </button>
              <button
                @click="saveSettings"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                保存设置
              </button>
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

const router = useRouter()

const currentTime = ref('')
const activeCategory = ref('basic')

// 设置数据
const settings = ref({
  systemName: 'EduMatch 教育平台',
  systemDescription: '专业的在线教育学习平台',
  version: 'v1.0.0',
  enable2FA: false,
  forcePasswordComplexity: true,
  sessionTimeout: 30,
  storageType: 'local',
  cloudProvider: 'aliyun',
  maxFileSize: 100
})

// 导航标签
const navigationTabs = ref([
  {
    id: 'dashboard',
    name: '仪表板',
    path: '/admin',
    icon: '📊'
  },
  {
    id: 'users',
    name: '用户管理',
    path: '/admin/users',
    icon: '👥'
  },
  {
    id: 'settings',
    name: '系统设置',
    path: '/admin/settings',
    icon: '⚙️'
  },
  {
    id: 'maintenance',
    name: '系统维护',
    path: '/admin/maintenance',
    icon: '🔧'
  }
])

// 设置分类
const settingCategories = ref([
  {
    id: 'basic',
    name: '基本设置',
    icon: '🔧'
  },
  {
    id: 'security',
    name: '安全设置',
    icon: '🔒'
  },
  {
    id: 'storage',
    name: '存储设置',
    icon: '💾'
  }
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

// 保存设置
const saveSettings = () => {
  // 模拟保存设置
  console.log('保存设置:', settings.value)
  // 这里应该调用API保存设置
  alert('设置已保存')
}

// 重置设置
const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？')) {
    // 重置为默认值
    settings.value = {
      systemName: 'EduMatch 教育平台',
      systemDescription: '专业的在线教育学习平台',
      version: 'v1.0.0',
      enable2FA: false,
      forcePasswordComplexity: true,
      sessionTimeout: 30,
      storageType: 'local',
      cloudProvider: 'aliyun',
      maxFileSize: 100
    }
  }
}

// 返回前台
const goToUserView = () => {
  router.push('/')
}

// 定时更新时间
let timeInterval: NodeJS.Timeout

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* 隐藏前端导航栏元素 */
.sidebar-navigation {
  display: none !important;
}

.bottom-navigation {
  display: none !important;
}

nav:not(.border-b) {
  display: none !important;
}

/* 确保后台页面占据整个屏幕 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 导航链接激活状态 */
.router-link-exact-active {
  border-color: rgb(59 130 246) !important; /* blue-500 */
  color: rgb(37 99 235) !important; /* blue-600 */
}

.dark .router-link-exact-active {
  color: rgb(96 165 250) !important; /* blue-400 */
}

/* 数字输入框移除箭头 */
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>