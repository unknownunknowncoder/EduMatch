<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  BarChart3, Calendar, Users, Target, 
  Globe, ArrowRight, BookOpen
} from 'lucide-vue-next';
import { useDatabaseStore } from '@/stores/database';
import { showToast, showMessage, messageText, messageType, getMessageClasses, getMessageIcon } from '@/utils/message';

// --- 核心逻辑 (100% 保留) ---
const dbStore = useDatabaseStore();
const route = useRoute();
const router = useRouter();
const currentUser = ref<any>(null);
const hasSearched = ref(false);
const isLoading = ref(false);
const searchResults = ref<any | null>(null);

// --- 动画控制系统 (重构版) ---
const featuresSectionRef = ref<HTMLElement | null>(null);
const areCardsVisible = ref(false); // 控制卡片是否开始播放动画

// --- 用户状态检查 ---
const checkUserStatus = () => { const userData = localStorage.getItem('currentUser'); if (userData) { try { currentUser.value = JSON.parse(userData); } catch (e) { localStorage.removeItem('currentUser'); currentUser.value = null; } } };

const handleSearchResults = () => {
  const resultsParam = route.query.results as string;
  const searchQueryFromRoute = route.query.search as string;
  if (resultsParam) {
    try {
      const results = JSON.parse(resultsParam);
      searchResults.value = {
        topRecommendation: normalizeRecommendation(results.topRecommendation),
        otherRecommendations: results.otherRecommendations?.map(normalizeRecommendation).filter(Boolean) || [],
        learningAdvice: results.learningAdvice
      };
      hasSearched.value = true;
      router.replace({ path: '/', query: {} });
      if (searchQueryFromRoute) showToast(`已为您找到"${searchQueryFromRoute}"的学习资源`, 'success');
    } catch (error) { console.error('Error', error); showToast('加载搜索结果失败', 'error'); }
  }
};

const formatDuration = (d: string) => d; 
const normalizeRecommendation = (rec: any) => {
  if (!rec) return null;
  let url = rec?.url || rec?.bv_number || rec?.['B站BV号'] || '';
  if (url && !url.startsWith('http')) { url = url.startsWith('BV') ? `https://www.bilibili.com/video/${url}` : url; }
  return {
    title: rec?.name || rec?.['名称'] || '推荐资源',
    description: rec?.reason || rec?.brief_description || '推荐学习资源',
    platform: rec?.platform || 'B站',
    difficulty: rec?.difficulty || '入门',
    duration: formatDuration(rec?.duration || ''),
    url,
    stats: rec?.study_data,
    accessGuide: rec?.access_guide
  };
};



// --- 生命周期 ---
onMounted(() => {
  checkUserStatus();
  handleSearchResults();

  // 视差滚动 & 动画触发器
  // 我们监听 "功能区容器" 是否进入屏幕，一旦进入，就将 areCardsVisible 设为 true
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        areCardsVisible.value = true;
        observer.disconnect(); // 触发一次后就不再监听了
      }
    });
  }, { threshold: 0.15 }); // 露出 15% 时触发

  if (featuresSectionRef.value) {
    observer.observe(featuresSectionRef.value);
  }
});
</script>

<template>
  <!-- 
    ROOT: 使用 CSS Perspective 实现真·视差 
    注意：h-screen + overflow-y-auto 是必须的，这样 .parallax-group 才能工作
  -->
  <div class="h-screen overflow-y-auto overflow-x-hidden perspective-container bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3]">
    


    <!-- 
      视差组 1: Hero Section 
      transform-style: preserve-3d 是核心
    -->
    <div v-if="!hasSearched" class="relative h-[calc(100vh-5rem)] min-h-[800px] flex items-center justify-center preserve-3d -mt-20">
      
      <!-- 背景层 (Parallax Layer: Deep) - 移动速度慢 -->
      <div class="absolute inset-0 parallax-layer-back z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop" 
          class="w-full h-full object-cover brightness-[0.4] grayscale-[30%]"
          alt="Library Background"
        />
        <!-- 纹理遮罩 -->
        <div class="absolute inset-0 bg-[#0f281f]/60 mix-blend-multiply"></div>
      </div>

      <!-- 内容层 (Parallax Layer: Base) - 移动速度正常 -->
      <div class="relative z-10 text-center px-6 parallax-layer-base">
         <div class="animate-fade-in-up">
            <span class="inline-block py-1 px-4 border border-[#d4c5a3]/30 text-[#d4c5a3] text-xs font-serif tracking-[0.2em] uppercase mb-6 rounded-full bg-[#0f281f]/50 backdrop-blur-sm">
               成立于 2024 年
            </span>
            <h1 class="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-[#f4f1ea] tracking-tight leading-[0.9] mb-8 text-shadow-lg">
               知识 <br />
               <span class="text-[#d4c5a3] italic">建筑师</span>
            </h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10 font-serif">
               不要让信息淹没智慧。<br/>
               AI 驱动的沉浸式学习平台，为您重塑知识边界。
            </p>
            <button @click="router.push('/search')" class="group relative px-10 py-5 bg-[#d4c5a3] text-[#0f281f] font-bold text-lg tracking-wide hover:bg-white transition-all overflow-hidden shadow-2xl rounded-sm">
               <span class="relative z-10 flex items-center gap-2">开始探索 <ArrowRight class="w-5 h-5"/></span>
            </button>
         </div>
      </div>
    </div>

    <!-- 
      视差组 2: Content Section (Paper Background)
      z-index 提升，覆盖在 Hero 之上
    -->
    <div v-if="!hasSearched" class="relative z-20 bg-[#f4f1ea] text-[#1a202c]">
       
       <!-- 过渡装饰 -->
       <div class="absolute -top-24 left-0 w-full h-24 bg-gradient-to-t from-[#f4f1ea] to-transparent"></div>

       <!-- 核心功能区 -->
       <section ref="featuresSectionRef" class="max-w-7xl mx-auto px-6 py-32">
          
          <div class="text-center mb-24 opacity-0 transition-opacity duration-1000" :class="{ 'opacity-100': areCardsVisible }">
             <h2 class="text-4xl md:text-5xl font-serif font-bold text-[#0f281f] mb-4">课程体系</h2>
             <div class="w-24 h-1 bg-[#d4c5a3] mx-auto"></div>
             <p class="mt-6 text-slate-600 max-w-xl mx-auto">就像一座精密的图书馆，我们为您分门别类，<br/>构建最适合您的知识殿堂。</p>
          </div>

          <!-- 
            Bento Grid with Staggered Animations 
            注意：class 'translate-y-20 opacity-0' 是初始状态
            class 'translate-y-0 opacity-100' 是激活状态
          -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             <!-- Card 1: AI Match (Big) -->
             <div class="md:col-span-2 relative group h-[400px] overflow-hidden bg-white shadow-xl transition-all duration-1000 ease-out transform translate-y-20 opacity-0 border border-[#e2e8f0]"
                  :class="{ '!translate-y-0 !opacity-100': areCardsVisible }"
                  style="transition-delay: 0ms">
                <div class="absolute inset-0">
                   <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.2]" />
                   <div class="absolute inset-0 bg-gradient-to-t from-[#0f281f] via-transparent to-transparent opacity-90"></div>
                </div>
                <div class="relative z-10 p-10 h-full flex flex-col justify-end">
                   <div class="w-12 h-12 bg-[#d4c5a3] flex items-center justify-center text-[#0f281f] mb-4 shadow-lg">
                      <Target class="w-6 h-6" />
                   </div>
                   <h3 class="text-3xl font-serif font-bold text-[#f4f1ea] mb-2">AI 神经匹配</h3>
                   <p class="text-white/80 max-w-md font-light">这不是简单的搜索。我们的神经网络深度解析您的认知模式，为您筛选 B站/MOOC 中最纯粹的 1% 知识晶体。</p>
                </div>
             </div>

             <!-- Card 2: Resources -->
             <div class="relative group h-[400px] overflow-hidden bg-[#0f281f] shadow-xl transition-all duration-1000 ease-out transform translate-y-20 opacity-0"
                  :class="{ '!translate-y-0 !opacity-100': areCardsVisible }"
                  style="transition-delay: 200ms">
                <div class="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                   <!-- 抽象线条图 -->
                   <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale" />
                </div>
                <div class="relative z-10 p-8 h-full flex flex-col">
                   <Globe class="w-8 h-8 text-[#d4c5a3] mb-auto" />
                   <div>
                      <h3 class="text-2xl font-serif font-bold text-[#f4f1ea] mb-2">全球索引</h3>
                      <p class="text-white/70 text-sm">打破信息孤岛。全球优质教育资源索引库。</p>
                   </div>
                </div>
             </div>

             <!-- Card 3: Planning -->
             <div class="relative group h-[350px] overflow-hidden bg-white shadow-xl border border-[#e2e8f0] transition-all duration-1000 ease-out transform translate-y-20 opacity-0"
                  :class="{ '!translate-y-0 !opacity-100': areCardsVisible }"
                  style="transition-delay: 300ms">
                <div class="absolute inset-0">
                   <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                   <div class="absolute inset-0 bg-[#0f281f]/80 mix-blend-multiply"></div>
                </div>
                <div class="relative z-10 p-8 h-full flex flex-col">
                   <BarChart3 class="w-8 h-8 text-[#d4c5a3] mb-auto" />
                   <div>
                      <h3 class="text-2xl font-serif font-bold text-[#f4f1ea] mb-2">学习策略</h3>
                      <p class="text-white/70 text-sm">基于艾宾浩斯遗忘曲线的复习策略生成。</p>
                   </div>
                </div>
             </div>

             <!-- Card 4: Plan -->
             <div class="relative group h-[350px] overflow-hidden bg-[#d4c5a3] shadow-xl transition-all duration-1000 ease-out transform translate-y-20 opacity-0"
                  :class="{ '!translate-y-0 !opacity-100': areCardsVisible }"
                  style="transition-delay: 450ms">
                <div class="absolute inset-0 flex items-center justify-center opacity-10">
                   <Calendar class="w-48 h-48 text-[#0f281f]" />
                </div>
                <div class="relative z-10 p-8 h-full flex flex-col justify-between">
                   <Calendar class="w-8 h-8 text-[#0f281f]" />
                   <div>
                      <h3 class="text-2xl font-serif font-bold text-[#0f281f] mb-2">学习计划</h3>
                      <p class="text-[#0f281f]/70 text-sm font-medium">可视化追踪。让坚持变得肉眼可见。</p>
                   </div>
                </div>
             </div>

             <!-- Card 5: Community -->
             <div class="relative group h-[350px] overflow-hidden bg-white shadow-xl border border-[#e2e8f0] transition-all duration-1000 ease-out transform translate-y-20 opacity-0"
                  :class="{ '!translate-y-0 !opacity-100': areCardsVisible }"
                  style="transition-delay: 600ms">
                <div class="absolute inset-0">
                   <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[0.5]" />
                   <div class="absolute inset-0 bg-[#0f281f]/70 mix-blend-hard-light"></div>
                </div>
                <div class="relative z-10 p-8 h-full flex flex-col">
                   <Users class="w-8 h-8 text-white mb-auto" />
                   <div>
                      <h3 class="text-2xl font-serif font-bold text-white mb-2">社区协作</h3>
                      <p class="text-white/80 text-sm">在智识的社区中寻找共鸣。</p>
                   </div>
                </div>
             </div>

          </div>
       </section>

       <!-- Footer Area -->
       <footer class="bg-[#0f281f] text-[#f4f1ea] py-20 px-6 text-center">
          <BookOpen class="w-12 h-12 mx-auto mb-6 text-[#d4c5a3]" />
          <h2 class="text-3xl font-serif font-bold mb-4">准备好构建您的智慧了吗？</h2>

          <div class="mt-12 text-white/30 text-sm font-serif">© 2025 学识库平台。保留所有权利。</div>
       </footer>

    </div>

    <!-- 搜索结果页 (覆盖式) -->
    <div v-if="hasSearched" class="absolute inset-0 z-50 bg-[#f4f1ea] overflow-y-auto min-h-screen pt-24 px-6">
        <div class="max-w-5xl mx-auto space-y-12 pb-20">
            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <div class="w-16 h-16 border-4 border-[#d4c5a3] border-t-[#0f281f] rounded-full animate-spin"></div>
                <p class="text-[#0f281f] mt-6 font-serif tracking-widest">查询档案中...</p>
            </div>

            <template v-else>
               <!-- Header -->
               <div class="flex items-center justify-between border-b border-[#0f281f]/10 pb-6">
                  <h2 class="text-3xl font-serif font-bold text-[#0f281f]">搜索结果</h2>
                  <button @click="hasSearched = false" class="text-sm text-slate-500 hover:text-[#0f281f]">关闭 X</button>
               </div>

               <!-- AI Advice (Note Style) -->
               <div v-if="searchResults?.learningAdvice" class="bg-[#fffdf5] border-l-4 border-[#d4c5a3] p-8 shadow-sm">
                  <h3 class="text-[#0f281f] font-bold uppercase tracking-wider mb-4 text-xs">策展人笔记</h3>
                  <p class="text-lg text-slate-700 font-serif leading-relaxed italic">"{{ searchResults.learningAdvice }}"</p>
               </div>

               <!-- Top Pick -->
               <div v-if="searchResults?.topRecommendation" class="bg-[#0f281f] text-[#f4f1ea] p-10 flex flex-col md:flex-row gap-10 shadow-2xl">
                  <div class="flex-1 space-y-4">
                     <div class="text-[#d4c5a3] text-xs font-bold uppercase tracking-widest">主要资源</div>
                     <h3 class="text-4xl font-serif font-bold leading-tight">{{ searchResults.topRecommendation.title }}</h3>
                     <p class="text-white/70 leading-relaxed font-light">{{ searchResults.topRecommendation.description }}</p>
                     <div class="pt-4 flex gap-4 text-xs font-mono text-[#d4c5a3]">
                        <span>{{ searchResults.topRecommendation.platform }}</span>
                        <span>{{ searchResults.topRecommendation.duration }}</span>
                     </div>
                  </div>
                  <div class="flex items-end">
                     <a :href="searchResults.topRecommendation.url" target="_blank" class="px-8 py-4 bg-[#d4c5a3] text-[#0f281f] font-bold hover:bg-white transition-colors">访问</a>
                  </div>
               </div>

               <!-- List -->
               <div class="grid gap-4">
                  <div v-for="(item, idx) in searchResults.otherRecommendations" :key="idx" 
                       class="group bg-white border border-[#e2e8f0] p-6 hover:border-[#0f281f] transition-colors flex justify-between items-center cursor-pointer">
                     <div>
                        <div class="text-xs text-slate-400 font-mono mb-1">REF 0{{ idx + 2 }}</div>
                        <h4 class="text-xl font-serif font-bold text-[#0f281f] group-hover:text-[#b49b67] transition-colors">{{ item.title }}</h4>
                        <p class="text-sm text-slate-500 mt-1 line-clamp-1">{{ item.description }}</p>
                     </div>
                     <a :href="item.url" target="_blank" class="w-10 h-10 flex items-center justify-center border border-[#e2e8f0] group-hover:bg-[#0f281f] group-hover:text-white transition-all">
                        <ArrowRight class="w-4 h-4" />
                     </a>
                  </div>
               </div>
            </template>
        </div>
    </div>


    
    <!-- Toast -->
    <div v-if="showMessage" :class="getMessageClasses(messageType)">
      <span v-html="getMessageIcon(messageType)"></span>
      <span>{{ messageText }}</span>
    </div>

  </div>
</template>

<style scoped>
/* 
  CSS 3D Parallax Magic 
  这是实现真正的“速度差”的关键。
*/
.perspective-container {
  perspective: 1px; /* 开启 3D 视角 */
  transform-style: preserve-3d;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.parallax-layer-back {
  /* 
    Z轴推远到 -1px，然后放大 2 倍来填满屏幕
    这样滚动时，它的移动速度只有前景的 50%
  */
  transform: translateZ(-1px) scale(2);
  z-index: -1;
}

.parallax-layer-base {
  /* 前景层，正常速度 */
  transform: translateZ(0);
}

/* 文本阴影增强 */
.text-shadow-lg {
  text-shadow: 0 4px 10px rgba(0,0,0,0.8);
}

/* 简单的淡入动效 */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
}

/* Fade Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>