<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Send, 
  Sparkles, 
  Bot, // 也可以换成 ScrollText 或 Library
  Minimize2
} from 'lucide-vue-next';

// 导入 Coze API 服务 - 使用本地代理服务器
import { cozeAPIService } from '@/services/coze-api';

const router = useRouter();

// --- 状态管理 ---
const showChatWindow = ref(false);
const isLoading = ref(false);
const chatInput = ref('');
const messages = ref<any[]>([
  { 
    role: 'assistant', 
    content: '学者您好。我是您的研究助理。今天有什么可以帮助您的吗？', 
    timestamp: new Date().toISOString() 
  }
]);
const chatContainer = ref<HTMLElement | null>(null);

// 快速提问标签（支持深度分析）
const quickPrompts = [
  '英语六级备考计划', 
  'Python数据分析完整路径', 
  'React高级进阶指南', 
  '机器学习入门到精通'
];

// 拖拽相关状态
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const ballPosition = ref({ x: 0, y: 0 });
const startPosition = ref({ x: 0, y: 0 });
const dragThreshold = 5;
const isDragStarted = ref(false);
const shouldPreventClick = ref(false);

// 聊天窗口拖拽状态
const isChatDragging = ref(false);
const chatDragOffset = ref({ x: 0, y: 0 });

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 控制聊天窗口
const closeChatWindow = () => {
  showChatWindow.value = false;
};

// --- 拖拽逻辑 (保持原有核心逻辑，仅适配样式) ---
const handleDragStart = (event: MouseEvent | TouchEvent) => {
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  startPosition.value = { x: clientX, y: clientY };
  isDragging.value = false;
  isDragStarted.value = true;
  shouldPreventClick.value = false;
  
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  
  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
  
  if (ballPosition.value.x === 0 && ballPosition.value.y === 0) {
    ballPosition.value = { x: rect.left, y: rect.top };
  }
};

const handleDragMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragStarted.value) return;
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  const deltaX = Math.abs(clientX - startPosition.value.x);
  const deltaY = Math.abs(clientY - startPosition.value.y);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  if (distance > dragThreshold && !isDragging.value) {
    isDragging.value = true;
    shouldPreventClick.value = true;
    document.body.style.userSelect = 'none';
    event.preventDefault();
  }
  
  if (!isDragging.value) return;
  
  event.preventDefault();
  
  let newX = clientX - dragOffset.value.x;
  let newY = clientY - dragOffset.value.y;
  
  // 使用统一的边界限制函数
  const constrainedPos = constrainPosition(newX, newY, showChatWindow.value);
  
  if (ballPosition.value.x !== constrainedPos.x || ballPosition.value.y !== constrainedPos.y) {
    ballPosition.value = constrainedPos;
  }
};

const handleDragEnd = (event?: MouseEvent | TouchEvent) => {
  const wasDragging = isDragging.value;
  const shouldPrevent = shouldPreventClick.value;
  
  isDragging.value = false;
  isDragStarted.value = false;
  document.body.style.userSelect = '';
  
  if (wasDragging && event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (shouldPrevent) {
    setTimeout(() => { shouldPreventClick.value = false; }, 300);
  } else {
    shouldPreventClick.value = false;
  }
  
  return wasDragging;
};

const toggleChatWindow = () => { 
  const isOpening = !showChatWindow.value;
  showChatWindow.value = isOpening;
  
  // 当打开聊天窗口时，确保悬浮球位置适合显示聊天窗口
  if (isOpening) {
    // 检查当前悬浮球位置是否适合显示聊天窗口
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const chatWidth = 380;
    const chatHeight = 600;
    const margin = 20;
    
    let adjustedX = ballPosition.value.x;
    let adjustedY = ballPosition.value.y;
    
    // 如果聊天窗口会超出右边界，调整悬浮球位置
    if (adjustedX + chatWidth > windowWidth - margin) {
      adjustedX = windowWidth - chatWidth - margin;
    }
    
    // 如果聊天窗口会超出底部边界，调整悬浮球位置  
    if (adjustedY + chatHeight > windowHeight - margin) {
      adjustedY = windowHeight - chatHeight - margin;
    }
    
    // 如果聊天窗口会超出左边界或顶部边界，调整悬浮球位置
    if (adjustedX < margin) {
      adjustedX = margin;
    }
    if (adjustedY < margin) {
      adjustedY = margin;
    }
    
    // 只有当位置需要调整时才更新
    if (adjustedX !== ballPosition.value.x || adjustedY !== ballPosition.value.y) {
      ballPosition.value = { x: adjustedX, y: adjustedY };
    }
  }
};

// 检查并限制位置在边界内（适用于悬浮球和聊天窗口）
const constrainPosition = (x: number, y: number, isChatWindow = false) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const margin = 20;
  
  if (isChatWindow) {
    const chatWidth = 380;
    const chatHeight = 600;
    
    // 限制聊天窗口在屏幕内
    x = Math.max(margin, Math.min(x, windowWidth - chatWidth - margin));
    y = Math.max(margin, Math.min(y, windowHeight - chatHeight - margin));
  } else {
    // 限制悬浮球在屏幕内
    const ballSize = 64;
    x = Math.max(margin, Math.min(x, windowWidth - ballSize - margin));
    y = Math.max(margin, Math.min(y, windowHeight - ballSize - margin));
  }
  
  return { x, y };
};

const handleBallClick = (event: MouseEvent) => {
  if (isDragging.value || shouldPreventClick.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  toggleChatWindow();
};

// 聊天窗口拖拽处理
const handleChatDragStart = (event: MouseEvent | TouchEvent) => {
  isChatDragging.value = true;
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  chatDragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
  
  document.body.style.userSelect = 'none';
  event.preventDefault();
};

const handleChatDragMove = (event: MouseEvent | TouchEvent) => {
  if (!isChatDragging.value) return;
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  let newX = clientX - chatDragOffset.value.x;
  let newY = clientY - chatDragOffset.value.y;
  
  // 使用统一的边界限制函数
  const constrainedPos = constrainPosition(newX, newY, true);
  
  // 更新悬浮球位置以跟随聊天窗口
  ballPosition.value = constrainedPos;
};

const handleChatDragEnd = () => {
  isChatDragging.value = false;
  document.body.style.userSelect = '';
};

// 处理登录
const handleLogin = () => {
  router.push('/login');
  closeChatWindow();
};

// --- 发送消息逻辑 ---
const sendMessage = async () => {
  const message = chatInput.value.trim();
  if (!message || isLoading.value) return;

  // 检查用户登录状态
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    // 用户未登录，显示游客提示
    messages.value.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    chatInput.value = '';
    
    const aiMessageIndex = messages.value.push({
      role: 'assistant', 
      content: '🔒 当前用户未登录，请登录后再使用本功能\n\n💡 登录后您可以：\n• 获得个性化的学习推荐\n• 保存喜欢的学习资源\n• 创建个人学习计划\n• 追踪学习进度', 
      timestamp: new Date().toISOString(), 
      resources: []
    }) - 1;

    setTimeout(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }, 100);
    return;
  }

  messages.value.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
  chatInput.value = '';
  isLoading.value = true;

  const aiMessageIndex = messages.value.push({
    role: 'assistant', 
    content: '🤖 AI智能体正在深度分析您的需求，生成个性化学习推荐（支持1分钟处理时间）...', 
    timestamp: new Date().toISOString(), 
    loading: true, 
    resources: []
  }) - 1;

  setTimeout(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }, 100);

  try {
    console.log(`🚀 开始AI查询（本地代理服务器）: "${message}"`);
    const response = await cozeAPIService.searchResources({ query: message });
    console.log(`✅ AI查询完成，获得高质量推荐`);

    const mapResourceForChat = (rec: any) => {
      if (!rec) return null;
      let url = rec?.url;
      if (!url && rec?.bv_number) {
        const bvNum = rec.bv_number;
        url = bvNum.startsWith('http') ? bvNum : (bvNum.startsWith('BV') ? `https://www.bilibili.com/video/${bvNum}` : bvNum);
      }
      return {
        name: rec?.name || 'Archive Item',
        description: rec?.reason || rec?.brief_description || 'No description.',
        platform: rec?.platform || 'Library',
        difficulty: rec?.difficulty || 'N/A',
        duration: rec?.duration || '',
        url: url,
        stats: rec?.study_data,
        accessGuide: rec?.access_guide
      };
    };

    const resources = [];
    const topResource = mapResourceForChat(response.top_recommendation);
    if (topResource) resources.push(topResource);
    if (response.other_recommendations?.length) {
      response.other_recommendations.forEach((rec: any) => {
        const mapped = mapResourceForChat(rec);
        if (mapped) resources.push(mapped);
      });
    }

    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: response.learning_advice || '根据您的查询，我找到了以下相关档案：',
      timestamp: new Date().toISOString(),
      resources
    };

    setTimeout(() => {
      closeChatWindow();
      router.push({
        path: '/search',
        query: { 
          search: message,
          results: JSON.stringify({
            topRecommendation: response.top_recommendation,
            otherRecommendations: response.other_recommendations,
            learningAdvice: response.learning_advice
          })
        }
      });
    }, 2500); // 稍微延长一点展示时间，体现沉稳

  } catch (error: any) {
    console.error('Error:', error);
    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: `查询失败: ${error.message || '未知系统错误'}。请稍后重试。`,
      timestamp: new Date().toISOString(),
      resources: []
    };
  } finally {
    isLoading.value = false;
    setTimeout(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; }, 100);
  }
};

// 全局事件绑定
const handleGlobalMouseMove = (e: MouseEvent) => { if (isDragStarted.value) handleDragMove(e); };
const handleGlobalMouseUp = (e: MouseEvent) => {
  if (isDragStarted.value) {
    const wasDragging = handleDragEnd(e);
    if (wasDragging) { e.preventDefault(); e.stopPropagation(); }
  }
};
const handleGlobalTouchMove = (e: TouchEvent) => { if (isDragStarted.value) { e.preventDefault(); handleDragMove(e); } };
const handleGlobalTouchEnd = (e: TouchEvent) => {
  if (isDragStarted.value) {
    const wasDragging = handleDragEnd(e);
    if (wasDragging) { e.preventDefault(); e.stopPropagation(); }
  }
};

// 聊天窗口的全局拖拽事件
const handleGlobalMouseMoveForChat = (e: MouseEvent) => {
  if (isChatDragging.value) {
    handleChatDragMove(e);
  } else if (isDragStarted.value) {
    handleGlobalMouseMove(e);
  }
};

const handleGlobalMouseUpForChat = (e: MouseEvent) => {
  if (isChatDragging.value) {
    handleChatDragEnd();
  } else if (isDragStarted.value) {
    handleGlobalMouseUp(e);
  }
};

const handleGlobalTouchMoveForChat = (e: TouchEvent) => {
  if (isChatDragging.value) {
    e.preventDefault();
    handleChatDragMove(e);
  } else if (isDragStarted.value) {
    handleGlobalTouchMove(e);
  }
};

const handleGlobalTouchEndForChat = (e: TouchEvent) => {
  if (isChatDragging.value) {
    e.preventDefault();
    handleChatDragEnd();
  } else if (isDragStarted.value) {
    handleGlobalTouchEnd(e);
  }
};

// 重置悬浮球到安全位置
const resetToSafePosition = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const safePos = constrainPosition(windowWidth - 100, windowHeight - 100, false);
  ballPosition.value = safePos;
  
  if (showChatWindow.value) {
    closeChatWindow();
  }
};

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  // ESC键关闭聊天窗口
  if (event.key === 'Escape' && showChatWindow.value) {
    closeChatWindow();
  }
  
  // Ctrl+R 或 Cmd+R 重置位置（避免与浏览器刷新冲突）
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault();
    resetToSafePosition();
  }
};

onMounted(() => {
  // 设置初始位置到右下角
  if (ballPosition.value.x === 0 && ballPosition.value.y === 0) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    ballPosition.value = constrainPosition(windowWidth - 100, windowHeight - 100, false);
  }
  
  document.addEventListener('mousemove', handleGlobalMouseMoveForChat);
  document.addEventListener('mouseup', handleGlobalMouseUpForChat);
  document.addEventListener('touchmove', handleGlobalTouchMoveForChat, { passive: false });
  document.addEventListener('touchend', handleGlobalTouchEndForChat);
  document.addEventListener('keydown', handleKeyDown);
  
  // 监听窗口大小变化，确保位置始终在边界内
  window.addEventListener('resize', () => {
    ballPosition.value = constrainPosition(ballPosition.value.x, ballPosition.value.y, showChatWindow.value);
  });
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMoveForChat);
  document.removeEventListener('mouseup', handleGlobalMouseUpForChat);
  document.removeEventListener('touchmove', handleGlobalTouchMoveForChat);
  document.removeEventListener('touchend', handleGlobalTouchEndForChat);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <!-- 全局悬浮球 (Emblem) -->
  <div 
    class="fixed z-[100]"
    :style="{
      left: ballPosition.x + 'px',
      top: ballPosition.y + 'px'
    }"
  >
    <!-- 悬浮球本体 -->
    <div 
      @mousedown="handleDragStart"
      @touchstart="handleDragStart"
      @click.stop="handleBallClick"
      class="w-16 h-16 rounded-full flex items-center justify-center group relative select-none transition-all duration-300 shadow-[0_10px_30px_rgba(26,60,52,0.4)]"
      :class="{ 
        'cursor-grabbing scale-95': isDragging,
        'cursor-grab': !isDragging,
        'animate-float': !isDragging && !showChatWindow,
        'bg-[#1a3c34] border-2 border-[#d4c5a3]': true,
        'opacity-0 pointer-events-none': showChatWindow // 打开窗口时隐藏球体，避免视觉干扰
      }"
    >
      <!-- 内部装饰 -->
      <div class="absolute inset-1 rounded-full border border-[#d4c5a3]/30"></div>
      <Sparkles class="w-7 h-7 text-[#d4c5a3]" />
      
      <!-- 提示气泡 -->
      <div class="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" v-if="!isDragging && !showChatWindow">
        <div class="bg-[#1a3c34] text-[#d4c5a3] text-[10px] font-bold uppercase tracking-widest px-3 py-2 shadow-lg border border-[#d4c5a3]/20 whitespace-nowrap">
          咨询助手
        </div>
      </div>
    </div>

    <!-- 聊天窗口 (The Logbook) -->
    <transition name="chat-window">
      <div 
        v-if="showChatWindow" 
        class="absolute bg-[#f2f0e9] shadow-2xl border border-[#1a3c34]/20 w-[380px] h-[600px] flex flex-col rounded-sm overflow-hidden font-sans"
        style="left: 0; top: 0;" 
      >
        <!-- 窗口头部 -->
        <div 
          @mousedown="handleChatDragStart"
          @touchstart="handleChatDragStart"
          class="px-5 py-4 bg-[#1a3c34] border-b border-[#d4c5a3]/20 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
        >
          <!-- 头部纹理 -->
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div class="w-8 h-8 rounded-sm bg-[#d4c5a3] flex items-center justify-center text-[#1a3c34] shadow-md border border-[#1a3c34] z-10">
            <Bot class="w-5 h-5" />
          </div>
          <div class="flex flex-col z-10">
             <span class="font-serif font-bold text-[#f2f0e9] text-base tracking-wide">研究助理</span>
             <span class="text-[9px] text-[#d4c5a3]/60 uppercase tracking-widest">AI 智能系统</span>
          </div>
          <div class="ml-auto flex gap-2 z-10">
            <button 
              @click="resetToSafePosition"
              @mousedown.stop
              class="p-1.5 text-[#d4c5a3]/60 hover:text-white transition-colors z-20 relative"
              title="Reset Position (Ctrl+R)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            <button 
              @click="closeChatWindow"
              @mousedown.stop
              class="p-1.5 text-[#d4c5a3]/60 hover:text-white transition-colors z-20 relative"
            >
              <Minimize2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-[#f2f0e9]">
          <!-- 欢迎语 -->
          <div v-if="messages.length === 1" class="text-center py-6">
             <div class="inline-block p-4 border border-[#1a3c34]/10 bg-[#1a3c34]/5 text-[#1a3c34] font-serif text-sm italic rounded-sm max-w-[80%]">
                "知识是唯一通过扩散而增加的宝藏。"
             </div>
          </div>

          <template v-for="(msg, index) in messages" :key="index">
            <!-- AI 消息 (白底信笺) -->
            <div v-if="msg.role === 'assistant'" class="flex gap-4 items-start">
              <div class="w-8 h-8 rounded-sm bg-[#1a3c34] flex-shrink-0 flex items-center justify-center text-[#d4c5a3] mt-1 border border-[#1a3c34]">
                <Sparkles class="w-4 h-4" />
              </div>
              <div class="flex flex-col gap-1 max-w-[85%]">
                <div class="bg-white border border-[#1a3c34]/10 text-[#1a3c34] px-4 py-3 shadow-sm rounded-sm text-sm font-serif leading-relaxed">
                  <div v-if="msg.loading" class="flex items-center gap-2 py-1">
                    <span class="w-1.5 h-1.5 bg-[#1a3c34] rounded-full animate-pulse"></span>
                    <span class="w-1.5 h-1.5 bg-[#1a3c34] rounded-full animate-pulse delay-100"></span>
                    <span class="w-1.5 h-1.5 bg-[#1a3c34] rounded-full animate-pulse delay-200"></span>
                    <span class="text-xs text-[#1a3c34]/50 ml-2 font-mono uppercase tracking-wider">分析中...</span>
                  </div>
                  <div v-else>
                    <div class="whitespace-pre-wrap">{{ msg.content }}</div>
                    
                    <!-- 未登录时的登录按钮 -->
                    <div v-if="msg.content.includes('当前用户未登录')" class="mt-4 p-3 bg-[#1a3c34]/5 border border-[#1a3c34]/20 rounded-sm">
                      <button 
                        @click="handleLogin"
                        class="w-full px-4 py-2 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest text-sm hover:bg-[#235246] transition-colors flex items-center justify-center gap-2"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        </svg>
                        立即登录
                      </button>
                    </div>
                    
                    <!-- 推荐卡片 (Index Card Style) -->
                    <div v-if="msg.resources && msg.resources.length > 0" class="mt-4 space-y-3">
                      <div v-for="(resource, rIndex) in msg.resources" :key="rIndex" 
                           class="bg-[#f9f9f7] p-3 border-l-2 border-[#d4c5a3] hover:bg-white hover:border-[#1a3c34] transition-colors cursor-default">
                        <h4 class="font-bold text-[#1a3c34] text-xs uppercase tracking-wide mb-1">{{ resource.name }}</h4>
                        <p class="text-[11px] text-[#1a3c34]/60 font-serif line-clamp-2">{{ resource.description }}</p>
                        <div class="mt-2 flex gap-2 text-[10px] text-[#1a3c34]/40 font-mono">
                           <span>{{ resource.platform }}</span>
                           <span>•</span>
                           <span>{{ resource.duration }}</span>
                        </div>
                    <div class="mt-2 text-[10px] text-[#1a3c34] font-bold animate-pulse">
                           >> 正在跳转到资源库...
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="text-[10px] text-[#1a3c34]/30 font-mono pl-1">{{ formatTime(msg.timestamp) }}</span>
              </div>
            </div>

            <!-- 用户消息 (墨绿底) -->
            <div v-else class="flex gap-4 items-start flex-row-reverse">
              <div class="w-8 h-8 rounded-sm bg-[#d4c5a3] flex-shrink-0 flex items-center justify-center text-[#1a3c34] mt-1 border border-[#1a3c34]/20">
                <Bot class="w-4 h-4" />
              </div>
              <div class="flex flex-col gap-1 items-end max-w-[85%]">
                <div class="bg-[#1a3c34] text-[#d4c5a3] px-4 py-3 rounded-sm shadow-md text-sm font-serif leading-relaxed">
                  {{ msg.content }}
                </div>
                <span class="text-[10px] text-[#1a3c34]/30 font-mono pr-1">{{ formatTime(msg.timestamp) }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- 输入区域 -->
        <div class="p-4 bg-[#e8e4d9] border-t border-[#1a3c34]/10">
          <!-- Quick Prompts -->
          <div v-if="messages.length < 3" class="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
            <button 
              v-for="prompt in quickPrompts" 
              :key="prompt"
              @click="chatInput = prompt"
              class="whitespace-nowrap px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-[#1a3c34]/20 text-[#1a3c34]/70 hover:bg-[#1a3c34] hover:text-[#d4c5a3] transition-colors bg-[#f2f0e9]"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Input Box -->
          <div class="relative group">
            <textarea 
              v-model="chatInput"
              @keydown.enter.exact.prevent="sendMessage"
              placeholder="请输入您想查询的主题..."
              class="w-full pl-4 pr-12 py-3 bg-[#f2f0e9] border border-[#1a3c34]/20 text-[#1a3c34] font-serif text-sm focus:outline-none focus:border-[#1a3c34] transition-colors resize-none placeholder-[#1a3c34]/30 h-14"
            ></textarea>
            <button 
              @click="sendMessage"
              :disabled="isLoading || !chatInput.trim()"
              class="absolute right-2 bottom-2 p-2 bg-[#1a3c34] text-[#d4c5a3] hover:bg-[#235246] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send v-if="!isLoading" class="w-4 h-4" />
              <div v-else class="w-4 h-4 border-2 border-[#d4c5a3] border-t-transparent rounded-full animate-spin"></div>
            </button>
          </div>
          <div class="flex justify-between items-center mt-2 px-1">
             <span class="text-[9px] text-[#1a3c34]/30 font-mono uppercase">EduMatch v3.0 // 安全通道</span>
             <span class="text-[9px] text-[#1a3c34]/30 font-mono">回车发送</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1a3c34; border-radius: 2px; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }

/* Chat Window Entrance */
.chat-window-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.chat-window-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.chat-window-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.chat-window-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>