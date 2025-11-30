<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  PlusCircle, 
  User, 
  LogOut,
  Bot,
  Clock,
  MonitorPlay,
  Award,
  ChevronRight,
  Search
} from 'lucide-vue-next';

// 导入 Coze API 服务
import { cozeAPIService, type CozeSearchResponse } from '@/services/coze-api';
import { useDatabaseStore } from '@/stores/database';
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message';

const dbStore = useDatabaseStore();

// --- 实际逻辑与数据 ---
const currentUser = ref<any>(null);

const isLoading = ref(false);
const chatInput = ref('');
const messages = ref<any[]>([
  // 初始欢迎语
  { 
    role: 'assistant', 
    content: '我是您的专属学习助手，告诉我您的学习需求，为您推荐最合适的学习资源。', 
    timestamp: new Date().toISOString() 
  }
]);
const chatContainer = ref<HTMLElement | null>(null);

// 推荐结果数据结构
const searchResults = ref<any>({
  top_recommendation: null,
  other_recommendations: [],
  learning_advice: ''
});

// 快速提问标签
const quickPrompts = ['我想考英语六级', 'Python数据分析入门', '零基础学React', '考研数学复习计划'];

// 退出登录
const logout = () => {
  localStorage.removeItem('currentUser');
  currentUser.value = null;
  showToast('已退出登录', 'success');
};

// 登录注册模态框状态
const showAuthModal = ref(false);
const authMode = ref<'login' | 'register'>('login');
const authLoading = ref(false);
const authMessage = ref('');
const authMessageType = ref<'success' | 'error'>('success');
const authForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: ''
});

const clearAuthState = () => {
  authForm.username = '';
  authForm.password = '';
  authForm.confirmPassword = '';
  authForm.nickname = '';
  authMessage.value = '';
  authMessageType.value = 'success';
};

const openAuthModal = (mode: 'login' | 'register') => {
  authMode.value = mode;
  clearAuthState();
  showAuthModal.value = true;
};

const switchAuthMode = (mode: 'login' | 'register') => {
  if (authMode.value === mode) return;
  authMode.value = mode;
  authForm.password = '';
  authForm.confirmPassword = '';
  authMessage.value = '';
};

const closeAuthModal = () => {
  showAuthModal.value = false;
  clearAuthState();
};

// 检查用户登录状态
const checkUserStatus = () => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    try {
      currentUser.value = JSON.parse(userData);
    } catch (error) {
      console.error('解析用户数据失败:', error);
      localStorage.removeItem('currentUser');
      currentUser.value = null;
    }
  }
};

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  const message = chatInput.value.trim();
  if (!message || isLoading.value) return;

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });

  chatInput.value = '';
  isLoading.value = true;

  // 添加AI占位消息
  const aiMessageIndex = messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    loading: true,
    resources: []
  }) - 1;

  // 滚动到底部
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }, 100);

  try {
    const response = await cozeAPIService.searchRecommendations({
      query: message
    });

    // 更新AI消息
    const resources = [];
    
    // 只有当有真实推荐时才添加资源卡片
    if (response.top_recommendation) {
      resources.push({
        name: response.top_recommendation.name,
        description: response.top_recommendation.reason || '这是一个非常优质的学习资源',
        platform: response.top_recommendation.platform || 'B站',
        difficulty: response.top_recommendation.difficulty || '进阶',
        duration: response.top_recommendation.duration || '待确认',
        url: response.top_recommendation.platform === 'B站' && response.top_recommendation.bv_number 
          ? `https://www.bilibili.com/video/${response.top_recommendation.bv_number}`
          : undefined
      });
    }
    
    // 添加其他推荐
    if (response.other_recommendations && response.other_recommendations.length > 0) {
      resources.push(...response.other_recommendations.map(rec => ({
        name: rec.name,
        description: rec.reason || '推荐学习资源',
        platform: rec.platform,
        difficulty: rec.difficulty,
        duration: rec.duration,
        url: rec.platform === 'B站' && rec.bv_number 
          ? `https://www.bilibili.com/video/${rec.bv_number}`
          : undefined
      })));
    }

    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: response.learning_advice || '我来为您推荐一些优质的学习资源：',
      timestamp: new Date().toISOString(),
      resources: resources
    };

    searchResults.value = response;

  } catch (error) {
    console.error('❌ 对话失败:', error);
    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: `抱歉，暂时无法处理您的请求：${error.message || '未知错误'}。请稍后再试。`,
      timestamp: new Date().toISOString(),
      resources: []
    };
  } finally {
    isLoading.value = false;
    // 滚动到底部
    setTimeout(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    }, 100);
  }
};

const handleQuickPrompt = (text: string) => {
  chatInput.value = text;
  sendMessage();
};

// 密码哈希工具
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const handleAuthSubmit = async () => {
  if (!authForm.username || !authForm.password) {
    authMessage.value = '请填写完整信息';
    authMessageType.value = 'error';
    return;
  }

  if (authMode.value === 'register') {
    if (authForm.username.length < 3) {
      authMessage.value = '用户名至少为3个字符';
      authMessageType.value = 'error';
      return;
    }
    if (authForm.password.length < 6) {
      authMessage.value = '密码长度至少为6位';
      authMessageType.value = 'error';
      return;
    }
    if (authForm.password !== authForm.confirmPassword) {
      authMessage.value = '两次输入的密码不一致';
      authMessageType.value = 'error';
      return;
    }
  }

  authLoading.value = true;
  authMessage.value = '';

  try {
    if (authMode.value === 'login') {
      const user = await dbStore.getUserByUsername(authForm.username);
      if (!user) {
        authMessage.value = '用户不存在';
        authMessageType.value = 'error';
        return;
      }
      const inputHash = await hashPassword(authForm.password);
      if (user.password_hash !== inputHash) {
        authMessage.value = '密码错误';
        authMessageType.value = 'error';
        return;
      }
      const userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar_url: user.avatar_url
      };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      currentUser.value = userInfo;
      authMessage.value = '登录成功';
      authMessageType.value = 'success';
      setTimeout(() => {
        closeAuthModal();
      }, 600);
    } else {
      const existingUser = await dbStore.getUserByUsername(authForm.username);
      if (existingUser) {
        authMessage.value = '该用户名已被注册';
        authMessageType.value = 'error';
        return;
      }
      const passwordHash = await hashPassword(authForm.password);
      await dbStore.createUser({
        username: authForm.username,
        nickname: authForm.nickname || undefined,
        password_hash: passwordHash
      });
      const newUser = await dbStore.getUserByUsername(authForm.username);
      if (newUser) {
        const userInfo = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          nickname: newUser.nickname,
          avatar_url: newUser.avatar_url
        };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        currentUser.value = userInfo;
        authMessage.value = '注册成功，已自动登录';
        authMessageType.value = 'success';
        setTimeout(() => {
          closeAuthModal();
        }, 800);
      } else {
        authMessage.value = '注册成功，但获取用户信息失败，请尝试登录';
        authMessageType.value = 'error';
      }
    }
  } catch (error) {
    console.error('认证失败:', error);
    authMessage.value = '操作失败，请稍后重试';
    authMessageType.value = 'error';
  } finally {
    authLoading.value = false;
  }
};

// 组件挂载时检查用户状态
onMounted(() => {
  checkUserStatus();
});
</script>

<template>
  <div class="min-h-screen bg-[#F3F4F6] font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700 pb-20 lg:pb-0">
    <!-- 通用提示框 -->
    <div 
      v-if="showMessage" 
      :class="getMessageClasses(messageType)"
      class="flex items-center space-x-2"
    >
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>
    
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2 group cursor-pointer">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <BookOpen class="w-5 h-5" />
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
            EduMatch
          </span>
        </div>

        <!-- 用户状态 -->
        <div class="flex items-center gap-4">
          <template v-if="currentUser">
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <User class="w-3.5 h-3.5" />
              </div>
              <span class="text-sm font-medium text-slate-600">{{ currentUser.username || currentUser.email }}</span>
            </div>
            <button @click="logout" class="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="退出登录">
              <LogOut class="w-5 h-5" />
            </button>
          </template>
          <template v-else>
            <button @click="openAuthModal('login')" class="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">登录</button>
            <button @click="openAuthModal('register')" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">注册</button>
          </template>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      
      <!-- Hero 区域 -->
      <div class="text-center space-y-6 max-w-3xl mx-auto animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
          <span class="block">学配智联平台</span>
          <span class="block mt-2 text-2xl md:text-3xl font-medium text-slate-500">
            智能匹配您的 <span class="text-indigo-600 decoration-indigo-300 underline decoration-4 underline-offset-4">学习需求</span>
          </span>
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          基于 AI 算法，为您精准推荐 B站、MOOC 等全网优质资源。让学习更高效，路径更清晰。
        </p>
      </div>

      <!-- 核心功能区：AI对话 + 推荐结果 -->
      <div class="grid lg:grid-cols-12 gap-8 items-start">
        
        <!-- 左侧/上方：AI 对话窗口 -->
        <div class="lg:col-span-5 xl:col-span-4 space-y-4">
          <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[600px] relative">
            <!-- 窗口标题 -->
            <div class="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 backdrop-blur-sm">
              <Bot class="w-5 h-5 text-indigo-600" />
              <span class="font-semibold text-slate-700">AI 学习助手</span>
              <div class="ml-auto flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
            </div>

            <!-- 消息列表 -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
              <template v-for="(msg, index) in messages" :key="index">
                <!-- AI 消息 -->
                <div v-if="msg.role === 'assistant'" class="flex gap-3 items-start max-w-[90%]">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                    <Sparkles class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed">
                      <div v-if="msg.loading" class="flex items-center space-x-2">
                        <span class="flex gap-1">
                          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                          <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                        </span>
                        <span class="text-xs text-slate-500">思考中...</span>
                      </div>
                      <div v-else>
                        <div class="whitespace-pre-wrap">{{ msg.content }}</div>
                        <!-- 推荐资源卡片 -->
                        <div v-if="msg.resources && msg.resources.length > 0" class="mt-6 space-y-4">
                          <div v-for="(resource, rIndex) in msg.resources" :key="rIndex" 
                               class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                            <div class="flex justify-between items-start gap-4">
                              <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-900 mb-2 leading-tight">{{ resource.name }}</h4>
                                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ resource.description }}</p>
                                <div class="flex flex-wrap items-center gap-3 text-xs">
                                  <span class="inline-flex items-center px-2.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium">
                                    {{ resource.platform }}
                                  </span>
                                  <span v-if="resource.difficulty" class="text-gray-500">{{ resource.difficulty }}</span>
                                  <span v-if="resource.duration" class="text-gray-500">{{ resource.duration }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span class="text-[10px] text-slate-400 ml-1">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                </div>

                <!-- 用户消息 -->
                <div v-else class="flex gap-3 items-start flex-row-reverse max-w-[90%] ml-auto">
                  <div class="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                    <User class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1 items-end">
                    <div class="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed">
                      {{ msg.content }}
                    </div>
                    <span class="text-[10px] text-slate-400 mr-1">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                </div>
              </template>

            </div>

            <!-- 输入区域 -->
            <div class="p-4 bg-white border-t border-slate-100">
              <!-- 快速提示词 -->
              <div v-if="messages.length < 2" class="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                <button 
                  v-for="prompt in quickPrompts" 
                  :key="prompt"
                  @click="handleQuickPrompt(prompt)"
                  class="whitespace-nowrap px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  {{ prompt }}
                </button>
              </div>

              <div class="relative">
                <textarea 
                  v-model="chatInput"
                  @keydown.enter.exact.prevent="sendMessage"
                  placeholder="输入您的学习需求，例如：我想学习前端开发..."
                  class="w-full pl-4 pr-12 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm shadow-inner transition-all"
                  rows="2"
                ></textarea>
                <button 
                  @click="sendMessage"
                  :disabled="isLoading || !chatInput.trim()"
                  class="absolute right-2 bottom-2.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  <Send v-if="!isLoading" class="w-4 h-4" />
                  <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
              <p class="text-[10px] text-slate-400 mt-2 text-center">按 Enter 发送，Shift + Enter 换行</p>
            </div>
          </div>
        </div>

        <!-- 右侧/下方：推荐结果展示 -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <!-- 如果没有结果，显示特色介绍 -->
          <div v-if="!searchResults.top_recommendation && searchResults.other_recommendations.length === 0" class="h-full flex flex-col justify-center space-y-6 opacity-60 hover:opacity-100 transition-opacity">
             <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                   <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                     <MonitorPlay class="w-6 h-6" />
                   </div>
                   <h3 class="font-bold text-slate-800 mb-2">智能匹配</h3>
                   <p class="text-sm text-slate-500">AI 深度分析您的需求，从海量资源中找到最适合您的课程。</p>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                   <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                     <BookOpen class="w-6 h-6" />
                   </div>
                   <h3 class="font-bold text-slate-800 mb-2">海量资源</h3>
                   <p class="text-sm text-slate-500">覆盖 B站、MOOC 等主流平台，从入门到精通全覆盖。</p>
                </div>
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                   <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                     <BarChart3 class="w-6 h-6" />
                   </div>
                   <h3 class="font-bold text-slate-800 mb-2">科学建议</h3>
                   <p class="text-sm text-slate-500">不仅提供资源，还为您生成科学的学习路径和建议。</p>
                </div>
             </div>
             <div class="text-center text-slate-400 flex items-center justify-center gap-2">
                <Search class="w-4 h-4" />
                <span>请在左侧输入需求获取推荐</span>
             </div>
          </div>

          <!-- 有结果时显示 -->
          <template v-else>
            <!-- 1. 最推荐资源 (Hero Card) -->
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div class="relative bg-white rounded-xl p-6 md:p-8 shadow-xl ring-1 ring-slate-900/5">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full text-sm">
                    <Sparkles class="w-4 h-4" />
                    AI 最推荐
                  </div>
                  <div class="flex items-center gap-2 text-slate-500 text-sm">
                    <Award class="w-4 h-4 text-yellow-500" />
                    <span>{{ searchResults.top_recommendation.study_data }}</span>
                  </div>
                </div>
                
                <div class="flex flex-col md:flex-row gap-6 items-start">
                   <div class="flex-1">
                      <h2 class="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                        {{ searchResults.top_recommendation.name }}
                      </h2>
                      <p class="text-slate-600 mb-4 leading-relaxed">
                        {{ searchResults.top_recommendation.reason }}
                      </p>
                      
                      <div class="flex flex-wrap gap-3 text-sm mb-6">
                         <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {{ searchResults.top_recommendation.platform }}
                         </span>
                         <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {{ searchResults.top_recommendation.institution || '个人UP主' }}
                         </span>
                         <span class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100">
                            <BarChart3 class="w-3 h-3" />
                            {{ searchResults.top_recommendation.difficulty }}
                         </span>
                         <span class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            <Clock class="w-3 h-3" />
                            {{ searchResults.top_recommendation.duration }}
                         </span>
                      </div>
                   </div>
                   
                   <div class="w-full md:w-auto flex-shrink-0">
                      <a :href="'https://www.bilibili.com/video/' + searchResults.top_recommendation.bv_number" target="_blank" 
                         class="flex items-center justify-center gap-2 w-full md:w-40 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-95">
                         立即学习
                         <ChevronRight class="w-4 h-4" />
                      </a>
                      <div class="mt-2 text-center text-xs text-slate-400 font-mono">
                        BV: {{ searchResults.top_recommendation.bv_number }}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- 2. AI 学习建议 -->
            <div v-if="searchResults.learning_advice" class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
               <div class="flex items-start gap-4">
                  <div class="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                     <BookOpen class="w-6 h-6" />
                  </div>
                  <div>
                     <h3 class="font-bold text-emerald-900 mb-1">AI 学习建议</h3>
                     <p class="text-emerald-800/80 text-sm leading-relaxed">
                        {{ searchResults.learning_advice }}
                     </p>
                  </div>
               </div>
            </div>

            <!-- 3. 其他推荐 (Grid) -->
            <div>
               <div class="flex items-center justify-between mb-4 px-1">
                  <h3 class="font-bold text-slate-800 flex items-center gap-2">
                     <PlusCircle class="w-5 h-5 text-slate-400" />
                     其他推荐
                  </h3>
                  <span class="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {{ searchResults.other_recommendations.length }}
                  </span>
               </div>
               
               <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="(resource, idx) in searchResults.other_recommendations" :key="idx" 
                       class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                     <div class="flex justify-between items-start mb-2">
                        <span :class="resource.platform === 'B站' ? 'text-pink-500 bg-pink-50' : 'text-green-600 bg-green-50'" 
                              class="text-[10px] font-bold px-2 py-0.5 rounded border border-current opacity-80">
                           {{ resource.platform }}
                        </span>
                        <span class="text-xs text-slate-400">{{ resource.duration }}</span>
                     </div>
                     <h4 class="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                        {{ resource.name }}
                     </h4>
                     <p class="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                        {{ resource.brief_description }}
                     </p>
                     <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span class="text-xs text-slate-400 font-medium">{{ resource.difficulty }}</span>
                        <a :href="'https://www.bilibili.com/video/' + resource.bv_number" target="_blank" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                           去观看 <ChevronRight class="w-3 h-3" />
                        </a>
                     </div>
                  </div>
               </div>
            </div>
          </template>

        </div>
      </div>

    </main>

    <!-- 登录/注册模态框 -->
    <transition name="fade">
      <div v-if="showAuthModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-400">账户中心</p>
              <h3 class="text-xl font-semibold text-slate-800 mt-1">
                {{ authMode === 'login' ? '登录 EduMatch' : '注册新账号' }}
              </h3>
            </div>
            <button @click="closeAuthModal" class="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              ✕
            </button>
          </div>

          <div class="px-6 pt-6">
            <div class="flex gap-3 mb-6">
              <button 
                @click="switchAuthMode('login')" 
                :class="[
                  'flex-1 py-2 rounded-xl border transition-all font-medium',
                  authMode === 'login' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                ]"
              >
                登录
              </button>
              <button 
                @click="switchAuthMode('register')" 
                :class="[
                  'flex-1 py-2 rounded-xl border transition-all font-medium',
                  authMode === 'register' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                ]"
              >
                注册
              </button>
            </div>
          </div>

          <form @submit.prevent="handleAuthSubmit" class="px-6 pb-6 space-y-4">
            <div>
              <label class="text-sm font-medium text-slate-600 mb-1 block">用户名</label>
              <input v-model="authForm.username" type="text" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="请输入用户名" />
            </div>

            <div v-if="authMode === 'register'">
              <label class="text-sm font-medium text-slate-600 mb-1 block">昵称（可选）</label>
              <input v-model="authForm.nickname" type="text" class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="给自己起个名字吧" />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600 mb-1 block">密码</label>
              <input v-model="authForm.password" type="password" minlength="6" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="至少 6 位字符" />
            </div>

            <div v-if="authMode === 'register'">
              <label class="text-sm font-medium text-slate-600 mb-1 block">确认密码</label>
              <input v-model="authForm.confirmPassword" type="password" minlength="6" required class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="再次输入密码" />
            </div>

            <div v-if="authMessage" :class="[
              'p-3 rounded-xl text-sm border',
              authMessageType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
            ]">
              {{ authMessage }}
            </div>

            <button type="submit" :disabled="authLoading" class="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {{ authLoading ? '处理中...' : authMode === 'login' ? '立即登录' : '确认注册' }}
            </button>

            <p class="text-xs text-center text-slate-400">继续即表示同意平台的隐私政策与使用条款</p>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保持功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

/* 简单动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>