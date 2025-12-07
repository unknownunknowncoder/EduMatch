<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. 顶部 Hero (高清、明亮、大场面) -->
    <div class="relative h-[400px] w-full overflow-hidden border-b-8 border-[#1a3c34]">
      <!-- 图片：选用明亮的古典图书馆全景 -->
      <img 
        src="https://images.unsplash.com/photo-1568667256549-094345857637?q=85&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-[30s] hover:scale-105"
        alt="Grand Academic Hall"
      />
      
      <!-- 遮罩：仅在底部加渐变，保证图片上方清晰 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/20 to-transparent"></div>
      
      <!-- 标题内容 -->
      <div class="absolute bottom-0 left-0 w-full p-10">
        <div class="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <div class="flex items-center gap-4 mb-2 text-[#d4c5a3]">
              <div class="h-px w-12 bg-[#d4c5a3]"></div>
              <span class="uppercase tracking-[0.3em] text-sm font-bold">学术社区</span>
            </div>
            <h1 class="text-5xl md:text-6xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-lg">
              学术研讨会
            </h1>
          </div>
          
          <div class="hidden md:block text-right text-white/80 font-serif italic max-w-md">
            "知识通过传播而增加，通过扩散而成长。"
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 主内容区域 -->
    <div class="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
      
      <!-- === 左侧侧边栏 (控制台) === -->
      <div class="lg:col-span-1 space-y-8">
        
        <!-- 发布按钮 (Primary Action) -->
        <button 
          @click="openModal"
          class="w-full py-4 bg-[#1a3c34] text-[#e8e4d9] font-bold text-sm uppercase tracking-widest hover:bg-[#235246] shadow-xl transition-all flex items-center justify-center gap-3 border border-[#1a3c34]"
        >
          <PenTool class="w-5 h-5" />
          发起讨论
        </button>

        <!-- 搜索与筛选 (Control Panel) -->
        <div class="bg-white border border-[#1a3c34]/10 shadow-sm p-6">
          <h3 class="text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-4 pb-2 border-b border-[#1a3c34]/10">
            搜索档案
          </h3>
          
          <div class="space-y-4">
            <div class="relative">
              <input 
                v-model="searchKeyword"
                @keyup.enter="performSearch"
                :disabled="isSearching"
                type="text" 
                placeholder="关键词..." 
                class="w-full bg-[#f2f0e9] border border-[#1a3c34]/20 p-3 pl-10 text-[#1a3c34] text-sm focus:outline-none focus:border-[#1a3c34] transition-colors disabled:opacity-50"
              />
              <Search v-if="!isSearching" class="absolute left-3 top-3.5 w-4 h-4 text-[#1a3c34]/50" />
              <svg v-else class="animate-spin absolute left-3 top-3.5 h-4 w-4 text-[#1a3c34]/50" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <button 
              @click="performSearch"
              :disabled="isSearching"
              class="w-full py-2 border border-[#1a3c34]/30 text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="isSearching" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSearching ? '搜索中...' : '搜索' }}
            </button>
          </div>
        </div>

        <!-- 排序选项 (Sort Options) -->
        <div class="bg-white border border-[#1a3c34]/10 shadow-sm p-6">
          <h3 class="text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-4 pb-2 border-b border-[#1a3c34]/10">
            档案排序
          </h3>
          <div class="space-y-2">
            <button 
              @click="sortByOption('latest')"
              :class="{'bg-[#1a3c34] text-white': currentSort === 'latest'}"
              class="w-full py-2 px-3 text-left text-xs font-medium hover:bg-[#1a3c34] hover:text-white transition-colors border border-[#1a3c34]/10"
            >
              🕐 最新发布
            </button>
            <button 
              @click="sortByOption('mostLikes')"
              :class="{'bg-[#1a3c34] text-white': currentSort === 'mostLikes'}"
              class="w-full py-2 px-3 text-left text-xs font-medium hover:bg-[#1a3c34] hover:text-white transition-colors border border-[#1a3c34]/10"
            >
              ❤️ 最多点赞
            </button>
            <button 
              @click="sortByOption('mostFavorites')"
              :class="{'bg-[#1a3c34] text-white': currentSort === 'mostFavorites'}"
              class="w-full py-2 px-3 text-left text-xs font-medium hover:bg-[#1a3c34] hover:text-white transition-colors border border-[#1a3c34]/10"
            >
              ⭐ 最多收藏
            </button>
            <button 
              @click="sortByOption('mostComments')"
              :class="{'bg-[#1a3c34] text-white': currentSort === 'mostComments'}"
              class="w-full py-2 px-3 text-left text-xs font-medium hover:bg-[#1a3c34] hover:text-white transition-colors border border-[#1a3c34]/10"
            >
              💬 最多讨论
            </button>
          </div>
        </div>

        <!-- 热门话题 (Index) -->
        <div class="bg-white border border-[#1a3c34]/10 shadow-sm p-6">
          <h3 class="text-xs font-bold text-[#1a3c34] uppercase tracking-widest mb-4 pb-2 border-b border-[#1a3c34]/10">
            话题索引
          </h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="tag in popularTags"
              :key="tag.id"
              @click="filterByTag(tag.name)"
              class="px-3 py-1 bg-[#f2f0e9] text-[#1a3c34] text-xs font-medium hover:bg-[#1a3c34] hover:text-white transition-colors border border-[#1a3c34]/10"
            >
              #{{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- === 右侧内容流 (文章列表) === -->
      <div class="lg:col-span-3 space-y-6">
        
        <!-- 状态栏 -->
        <div class="flex items-center justify-between pb-4 border-b border-[#1a3c34]/10">
          <h2 class="text-xl font-serif font-bold text-[#1a3c34]">最新手稿</h2>
          <div v-if="showSearchResults" class="text-sm text-[#1a3c34]/60 flex items-center gap-2">
            找到 {{ filteredPosts.length }} 条结果
            <button @click="clearSearch" class="text-[#b03e3e] hover:underline text-xs font-bold uppercase">清除</button>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="py-20 text-center">
          <div class="w-12 h-12 border-4 border-[#d4c5a3] border-t-[#1a3c34] rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 text-[#1a3c34]/60 font-serif italic">检索文档中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="displayedPosts.length === 0" class="py-20 text-center bg-white border border-[#1a3c34]/10">
          <Feather class="w-12 h-12 text-[#1a3c34]/20 mx-auto mb-4" />
          <h3 class="text-lg font-serif font-bold text-[#1a3c34]">未找到记录</h3>
          <p class="text-[#1a3c34]/60 text-sm mt-2">请尝试调整筛选条件或创建新条目。</p>
        </div>

        <!-- 帖子列表 -->
        <div v-else class="space-y-6">
          <div 
            v-for="post in displayedPosts" 
            :key="post.id"
            class="group bg-white p-8 border border-[#1a3c34]/10 shadow-sm hover:shadow-xl hover:border-[#1a3c34]/30 transition-all duration-300 cursor-pointer relative"
            @click="viewPostDetail(post.id)"
          >
            <!-- 顶部标签栏 -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-[#1a3c34] text-white text-[10px] font-bold uppercase tracking-wider">
                  {{ post.category || 'General' }}
                </span>
                <span class="text-xs text-[#1a3c34]/50 font-mono">
                  {{ formatDate(post.created_at) }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-[#1a3c34]/40">
                <User class="w-4 h-4" />
                <span class="text-xs font-bold uppercase tracking-wider hover:text-[#1a3c34]" @click.stop="navigateToUserProfile(post.user_id)">
                  {{ post.author || 'Anonymous' }}
                </span>
              </div>
            </div>

            <!-- 标题与内容 -->
            <h3 class="text-2xl font-serif font-bold text-[#1a3c34] mb-3 group-hover:text-[#8c734b] transition-colors">
              {{ post.title }}
            </h3>
            <p class="text-[#1a3c34]/70 font-serif leading-relaxed line-clamp-3 mb-6 text-base">
              {{ post.content }}
            </p>

            <!-- 关联资源 (精致卡片) -->
            <div v-if="post.resource" class="mb-6 p-4 bg-[#f9f9f7] border-l-4 border-[#1a3c34] flex items-center justify-between group/res hover:bg-[#f2f0e9] transition-colors">
              <div class="flex items-center gap-3">
                <FileText class="w-5 h-5 text-[#1a3c34]/60" />
                <div>
                  <div class="text-xs font-bold text-[#1a3c34]/40 uppercase">参考资料</div>
                  <div class="text-sm font-serif font-bold text-[#1a3c34]">{{ post.resource.title }}</div>
                </div>
              </div>
              <a :href="post.resource.url" target="_blank" @click.stop class="text-[#1a3c34]/60 hover:text-[#1a3c34]">
                <ExternalLink class="w-4 h-4" />
              </a>
            </div>

            <!-- 底部互动栏 -->
            <div class="pt-4 border-t border-[#1a3c34]/5 flex items-center justify-between">
              <div class="flex gap-2">
                <span v-for="tag in post.tags" :key="tag" class="text-xs text-[#1a3c34]/50 font-mono hover:text-[#1a3c34] transition-colors">
                  #{{ tag }}
                </span>
              </div>
              
              <div class="flex gap-4">
                <button 
                  @click.stop="toggleLike(post)"
                  class="flex items-center gap-1.5 text-[#1a3c34]/50 hover:text-[#b03e3e] transition-colors"
                  :class="{'text-[#b03e3e]': post.is_liked}"
                >
                  <Heart class="w-4 h-4" :class="{'fill-current': post.is_liked}" />
                  <span class="text-xs font-mono">{{ post.like_count || 0 }}</span>
                </button>
                <button 
                  @click.stop="toggleFavorite(post)"
                  class="flex items-center gap-1.5 text-[#1a3c34]/50 hover:text-[#f59e0b] transition-colors"
                  :class="{'text-[#f59e0b]': post.is_favorited}"
                >
                  <Star class="w-4 h-4" :class="{'fill-current': post.is_favorited}" />
                  <span class="text-xs font-mono">{{ post.favorite_count || 0 }}</span>
                </button>
                <button class="flex items-center gap-1.5 text-[#1a3c34]/50 hover:text-[#1a3c34] transition-colors">
                  <MessageSquare class="w-4 h-4" />
                  <span class="text-xs font-mono">{{ post.comment_count || 0 }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 (复古按钮) -->
        <div class="flex justify-center gap-4 pt-8">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-sm hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">
            上一页
          </button>
          <span class="px-4 py-2 font-mono text-[#1a3c34]">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-sm hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">
            下一页
          </button>
        </div>

      </div>
    </div>

    <!-- 发帖弹窗 (保持风格一致) -->
    <transition name="fade">
      <div v-if="showCreatePostModal" class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-[#1a3c34]/90 backdrop-blur-sm px-4">
        <div class="bg-[#f4f1ea] w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#1a3c34]/20">
          <button @click="closeCreatePostModal" class="absolute top-6 right-6 text-[#1a3c34]/40 hover:text-[#1a3c34] hover:bg-[#1a3c34]/10 rounded-sm p-2 transition-all"><X class="w-6 h-6"/></button>
          
          <div class="p-10">
             <div class="text-center mb-8 pb-4 border-b border-[#1a3c34]/10">
                <h2 class="text-3xl font-serif font-bold text-[#1a3c34]">新提交</h2>
             </div>

             <form @submit.prevent="submitPost" class="space-y-6">
                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">标题</label>
                   <input v-model="newPostForm.title" type="text" class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] font-serif focus:border-[#1a3c34] focus:outline-none" placeholder="研究标题..." />
                </div>

                <div class="grid grid-cols-2 gap-4">
                   <div>
                      <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">分类</label>
                      <select v-model="newPostForm.category" class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:border-[#1a3c34] focus:outline-none">
                         <option value="" disabled>选择...</option>
                         <option value="前端开发">前端开发</option>
                         <option value="后端开发">后端开发</option>
                         <option value="算法与数据结构">算法与数据结构</option>
                         <option value="其他">综合</option>
                      </select>
                   </div>
                   <div>
                      <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">参考资料</label>
                      <select v-model="newPostForm.resourceId" class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] focus:border-[#1a3c34] focus:outline-none">
                         <option value="">无</option>
                         <option v-for="res in myResources" :key="res.id" :value="res.id">{{ res.title }}</option>
                      </select>
                   </div>
                </div>

                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">内容</label>
                   <textarea v-model="newPostForm.content" rows="6" class="w-full bg-white border border-[#1a3c34]/20 p-3 text-[#1a3c34] font-serif leading-relaxed focus:border-[#1a3c34] focus:outline-none resize-none"></textarea>
                </div>

                <div>
                   <label class="block text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-2">标签</label>
                   <div class="flex gap-2 mb-2">
                      <input v-model="tagInput" class="flex-1 bg-white border border-[#1a3c34]/20 px-3 py-2 text-sm focus:border-[#1a3c34] focus:outline-none" placeholder="添加标签" />
                      <button type="button" @click="addTag" class="px-4 bg-[#1a3c34] text-white text-xs font-bold uppercase hover:bg-[#235246] transition-colors">添加</button>
                   </div>
                   <div class="flex flex-wrap gap-2">
                      <span v-for="(tag, i) in newPostForm.tags" :key="i" class="px-2 py-1 bg-[#1a3c34]/10 text-[#1a3c34] text-xs flex items-center gap-1">#{{ tag }} <button type="button" @click="removeTag(i)" class="hover:text-red-600"><X class="w-3 h-3"/></button></span>
                   </div>
                </div>

                <div class="pt-4 flex justify-end gap-4">
                   <button type="button" @click="closeCreatePostModal" class="px-6 py-3 text-[#1a3c34] font-bold text-sm hover:underline">取消</button>
                   <button type="submit" :disabled="isSubmitting" class="px-8 py-3 bg-[#1a3c34] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#235246] transition-colors flex items-center gap-2">
                      <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                      <span>发布</span>
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Message -->
    <div v-if="showMessage" :class="getMessageClasses(messageType)">
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDatabaseStore } from '@/stores/database';
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message';
import { 
  Users, Search, ArrowRight, PenTool, Tag, 
  Feather, FileText, User, Heart, Star, MessageSquare, X,
  Loader2, ExternalLink
} from 'lucide-vue-next';

// --- Types ---
interface LinkedResource { id: string; title: string; description?: string; category?: string; url?: string }
interface Post {
  id: string; title: string; content: string; author: string; user_id?: string;
  category: string; created_at: string; like_count: number; favorite_count: number;
  comment_count: number; tags: string[]; resource?: LinkedResource | null;
  is_liked?: boolean; is_favorited?: boolean;
}

// --- State ---
const router = useRouter();
const dbStore = useDatabaseStore();
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const searchKeyword = ref('');
const showSearchResults = ref(false);
const showCreatePostModal = ref(false);
const isSubmitting = ref(false);
const isSearching = ref(false);
const isLiking = ref(false);
const isFavoriting = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const currentSort = ref('latest');
const posts = ref<Post[]>([]);
const filteredPosts = ref<Post[]>([]);
const popularTags = ref<any[]>([]);
const myResources = ref<LinkedResource[]>([]);
const newPostForm = reactive({ title: '', content: '', category: '', tags: [] as string[], resourceId: '' as string | null });
const tagInput = ref('');

// --- Computed ---
const displayedPosts = computed(() => {
  const current = showSearchResults.value ? filteredPosts.value : posts.value;
  return current.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// --- Methods ---
const handleSearchInput = () => { if (!searchKeyword.value.trim()) clearSearch(); };
const clearSearch = () => { searchKeyword.value = ''; showSearchResults.value = false; filteredPosts.value = []; currentPage.value = 1; updatePagination(); };
const performSearch = () => {
  const k = searchKeyword.value.trim().toLowerCase();
  if(!k) return clearSearch();
  isSearching.value = true;
  setTimeout(() => {
    filteredPosts.value = posts.value.filter(p => 
      p.title.toLowerCase().includes(k) || p.content.toLowerCase().includes(k) || 
      p.author.toLowerCase().includes(k) || p.tags.some(t => t.toLowerCase().includes(k))
    );
    showSearchResults.value = true;
    currentPage.value = 1;
    // 应用当前排序到搜索结果
    applySortingToResults(filteredPosts.value);
    updatePagination();
    isSearching.value = false;
  }, 300);
};

const applySortingToResults = (targetPosts: Post[]) => {
   switch(currentSort.value) {
      case 'latest':
         targetPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
         break;
      case 'mostLikes':
         targetPosts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
         break;
      case 'mostFavorites':
         targetPosts.sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0));
         break;
      case 'mostComments':
         targetPosts.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
         break;
   }
};

const updatePagination = () => { totalPages.value = Math.ceil((showSearchResults.value ? filteredPosts.value : posts.value).length / pageSize.value) || 1; };
const prevPage = () => { if(currentPage.value > 1) { currentPage.value--; window.scrollTo({ top: 0, behavior: 'smooth' }); } };
const nextPage = () => { if(currentPage.value < totalPages.value) { currentPage.value++; window.scrollTo({ top: 0, behavior: 'smooth' }); } };

const formatDate = (str: string) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const viewPostDetail = (id: string) => router.push(`/post/${id}`);
const navigateToUserProfile = (id?: string) => { if(id) router.push(`/user/${id}`); };
const filterByTag = (tag: string) => { searchKeyword.value = tag; performSearch(); };

const openModal = async () => {
  const userStr = localStorage.getItem('currentUser');
  if(!userStr) { router.push('/login'); return; }
  try { const u = JSON.parse(userStr); if(u.id) await loadMyResources(u.id); } catch(e){}
  showCreatePostModal.value = true;
};
const closeCreatePostModal = () => { showCreatePostModal.value = false; Object.assign(newPostForm, {title:'', content:'', category:'', tags:[], resourceId:''}); tagInput.value=''; };
const addTag = () => { const t = tagInput.value.trim(); if(t && !newPostForm.tags.includes(t)) newPostForm.tags.push(t); tagInput.value=''; };
const removeTag = (i: number) => newPostForm.tags.splice(i, 1);

const loadMyResources = async (uid: string) => {
  try {
    const res = await dbStore.getUserResources(uid);
    myResources.value = (res||[]).map((r:any) => ({ id: r.id, title: r.title, description: r.description, category: r.type, url: r.url }));
  } catch(e) { console.error(e); }
};

const loadPosts = async () => {
  isLoading.value = true;
  try {
    const client = await dbStore.getClient();
    if(!client) return;
    const { data: pData, error } = await client.from('community_posts').select('*').order('created_at', { ascending: false });
    if(error) throw error;

    const userIds = new Set<string>();
    const resIds = new Set<string>();
    pData?.forEach((p: any) => {
       if(p.user_id) userIds.add(p.user_id);
       if(p.resource_id) resIds.add(p.resource_id);
    });

    const userMap: Record<string, any> = {};
    if(userIds.size) {
       const { data: uData } = await client.from('users').select('id, username, nickname').in('id', Array.from(userIds));
       uData?.forEach((u: any) => userMap[u.id] = u);
    }

    const resMap: Record<string, any> = {};
    if(resIds.size) {
       const { data: rData } = await client.from('resources').select('id, title, description, category, url').in('id', Array.from(resIds));
       rData?.forEach((r: any) => resMap[r.id] = r);
    }

    posts.value = (pData||[]).map((p:any) => {
       const u = userMap[p.user_id];
       const r = resMap[p.resource_id];
       return {
          ...p,
          author: u?.nickname || u?.username || 'Anonymous',
          resource: r,
          is_liked: false, is_favorited: false
       };
    });

    // 获取真实的评论数和收藏数
    await loadPostCounts(client);
    
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
       const uid = JSON.parse(currentUser).id;
       await checkUserInteractions(client, uid);
    }
    
    // 应用默认排序
    applySortingToResults(posts.value);
    
    updatePagination();
  } catch(e:any) { hasError.value = true; errorMessage.value = e.message; }
  finally { isLoading.value = false; }
};

const loadPostCounts = async (client: any) => {
   const postIds = posts.value.map(p => p.id);
   if (postIds.length === 0) return;
   
   const [comments, favorites] = await Promise.all([
      client.from('post_comments').select('post_id').in('post_id', postIds),
      client.from('post_favorites').select('post_id').in('post_id', postIds)
   ]);
   
   const commentCounts: Record<string, number> = {};
   const favoriteCounts: Record<string, number> = {};
   
   comments.data?.forEach((c: any) => {
      commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
   });
   
   favorites.data?.forEach((f: any) => {
      favoriteCounts[f.post_id] = (favoriteCounts[f.post_id] || 0) + 1;
   });
   
   posts.value.forEach(p => {
      p.comment_count = commentCounts[p.id] || 0;
      p.favorite_count = favoriteCounts[p.id] || 0;
   });
};

const checkUserInteractions = async (client: any, userId: string) => {
   const [likes, favs] = await Promise.all([
      client.from('post_likes').select('post_id').eq('user_id', userId),
      client.from('post_favorites').select('post_id').eq('user_id', userId)
   ]);
   const likedSet = new Set(likes.data?.map((x: any) => x.post_id));
   const favSet = new Set(favs.data?.map((x: any) => x.post_id));
   posts.value.forEach(p => {
      p.is_liked = likedSet.has(p.id);
      p.is_favorited = favSet.has(p.id);
   });
};

const loadPopularTags = async () => {
   const counts: Record<string, number> = {};
   posts.value.forEach(p => p.tags?.forEach((t:string) => counts[t] = (counts[t]||0)+1));
   popularTags.value = Object.entries(counts).map(([name, count]) => ({name, count, id:name})).sort((a,b)=>b.count-a.count).slice(0,8);
};

const submitPost = async () => {
  if(!newPostForm.title.trim()) return;
  isSubmitting.value = true;
  try {
    const client = await dbStore.getClient();
    const user = JSON.parse(localStorage.getItem('currentUser')||'{}');
    if(!user.id) throw new Error("Auth required");
    
    const { data, error } = await client.from('community_posts').insert([{
      title: newPostForm.title, content: newPostForm.content, category: newPostForm.category||'General',
      tags: newPostForm.tags, resource_id: newPostForm.resourceId||null, user_id: user.id,
      like_count:0, favorite_count:0, comment_count:0
    }]).select();
    
    if(error) throw error;
    if(data?.[0]) posts.value.unshift({ ...data[0], author: user.nickname||user.username, is_liked:false, is_favorited:false, comment_count:0, resource: myResources.value.find(r=>r.id===newPostForm.resourceId) });
    
    closeCreatePostModal();
    showToast('Manuscript submitted.', 'success');
    updatePagination();
  } catch(e) { showToast('Submission failed.', 'error'); }
  finally { isSubmitting.value = false; }
};

const toggleLike = async (post: Post) => {
   if(isLiking.value) return;
   isLiking.value = true;
   try {
      const client = await dbStore.getClient();
      const userStr = localStorage.getItem('currentUser');
      if(!userStr) { router.push('/login'); return; }
      const uid = JSON.parse(userStr).id;

      if(post.is_liked) {
         await client.from('post_likes').delete().eq('user_id', uid).eq('post_id', post.id);
         post.like_count--;
         post.is_liked = false;
      } else {
         await client.from('post_likes').insert({ user_id: uid, post_id: post.id });
         post.like_count++;
         post.is_liked = true;
      }
   } catch(e) { console.error(e); } 
   finally { isLiking.value = false; }
};

const toggleFavorite = async (post: Post) => {
   if(isFavoriting.value) return;
   isFavoriting.value = true;
   try {
      const client = await dbStore.getClient();
      const userStr = localStorage.getItem('currentUser');
      if(!userStr) { router.push('/login'); return; }
      const uid = JSON.parse(userStr).id;

      if(post.is_favorited) {
         await client.from('post_favorites').delete().eq('user_id', uid).eq('post_id', post.id);
         post.favorite_count--;
         post.is_favorited = false;
      } else {
         await client.from('post_favorites').insert({ user_id: uid, post_id: post.id });
         post.favorite_count++;
         post.is_favorited = true;
      }
   } catch(e) { console.error(e); } 
   finally { isFavoriting.value = false; }
};

const sortByOption = (sortType: string) => {
   currentSort.value = sortType;
   applySorting();
};

const applySorting = () => {
   const currentPosts = showSearchResults.value ? filteredPosts.value : posts.value;
   applySortingToResults(currentPosts);
   currentPage.value = 1;
   updatePagination();
};

onMounted(() => { loadPosts().then(loadPopularTags); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:deep(.bg-green-100) { background-color: #f0fdf4 !important; color: #166534 !important; border-color: #166534 !important; }
:deep(.bg-red-100) { background-color: #fef2f2 !important; color: #991b1b !important; border-color: #991b1b !important; }
</style>