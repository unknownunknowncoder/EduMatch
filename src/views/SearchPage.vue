<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans selection:bg-[#1a3c34] selection:text-[#e8e4d9] pb-24">
    
    <!-- 1. Top Banner (修复版：档案馆长廊) -->
    <!-- 增加 bg-[#1a3c34] 作为图片加载失败时的底色 -->
    <div class="h-64 relative w-full border-b-4 border-[#1a3c34] bg-[#1a3c34]">
      <!-- 更换为更稳定的图片源：古典图书馆长廊 -->
      <img 
        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop" 
        class="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%] opacity-80"
        alt="Library Archive Hall"
      />
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/95 via-[#1a3c34]/30 to-transparent"></div>
      
      <!-- Back Navigation -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#1a3c34] hover:border-[#d4c5a3] transition-all rounded-sm text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Return
        </button>
      </div>

      <!-- Title -->
      <div class="absolute bottom-8 left-0 w-full p-8 z-10">
        <div class="max-w-7xl mx-auto flex items-end justify-between">
           <div>
              <h2 class="text-[#d4c5a3] text-xs font-bold uppercase tracking-[0.3em] mb-2">Query Results</h2>
              <h1 class="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide shadow-black drop-shadow-md">
                 Research Findings
              </h1>
              <p class="text-white/60 font-serif italic mt-2">Curated by AI Archivist</p>
           </div>
        </div>
      </div>
    </div>

    <!-- 2. Main Content -->
    <div class="max-w-7xl mx-auto px-6 -mt-16 relative z-10 space-y-10">
      
      <!-- 搜索结果展示 -->
      <div v-if="normalizedResults" class="space-y-10">
        
        <!-- A. 重点推荐 (The Primary Dossier) -->
        <div v-if="normalizedResults.topRecommendation && (!normalizedResults.topRecommendation.id || !normalizedResults.topRecommendation.id.startsWith('fallback'))" class="animate-fade-in-up">
          <div class="flex items-center gap-3 mb-4 text-[#d4c5a3]">
             <Sparkles class="w-5 h-5" />
             <span class="text-xs font-bold uppercase tracking-widest">首选推荐</span>
          </div>
          
          <div class="bg-white shadow-2xl border-t-8 border-[#1a3c34] p-8 md:p-10 relative overflow-hidden rounded-sm">
             <!-- Watermark -->
             <Award class="absolute -right-10 -bottom-10 w-64 h-64 text-[#1a3c34]/5 -z-0 pointer-events-none rotate-12" />

             <div class="relative z-10 flex flex-col md:flex-row gap-8">
                <!-- Rank/Score Badge -->
                <div class="flex-shrink-0 flex flex-col items-start md:ml-0">
                   <div class="w-24 h-24 border-4 border-[#1a3c34]/10 rounded-full flex flex-col items-center justify-center bg-[#f9f9f7] relative text-center">
                      <div class="text-lg font-serif font-bold text-[#1a3c34] leading-tight">匹配度:</div>
                      <div class="text-xl font-serif font-bold text-[#1a3c34]">{{ Math.round(((normalizedResults?.topRecommendation?.matchScore) || 0.9) * 100) }}%</div>
                      <div class="text-[9px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mt-1">匹配</div>
                   </div>
                </div>

                <div class="flex-1 md:ml-8">
                   <div class="flex flex-wrap items-center gap-3 mb-3">
                      <span class="px-2 py-1 bg-[#1a3c34] text-[#d4c5a3] text-[10px] font-bold uppercase tracking-wider rounded-sm">首选</span>
                      <span class="px-2 py-1 border border-[#1a3c34]/20 text-[#1a3c34] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                         {{ getPlatformDisplayName(normalizedResults?.topRecommendation?.platform) }}
                      </span>
                   </div>
                   
                   <h2 class="text-3xl font-serif font-bold text-[#1a3c34] mb-4 leading-tight">
                      {{ normalizedResults?.topRecommendation?.name || '推荐学习资源' }}
                   </h2>
                   
                   <p class="text-[#1a3c34]/70 font-serif text-lg leading-relaxed mb-6">
                      {{ normalizedResults?.topRecommendation?.reason || 'AI智能推荐的学习资源' }}
                   </p>

                   <!-- Meta Grid -->
                   <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-[#1a3c34]/10 mb-6">
                      <div>
                         <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">等级</div>
                         <div class="font-serif font-bold text-[#1a3c34]">{{ normalizedResults?.topRecommendation?.difficulty || '入门' }}</div>
                      </div>
                      <div>
                         <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">时长</div>
                         <div class="font-serif font-bold text-[#1a3c34]">{{ normalizedResults?.topRecommendation?.duration || '未知' }}</div>
                      </div>
                      <div v-if="normalizedResults?.topRecommendation?.bv_number">
                         <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">编号</div>
                         <div class="font-mono text-sm text-[#1a3c34]">{{ normalizedResults?.topRecommendation?.bv_number }}</div>
                      </div>
                      <div v-else-if="normalizedResults?.topRecommendation?.access_guide">
                         <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">访问</div>
                         <div class="font-mono text-xs text-[#1a3c34] truncate">{{ normalizedResults.topRecommendation.access_guide }}</div>
                      </div>
                      <div>
                         <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">影响</div>
                         <div class="font-serif font-bold text-[#1a3c34]">{{ normalizedResults?.topRecommendation?.study_data || '暂无' }}</div>
                      </div>
                   </div>

                   <!-- AI Reason Box -->
                   <div class="bg-[#f9f9f7] border-l-4 border-[#d4c5a3] p-4 mb-8 italic font-serif text-[#1a3c34]/80 text-sm">
                      <span class="not-italic font-bold text-[#1a3c34] mr-2 text-xs uppercase tracking-wide">分析:</span>
                      {{ normalizedResults?.topRecommendation?.reason || 'AI智能推荐的学习资源' }}
                   </div>

                   <div class="flex justify-start">
                      <button 
                         @click="openResource({
                           url: normalizedResults?.topRecommendation?.watch_url || 
                               (normalizedResults?.topRecommendation?.bv_number ? `https://www.bilibili.com/video/${normalizedResults.topRecommendation.bv_number}` : 
                                normalizedResults?.topRecommendation?.access_guide ? `https://www.google.com/search?q=${encodeURIComponent(normalizedResults.topRecommendation.access_guide)}` : undefined)
                         })"
                         class="px-8 py-3 bg-[#1a3c34] text-[#d4c5a3] font-bold uppercase tracking-widest text-xs hover:bg-[#235246] transition-all shadow-lg flex items-center gap-2"
                      >
                         访问资源 <ExternalLink class="w-3 h-3" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- B. 学习建议 (Curator's Note) -->
        <div v-if="normalizedResults?.learningAdvice" class="bg-[#fffdf5] border border-[#d4c5a3] p-6 shadow-sm relative mx-auto max-w-4xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
           <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#d4c5a3]/30 -z-10 rotate-2"></div>
           <div class="flex items-start gap-4">
              <div class="p-2 bg-[#d4c5a3]/20 rounded-full text-[#8c734b]">
                 <Lightbulb class="w-6 h-6" />
              </div>
              <div>
                 <h3 class="text-xs font-bold text-[#8c734b] uppercase tracking-widest mb-2">Curator's Strategy Note</h3>
                 <p class="text-[#1a3c34] font-serif leading-relaxed italic text-lg">
                    "{{ normalizedResults.learningAdvice }}"
                 </p>
              </div>
           </div>
        </div>

        <!-- C. 其他推荐 (Index Cards) -->
        <div v-if="normalizedResults?.otherRecommendations && normalizedResults.otherRecommendations.length > 0">
           <div class="flex items-center justify-between mb-6 border-b border-[#1a3c34]/10 pb-2">
              <h3 class="text-xl font-serif font-bold text-[#1a3c34]">相关参考文献</h3>
              <span class="text-xs font-mono text-[#1a3c34]/40">文献数量: {{ normalizedResults.otherRecommendations.length }}</span>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                 v-for="(resource, index) in normalizedResults.otherRecommendations" 
                 :key="resource.id || index"
                 class="group bg-white p-6 border border-[#1a3c34]/10 shadow-sm hover:shadow-lg hover:border-[#1a3c34]/30 transition-all cursor-pointer relative overflow-hidden"
                 @click="openResource({
                   url: resource.watch_url || 
                       (resource.bv_number ? `https://www.bilibili.com/video/${resource.bv_number}` : 
                        resource.access_guide ? `https://www.google.com/search?q=${encodeURIComponent(resource.access_guide)}` : undefined)
                 })"
              >
                 <!-- Left color bar -->
                 <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3] group-hover:bg-[#1a3c34] transition-colors"></div>

                 <div class="flex justify-between items-start mb-3">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-[#1a3c34]/50 border border-[#1a3c34]/10 px-2 py-0.5 rounded-sm">
                       {{ getPlatformDisplayName(resource.platform) }}
                    </span>
                    <ExternalLink class="w-4 h-4 text-[#1a3c34]/20 group-hover:text-[#1a3c34] transition-colors" />
                 </div>

                 <h4 class="font-serif font-bold text-lg text-[#1a3c34] mb-2 line-clamp-2 group-hover:text-[#b49b67] transition-colors leading-tight">
                    {{ resource.name || '学习资源' }}
                 </h4>
                 
                 <p class="text-[#1a3c34]/60 text-xs font-serif line-clamp-3 mb-4 leading-relaxed">
                    {{ resource.reason || 'AI推荐的学习资源' }}
                 </p>

                 <div class="pt-3 border-t border-[#1a3c34]/5 space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-mono text-[#1a3c34]/40 uppercase">
                       <span>{{ resource.difficulty || '入门' }} • {{ resource.duration || '未知' }} • {{ resource.study_data || '暂无数据' }}</span>
                       <span v-if="resource.bv_number">编号: {{ resource.bv_number }}</span>
                    </div>
                    <div v-if="resource.access_guide" class="text-[9px] text-[#1a3c34]/60 font-mono bg-[#f9f9f7] p-2 rounded border border-[#1a3c34]/10">
                       <span class="font-bold">访问指引:</span> {{ resource.access_guide }}
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <!-- 3. Initial State / Empty Search (Library Guide) -->
      <div v-else-if="!hasSearched" class="py-16">
        
        <!-- Welcome Message -->
        <div class="text-center mb-16">
           <div class="w-20 h-20 bg-[#1a3c34] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-[#d4c5a3]">
              <Sparkles class="h-10 w-10 text-[#d4c5a3]" />
           </div>
           <h2 class="text-3xl font-serif font-bold text-[#1a3c34] mb-4">AI 研究助理</h2>
           <p class="text-[#1a3c34]/60 font-serif italic max-w-xl mx-auto text-lg">
              "启动与档案库的对话。请说明您的需求，系统将检索最相关的知识资料。"
           </p>
        </div>

        <!-- Guide Steps -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div class="bg-white p-6 border border-[#1a3c34]/10 shadow-sm relative group hover:border-[#d4c5a3] transition-colors">
              <div class="text-4xl font-serif font-bold text-[#1a3c34]/10 absolute top-4 right-4 group-hover:text-[#d4c5a3]/20">01</div>
              <div class="mb-4 text-[#1a3c34]"><Bot class="w-8 h-8" /></div>
              <h3 class="font-bold text-[#1a3c34] text-sm uppercase tracking-widest mb-2">Activate</h3>
              <p class="text-xs text-[#1a3c34]/60 font-serif">点击悬浮徽标唤醒AI助理。</p>
           </div>
           <div class="bg-white p-6 border border-[#1a3c34]/10 shadow-sm relative group hover:border-[#d4c5a3] transition-colors">
              <div class="text-4xl font-serif font-bold text-[#1a3c34]/10 absolute top-4 right-4 group-hover:text-[#d4c5a3]/20">02</div>
              <div class="mb-4 text-[#1a3c34]"><MessageSquare class="w-8 h-8" /></div>
              <h3 class="font-bold text-[#1a3c34] text-sm uppercase tracking-widest mb-2">咨询</h3>
              <p class="text-xs text-[#1a3c34]/60 font-serif">描述您的学习目标或研究主题。</p>
           </div>
           <div class="bg-white p-6 border border-[#1a3c34]/10 shadow-sm relative group hover:border-[#d4c5a3] transition-colors">
              <div class="text-4xl font-serif font-bold text-[#1a3c34]/10 absolute top-4 right-4 group-hover:text-[#d4c5a3]/20">03</div>
              <div class="mb-4 text-[#1a3c34]"><Sparkles class="w-8 h-8" /></div>
              <h3 class="font-bold text-[#1a3c34] text-sm uppercase tracking-widest mb-2">分析</h3>
              <p class="text-xs text-[#1a3c34]/60 font-serif">AI筛选档案以找到最佳匹配。</p>
           </div>
           <div class="bg-white p-6 border border-[#1a3c34]/10 shadow-sm relative group hover:border-[#d4c5a3] transition-colors">
              <div class="text-4xl font-serif font-bold text-[#1a3c34]/10 absolute top-4 right-4 group-hover:text-[#d4c5a3]/20">04</div>
              <div class="mb-4 text-[#1a3c34]"><BookOpen class="w-8 h-8" /></div>
              <h3 class="font-bold text-[#1a3c34] text-sm uppercase tracking-widest mb-2">学习</h3>
              <p class="text-xs text-[#1a3c34]/60 font-serif">访问资源并开始您的学习之旅。</p>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, Sparkles, Lightbulb, BookOpen, Search, 
  ExternalLink, Bookmark, Award, Bot, MessageSquare 
} from 'lucide-vue-next'
import { showToast } from '@/utils/message'

const router = useRouter()

// 响应式数据
const hasSearched = ref(false)
const searchResults = ref<any | null>(null)

// 从sessionStorage恢复状态
const restoreFromStorage = () => {
  try {
    const stored = sessionStorage.getItem('searchResults')
    const searched = sessionStorage.getItem('hasSearched')
    
    if (stored && searched === 'true') {
      searchResults.value = JSON.parse(stored)
      hasSearched.value = true
      return true
    }
  } catch (error) {
    console.error('Failed to restore from storage:', error)
  }
  return false
}

// 保存状态到sessionStorage
const saveToStorage = (results: any) => {
  try {
    sessionStorage.setItem('searchResults', JSON.stringify(results))
    sessionStorage.setItem('hasSearched', 'true')
  } catch (error) {
    console.error('Failed to save to storage:', error)
  }
}

// 清除存储的状态
const clearStorage = () => {
  try {
    sessionStorage.removeItem('searchResults')
    sessionStorage.removeItem('hasSearched')
  } catch (error) {
    console.error('Failed to clear storage:', error)
  }
}

// 计算属性：统一数据格式
const normalizedResults = computed(() => {
  if (!searchResults.value) return null
  
  try {
    // 如果已经是转换后的格式（英文键名）
    if (searchResults.value.topRecommendation || searchResults.value.otherRecommendations || searchResults.value.learningAdvice) {
      return {
        topRecommendation: searchResults.value.topRecommendation || {},
        otherRecommendations: searchResults.value.otherRecommendations || [],
        learningAdvice: searchResults.value.learningAdvice
      }
    }
    
    // 如果是原始API格式（中文键名），进行转换
    return {
      topRecommendation: searchResults.value.top_recommendation || {},
      otherRecommendations: searchResults.value.other_recommendations || [],
      learningAdvice: searchResults.value.learning_advice
    }
  } catch (error) {
    console.error('Error normalizing results:', error)
    return null
  }
})

const goBack = () => {
  router.back()
}

const openResource = (resource: any) => {
  if (resource.url) {
    window.open(resource.url, '_blank')
  }
}

const saveToFavorites = (resource: any) => {
  // 这里可以接入真实的收藏逻辑
  showToast('Resource archived to personal collection.', 'success')
  console.log('Archiving:', resource)
}

const getPlatformDisplayName = (platform: string): string => {
  const platformMap: { [key: string]: string } = {
    '中国大学MOOC官网': '大学MOOC',
    'B站': 'B站',
    'Bilibili': 'B站',
    'Coursera': 'Coursera',
    'edX': 'edX',
    '学堂在线': '学堂在线'
  }
  return platformMap[platform] || platform
}

const clearSearch = () => {
  hasSearched.value = false
  searchResults.value = null
  clearStorage()
  router.replace({ query: {} })
}

const showPopularSearches = () => {
  showToast('Feature coming soon.', 'info')
}

// 处理搜索结果的函数
const handleSearchResults = () => {
  const resultsFromChat = router.currentRoute.value.query.results as string
  
  if (resultsFromChat) {
    hasSearched.value = true
    
    try {
      const results = JSON.parse(resultsFromChat)
      
      // 直接使用传递过来的转换后数据
      searchResults.value = results
      // 保存到sessionStorage
      saveToStorage(results)
    } catch (error) {
      console.error('Failed to parse archives:', error)
      searchResults.value = null
    }
  } else if (!hasSearched.value && !searchResults.value) {
    // 如果没有新的搜索结果，尝试从存储中恢复
    restoreFromStorage()
  }
}

// 生命周期
onMounted(() => {
  // 首先尝试从存储中恢复状态
  const restored = restoreFromStorage()
  
  // 然后检查是否有新的搜索结果（这会覆盖存储的状态）
  handleSearchResults()
})

// 监听路由变化
const route = useRoute()

watch(() => route.query.results, () => {
  handleSearchResults()
}, { immediate: false })
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>