<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Send, 
  Sparkles, 
  Bot,
  Minimize2,
  X
} from 'lucide-vue-next';

// 导入 Coze API 服务
import { cozeAPIService } from '@/services/coze-api';

const router = useRouter();

// --- 状态管理 ---
const showChatWindow = ref(false);
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

// 快速提问标签
const quickPrompts = ['我想考英语六级', 'Python数据分析入门', '零基础学React', '考研数学复习计划'];

// 拖拽相关状态
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const ballPosition = ref({ x: 0, y: 0 }); // 初始位置
const startPosition = ref({ x: 0, y: 0 }); // 记录拖拽开始位置
const dragThreshold = 5; // 拖拽阈值，超过这个距离才认为是拖拽
const isDragStarted = ref(false); // 标记是否开始了拖拽流程
const shouldPreventClick = ref(false); // 标记是否应该阻止点击事件

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 控制聊天窗口
const closeChatWindow = () => {
  showChatWindow.value = false;
};

// 拖拽开始 - 支持聊天窗口和悬浮球
const handleDragStart = (event: MouseEvent | TouchEvent) => {
  // 不再阻止聊天窗口的拖拽，支持聊天窗口打开时拖拽
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  startPosition.value = { x: clientX, y: clientY };
  isDragging.value = false; // 先不标记为拖拽，等移动距离超过阈值
  isDragStarted.value = true; // 标记开始了拖拽流程
  shouldPreventClick.value = false; // 重置点击阻止标记
  
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  
  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
  
  // 如果是初始状态，先设置当前位置
  if (ballPosition.value.x === 0 && ballPosition.value.y === 0) {
    ballPosition.value = { 
      x: rect.left, 
      y: rect.top 
    };
  }
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
  const elementSize = showChatWindow.value ? 384 : 64; // 聊天窗口宽度 384px (w-96) 或 悬浮球 64px
  const elementHeight = showChatWindow.value ? 500 : 64; // 聊天窗口高度 500px 或 悬浮球 64px
  
  let newX = clientX - dragOffset.value.x;
  let newY = clientY - dragOffset.value.y;
  
  // 限制在窗口范围内，留出一些边距避免贴边
  const margin = 8; // 8px边距
  newX = Math.max(margin, Math.min(newX, windowWidth - elementSize - margin));
  newY = Math.max(margin, Math.min(newY, windowHeight - elementHeight - margin));
  
  // 更新位置，避免重复设置相同值
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

// 发送消息
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

    const mapResourceForChat = (rec: any) => {
      if (!rec) return null;
      
      // 构建URL，优先使用BV号，然后是URL
      let url = rec?.url;
      if (!url && rec?.bv_number) {
        const bvNum = rec.bv_number;
        if (bvNum.startsWith('http')) {
          url = bvNum;
        } else if (bvNum.startsWith('BV')) {
          url = `https://www.bilibili.com/video/${bvNum}`;
        } else {
          url = bvNum;
        }
      } else if (!url && rec?.['B站BV号']) {
        const bvNum = rec['B站BV号'];
        url = bvNum.startsWith('http') ? bvNum : `https://www.bilibili.com/video/${bvNum}`;
      }
      
      return {
        name: rec?.name || rec?.['名称'] || '推荐资源',
        description: rec?.reason || rec?.['推荐理由'] || rec?.brief_description || rec?.['内容简介'] || '推荐学习资源',
        platform: rec?.platform || rec?.['平台来源'] || 'B站',
        difficulty: rec?.difficulty || rec?.['难度等级'] || '入门',
        duration: rec?.duration || rec?.['学习时长'] || '',
        url: url,
        stats: rec?.study_data || rec?.['学习数据'],
        accessGuide: rec?.access_guide || rec?.['访问指引']
      };
    };

    const resources = [];
    const topResource = mapResourceForChat(response.top_recommendation);
    if (topResource) {
      resources.push(topResource);
    }
    if (response.other_recommendations && response.other_recommendations.length > 0) {
      response.other_recommendations.forEach(rec => {
        const mapped = mapResourceForChat(rec);
        if (mapped) resources.push(mapped);
      });
    }

    messages.value[aiMessageIndex] = {
      role: 'assistant',
      content: response.learning_advice || '我来为您推荐一些优质的学习资源：',
      timestamp: new Date().toISOString(),
      resources
    };

    // 关闭聊天窗口，跳转到主页
    setTimeout(() => {
      closeChatWindow();
      // 跳转到主页并传递搜索结果
      router.push({
        path: '/',
        query: { 
          search: message,
          results: JSON.stringify({
            topRecommendation: response.top_recommendation,
            otherRecommendations: response.other_recommendations,
            learningAdvice: response.learning_advice
          })
        }
      });
    }, 2000); // 延迟2秒让用户看到结果

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

// 全局事件处理函数定义在组件顶层作用域
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

// 组件挂载时添加全局拖拽事件监听
onMounted(() => {
  document.addEventListener('mousemove', handleGlobalMouseMove);
  document.addEventListener('mouseup', handleGlobalMouseUp);
  document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
  document.addEventListener('touchend', handleGlobalTouchEnd);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove);
  document.removeEventListener('mouseup', handleGlobalMouseUp);
  document.removeEventListener('touchmove', handleGlobalTouchMove);
  document.removeEventListener('touchend', handleGlobalTouchEnd);
});
</script>

<template>
  <!-- 全局悬浮球AI助手 -->
  <div 
    class="fixed z-50"
    :style="{
      left: ballPosition.x ? ballPosition.x + 'px' : '1rem',
      top: ballPosition.y ? ballPosition.y + 'px' : '1rem'
    }"
  >
    <!-- 悬浮球 - 始终存在，通过样式调整显示效果 -->
    <div 
      @mousedown="handleDragStart"
      @touchstart="handleDragStart"
      @click.stop="handleBallClick"
      class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative select-none"
      :class="{ 
        'cursor-grabbing scale-110': isDragging,
        'cursor-grab': !isDragging,
        'animate-pulse hover:animate-none': !isDragging && !showChatWindow,
        'ring-4 ring-indigo-200 ring-opacity-60': showChatWindow,
        'absolute': showChatWindow,
        '-left-16': showChatWindow,
        '-top-1': showChatWindow
      }"
      :style="showChatWindow ? 'transform: translate(0, 0); z-index: 51;' : 'transform: translate(0, 0);'"
    >
      <Bot class="w-8 h-8 text-white" />
      <!-- 提示气泡 -->
      <div class="absolute -top-8 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div class="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          {{ isDragging ? '拖拽中...' : (showChatWindow ? '点击关闭聊天窗口' : '点击打开聊天窗口或拖拽') }}
        </div>
        <!-- 小箭头 -->
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <transition name="chat-window">
      <div 
        v-if="showChatWindow" 
        class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 h-[500px] flex flex-col relative ml-6"
      >
        <!-- 窗口头部 - 可拖拽区域 -->
        <div 
          @mousedown="handleDragStart"
          @touchstart="handleDragStart"
          class="px-4 py-3 bg-slate-50 border-b border-slate-200 rounded-t-2xl flex items-center gap-2 cursor-grab active:cursor-grabbing select-none"
        >
          <!-- 聊天窗口内的悬浮球图标 -->
          <div 
            :class="{ 
              'scale-110': isDragging,
              'animate-pulse hover:animate-none': !isDragging
            }"
            class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300"
          >
            <Bot class="w-4 h-4" />
          </div>
          <span class="font-semibold text-slate-700 flex-1">AI学习助手</span>
          <div class="ml-auto flex gap-2">
            <button 
              @click="closeChatWindow"
              @mousedown.stop
              @touchstart.stop
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
                          <div class="text-xs text-indigo-600 font-medium">
                            正在跳转到主页展示完整推荐...
                          </div>
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
                <Bot class="w-4 h-4" />
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
</template>

<style scoped>
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

/* 聊天窗口动画 */
.chat-window-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.chat-window-leave-active {
  transition: all 0.35s cubic-bezier(0.55, -0.35, 0.265, 1.35);
}
.chat-window-enter-from {
  opacity: 0;
  transform: scale(0.3) translateY(30px);
}
.chat-window-leave-to {
  opacity: 0;
  transform: scale(0.2) translateY(10px);
}
</style>