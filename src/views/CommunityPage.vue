<template>
  <div class="min-h-screen bg-[#F3F4F6] font-sans text-slate-800 pb-10">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    
    <!-- 1. 顶部 Hero 区域 -->
    <div class="bg-white border-b border-slate-200 pt-8 pb-12 mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">学习社区</h1>
            <p class="mt-2 text-slate-500 text-lg">与志同道合的伙伴交流，分享你的学习经验。</p>
          </div>
          
          <!-- 搜索框 -->
          <div class="w-full md:w-96">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-5 w-5 text-slate-400" />
              </div>
              <input 
                v-model="searchKeyword"
                @input="handleSearchInput"
                @keyup.enter="performSearch"
                @keyup.escape="clearSearch"
                type="text" 
                class="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm shadow-sm"
                placeholder="搜索帖子、话题或关键词..."
              />
              <button 
                v-if="searchKeyword"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            
            <!-- 筛选框 -->
            <div class="mt-3 flex items-center gap-3 flex-nowrap justify-end">
              <span class="text-sm font-medium text-slate-700 whitespace-nowrap">排序方式：</span>
              <div class="flex gap-2 flex-nowrap">
                <button
                  @click="setSortBy('latest')"
                  :class="sortBy === 'latest' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <Clock class="w-4 h-4" />
                  最新发布
                </button>
                <button
                  @click="setSortBy('likes')"
                  :class="sortBy === 'likes' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <Heart class="w-4 h-4" />
                  最多点赞
                </button>
                <button
                  @click="setSortBy('favorites')"
                  :class="sortBy === 'favorites' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <Tag class="w-4 h-4" />
                  最多收藏
                </button>
                <button
                  @click="setSortBy('comments')"
                  :class="sortBy === 'comments' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <MessageSquare class="w-4 h-4" />
                  最多评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-8">
        
        <!-- 2. 左侧：帖子列表 (占8列) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- 搜索结果提示 -->
          <div v-if="showSearchResults" class="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
            <span class="text-sm text-slate-600">
              搜索 "<span class="font-bold text-indigo-600">{{ searchKeyword }}</span>" 的结果：{{ filteredPosts.length }} 条
            </span>
            <button @click="clearSearch" class="text-xs text-slate-400 hover:text-red-500 transition-colors">清除搜索</button>
          </div>

          <!-- 加载状态 (Skeleton) -->
          <div v-if="isLoading" class="space-y-4">
             <div v-for="n in 3" :key="n" class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
                <div class="flex items-center gap-3 mb-4">
                   <div class="w-10 h-10 rounded-full bg-slate-200"></div>
                   <div class="h-4 bg-slate-200 w-32 rounded"></div>
                </div>
                <div class="h-6 bg-slate-200 w-3/4 rounded mb-2"></div>
                <div class="h-4 bg-slate-200 w-full rounded mb-2"></div>
                <div class="h-4 bg-slate-200 w-1/2 rounded"></div>
             </div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="hasError" class="text-center py-12 bg-white rounded-xl border border-red-100">
             <p class="text-red-500 mb-4">{{ errorMessage }}</p>
             <button @click="retryLoading" class="text-indigo-600 hover:underline">重新加载</button>
          </div>

          <!-- 空状态 -->
          <div v-else-if="displayedPosts.length === 0" class="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
             <MessageSquare class="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 class="text-lg font-medium text-slate-900">未找到相关内容</h3>
             <p class="text-slate-500 mt-1">尝试使用其他关键词，或成为第一个发帖的人！</p>
             <button @click="openModal" class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                发表第一篇经验
             </button>
          </div>

          <!-- 帖子列表 -->
          <template v-else>
            <div 
              v-for="post in displayedPosts" 
              :key="post.id"
              class="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              @click="viewPostDetail(post.id)"
            >
              <!-- 头部：作者与元数据 -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                   <button 
                     @click.stop="navigateToUserProfile(post.user_id)"
                     class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm hover:bg-indigo-200 hover:ring-2 hover:ring-indigo-500 transition-all"
                   >
                      <User class="w-5 h-5" />
                   </button>
                   <div>
                      <button 
                        @click.stop="navigateToUserProfile(post.user_id)"
                        class="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors text-left"
                      >
                        {{ post.author || '匿名用户' }}
                      </button>
                      <div class="text-xs text-slate-400 flex items-center gap-1">
                         <span>{{ formatDate(post.created_at) }}</span>
                         <span>·</span>
                         <span>{{ post.category || '未分类' }}</span>
                      </div>
                   </div>
                </div>
                <!-- 点赞和收藏按钮 -->
                <div class="flex space-x-3">
                  <!-- 点赞按钮 -->
                  <button 
                    @click.stop="toggleLike(post)"
                    :disabled="isLiking"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    :class="post.is_liked ? 'text-red-500 bg-red-50' : 'bg-gray-100'"
                  >
                    <Heart class="w-4 h-4" :class="{ 'fill-current': post.is_liked }" />
                    <span class="text-sm font-medium">{{ post.like_count || 0 }}</span>
                  </button>
                  
                  <!-- 收藏按钮 -->
                  <button 
                    @click.stop="toggleFavorite(post)"
                    :disabled="isFavoriting"
                    class="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50"
                    :class="post.is_favorited ? 'text-yellow-500 bg-yellow-50' : 'bg-gray-100'"
                  >
                    <Tag class="w-4 h-4" />
                    <span class="text-sm font-medium">{{ post.favorite_count || 0 }}</span>
                  </button>
                </div>
              </div>

              <!-- 内容区 -->
              <h2 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                 {{ post.title }}
              </h2>
              <p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                 {{ post.content }}
              </p>
              <div
                v-if="post.resource"
                class="mb-4 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-indigo-900">{{ post.resource.title }}</p>
                    <p class="text-xs text-indigo-500">{{ post.resource.category || '未分类' }}</p>
                    <p class="text-sm text-slate-600 mt-2 line-clamp-2">
                      {{ post.resource.description || '暂无资源描述' }}
                    </p>
                  </div>
                  <a
                    v-if="post.resource.url"
                    :href="post.resource.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                    @click.stop
                  >
                    查看资源
                  </a>
                </div>
              </div>

              <!-- 底部：标签与互动 -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div class="flex flex-wrap gap-2">
                    <span v-for="tag in post.tags" :key="tag" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                       <Hash class="w-3 h-3 mr-0.5 text-slate-400" />
                       {{ tag }}
                    </span>
                 </div>
                 <div class="flex items-center gap-4 text-slate-400 text-sm">
                    <button class="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                       <MessageSquare class="w-4 h-4" />
                       {{ post.comment_count || 0 }}
                    </button>
                 </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="flex flex-wrap items-center justify-center gap-4 py-4">
              <div class="flex items-center gap-4">
                <button 
                  @click="prevPage"
                  :disabled="currentPage === 1" 
                  class="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <span class="text-sm text-slate-600 font-medium">第 {{ currentPage }} / {{ totalPages }} 页</span>
                <button 
                  @click="nextPage"
                  :disabled="currentPage === totalPages" 
                  class="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span>跳转到</span>
                <input
                  v-model="jumpPageInput"
                  type="number"
                  min="1"
                  :max="totalPages"
                  @keyup.enter="jumpToPage"
                  class="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="页码"
                />
                <span>页</span>
                <button
                  type="button"
                  @click="jumpToPage"
                  class="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 disabled:opacity-50"
                  :disabled="!totalPages"
                >
                  跳转
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- 3. 右侧：侧边栏 (占4列) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- 发布按钮 -->
          <button 
            @click="openModal"
            class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
             <Plus class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
             发表我的经验
          </button>

          <!-- 热门标签卡片 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Tag class="w-5 h-5 text-indigo-500" />
                热门话题
             </h3>
             <div class="flex flex-wrap gap-2">
                <span 
                   v-for="tag in popularTags" 
                   :key="tag.name"
                   @click="filterByTag(tag.name)"
                   class="cursor-pointer px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                >
                   {{ tag.name }}
                   <span class="text-xs bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md group-hover:bg-indigo-200 group-hover:text-indigo-700">{{ tag.count }}</span>
                </span>
                <div v-if="popularTags.length === 0" class="text-slate-400 text-sm">暂无热门标签</div>
             </div>
          </div>

          <!-- 社区规范/公告 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
             <h3 class="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">🌟 社区公约</h3>
             <ul class="text-sm text-slate-600 space-y-2 list-disc list-inside marker:text-indigo-400">
                <li>友善交流，互相尊重</li>
                <li>分享真实、有价值的学习经验</li>
                <li>禁止发布广告或违规内容</li>
             </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- 4. 发布模态框 (Modal) -->
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal"></div>
        
        <!-- 内容 -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <h3 class="text-lg font-bold text-slate-800">发表学习经验</h3>
             <button @click="closeModal" class="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X class="w-5 h-5" />
             </button>
          </div>

          <!-- Body (Scrollable) -->
          <div class="p-6 overflow-y-auto space-y-5">
             <!-- 标题 -->
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">标题</label>
                <input 
                  v-model="newPostForm.title" 
                  type="text" 
                  placeholder="一句话概括你的核心观点" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                />
             </div>

             <!-- 分类 -->
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">分类</label>
                <select 
                  v-model="newPostForm.category" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-600"
                >
                   <option value="" disabled selected>选择分类</option>
                   <option value="前端开发">前端开发</option>
                   <option value="后端开发">后端开发</option>
                   <option value="算法与数据结构">算法与数据结构</option>
                   <option value="语言学习">语言学习</option>
                   <option value="考研/考证">考研/考证</option>
                   <option value="其他">其他</option>
                </select>
             </div>

             <!-- 内容 -->
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">内容详情</label>
                <textarea 
                  v-model="newPostForm.content" 
                  rows="6" 
                  placeholder="详细分享你的经验、心得或问题...（选填）" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                ></textarea>
             </div>

             <!-- 标签输入 -->
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">标签 (Enter添加)</label>
                <div class="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[46px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                   <span v-for="(tag, idx) in newPostForm.tags" :key="idx" class="inline-flex items-center px-2 py-1 rounded-md text-sm bg-indigo-100 text-indigo-700">
                      {{ tag }}
                      <button @click="removeTag(idx)" class="ml-1 hover:text-indigo-900"><X class="w-3 h-3" /></button>
                   </span>
                   <input 
                      v-model="tagInput" 
                      @keydown.enter.prevent="addTag"
                      @keydown.backspace="tagInput==='' && newPostForm.tags.length ? newPostForm.tags.pop() : null"
                      type="text" 
                      placeholder="添加标签..." 
                      class="flex-1 bg-transparent border-none outline-none text-sm min-w-[80px]" 
                   />
                </div>
             </div>

             <!-- 关联我的资源 -->
             <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">关联我的资源</label>
                <div class="space-y-2">
                  <p v-if="isLoadingResources" class="text-sm text-slate-500">正在加载资源...</p>
                  <p v-else-if="resourcesError" class="text-sm text-red-500">{{ resourcesError }}</p>
                  <div v-else-if="myResources.length === 0" class="text-sm text-slate-500 flex flex-wrap items-center gap-2">
                    你还没有创建学习资源
                    <button 
                      @click="router.push('/my-all-resources')" 
                      class="text-indigo-600 hover:underline font-medium"
                    >
                      前往创建
                    </button>
                  </div>
                  <div v-else class="space-y-3">
                    <select 
                      v-model="newPostForm.resourceId"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-600"
                    >
                      <option value="">不关联资源</option>
                      <option 
                        v-for="resource in myResources" 
                        :key="resource.id" 
                        :value="resource.id"
                      >
                        {{ resource.title }}
                      </option>
                    </select>
                    <div v-if="selectedResource" class="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <p class="text-sm font-semibold text-slate-800">{{ selectedResource.title }}</p>
                      <p class="text-xs text-slate-500">{{ selectedResource.category || '未分类' }}</p>
                      <p class="text-sm text-slate-600 mt-1 line-clamp-2">{{ selectedResource.description || '暂无描述' }}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
             <button @click="closeModal" class="px-5 py-2 text-slate-600 font-medium hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">取消</button>
             <button 
                @click="submitPost" 
                :disabled="isSubmitting || !newPostForm.title"
                class="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
             >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                {{ isSubmitting ? '发布中...' : '发布经验' }}
             </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDatabaseStore } from '@/stores/database';
import { supabaseService } from '@/services/supabase';
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Heart, 
  Share2, 
  Tag, 
  User, 
  Clock, 
  X, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Hash
} from 'lucide-vue-next';

// --- 类型定义 ---
interface LinkedResource {
  id: string
  title: string
  description?: string
  category?: string
  url?: string
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  user_id?: string;
  avatar_color?: string; // 模拟头像颜色
  category: string;
  created_at: string;
  like_count: number;
  favorite_count: number;
  comment_count: number;
  tags: string[];
  resource_id?: string | null;
  resource?: LinkedResource | null;
  is_liked?: boolean;
  is_favorited?: boolean;
}

// --- 状态管理 ---
const router = useRouter();
const dbStore = useDatabaseStore();

const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const searchKeyword = ref('');
const showSearchResults = ref(false);
const showModal = ref(false);
const sortBy = ref<'latest' | 'likes' | 'favorites' | 'comments'>('latest');
const isSubmitting = ref(false);
const isLiking = ref(false);
const isFavoriting = ref(false);
const myResources = ref<LinkedResource[]>([])
const isLoadingResources = ref(false)
const resourcesError = ref('')

// 分页状态
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const jumpPageInput = ref('');

// 数据
const posts = ref<Post[]>([]);
const filteredPosts = ref<Post[]>([]);
const popularTags = ref<any[]>([]);

// 表单数据
const newPostForm = reactive({
  title: '',
  content: '',
  category: '',
  tags: [] as string[],
  resourceId: '' as string | null
});
const tagInput = ref('');
const selectedResource = computed(() => {
  if (!newPostForm.resourceId) return null
  return myResources.value.find(res => res.id === newPostForm.resourceId) || null
})

// --- 计算属性 ---
const displayedPosts = computed(() => {
  let currentPosts = showSearchResults.value ? filteredPosts.value : posts.value;
  
  // 根据筛选条件排序
  const sortedPosts = [...currentPosts].sort((a, b) => {
    switch (sortBy.value) {
      case 'likes':
        return (b.like_count || 0) - (a.like_count || 0);
      case 'favorites':
        return (b.favorite_count || 0) - (a.favorite_count || 0);
      case 'comments':
        return (b.comment_count || 0) - (a.comment_count || 0);
      case 'latest':
      default:
        // 按创建时间降序（最新的在前）
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
    }
  });
  
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return sortedPosts.slice(startIndex, endIndex);
});

// --- 方法 ---

// 处理搜索输入变化
const handleSearchInput = () => {
  if (!searchKeyword.value.trim()) {
    clearSearch();
  }
};

// 设置排序方式
const setSortBy = (sort: 'latest' | 'likes' | 'favorites' | 'comments') => {
  sortBy.value = sort;
  currentPage.value = 1; // 重置到第一页
  updatePagination();
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  showSearchResults.value = false;
  filteredPosts.value = [];
  currentPage.value = 1;
  updatePagination();
};

// 执行搜索
const performSearch = async () => {
  const keyword = searchKeyword.value.trim();
  
  if (!keyword) {
    clearSearch();
    return;
  }
  
  showSearchResults.value = true;
  
  const keywordLower = keyword.toLowerCase();
  const matchedPosts = posts.value.filter(post => {
    if (post.title && post.title.toLowerCase().includes(keywordLower)) {
      return true;
    }
    if (post.content && post.content.toLowerCase().includes(keywordLower)) {
      return true;
    }
    if (post.category && post.category.toLowerCase().includes(keywordLower)) {
      return true;
    }
    if (post.author && post.author.toLowerCase().includes(keywordLower)) {
      return true;
    }
    if (post.tags && Array.isArray(post.tags)) {
      const tagMatch = post.tags.some(tag => 
        typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
      );
      if (tagMatch) {
        return true;
      }
    }
    return false;
  });
  
  filteredPosts.value = matchedPosts;
  currentPage.value = 1;
  updatePagination();
};

// 更新分页
const updatePagination = () => {
  const currentPosts = showSearchResults.value ? filteredPosts.value : posts.value;
  // 注意：这里不排序，因为排序在 displayedPosts 计算属性中处理
  totalPages.value = Math.ceil(currentPosts.length / pageSize.value);
};

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const jumpToPage = () => {
  const total = totalPages.value;
  if (!total) {
    showToast('暂无可跳转的页码', 'warning');
    return;
  }

  if (!jumpPageInput.value) {
    showToast('请输入要跳转的页码', 'warning');
    return;
  }

  const target = Number(jumpPageInput.value);
  if (!Number.isInteger(target)) {
    showToast('请输入有效的整数页码', 'warning');
    return;
  }

  if (target < 1 || target > total) {
    showToast(`页码需在 1 到 ${total} 之间`, 'warning');
    return;
  }

  currentPage.value = target;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  jumpPageInput.value = '';
};

// 查看帖子详情
const viewPostDetail = (postId: string) => {
  router.push(`/post/${postId}`);
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 按标签过滤
const filterByTag = async (tagName: string) => {
  const keywordLower = tagName.toLowerCase();
  const matchedPosts = posts.value.filter(post => {
    if (post.tags && Array.isArray(post.tags)) {
      const tagMatch = post.tags.some(tag => 
        typeof tag === 'string' && tag.toLowerCase().includes(keywordLower)
      );
      if (tagMatch) {
        return true;
      }
    }
    return false;
  });
  
  filteredPosts.value = matchedPosts;
  showSearchResults.value = true;
  currentPage.value = 1;
  searchKeyword.value = tagName;
  updatePagination();
};

const loadMyResources = async (userId: string) => {
  isLoadingResources.value = true;
  resourcesError.value = '';
  try {
    const resources = await dbStore.getUserResources(userId);
    myResources.value = (resources || []).map((res: any) => ({
      id: res.id,
      title: res.title || '未命名资源',
      description: res.description,
      category: res.category,
      url: res.url
    }));
  } catch (error) {
    console.error('获取用户资源失败:', error);
    resourcesError.value = '加载资源失败，请稍后再试';
    myResources.value = [];
  } finally {
    isLoadingResources.value = false;
  }
};

// --- 点赞收藏功能 ---
const toggleLike = async (post: any) => {
  if (isLiking.value) return;
  
  isLiking.value = true;
  try {
    // 获取当前用户ID
    let currentUserId = null;
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.id) {
          currentUserId = user.id.toString();
        }
      } catch (error: any) {
        console.error('解析用户信息失败:', error);
      }
    }
    
    if (!currentUserId) {
      router.push('/login');
      return;
    }
    
    // 使用统一的 Supabase 客户端获取方式
    let client = null;
    try {
      client = await supabaseService.getClient();
    } catch (error: any) {
      console.error('❌ 数据库连接失败:', error.message);
      showToast('数据库连接失败，请稍后重试', 'error');
      return;
    }
    
    if (post.is_liked) {
      // 取消点赞
      const { error } = await client
        .from('post_likes')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id);
      
      if (error) {
        console.error('❌ 取消点赞失败:', error);
      } else {
        post.is_liked = false;
        post.like_count = Math.max((post.like_count || 0) - 1, 0);
      }
    } else {
      // 添加点赞
      const { data: existingLike } = await client
        .from('post_likes')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
        .limit(1);
      
      if (existingLike && existingLike.length > 0) {
        post.is_liked = true;
      } else {
        const { error } = await client
          .from('post_likes')
          .insert({
            user_id: currentUserId,
            post_id: post.id
          });
        
        if (error) {
          if (error.code === '23503' && error.message.includes('fk_post_likes_user')) {
            // 外键约束错误的临时解决方案
            post.is_liked = true;
            post.like_count = (post.like_count || 0) + 1;
            return;
          } else {
            throw error;
          }
        } else {
          post.is_liked = true;
          post.like_count = (post.like_count || 0) + 1;
        }
      }
    }
  } catch (error) {
    console.error('❌ 点赞操作失败:', error);
    showToast('操作失败，请稍后重试', 'error');
  } finally {
    isLiking.value = false;
  }
};

const toggleFavorite = async (post: any) => {
  if (isFavoriting.value) return;
  
  isFavoriting.value = true;
  try {
    // 获取当前用户ID
    let currentUserId = null;
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.id) {
          currentUserId = user.id.toString();
        }
      } catch (error: any) {
        console.error('解析用户信息失败:', error);
      }
    }
    
    if (!currentUserId) {
      router.push('/login');
      return;
    }
    
    // 使用统一的 Supabase 客户端获取方式
    let client = null;
    try {
      client = await supabaseService.getClient();
    } catch (error: any) {
      console.error('❌ 数据库连接失败:', error.message);
      showToast('数据库连接失败，请稍后重试', 'error');
      return;
    }
    
    if (post.is_favorited) {
      // 取消收藏
      const { error } = await client
        .from('post_favorites')
        .delete()
        .eq('user_id', currentUserId)
        .eq('post_id', post.id);
      
      if (error) {
        console.error('❌ 取消收藏失败:', error);
      } else {
        post.is_favorited = false;
        post.favorite_count = Math.max((post.favorite_count || 0) - 1, 0);
      }
    } else {
      // 添加收藏
      const { data: existingFavorite } = await client
        .from('post_favorites')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('post_id', post.id)
        .limit(1);
      
      if (existingFavorite && existingFavorite.length > 0) {
        post.is_favorited = true;
      } else {
        const { error } = await client
          .from('post_favorites')
          .insert({
            user_id: currentUserId,
            post_id: post.id
          });
        
        if (error) {
          if (error.code === '23503' && error.message.includes('fk_post_favorites_user')) {
            // 外键约束错误的临时解决方案
            post.is_favorited = true;
            post.favorite_count = (post.favorite_count || 0) + 1;
            return;
          } else {
            throw error;
          }
        } else {
          post.is_favorited = true;
          post.favorite_count = (post.favorite_count || 0) + 1;
        }
      }
    }
  } catch (error) {
    console.error('❌ 收藏操作失败:', error);
    showToast('操作失败，请稍后重试', 'error');
  } finally {
    isFavoriting.value = false;
  }
};

// --- 数据加载 ---
const loadPosts = async () => {
  isLoading.value = true;
  try {
    let client = await dbStore.getClient();
    if (!client) {
      await dbStore.reconnect();
      client = await dbStore.getClient();
    }
    
    if (!client) {
      throw new Error('数据库客户端初始化失败');
    }
    
    // 获取帖子数据
    const { data: postsData, error: postsError } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (postsError) {
      throw postsError;
    }

    // 获取作者信息
    const userIds = Array.from(new Set((postsData || [])
      .map((post: any) => post.user_id)
      .filter((id: string | null): id is string => !!id)));

    const userMap: Record<string, { id: string; username?: string; nickname?: string }> = {};
    if (userIds.length > 0) {
      const { data: usersData, error: usersError } = await client
        .from('users')
        .select('id, username, nickname')
        .in('id', userIds);

      if (usersError) {
        console.warn('加载用户信息失败:', usersError);
      } else {
        usersData?.forEach((user: any) => {
          userMap[user.id] = user;
        });
      }
    }

    // 获取与帖子关联的资源
    const resourceIds = Array.from(new Set((postsData || [])
      .map((post: any) => post.resource_id)
      .filter((id: string | null): id is string => !!id)));

    const resourceMap: Record<string, LinkedResource> = {};
    if (resourceIds.length > 0) {
      const { data: resourcesData, error: resourcesError } = await client
        .from('resources')
        .select('id, title, description, category, url')
        .in('id', resourceIds);

      if (resourcesError) {
        console.warn('加载资源信息失败:', resourcesError);
      } else {
        resourcesData?.forEach((res: any) => {
          resourceMap[res.id] = {
            id: res.id,
            title: res.title || '未命名资源',
            description: res.description,
            category: res.category,
            url: res.url
          };
        });
      }
    }
    
    // 获取所有帖子的评论数
    const { data: commentsData, error: commentsError } = await client
      .from('post_comments')
      .select('post_id')
      .not('post_id', 'is', null);
    
    if (commentsError) {
      console.error('获取评论数据失败:', commentsError);
    }
    
    // 计算每个帖子的评论数
    const commentCounts: Record<string, number> = {};
    if (commentsData) {
      commentsData.forEach(comment => {
        const postId = comment.post_id;
        commentCounts[postId] = (commentCounts[postId] || 0) + 1;
      });
    }
    
    // 获取当前用户ID以检查收藏状态
    let currentUserId: string | null = null;
    let currentUserName = '';
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.id) {
          currentUserId = user.id;
          currentUserName = user.nickname || user.username || '';
        }
      } catch (error: any) {
        console.error('解析用户信息失败:', error);
      }
    }
    
    posts.value = (postsData || []).map((post: any) => {
      const userInfo = post.user_id ? userMap[post.user_id] : null;
      const authorName = userInfo?.nickname || userInfo?.username || (post.user_id ? `用户${post.user_id.substring(0, 8)}` : '匿名用户');
      const linkedResource = post.resource_id ? (resourceMap[post.resource_id] || null) : null;

      return {
        ...post,
        author: authorName,
        is_liked: false,
        is_favorited: false,
        like_count: post.like_count || 0,
        favorite_count: post.favorite_count || 0,
        comment_count: commentCounts[post.id] || 0,
        resource: linkedResource
      };
    });
    
    // 如果用户已登录，加载点赞和收藏状态
    if (currentUserId) {
      await loadLikesStatus(currentUserId);
      await loadFavoritesStatus(currentUserId);
    }
    
    updatePagination();
    
  } catch (error) {
    console.error('❌ 加载帖子失败:', error);
    hasError.value = true;
    errorMessage.value = '加载帖子失败：' + (error.message || '未知错误');
  } finally {
    isLoading.value = false;
  }
};

const loadLikesStatus = async (userId: string) => {
  try {
    const client = await supabaseService.getClient();
    
    const { data, error } = await client
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    if (!error && data) {
      const likedPostIds = new Set(data.map((like: any) => like.post_id));
      posts.value.forEach(post => {
        post.is_liked = likedPostIds.has(post.id);
      });
    }
  } catch (error) {
    console.error('❌ 加载点赞状态失败:', error);
  }
};

const loadFavoritesStatus = async (userId: string) => {
  try {
    const client = await supabaseService.getClient();
    
    const { data, error } = await client
      .from('post_favorites')
      .select('post_id')
      .eq('user_id', userId);
    
    if (!error && data) {
      const favoritedPostIds = new Set(data.map((fav: any) => fav.post_id));
      posts.value.forEach(post => {
        post.is_favorited = favoritedPostIds.has(post.id);
      });
    }
  } catch (error) {
    console.error('❌ 加载收藏状态失败:', error);
  }
};

const loadPopularTags = async () => {
  try {
    let client = await dbStore.getClient();
    if (!client) {
      await dbStore.reconnect();
      client = await dbStore.getClient();
    }
    
    if (!client) {
      return;
    }
    
    const { data, error } = await client
      .from('community_posts')
      .select('tags');
    
    if (error) {
      console.error('❌ 加载标签失败:', error);
      return;
    }
    
    const tagCount: any = {};
    data?.forEach((post: any) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
    
    popularTags.value = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count, id: name }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 6);
      
  } catch (error) {
    console.error('❌ 加载标签异常:', error);
  }
};

const retryLoading = async () => {
  hasError.value = false;
  errorMessage.value = '';
  currentPage.value = 1;
  await loadPosts();
};

// --- 模态框与表单逻辑 ---
const openModal = async () => {
  // 检查用户是否登录
  const currentUserStr = localStorage.getItem('currentUser');
  if (!currentUserStr) {
    router.push('/login');
    return;
  }

  try {
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser?.id) {
      await loadMyResources(currentUser.id);
    }
  } catch (error) {
    console.error('解析当前用户失败:', error);
  }

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newPostForm.title = '';
  newPostForm.content = '';
  newPostForm.category = '';
  newPostForm.tags = [];
  newPostForm.resourceId = '';
  tagInput.value = '';
};

const addTag = () => {
  const val = tagInput.value.trim();
  if (val && !newPostForm.tags.includes(val)) {
    newPostForm.tags.push(val);
  }
  tagInput.value = '';
};

const removeTag = (index: number) => {
  newPostForm.tags.splice(index, 1);
};

const submitPost = async () => {
  if (!newPostForm.title.trim()) {
    showToast('请填写标题', 'warning');
    return;
  }
  
  isSubmitting.value = true;
  try {
    let client = await dbStore.getClient();
    if (!client) {
      await dbStore.reconnect();
      client = await dbStore.getClient();
    }
    
    if (!client) {
      throw new Error('数据库客户端初始化失败');
    }
    
    // 获取当前用户ID
    let currentUserId: string | null = null;
    let currentUserName = '';
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.id) {
          currentUserId = user.id;
          currentUserName = user.nickname || user.username || '';
        }
      } catch (error: any) {
        console.error('解析用户信息失败:', error);
      }
    }
    
    if (!currentUserId) {
      router.push('/login');
      isSubmitting.value = false;
      return;
    }
    
    const { data, error } = await client
      .from('community_posts')
      .insert([{
        title: newPostForm.title,
        content: newPostForm.content,
        category: newPostForm.category || '学习经验',
        tags: newPostForm.tags,
        resource_id: newPostForm.resourceId || null,
        user_id: currentUserId,
        like_count: 0,
        favorite_count: 0,
        view_count: 0,
        comment_count: 0
      }])
      .select();
    
    if (error) {
      throw error;
    }
    
    if (data && data[0]) {
      const linkedResource = newPostForm.resourceId
        ? myResources.value.find(res => res.id === newPostForm.resourceId) || null
        : null;

      const newPostData = {
        ...data[0],
        author: currentUserName || (currentUserId ? `用户${currentUserId.substring(0, 8)}` : '匿名'),
        is_liked: false,
        is_favorited: false,
        like_count: data[0].like_count || 0,
        favorite_count: data[0].favorite_count || 0,
        comment_count: data[0].comment_count || 0,
        resource: linkedResource
      };
      posts.value.unshift(newPostData);
      
      currentPage.value = 1;
      updatePagination();
    }
    
    closeModal();
    loadPopularTags();
    
    // 显示成功提示
    showToast('发布经验成功', 'success');
    
  } catch (error) {
    console.error('❌ 发布帖子失败:', error);
    showToast('发布失败，请重试', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 导航到用户主页
const navigateToUserProfile = (userId: string) => {
  if (!userId) return
  
  // 如果点击的是自己的用户ID，跳转到个人资料页面
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (currentUser.id === userId) {
    router.push('/profile')
  } else {
    router.push(`/user/${userId}`)
  }
}

// --- 初始化 ---
onMounted(async () => {
  try {
    if (dbStore.isConnected) {
      console.log('✅ 数据库已连接');
    } else {
      await dbStore.reconnect();
    }
    
    await Promise.all([
      loadPosts(),
      loadPopularTags()
    ]);
    
    console.log('🎉 CommunityPage 初始化完成');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    hasError.value = true;
    errorMessage.value = '初始化失败：' + (error.message || '未知错误');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Modal 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}

/* 文本截断样式 */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>