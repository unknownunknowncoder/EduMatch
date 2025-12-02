<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import { 
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
  Search,
  MessageSquare,
  Calendar,
  Users,
  Target,
  Zap,
  Globe,
  X,
  Minimize2
} from 'lucide-vue-next';

// 导入 Coze API 服务
import { cozeAPIService } from '@/services/coze-api';
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

// 页面状态控制
const showChatWindow = ref(false);
const hasSearched = ref(false);

// 推荐结果数据结构
const searchResults = ref<any | null>(null);

// 快速提问标签
const quickPrompts = ['我想考英语六级', 'Python数据分析入门', '零基础学React', '考研数学复习计划'];

// 六大功能介绍卡片配置
const featureCards = [
  {
    id: 1,
    icon: Target,
    title: '智能匹配',
    description: 'AI深度分析您的学习需求和基础，从海量资源中找到最适合的课程和教程。',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    icon: Globe,
    title: '海量资源',
    description: '覆盖B站、MOOC等主流学习平台，从入门到精通的全体系学习资源。',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    icon: BarChart3,
    title: '科学规划',
    description: '基于学习科学理论，为您生成个性化的学习路径和时间安排建议。',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    id: 4,
    icon: MessageSquare,
    title: '学习社区',
    description: '与志同道合的学伴交流经验，分享学习心得，共同进步成长。',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 5,
    icon: Calendar,
    title: '学习计划',
    description: '制定详细的学习计划表，跟踪学习进度，让学习更有条理和效率。',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 6,
    icon: Users,
    title: '个性推荐',
    description: '根据您的学习历史和偏好，持续优化推荐算法，越用越懂你。',
    color: 'rose',
    gradient: 'from-rose-500 to-red-500'
  }
];

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

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // 可以添加一个提示信息
    console.log('访问指引已复制到剪贴板:', text);
  } catch (err) {
    console.error('复制失败:', err);
    // 降级方案
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('访问指引已复制到剪贴板（降级方案）:', text);
    } catch (err) {
      console.error('降级复制也失败:', err);
    }
    document.body.removeChild(textArea);
  }
};

// 格式化学习时长
const formatDuration = (duration: string) => {
  if (!duration || duration.trim() === '') return '';
  
  // 如果包含"小时"和"分钟"，且小时数过大，可能是把分钟当作小时了
  if (duration.includes('小时') && duration.includes('分钟')) {
    const hourMatch = duration.match(/(\d+)小时/);
    const minuteMatch = duration.match(/(\d+)分钟/);
    
    if (hourMatch && minuteMatch) {
      const hours = parseInt(hourMatch[1]);
      const minutes = parseInt(minuteMatch[1]);
      
      // 如果小时数过大（比如超过100），可能是错误格式
      if (hours > 100) {
        return `${minutes}分钟`;
      }
      
      // 正常情况
      if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
      } else {
        return `${minutes}分钟`;
      }
    }
  }
  
  // 如果只是简单的数字加单位
  return duration;
};

const normalizeRecommendation = (rec: any) => {
  if (!rec) {
    return null;
  }
  const platform = rec?.platform || rec?.['平台来源'] || 'B站';
  const difficulty = rec?.difficulty || rec?.['难度等级'] || '入门';
  const duration = rec?.duration || rec?.['学习时长'] || '';
  
  // 构建URL，优先使用BV号，然后是URL，最后是访问指引
  let url = rec?.url;
  if (!url) {
    if (rec?.bv_number) {
      // 如果BV号已经是完整URL，直接使用；否则构建B站视频URL
      const bvNum = rec.bv_number;
      if (bvNum.startsWith('http')) {
        url = bvNum;
      } else if (bvNum.startsWith('BV')) {
        url = `https://www.bilibili.com/video/${bvNum}`;
      } else {
        // 可能是其他格式的URL
        url = bvNum;
      }
    } else if (rec?.['B站BV号']) {
      const bvNum = rec['B站BV号'];
      url = bvNum.startsWith('http') ? bvNum : `https://www.bilibili.com/video/${bvNum}`;
    }
  }
  
  // 优先使用推荐理由，然后是内容简介，最后是简要说明
  const description = rec?.reason || rec?.['推荐理由'] || rec?.brief_description || rec?.['内容简介'] || rec?.['简要说明'] || '推荐学习资源'
  
  return {
    title: rec?.name || rec?.['名称'] || '推荐资源',
    description: description,
    platform: platform,
    difficulty,
    duration: formatDuration(duration),
    url: url,
    stats: rec?.study_data || rec?.['学习数据'],
    institution: rec?.institution || rec?.['机构'],
    upHost: rec?.up_host || rec?.['UP主'],
    accessGuide: rec?.access_guide || rec?.['访问指引'] // 添加访问指引字段
  };
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
  hasSearched.value = true; // 标记已搜索，切换到结果页面

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

    const mapResourceForChat = (rec: any) => {
      const normalized = normalizeRecommendation(rec)
      if (!normalized) return null
      return {
        name: normalized.title,
        description: normalized.description,
        platform: normalized.platform,
        difficulty: normalized.difficulty,
        duration: normalized.duration,
        url: normalized.url,
        stats: normalized.stats,
        accessGuide: normalized.accessGuide
      }
    }

    const resources = []
    const topResource = mapResourceForChat(response.top_recommendation)
    if (topResource) {
      resources.push(topResource)
    }
    if (response.other_recommendations && response.other_recommendations.length > 0) {
      response.other_recommendations.forEach(rec => {
        const mapped = mapResourceForChat(rec)
        if (mapped) resources.push(mapped)
      })
    }

    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: response.learning_advice || '我来为您推荐一些优质的学习资源：',
      timestamp: new Date().toISOString(),
      resources
    };

    searchResults.value = {
      topRecommendation: normalizeRecommendation(response.top_recommendation),
      otherRecommendations: response.other_recommendations?.map(normalizeRecommendation).filter(Boolean) || [],
      learningAdvice: response.learning_advice
    };

  } catch (error: any) {
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

// 控制悬浮球和聊天窗口
const closeChatWindow = () => {
  showChatWindow.value = false;
};

// 拖拽相关状态
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const ballPosition = ref({ x: 0, y: 0 });
const startPosition = ref({ x: 0, y: 0 }); // 记录拖拽开始位置
const dragThreshold = 5; // 拖拽阈值，超过这个距离才认为是拖拽
const isDragStarted = ref(false); // 标记是否开始了拖拽流程
const shouldPreventClick = ref(false); // 标记是否应该阻止点击事件

// 拖拽开始
const handleDragStart = (event: MouseEvent | TouchEvent) => {
  if (showChatWindow.value) return; // 聊天窗口打开时不允许拖拽
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  startPosition.value = { x: clientX, y: clientY };
  isDragging.value = false; // 先不标记为拖拽，等移动距离超过阈值
  isDragStarted.value = true; // 标记开始了拖拽流程
  shouldPreventClick.value = false; // 重置点击阻止标记
  
  const ball = event.currentTarget as HTMLElement;
  const rect = ball.getBoundingClientRect();
  
  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
};

// 拖拽中
const handleDragMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragStarted.value) return; // 如果没有开始拖拽流程，直接返回
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  // 计算移动距离
  const deltaX = Math.abs(clientX - startPosition.value.x);
  const deltaY = Math.abs(clientY - startPosition.value.y);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // 如果移动距离超过阈值，开始拖拽
  if (distance > dragThreshold && !isDragging.value) {
    isDragging.value = true;
    shouldPreventClick.value = true; // 标记应该阻止点击
    document.body.style.userSelect = 'none';
    event.preventDefault();
  }
  
  if (!isDragging.value) return;
  
  event.preventDefault();
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const ballSize = 64; // 悬浮球大小 w-16 h-16 = 4rem = 64px
  
  let newX = clientX - dragOffset.value.x;
  let newY = clientY - dragOffset.value.y;
  
  // 限制在窗口范围内
  newX = Math.max(0, Math.min(newX, windowWidth - ballSize));
  newY = Math.max(0, Math.min(newY, windowHeight - ballSize));
  
  // 更新位置
  if (ballPosition.value.x !== newX || ballPosition.value.y !== newY) {
    ballPosition.value = { x: newX, y: newY };
  }
};

// 拖拽结束
const handleDragEnd = (event?: MouseEvent | TouchEvent) => {
  const wasDragging = isDragging.value;
  const shouldPrevent = shouldPreventClick.value;
  
  isDragging.value = false;
  isDragStarted.value = false; // 重置拖拽流程标记
  document.body.style.userSelect = '';
  
  // 如果发生了拖拽，阻止点击事件
  if (wasDragging && event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // 如果应该阻止点击，延迟重置标记（给时间让点击事件被阻止）
  if (shouldPrevent) {
    setTimeout(() => {
      shouldPreventClick.value = false;
    }, 300); // 延迟300ms后重置，确保点击事件不会触发
  } else {
    shouldPreventClick.value = false;
  }
  
  return wasDragging; // 返回是否发生了拖拽
};

// 切换聊天窗口
const toggleChatWindow = () => {
  showChatWindow.value = !showChatWindow.value;
};

// 点击悬浮球（仅在非拖拽时触发）
const handleBallClick = (event: MouseEvent) => {
  // 如果正在拖拽或应该阻止点击，不触发点击
  if (isDragging.value || shouldPreventClick.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  
  // 切换聊天窗口
  toggleChatWindow();
};

// 快速提问处理
const handleQuickPrompt = (prompt: string) => {
  chatInput.value = prompt;
  if (!showChatWindow.value) {
    showChatWindow.value = true;
  }
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
  
  // 添加全局拖拽事件监听
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragStarted.value) {
      handleDragMove(e);
    }
  };
  const handleGlobalMouseUp = (e: MouseEvent) => {
    if (isDragStarted.value) {
      const wasDragging = handleDragEnd(e);
      // 如果发生了拖拽，阻止后续的点击事件
      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };
  const handleGlobalTouchMove = (e: TouchEvent) => {
    if (isDragStarted.value) {
      e.preventDefault();
      handleDragMove(e);
    }
  };
  const handleGlobalTouchEnd = (e: TouchEvent) => {
    if (isDragStarted.value) {
      const wasDragging = handleDragEnd(e);
      // 如果发生了拖拽，阻止后续的点击事件
      if (wasDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };
  
  document.addEventListener('mousemove', handleGlobalMouseMove);
  document.addEventListener('mouseup', handleGlobalMouseUp);
  document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
  document.addEventListener('touchend', handleGlobalTouchEnd);
  
  // 组件卸载时清理事件监听
  return () => {
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('touchmove', handleGlobalTouchMove);
    document.removeEventListener('touchend', handleGlobalTouchEnd);
  };
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
      
      <!-- 首页介绍区域 - 6个功能卡片 -->
      <div v-if="!hasSearched" class="space-y-8">
        <!-- Hero 标题 -->
        <div class="text-center space-y-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            <span class="block">智能学习平台</span>
            <span class="block mt-2 text-2xl md:text-3xl font-medium text-slate-500">
              让学习更 <span class="text-indigo-600 font-bold">高效</span>，成长更 <span class="text-purple-600 font-bold">清晰</span>
            </span>
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            整合AI智能推荐、海量学习资源、社区交流、学习计划等功能，为您提供全方位的学习支持
          </p>
        </div>

        <!-- 六大功能卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div 
            v-for="card in featureCards" 
            :key="card.id"
            class="group bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <!-- 图标容器 -->
            <div :class="`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`">
              <component :is="card.icon" class="w-8 h-8" />
            </div>
            
            <!-- 内容 -->
            <h3 class="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {{ card.title }}
            </h3>
            <p class="text-slate-600 leading-relaxed">
              {{ card.description }}
            </p>
          </div>
        </div>

        <!-- 快速体验提示 -->
        <div class="text-center mt-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-full border border-indigo-200">
            <Zap class="w-5 h-5 text-indigo-600" />
            <span class="text-indigo-700 font-medium">点击右下角的AI助手开始智能推荐</span>
          </div>
        </div>
      </div>

      <!-- 搜索结果区域 -->
      <div v-else class="space-y-8">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 space-y-6">
          <!-- 加载转圈动画 -->
          <div class="relative">
            <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-indigo-300 border-t-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <!-- 加载文字 -->
          <div class="text-center space-y-2">
            <div class="flex items-center gap-2 text-lg font-medium text-slate-600">
              <Sparkles class="w-5 h-5 text-indigo-600 animate-pulse" />
              <span>AI正在为您精选学习资源...</span>
            </div>
            <p class="text-sm text-slate-500">请稍候，推荐卡片即将展示</p>
          </div>
        </div>

        <!-- 结果标题 -->
        <div v-else class="text-center space-y-4">
          <h2 class="text-3xl font-bold text-slate-900">AI推荐结果</h2>
          <p class="text-slate-600">根据您的需求，为您精选了以下学习资源</p>
        </div>

        <!-- 学习建议 -->
        <div v-if="searchResults?.learningAdvice && !isLoading" class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-indigo-900">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles class="w-5 h-5" />
            学习建议
          </h3>
          <p class="leading-relaxed text-sm">{{ searchResults.learningAdvice }}</p>
        </div>

        <!-- 推荐资源卡片加载骨架屏 -->
        <div v-if="isLoading" class="space-y-6">
          <!-- 最推荐骨架屏 -->
          <div class="bg-white rounded-2xl border border-slate-100 p-6">
            <div class="flex flex-col lg:flex-row gap-6">
              <div class="flex-1 space-y-3">
                <div class="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
                <div class="h-8 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-slate-200 rounded animate-pulse w-16"></div>
                  <div class="h-3 bg-slate-200 rounded animate-pulse w-20"></div>
                  <div class="h-3 bg-slate-200 rounded animate-pulse w-32"></div>
                </div>
              </div>
              <div class="flex items-center">
                <div class="h-10 bg-slate-200 rounded-lg animate-pulse w-24"></div>
              </div>
            </div>
          </div>

          <!-- 其他推荐骨架屏 -->
          <div class="space-y-4">
            <div class="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
            <div class="grid gap-4 md:grid-cols-2">
              <!-- 骨架卡片1 -->
              <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div class="flex justify-between">
                  <div class="space-y-2">
                    <div class="h-5 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    <div class="h-3 bg-slate-200 rounded animate-pulse w-full"></div>
                  </div>
                  <div class="h-4 bg-slate-200 rounded animate-pulse w-8"></div>
                </div>
                <div class="flex gap-2">
                  <div class="h-3 bg-slate-200 rounded-full animate-pulse w-16"></div>
                  <div class="h-3 bg-slate-200 rounded-full animate-pulse w-12"></div>
                  <div class="h-3 bg-slate-200 rounded-full animate-pulse w-20"></div>
                </div>
                <div class="h-6 bg-slate-200 rounded animate-pulse w-20"></div>
              </div>
              
              <!-- 骨架卡片2 -->
              <div class="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div class="flex justify-between">
                  <div class="space-y-2">
                    <div class="h-5 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    <div class="h-3 bg-slate-200 rounded animate-pulse w-full"></div>
                  </div>
                  <div class="h-4 bg-slate-200 rounded animate-pulse w-8"></div>
                </div>
                <div class="flex gap-2">
                  <div class="h-3 bg-slate-200 rounded-full animate-pulse w-16"></div>
                  <div class="h-3 bg-slate-200 rounded-full animate-pulse w-12"></div>
                </div>
                <div class="h-6 bg-slate-200 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最推荐 -->
        <div v-if="searchResults?.topRecommendation && !isLoading" class="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col lg:flex-row gap-6">
          <div class="flex-1">
            <p class="text-xs uppercase tracking-wider text-indigo-500 font-semibold mb-2">🎯 最推荐</p>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">{{ searchResults.topRecommendation.title }}</h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">{{ searchResults.topRecommendation.description }}</p>
            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold">
                {{ searchResults.topRecommendation.platform }}
              </span>
              <span v-if="searchResults.topRecommendation.difficulty && searchResults.topRecommendation.difficulty !== '待确认'">{{ searchResults.topRecommendation.difficulty }}</span>
              <span v-if="searchResults.topRecommendation.duration && searchResults.topRecommendation.duration !== '待确认'">{{ searchResults.topRecommendation.duration }}</span>
              <span v-if="searchResults.topRecommendation.upHost">UP主：{{ searchResults.topRecommendation.upHost }}</span>
              <span v-if="searchResults.topRecommendation.institution">机构：{{ searchResults.topRecommendation.institution }}</span>
              <span v-if="searchResults.topRecommendation.stats">{{ searchResults.topRecommendation.stats }}</span>
            </div>
          </div>
          <div class="flex items-center lg:items-end">
            <a 
              v-if="searchResults.topRecommendation.url"
              :href="searchResults.topRecommendation.url"
              target="_blank"
              rel="noopener noreferrer"
              class="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              立即学习
            </a>
          </div>
          <div v-if="searchResults.topRecommendation.accessGuide" class="mt-3 text-sm text-slate-600">
            <span class="font-medium">访问指引：</span>{{ searchResults.topRecommendation.accessGuide }}
          </div>
        </div>

        <!-- 其他推荐 -->
        <div v-if="searchResults?.otherRecommendations?.length && !isLoading" class="space-y-4">
          <p class="text-sm font-semibold text-slate-500">📚 其他推荐</p>
          <div class="grid gap-4 md:grid-cols-2">
            <div 
              v-for="(item, idx) in searchResults.otherRecommendations" 
              :key="idx"
              class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="text-lg font-semibold text-slate-900 mb-1">{{ item.title }}</h4>
                  <p class="text-sm text-slate-600 mb-3">{{ item.description }}</p>
                </div>
                <span class="text-xs text-slate-400 mt-1">#{{ idx + 1 }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span class="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-700">{{ item.platform }}</span>
                <span v-if="item.difficulty && item.difficulty !== '待确认'">{{ item.difficulty }}</span>
                <span v-if="item.duration && item.duration !== '待确认'">{{ item.duration }}</span>
                <span v-if="item.stats">{{ item.stats }}</span>
              </div>
              <div class="mt-3">
                <a 
                  v-if="item.url"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  查看资源 →
                </a>
                <div v-if="item.accessGuide" class="text-xs text-slate-600 mt-1">
                  <span class="font-medium">访问指引：</span>{{ item.accessGuide }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 悬浮球AI助手 -->
    <div 
      class="fixed z-50"
      :style="{
        left: ballPosition.x ? ballPosition.x + 'px' : '',
        top: ballPosition.y ? ballPosition.y + 'px' : '',
        right: ballPosition.x === 0 ? '2rem' : '',
        bottom: ballPosition.y === 0 ? '2rem' : '',
        transform: ballPosition.x || ballPosition.y ? 'none' : ''
      }"
    >
      <!-- 悬浮球 -->
      <div 
        v-if="!showChatWindow || ballPosition.x || ballPosition.y"
        @mousedown="handleDragStart"
        @touchstart="handleDragStart"
        @click.stop="handleBallClick"
        class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative select-none"
        :class="{ 
          'cursor-grabbing scale-110': isDragging,
          'cursor-grab': !isDragging,
          'animate-pulse hover:animate-none': !isDragging
        }"
      >
        <Bot class="w-8 h-8 text-white" />
        <!-- 提示气泡 -->
        <div class="absolute -top-8 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div class="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {{ isDragging ? '拖拽中...' : (showChatWindow ? '点击缩小' : '点击或拖拽') }}
          </div>
          <!-- 小箭头 -->
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </div>

      <!-- 聊天窗口 -->
      <transition name="chat-window">
        <div 
          v-if="showChatWindow" 
          @mousedown.stop
          @touchstart.stop
          class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 h-[500px] flex flex-col relative animate-fade-in-up"
        >
          <!-- 窗口头部 -->
          <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 rounded-t-2xl flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
              <Bot class="w-4 h-4" />
            </div>
            <span class="font-semibold text-slate-700">AI学习助手</span>
            <div class="ml-auto flex gap-2">
              <button 
                @click="closeChatWindow"
                class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="最小化"
              >
                <Minimize2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
            <!-- 欢迎消息 -->
            <div v-if="messages.length === 0" class="text-center py-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm">
                <Sparkles class="w-4 h-4" />
                <span>我是您的AI学习助手，有什么可以帮助您的吗？</span>
              </div>
            </div>

            <!-- 消息历史 -->
            <template v-for="(msg, index) in messages" :key="index">
              <!-- AI消息 -->
              <div v-if="msg.role === 'assistant'" class="flex gap-3 items-start">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white">
                  <Sparkles class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-1 max-w-[80%]">
                  <div class="bg-slate-100 text-slate-800 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm text-sm">
                    <div v-if="msg.loading" class="flex items-center gap-2">
                      <div class="flex gap-1">
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                      </div>
                      <span class="text-xs text-slate-500">思考中...</span>
                    </div>
                    <div v-else>
                      <div class="whitespace-pre-wrap">{{ msg.content }}</div>
                      <!-- 推荐资源卡片 -->
                      <div v-if="msg.resources && msg.resources.length > 0" class="mt-4 space-y-3">
                        <div v-for="(resource, rIndex) in msg.resources" :key="rIndex" 
                             class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                          <div class="flex justify-between items-start gap-3">
                            <div class="flex-1 min-w-0">
                              <h4 class="font-semibold text-gray-900 mb-2 text-sm leading-tight">{{ resource.name }}</h4>
                              <p class="text-xs text-gray-600 mb-2 line-clamp-2">{{ resource.description }}</p>
                              <div class="flex flex-wrap items-center gap-2 text-xs">
                                <span class="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium">
                                  {{ resource.platform }}
                                </span>
                                <span v-if="resource.difficulty && resource.difficulty !== '待确认'" class="text-gray-500">{{ resource.difficulty }}</span>
                                <span v-if="resource.duration && resource.duration !== '待确认'" class="text-gray-500">{{ resource.duration }}</span>
                                <span v-if="resource.stats" class="text-gray-400">{{ resource.stats }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="mt-3">
                            <a 
                              v-if="resource.url"
                              :href="resource.url" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              前往查看 →
                            </a>
                            <div v-if="resource.accessGuide" class="text-xs text-slate-600 mt-1">
                              <span class="font-medium">访问指引：</span>{{ resource.accessGuide }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="text-[10px] text-slate-400">{{ formatTime(msg.timestamp) }}</span>
                </div>
              </div>

              <!-- 用户消息 -->
              <div v-else class="flex gap-3 items-start flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white">
                  <User class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-1 items-end max-w-[80%]">
                  <div class="bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-tr-none shadow-md text-sm">
                    {{ msg.content }}
                  </div>
                  <span class="text-[10px] text-slate-400">{{ formatTime(msg.timestamp) }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- 输入区域 -->
          <div class="p-3 bg-slate-50 border-t border-slate-200">
            <!-- 快速提示词 -->
            <div v-if="messages.length < 3" class="flex gap-2 overflow-x-auto pb-2 mb-2">
              <button 
                v-for="prompt in quickPrompts" 
                :key="prompt"
                @click="chatInput = prompt"
                class="whitespace-nowrap px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors flex-shrink-0"
              >
                {{ prompt }}
              </button>
            </div>

            <!-- 输入框 -->
            <div class="relative">
              <textarea 
                v-model="chatInput"
                @keydown.enter.exact.prevent="sendMessage"
                placeholder="输入您的学习需求，例如：我想学习前端开发..."
                class="w-full pl-3 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm shadow-sm transition-all"
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
      </transition>
    </div>

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

/* 聊天窗口动画 */
.chat-window-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.chat-window-leave-active {
  transition: all 0.2s ease-in;
}
.chat-window-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
.chat-window-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* 悬浮球动画 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(79, 70, 229, 0);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .fixed.bottom-8.right-8 {
    bottom: 1rem;
    right: 1rem;
  }
  
  .w-96 {
    width: calc(100vw - 2rem);
    max-width: 24rem;
  }
}
</style>