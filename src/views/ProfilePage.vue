<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. 顶部 Hero (修复版：清晰明亮) -->
    <div class="h-80 relative overflow-hidden bg-[#1a3c34]">
      <!-- 图片：选用明亮的古典图书馆，移除导致变黑的混合模式 -->
      <img 
        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center"
        alt="Scholar Library"
      />
      <!-- 渐变遮罩：仅在底部加深，保证上方图片清晰可见 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#f2f0e9] via-[#1a3c34]/40 to-transparent"></div>
      
      <!-- Logout Button -->
      <button 
        @click="handleLogout"
        class="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-[#b03e3e] hover:border-[#b03e3e] transition-all rounded-sm text-xs font-bold uppercase tracking-widest shadow-lg"
      >
        <LogOut class="w-4 h-4" /> 登出
      </button>
    </div>

    <!-- 2. 主内容区域 -->
    <div class="max-w-6xl mx-auto px-6 -mt-32 relative z-10 space-y-12">
      
      <!-- === A. 用户履历档案 (The Dossier) === -->
      <div class="bg-white shadow-2xl border-t-8 border-[#1a3c34] p-8 md:p-10 relative overflow-hidden">
        <!-- 背景水印 -->
        <User class="absolute -right-10 -bottom-10 w-64 h-64 text-[#1a3c34]/5 -z-0 pointer-events-none" />

        <div class="relative z-10 flex flex-col md:flex-row items-start gap-10">
           <!-- 头像区 -->
           <div class="flex-shrink-0">
              <div class="w-32 h-32 bg-[#1a3c34] p-1 rounded-sm shadow-lg rotate-[-2deg]">
                 <!-- 生成的 SVG 头像 -->
                 <img :src="userAvatar" class="w-full h-full object-cover bg-[#f2f0e9]" />
              </div>
              <div class="mt-4 text-center">
                 <span class="px-3 py-1 bg-[#1a3c34]/10 text-[#1a3c34] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-[#1a3c34]/20">
                    活跃学者
                 </span>
              </div>
           </div>

           <!-- 信息与数据 -->
           <div class="flex-1 w-full">
              <!-- 姓名与签名 -->
              <div class="mb-8">
                 <div class="flex items-center gap-3 mb-2">
                    <h1 class="text-4xl font-serif font-bold text-[#1a3c34]">{{ userInfo.name }}</h1>
                    <button @click="editNickname" class="text-[#1a3c34]/40 hover:text-[#1a3c34] transition-colors" title="编辑姓名">
                       <Edit3 class="w-4 h-4" />
                    </button>
                 </div>
                 <div class="flex items-start gap-2 text-[#1a3c34]/70 font-serif italic text-lg leading-relaxed max-w-2xl relative group">
                    <span class="absolute -left-4 -top-2 text-4xl text-[#d4c5a3] opacity-50">"</span>
                    {{ userInfo.bio || '暂无个人陈述。' }}
                    <button @click="editBio" class="opacity-0 group-hover:opacity-100 ml-2 text-[#1a3c34]/40 hover:text-[#1a3c34] transition-all" title="编辑签名">
                       <Edit3 class="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <!-- 数据仪表盘 (点击可跳转) -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-[#1a3c34]/10 py-6">
                 <div @click="goToFollowing" class="cursor-pointer group">
                    <div class="text-2xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3] transition-colors">{{ followStats.followings_count }}</div>
                    <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest">关注</div>
                 </div>
                 <div @click="goToFollowers" class="cursor-pointer group">
                    <div class="text-2xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3] transition-colors">{{ followStats.followers_count }}</div>
                    <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest">粉丝</div>
                 </div>
                 <div @click="goToLikedFavorites" class="cursor-pointer group">
                    <div class="text-2xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3] transition-colors">{{ likedCount }}</div>
                    <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest">获赞</div>
                 </div>
                 <div @click="goToFavorites" class="cursor-pointer group">
                    <div class="text-2xl font-serif font-bold text-[#1a3c34] group-hover:text-[#d4c5a3] transition-colors">{{ favoritedCount }}</div>
                    <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest">收藏</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- === B. 仪表盘导航 (The Dashboard) === -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         <!-- 1. 我的帖子 -->
         <div 
            @click="router.push('/my-all-posts')"
            class="group bg-[#f9f9f7] p-6 border border-[#1a3c34]/10 hover:border-[#1a3c34] hover:bg-white hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
         >
            <!-- 顶部装饰条 -->
            <div class="absolute top-0 left-0 w-full h-1.5 bg-[#1a3c34] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            
            <div class="flex justify-between items-start mb-4">
               <div class="p-3 bg-[#1a3c34]/5 text-[#1a3c34] rounded-sm group-hover:bg-[#1a3c34] group-hover:text-[#f2f0e9] transition-colors">
                  <PenTool class="w-6 h-6" />
               </div>
               <ArrowRight class="w-4 h-4 text-[#1a3c34]/30 group-hover:text-[#1a3c34] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-1">我的手稿</h3>
            <p class="text-sm text-[#1a3c34]/60">管理已发布的 {{ myPosts.length }} 篇帖子。</p>
         </div>

         <!-- 2. 我的资源 -->
         <div 
            @click="router.push('/my-all-resources')"
            class="group bg-[#f9f9f7] p-6 border border-[#1a3c34]/10 hover:border-[#1a3c34] hover:bg-white hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
         >
            <div class="absolute top-0 left-0 w-full h-1.5 bg-[#d4c5a3] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            
            <div class="flex justify-between items-start mb-4">
               <div class="p-3 bg-[#1a3c34]/5 text-[#1a3c34] rounded-sm group-hover:bg-[#d4c5a3] group-hover:text-[#1a3c34] transition-colors">
                  <FolderOpen class="w-6 h-6" />
               </div>
               <ArrowRight class="w-4 h-4 text-[#1a3c34]/30 group-hover:text-[#1a3c34] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-1">个人档案</h3>
            <p class="text-sm text-[#1a3c34]/60">管理上传的 {{ myResources.length }} 份资源。</p>
         </div>

         <!-- 3. 珍藏集 (点赞收藏) -->
         <div 
            @click="router.push('/liked?tab=favorites')"
            class="group bg-[#f9f9f7] p-6 border border-[#1a3c34]/10 hover:border-[#1a3c34] hover:bg-white hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
         >
            <div class="absolute top-0 left-0 w-full h-1.5 bg-[#b03e3e] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            
            <div class="flex justify-between items-start mb-4">
               <div class="p-3 bg-[#1a3c34]/5 text-[#1a3c34] rounded-sm group-hover:bg-[#b03e3e] group-hover:text-white transition-colors">
                  <Bookmark class="w-6 h-6" />
               </div>
               <ArrowRight class="w-4 h-4 text-[#1a3c34]/30 group-hover:text-[#1a3c34] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-1">珍藏目录</h3>
            <p class="text-sm text-[#1a3c34]/60">查看收藏和点赞的内容。</p>
         </div>

      </div>

      <!-- === C. 隐私设置 (Privacy Control) === -->
      <section class="bg-white border border-[#1a3c34]/10 shadow-lg p-8 relative overflow-hidden">
         <!-- 左侧装饰条 -->
         <div class="absolute top-0 left-0 w-1 h-full bg-[#1a3c34]"></div>
         
         <div class="flex items-center gap-3 mb-8 border-b border-[#1a3c34]/10 pb-4">
            <Shield class="w-6 h-6 text-[#1a3c34]" />
            <h2 class="text-xl font-serif font-bold text-[#1a3c34]">隐私控制</h2>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- 隐私设置选项 -->
            <div class="space-y-6">
               <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-4">内容可见性</h3>
               
               <!-- 隐藏关注 -->
               <div class="flex items-center justify-between p-4 bg-[#f9f9f7] border border-[#1a3c34]/10">
                  <div>
                     <h4 class="text-sm font-serif font-bold text-[#1a3c34]">隐藏关注列表</h4>
                     <p class="text-xs text-[#1a3c34]/60 mt-1">其他用户无法查看你关注的人</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        v-model="privacySettings.hide_following" 
                        @change="updatePrivacySettings"
                        class="sr-only peer"
                     >
                     <div class="w-11 h-6 bg-[#1a3c34]/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1a3c34] rounded-full peer peer-checked:bg-[#1a3c34] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1a3c34]/20 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
               </div>

               <!-- 隐藏粉丝 -->
               <div class="flex items-center justify-between p-4 bg-[#f9f9f7] border border-[#1a3c34]/10">
                  <div>
                     <h4 class="text-sm font-serif font-bold text-[#1a3c34]">隐藏粉丝列表</h4>
                     <p class="text-xs text-[#1a3c34]/60 mt-1">其他用户无法查看你的粉丝</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        v-model="privacySettings.hide_followers" 
                        @change="updatePrivacySettings"
                        class="sr-only peer"
                     >
                     <div class="w-11 h-6 bg-[#1a3c34]/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1a3c34] rounded-full peer peer-checked:bg-[#1a3c34] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1a3c34]/20 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
               </div>

               <!-- 隐藏资源 -->
               <div class="flex items-center justify-between p-4 bg-[#f9f9f7] border border-[#1a3c34]/10">
                  <div>
                     <h4 class="text-sm font-serif font-bold text-[#1a3c34]">隐藏资源库</h4>
                     <p class="text-xs text-[#1a3c34]/60 mt-1">其他用户无法查看你的学习资源</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        v-model="privacySettings.hide_resources" 
                        @change="updatePrivacySettings"
                        class="sr-only peer"
                     >
                     <div class="w-11 h-6 bg-[#1a3c34]/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1a3c34] rounded-full peer peer-checked:bg-[#1a3c34] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1a3c34]/20 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
               </div>

               <!-- 隐藏帖子 -->
               <div class="flex items-center justify-between p-4 bg-[#f9f9f7] border border-[#1a3c34]/10">
                  <div>
                     <h4 class="text-sm font-serif font-bold text-[#1a3c34]">隐藏帖子</h4>
                     <p class="text-xs text-[#1a3c34]/60 mt-1">其他用户无法查看你的社区帖子</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        v-model="privacySettings.hide_posts" 
                        @change="updatePrivacySettings"
                        class="sr-only peer"
                     >
                     <div class="w-11 h-6 bg-[#1a3c34]/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1a3c34] rounded-full peer peer-checked:bg-[#1a3c34] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#1a3c34]/20 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
               </div>
            </div>

            <!-- 隐私设置说明 -->
            <div class="bg-[#f2f0e9] p-6 border border-[#1a3c34]/10">
               <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-4">隐私说明</h3>
               <div class="text-xs text-[#1a3c34]/70 font-serif leading-relaxed space-y-3">
                  <p>• 默认情况下，所有用户都可以查看你的关注、粉丝、资源和帖子。</p>
                  <p>• 启用隐私设置后，其他用户将无法查看相应内容。</p>
                  <p>• 隐私设置不会影响已获得链接的用户访问特定资源或帖子。</p>
                  <p>• 你可以随时更改这些设置，更改将立即生效。</p>
               </div>
            </div>
         </div>
      </section>

      <!-- === D. 系统设置 (Security Clearance) === -->
      <section class="bg-white border border-[#1a3c34]/10 shadow-lg p-8 relative overflow-hidden">
         <!-- 左侧装饰条 -->
         <div class="absolute top-0 left-0 w-1 h-full bg-[#1a3c34]"></div>
         
         <div class="flex items-center gap-3 mb-8 border-b border-[#1a3c34]/10 pb-4">
            <Settings class="w-6 h-6 text-[#1a3c34]" />
            <h2 class="text-xl font-serif font-bold text-[#1a3c34]">账户安全设置</h2>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- 修改密码表单 -->
            <div>
               <h3 class="text-xs font-bold text-[#1a3c34]/60 uppercase tracking-widest mb-6">更新通行证</h3>
               <div class="space-y-4">
                  <div class="relative">
                     <label class="block text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">当前密码</label>
                     <input v-model="passwordForm.currentPassword" type="password" class="w-full bg-[#f9f9f7] border-b border-[#1a3c34]/20 p-2 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif" />
                  </div>
                  <div class="relative">
                     <label class="block text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">新密码</label>
                     <input v-model="passwordForm.newPassword" type="password" class="w-full bg-[#f9f9f7] border-b border-[#1a3c34]/20 p-2 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif" />
                  </div>
                  <div class="relative">
                     <label class="block text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">确认新密码</label>
                     <input v-model="passwordForm.confirmPassword" type="password" class="w-full bg-[#f9f9f7] border-b border-[#1a3c34]/20 p-2 text-[#1a3c34] focus:outline-none focus:border-[#1a3c34] transition-colors font-serif" />
                  </div>
                  <button @click="updatePassword" class="mt-4 px-6 py-2 border border-[#1a3c34] text-[#1a3c34] text-xs font-bold uppercase tracking-widest hover:bg-[#1a3c34] hover:text-[#d4c5a3] transition-colors">
                     提交更改
                  </button>
               </div>
            </div>

            <!-- 装饰性系统信息 -->
            <div class="bg-[#f2f0e9] p-6 border border-[#1a3c34]/5 text-[#1a3c34]/60 text-xs font-mono leading-loose flex flex-col justify-center">
               <p>USER ID: {{ userInfo.id || 'UNKNOWN' }}</p>
               <p>STATUS: ACTIVE / VERIFIED</p>
               <p>LAST LOGIN: {{ new Date().toLocaleString() }}</p>
               <div class="w-full h-px bg-[#1a3c34]/10 my-4"></div>
               <p class="italic font-serif">"The securest of all possessions is knowledge."</p>
            </div>
         </div>
      </section>

    </div>

    <!-- Edit Dialog Component -->
    <EditUserDialog
      ref="editDialog"
      :title="editDialogTitle"
      :edit-type="editType"
      :initial-value="editInitialValue"
      @confirm="handleEditConfirm"
    />

    <!-- Toast -->
    <div v-if="showMessage" :class="getMessageClasses(messageType)" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[110]">
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDatabaseStore } from '@/stores/database'
import { getSupabaseService } from '@/services/supabase'
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message'
import EditUserDialog from '@/components/EditUserDialog.vue'
import { 
  User, Mail, Edit3, LogOut, Award, FolderOpen, 
  PenTool, Bookmark, ArrowRight, X, Settings, Shield
} from 'lucide-vue-next'

// Interfaces
interface UserInfo { name: string; email: string; avatar?: string; bio?: string; created_at?: string; id?: string }
interface MyResource { id: string; title: string; description: string; type: string; category?: string; created_at: string; url?: string }
interface MyPost { id: string; title: string; content: string; category?: string; created_at: string; views?: number; likes?: number; comments?: number; user_id?: string }
interface PrivacySettings { hide_following: boolean; hide_followers: boolean; hide_posts: boolean; hide_resources: boolean }

const router = useRouter()
const databaseStore = useDatabaseStore()

// State
const userInfo = ref<UserInfo>({ name: 'Scholar', email: '' })
const myResources = ref<MyResource[]>([])
const myPosts = ref<MyPost[]>([])
const isLoadingResources = ref(false)
const isLoadingPosts = ref(false)
const likedCount = ref(0)
const favoritedCount = ref(0)
const followStats = ref({ followers_count: 0, followings_count: 0 })
const privacySettings = ref<PrivacySettings>({
  hide_following: false,
  hide_followers: false, 
  hide_posts: false,
  hide_resources: false
})

// Edit & Forms
const editDialog = ref<InstanceType<typeof EditUserDialog>>()
const editType = ref<'nickname' | 'bio'>('nickname')
const editDialogTitle = ref('')
const editInitialValue = ref('')
const showEditModal = ref(false)
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

// SVG Avatar Generator (Dark Green Theme)
const userAvatar = computed(() => {
  const name = userInfo.value.name.charAt(0).toUpperCase()
  // SVG with Dark Green background and Gold text
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#1a3c34"/>
      <text x="50" y="65" font-family="serif" font-weight="bold" font-size="50" fill="#d4c5a3" text-anchor="middle">${name}</text>
    </svg>
  `
  
  // 使用encodeURIComponent替代btoa来处理中文字符
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent)
})

// Formatters
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

// Navigation
const navigateToCreateResource = () => router.push('/create-resource')
const navigateToResource = (id: string) => router.push(`/resource/${id}`)
const navigateToPost = (id: string) => router.push(`/post/${id}`)
const navigateToCommunity = () => router.push('/community')
const navigateToAllPosts = () => router.push('/my-all-posts')
const navigateToAllResources = () => router.push('/my-all-resources')
const goToLikedFavorites = () => router.push('/liked')
const goToFavorites = () => router.push('/liked?tab=favorites')
const goToFollowing = () => router.push('/profile/following')
const goToFollowers = () => router.push('/profile/followers')

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  router.push('/login')
  showToast('已安全登出', 'success')
}

// Data Loaders
const loadUserProfile = async () => {
  const currentUserStr = localStorage.getItem('currentUser')
  if (currentUserStr) {
    try {
      const user = JSON.parse(currentUserStr)
      // Fetch latest from DB
      const supabaseService = getSupabaseService()
      const client = await supabaseService.getClient()
      const { data } = await client.from('users').select('*').eq('id', user.id).single()
      if (data) {
         userInfo.value = { 
            id: data.id,
            name: data.nickname || data.username, 
            email: data.email || user.email, 
            bio: data.bio,
            created_at: data.created_at 
         }
      } else {
         // Fallback
         userInfo.value = { 
            id: user.id,
            name: user.nickname || user.username, 
            email: user.email, 
            bio: user.bio 
         }
      }
    } catch (e) { console.error(e) }
  }
}

const loadMyResources = async () => {
  isLoadingResources.value = true
  try {
    const supabaseService = getSupabaseService()
    const client = await supabaseService.getClient()
    const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
    if (!uid) return

    const { data } = await client.from('resources').select('*').eq('created_by', uid).order('created_at', { ascending: false })
    myResources.value = (data || []).map((r: any) => ({
       id: r.id, title: r.title, description: r.description || '', type: r.type, category: r.category, created_at: r.created_at, url: r.url
    }))
  } catch (e) { console.error(e) } finally { isLoadingResources.value = false }
}

const loadMyPosts = async () => {
  isLoadingPosts.value = true
  try {
    const supabaseService = getSupabaseService()
    const client = await supabaseService.getClient()
    const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
    if (!uid) return

    const { data } = await client.from('community_posts').select('*').eq('user_id', uid).order('created_at', { ascending: false })
    myPosts.value = (data || []).map((p: any) => ({
       id: p.id, title: p.title, content: p.content, category: p.category, created_at: p.created_at, user_id: p.user_id
    }))
  } catch (e) { console.error(e) } finally { isLoadingPosts.value = false }
}

const loadStats = async () => {
   const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
   if (!uid) return
   
   try {
      const supabaseService = getSupabaseService()
      const follow = await supabaseService.getFollowStats(uid)
      followStats.value = follow || { followers_count: 0, followings_count: 0 }
      
      const client = await supabaseService.getClient()
      const { count: l } = await client.from('post_likes').select('*', { count: 'exact', head: true }).eq('user_id', uid)
      likedCount.value = l || 0
      
      const { count: f } = await client.from('post_favorites').select('*', { count: 'exact', head: true }).eq('user_id', uid)
      favoritedCount.value = f || 0
   } catch(e) { console.error(e) }
}

// Edit Actions
const editNickname = () => { editType.value = 'nickname'; editDialogTitle.value = '编辑昵称'; editInitialValue.value = userInfo.value.name; editDialog.value?.show() }
const editBio = () => { editType.value = 'bio'; editDialogTitle.value = '编辑个人签名'; editInitialValue.value = userInfo.value.bio || ''; editDialog.value?.show() }

const handleEditConfirm = async (val: string) => {
   const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
   const supabaseService = getSupabaseService()
   if(editType.value === 'nickname') {
      await supabaseService.updateUserNickname(uid, val)
      userInfo.value.name = val
      showToast('昵称已更新', 'success')
   } else {
      const client = await supabaseService.getClient()
      await client.from('users').update({ bio: val }).eq('id', uid)
      userInfo.value.bio = val
      showToast('签名已更新', 'success')
   }
}

const updatePassword = async () => {
   if(passwordForm.newPassword !== passwordForm.confirmPassword) { showToast('两次输入的密码不一致', 'error'); return }
   const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
   try {
      const supabaseService = getSupabaseService()
      await supabaseService.updateUserPassword(uid, passwordForm.newPassword)
      showToast('密码修改成功', 'success')
      passwordForm.currentPassword = ''; passwordForm.newPassword = ''; passwordForm.confirmPassword = ''
   } catch(e) { showToast('修改失败', 'error') }
}

const loadPrivacySettings = async () => {
   const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
   if (!uid) return
   
   try {
      const supabaseService = getSupabaseService()
      const client = await supabaseService.getClient()
      const { data } = await client.from('user_privacy_settings').select('*').eq('user_id', uid).single()
      
      if (data) {
         privacySettings.value = {
            hide_following: data.hide_following,
            hide_followers: data.hide_followers,
            hide_posts: data.hide_posts,
            hide_resources: data.hide_resources
         }
      }
   } catch(e) { 
      console.error('加载隐私设置失败:', e)
      // 如果没有找到记录，使用默认值
   }
}

const updatePrivacySettings = async () => {
   const uid = userInfo.value.id || JSON.parse(localStorage.getItem('currentUser') || '{}').id
   if (!uid) return
   
   try {
      const supabaseService = getSupabaseService()
      const client = await supabaseService.getClient()
      
      // 先检查是否已存在记录
      const { data: existingRecord } = await client
         .from('user_privacy_settings')
         .select('*')
         .eq('user_id', uid)
         .single()
      
      if (existingRecord) {
         // 如果存在，则更新记录
         const { error } = await client
            .from('user_privacy_settings')
            .update({
               hide_following: privacySettings.value.hide_following,
               hide_followers: privacySettings.value.hide_followers,
               hide_posts: privacySettings.value.hide_posts,
               hide_resources: privacySettings.value.hide_resources,
               updated_at: new Date().toISOString()
            })
            .eq('user_id', uid)
         
         if (error) throw error
      } else {
         // 如果不存在，则插入新记录
         const { error } = await client
            .from('user_privacy_settings')
            .insert({
               user_id: uid,
               hide_following: privacySettings.value.hide_following,
               hide_followers: privacySettings.value.hide_followers,
               hide_posts: privacySettings.value.hide_posts,
               hide_resources: privacySettings.value.hide_resources,
               created_at: new Date().toISOString(),
               updated_at: new Date().toISOString()
            })
         
         if (error) throw error
      }
      
      showToast('隐私设置已更新', 'success')
   } catch(e) { 
      console.error('更新隐私设置失败:', e)
      showToast('更新失败，请重试', 'error')
   }
}

onMounted(() => {
   loadUserProfile().then(() => {
      loadMyResources()
      loadMyPosts()
      loadStats()
      loadPrivacySettings()
   })
})
</script>

<style scoped>
/* Toast Override */
:deep(.bg-green-100) { background-color: #f0fdf4 !important; color: #166534 !important; border-color: #166534 !important; }
:deep(.bg-red-100) { background-color: #fef2f2 !important; color: #991b1b !important; border-color: #991b1b !important; }
</style>