<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-20">
    
    <!-- 1. 顶部导航 (Sticky Header) -->
    <div class="sticky top-0 z-30 bg-[#f2f0e9]/95 backdrop-blur-sm border-b border-[#1a3c34]/10 px-6 py-4 shadow-sm">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <button 
          @click="$router.back()" 
          class="flex items-center text-[#1a3c34]/60 hover:text-[#1a3c34] transition-colors font-serif italic group"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回研讨会
        </button>
        
        <!-- Actions (Top) -->
        <div class="flex items-center gap-3">
           <button 
              @click="toggleLike(post!)" 
              :disabled="isLiking"
              class="p-2 rounded-full border border-[#1a3c34]/10 hover:bg-[#1a3c34] hover:text-white transition-colors text-[#1a3c34]/60"
              :class="{'!bg-[#b03e3e] !text-white !border-[#b03e3e]': post?.is_liked}"
           >
              <Heart class="w-4 h-4" :class="{'fill-current': post?.is_liked}" />
           </button>
           <button 
              @click="toggleFavorite(post!)" 
              :disabled="isFavoriting"
              class="p-2 rounded-full border border-[#1a3c34]/10 hover:bg-[#1a3c34] hover:text-white transition-colors text-[#1a3c34]/60"
              :class="{'!bg-[#f59e0b] !text-white !border-[#f59e0b]': post?.is_favorited}"
           >
              <Star class="w-4 h-4" :class="{'fill-current': post?.is_favorited}" />
           </button>
        </div>
      </div>
    </div>

    <!-- Toast Message -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

    <div class="max-w-4xl mx-auto px-6 mt-8" v-if="post">
      
      <!-- 2. 手稿正文 (The Manuscript) -->
      <article class="bg-white shadow-xl border-t-8 border-[#1a3c34] p-10 md:p-14 relative overflow-hidden mb-12">
        <!-- Watermark -->
        <Feather class="absolute right-[-20px] top-[-20px] w-64 h-64 text-[#f2f0e9] -z-0 pointer-events-none opacity-60 rotate-12" />

        <div class="relative z-10">
           <!-- Meta Header -->
           <div class="flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest text-[#1a3c34]/40 border-b border-[#1a3c34]/10 pb-6">
              <span class="flex items-center gap-2">
                 <User class="w-4 h-4" /> {{ post.author_name || '匿名用户' }}
              </span>
              <span>•</span>
              <span>{{ formatDate(post.created_at) }}</span>
              <span>•</span>
              <span class="px-2 py-1 bg-[#f2f0e9] text-[#1a3c34] rounded-sm">{{ post.category || '综合' }}</span>
           </div>

           <!-- Title -->
           <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#1a3c34] mb-8 leading-tight">
              {{ post.title }}
           </h1>

           <!-- Body Content -->
           <div class="prose prose-lg prose-p:text-[#1a3c34]/80 prose-headings:font-serif prose-headings:text-[#1a3c34] max-w-none font-serif leading-loose">
              <p class="whitespace-pre-wrap">{{ post.content }}</p>
           </div>

           <!-- Linked Resource (Reference Card) -->
           <div v-if="post.resource" class="mt-12 p-6 bg-[#f9f9f7] border border-[#1a3c34]/10 flex items-start justify-between gap-6 group hover:border-[#1a3c34]/30 transition-colors">
              <div class="flex gap-4">
                 <div class="w-12 h-12 bg-[#1a3c34] text-[#d4c5a3] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileText class="w-6 h-6" />
                 </div>
                 <div>
                    <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">附件参考</div>
                    <h3 class="text-lg font-serif font-bold text-[#1a3c34]">{{ post.resource.title }}</h3>
                    <p class="text-sm text-[#1a3c34]/60 mt-1 line-clamp-2">{{ post.resource.description || '暂无摘要。' }}</p>
                 </div>
              </div>
              <a 
                 :href="post.resource.url" 
                 target="_blank" 
                 class="px-6 py-3 border border-[#1a3c34] text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors flex-shrink-0"
              >
                 访问
              </a>
           </div>
           
           <!-- Deleted Resource State -->
           <div v-else-if="post.resource_id" class="mt-12 p-6 bg-[#f2f0e9] border border-dashed border-[#1a3c34]/20 flex items-center gap-4 text-[#1a3c34]/40 italic font-serif">
              <FileX class="w-6 h-6" />
              <span>参考资料已从档案中移除。</span>
           </div>

           <!-- Interaction Stats -->
           <div class="mt-8 pt-8 border-t border-[#1a3c34]/10">
              <div class="flex items-center justify-center gap-8 text-sm">
                 <button 
                    @click="toggleLike(post!)"
                    :disabled="isLiking"
                    class="flex items-center gap-2 transition-colors"
                    :class="{
                      'text-[#b03e3e]': post?.is_liked,
                      'text-[#1a3c34]/60 hover:text-[#1a3c34]': !post?.is_liked
                    }"
                 >
                    <Heart class="w-4 h-4" :class="{'fill-current': post?.is_liked}" />
                    <span class="font-mono">{{ post.like_count || 0 }}</span>
                    <span class="text-xs uppercase tracking-wider">{{ post?.is_liked ? '已点赞' : '点赞' }}</span>
                 </button>
                 <button 
                    @click="toggleFavorite(post!)"
                    :disabled="isFavoriting"
                    class="flex items-center gap-2 transition-colors"
                    :class="{
                      'text-[#f59e0b]': post?.is_favorited,
                      'text-[#1a3c34]/60 hover:text-[#1a3c34]': !post?.is_favorited
                    }"
                 >
                    <Star class="w-4 h-4" :class="{'fill-current': post?.is_favorited}" />
                    <span class="font-mono">{{ post.favorite_count || 0 }}</span>
                    <span class="text-xs uppercase tracking-wider">{{ post?.is_favorited ? '已收藏' : '收藏' }}</span>
                 </button>
                 <div class="flex items-center gap-2 text-[#1a3c34]/60">
                    <MessageSquare class="w-4 h-4" />
                    <span class="font-mono">{{ post.comment_count || 0 }}</span>
                    <span class="text-xs uppercase tracking-wider">评论</span>
                 </div>
              </div>
           </div>
        </div>
      </article>

      <!-- 3. 评论区 (Discussion Log) -->
      <section id="comments-section" class="mb-20">
         <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-serif font-bold text-[#1a3c34] flex items-center gap-3">
               <MessageSquare class="w-6 h-6 text-[#d4c5a3]" />
               讨论记录 <span class="text-lg text-[#1a3c34]/40 font-normal">({{ totalComments }})</span>
            </h2>
         </div>

         <!-- Add Comment -->
         <div class="bg-white p-6 shadow-sm border border-[#1a3c34]/10 mb-10 relative">
            <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3]"></div>
            <textarea 
               v-model="newComment" 
               placeholder="添加您的注释..." 
               rows="3"
               class="w-full bg-[#f9f9f7] border border-[#1a3c34]/10 p-4 text-[#1a3c34] font-serif placeholder-slate-400 focus:outline-none focus:border-[#1a3c34] transition-colors resize-none"
            ></textarea>
            <div class="flex justify-end mt-4">
               <button 
                  @click="addComment" 
                  :disabled="!newComment.trim() || isSubmittingComment"
                  class="px-6 py-2 bg-[#1a3c34] text-[#d4c5a3] font-bold text-xs uppercase tracking-widest hover:bg-[#235246] transition-colors disabled:opacity-50 flex items-center gap-2"
               >
                  <Loader2 v-if="isSubmittingComment" class="w-3 h-3 animate-spin" />
                  <span>{{ isSubmittingComment ? '发布中...' : '发布注释' }}</span>
               </button>
            </div>
         </div>

         <!-- Comments List -->
         <div class="space-y-6">
            <div v-if="isLoadingComments" class="text-center py-10 text-[#1a3c34]/40 font-serif italic">加载讨论中...</div>
            
            <div v-else-if="allComments.length === 0" class="text-center py-16 border-2 border-dashed border-[#1a3c34]/10">
               <p class="text-[#1a3c34]/40 font-serif italic">暂无注释。成为第一个贡献者。</p>
            </div>

            <div 
               v-else
               v-for="comment in displayedComments" 
               :key="comment.id"
               class="bg-white p-6 border-b border-[#1a3c34]/5 hover:bg-[#fafafa] transition-colors"
            >
               <div class="flex gap-4">
                  <div class="flex-shrink-0">
                     <div class="w-10 h-10 bg-[#1a3c34]/5 text-[#1a3c34] flex items-center justify-center font-serif font-bold text-lg rounded-sm border border-[#1a3c34]/10">
                        {{ comment.author_name ? comment.author_name.charAt(0).toUpperCase() : '?' }}
                     </div>
                  </div>
                  <div class="flex-1">
                     <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-[#1a3c34] text-sm uppercase tracking-wide cursor-pointer hover:underline" @click="navigateToUserProfile(comment.user_id)">
                           {{ comment.author_name || '匿名用户' }}
                        </span>
                        <span class="text-xs font-mono text-[#1a3c34]/40">{{ formatDate(comment.created_at) }}</span>
                     </div>
                     <p class="text-[#1a3c34]/80 font-serif leading-relaxed whitespace-pre-wrap text-sm">
                        {{ comment.content }}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <!-- Pagination -->
         <div v-if="totalPages > 1" class="flex justify-center gap-4 pt-10 border-t border-[#1a3c34]/10 mt-10">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">上一页</button>
            <span class="px-4 py-2 font-mono text-[#1a3c34]">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 border border-[#1a3c34]/20 text-[#1a3c34] text-xs font-bold uppercase hover:bg-[#1a3c34] hover:text-white transition-colors disabled:opacity-30">下一页</button>
         </div>

      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import type { Post, Comment } from '@/types/community'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import { 
  ArrowLeft, Heart, Bookmark, Star, User, FileText, FileX, 
  MessageSquare, Loader2, Feather, ExternalLink
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const post = ref<Post | null>(null)
const allComments = ref<Comment[]>([])
const newComment = ref('')
const isLiking = ref(false)
const isFavoriting = ref(false)
const isSubmittingComment = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalComments = ref(0)
const isLoadingComments = ref(false)

const dbStore = useDatabaseStore()

// Computed
const totalPages = computed(() => Math.ceil(totalComments.value / pageSize.value))
const displayedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allComments.value.slice(start, start + pageSize.value)
})

// Methods
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; scrollToComments(); } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; scrollToComments(); } }
const scrollToComments = () => { document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' }) }

const formatDate = (str: string) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const toggleLike = async (post: Post) => {
  if (isLiking.value) return; isLiking.value = true;
  try {
    const client = await dbStore.getClient();
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) { router.push('/login'); return; }
    const uid = JSON.parse(userStr).id;

    if (post.is_liked) {
      await client.from('post_likes').delete().eq('user_id', uid).eq('post_id', post.id);
      post.like_count--; post.is_liked = false;
    } else {
      await client.from('post_likes').upsert([{ user_id: uid, post_id: post.id }], { onConflict: 'user_id,post_id' });
      post.like_count++; post.is_liked = true;
    }
  } catch (e) { showToast('Action failed', 'error'); } finally { isLiking.value = false; }
}

const toggleFavorite = async (post: Post) => {
  if (isFavoriting.value) return; isFavoriting.value = true;
  try {
    const client = await dbStore.getClient();
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) { router.push('/login'); return; }
    const uid = JSON.parse(userStr).id;

    if (post.is_favorited) {
      await client.from('post_favorites').delete().eq('user_id', uid).eq('post_id', post.id);
      post.favorite_count--; post.is_favorited = false;
    } else {
      await client.from('post_favorites').upsert([{ user_id: uid, post_id: post.id }], { onConflict: 'user_id,post_id' });
      post.favorite_count++; post.is_favorited = true;
    }
  } catch (e) { showToast('Action failed', 'error'); } finally { isFavoriting.value = false; }
}

const fetchPostDetail = async () => {
  try {
    const { supabaseService } = await import('@/services/supabase');
    const postData = await supabaseService.getPostById(postId);
    if (!postData) return;

    let userInfo = null;
    if (postData.user_id) userInfo = await supabaseService.getUserById(postData.user_id);

    const userStr = localStorage.getItem('currentUser');
    let isLiked = false, isFavorited = false;
    
    if (userStr) {
      const uid = JSON.parse(userStr).id;
      const client = supabaseService.getClient();
      const [l, f] = await Promise.all([
         client.from('post_likes').select('id').eq('user_id', uid).eq('post_id', postId),
         client.from('post_favorites').select('id').eq('user_id', uid).eq('post_id', postId)
      ]);
      if(l.data?.length) isLiked = true;
      if(f.data?.length) isFavorited = true;
    }

    // 获取真实的互动数据
    const client = supabaseService.getClient();
    const [likes, favorites, comments] = await Promise.all([
      client.from('post_likes').select('id').eq('post_id', postId),
      client.from('post_favorites').select('id').eq('post_id', postId),
      client.from('post_comments').select('id').eq('post_id', postId)
    ]);

    post.value = {
      ...postData,
      author_name: userInfo?.nickname || userInfo?.username || 'Anonymous',
      is_liked: isLiked,
      is_favorited: isFavorited,
      like_count: likes.data?.length || 0,
      favorite_count: favorites.data?.length || 0,
      comment_count: comments.data?.length || 0,
      resource: postData.resource || null
    };
    
    await loadComments();
  } catch (e) { console.error(e); }
}

const loadComments = async () => {
  isLoadingComments.value = true;
  try {
    const client = await dbStore.getClient();
    const { count } = await client.from('post_comments').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    totalComments.value = count || 0;

    const { data } = await client.from('post_comments').select('*, user:user_id(nickname, username)')
      .eq('post_id', postId).order('created_at', { ascending: false });
    
    allComments.value = (data || []).map((c: any) => ({
      ...c,
      author_name: c.user?.nickname || c.user?.username || 'Anonymous'
    }));
  } catch (e) { console.error(e); } finally { isLoadingComments.value = false; }
}

const addComment = async () => {
  if (!newComment.value.trim()) return;
  isSubmittingComment.value = true;
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return;
    const uid = JSON.parse(userStr).id;
    const client = await dbStore.getClient();
    
    await client.from('post_comments').insert([{ post_id: postId, user_id: uid, content: newComment.value.trim() }]);
    await loadComments();
    if (post.value) post.value.comment_count = (post.value.comment_count || 0) + 1;
    newComment.value = '';
  } catch (e) { console.error(e); } finally { isSubmittingComment.value = false; }
}

const navigateToUserProfile = (id?: string) => { if(id) router.push(`/user/${id}`); }

onMounted(() => { fetchPostDetail(); })
</script>

<style scoped>
/* Typography Overrides */
.prose p { margin-bottom: 1.5em; line-height: 1.8; }
:deep(.bg-green-100) { background-color: #f0fdf4 !important; color: #166534 !important; border-color: #166534 !important; }
</style>