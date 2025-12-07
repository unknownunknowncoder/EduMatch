<template>
  <div class="min-h-screen bg-[#f4f1ea] font-sans selection:bg-[#0f281f] selection:text-[#d4c5a3] pb-20">
    
    <!-- 返回按钮 (Sticky) -->
    <div class="sticky top-0 z-30 bg-[#f4f1ea]/90 backdrop-blur-sm border-b border-[#0f281f]/5 px-6 py-4">
      <div class="max-w-5xl mx-auto">
        <button 
          @click="$router.back()"
          class="group flex items-center text-[#0f281f]/60 hover:text-[#0f281f] transition-colors font-serif italic"
        >
          <ArrowLeft class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回档案库
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="!resource" class="flex flex-col items-center justify-center py-32 space-y-6">
       <div class="w-16 h-16 border-4 border-[#d4c5a3] border-t-[#0f281f] rounded-full animate-spin"></div>
       <p class="text-[#0f281f] font-serif tracking-widest uppercase">正在调取档案...</p>
    </div>

    <!-- 资源详情 (档案卡片) -->
    <div v-else class="max-w-5xl mx-auto px-4 mt-8">
      
      <!-- 卡片容器：模仿文件夹样式 -->
      <div class="bg-white shadow-xl relative overflow-hidden rounded-sm border border-[#0f281f]/10">
        <!-- 顶部装饰条 -->
        <div class="h-2 bg-[#0f281f] w-full"></div>
        
        <!-- 背景水印 -->
        <FileText class="absolute -right-20 top-20 w-96 h-96 text-[#f4f1ea] -z-0 pointer-events-none opacity-50 rotate-12" />

        <div class="p-8 md:p-12 relative z-10">
          
          <!-- 1. 档案头部 (Header) -->
          <div class="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-[#0f281f] pb-8 mb-8">
             <div class="space-y-4 max-w-2xl">
                <!-- 类型标签 -->
                <div class="flex items-center gap-3">
                   <span class="px-3 py-1 bg-[#0f281f] text-[#d4c5a3] text-xs font-bold uppercase tracking-widest rounded-sm">
                      {{ formatType(resource.type) }}
                   </span>
                   <span class="text-[#0f281f]/50 font-mono text-xs uppercase tracking-widest">
                      编号: RES-{{ resource.id.slice(0, 8).toUpperCase() }}
                   </span>
                </div>
                
                <!-- 标题 -->
                <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#0f281f] leading-tight">
                   {{ resource.title }}
                </h1>
                
                <!-- 来源与作者 -->
                <div class="flex items-center gap-2 text-[#0f281f]/70 font-serif italic text-lg">
                   <User class="w-5 h-5" />
                   <span>提供者: {{ resource.provider || '未知来源' }}</span>
                </div>
             </div>

             <!-- 右侧状态章 -->
             <div class="hidden md:flex flex-col items-end gap-2">
                <div class="w-24 h-24 border-2 border-[#d4c5a3] rounded-full flex flex-col items-center justify-center text-[#d4c5a3] rotate-[-12deg] opacity-80">
                   <span class="text-[10px] font-bold uppercase tracking-widest">状态</span>
                   <span class="text-lg font-bold uppercase">已归档</span>
                   <span class="text-[10px] font-mono">{{ new Date().toLocaleDateString() }}</span>
                </div>
             </div>
          </div>

          <!-- 2. 关键指标 (Metrics Grid) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
             
             <!-- 难度 -->
             <div class="bg-[#f4f1ea] p-4 border-l-4 border-[#0f281f]">
                <div class="text-xs font-bold text-[#0f281f]/50 uppercase tracking-widest mb-1">难度等级</div>
                <div class="flex items-center gap-2 text-[#0f281f] font-serif font-bold text-lg">
                   <BarChart3 class="w-5 h-5" />
                   {{ formatDifficulty(resource.difficulty) }}
                </div>
             </div>

             <!-- 时长 -->
             <div class="bg-[#f4f1ea] p-4 border-l-4 border-[#d4c5a3]">
                <div class="text-xs font-bold text-[#0f281f]/50 uppercase tracking-widest mb-1">预计耗时</div>
                <div class="flex items-center gap-2 text-[#0f281f] font-serif font-bold text-lg">
                   <Clock class="w-5 h-5" />
                   {{ resource.duration || '未知' }} 小时
                </div>
             </div>

             <!-- 热度 -->
             <div class="bg-[#f4f1ea] p-4 border-l-4 border-[#0f281f]">
                <div class="text-xs font-bold text-[#0f281f]/50 uppercase tracking-widest mb-1">查阅次数</div>
                <div class="flex items-center gap-2 text-[#0f281f] font-serif font-bold text-lg">
                   <Eye class="w-5 h-5" />
                   {{ resource.views }}
                </div>
             </div>

             <!-- 评分 -->
             <div class="bg-[#f4f1ea] p-4 border-l-4 border-[#d4c5a3]">
                <div class="text-xs font-bold text-[#0f281f]/50 uppercase tracking-widest mb-1">档案评分</div>
                <div class="flex items-center gap-2 text-[#0f281f] font-serif font-bold text-lg">
                   <Star class="w-5 h-5 fill-[#0f281f]" />
                   {{ resource.likes > 0 ? '高评' : '暂无' }}
                </div>
             </div>
          </div>

          <!-- 3. 详细内容 (Content) -->
          <div class="grid md:grid-cols-3 gap-10">
             
             <!-- 左侧：主要描述 -->
             <div class="md:col-span-2 space-y-8">
                <div>
                   <h3 class="flex items-center gap-2 text-lg font-bold text-[#0f281f] uppercase tracking-widest mb-4 border-b border-[#0f281f]/10 pb-2">
                      <FileText class="w-5 h-5" /> 摘要说明
                   </h3>
                   <p class="text-[#0f281f]/80 leading-relaxed font-serif text-lg whitespace-pre-wrap">
                      {{ resource.description || '暂无详细描述。' }}
                   </p>
                </div>

                <div v-if="resource.contentOutline && resource.contentOutline.length">
                   <h3 class="flex items-center gap-2 text-lg font-bold text-[#0f281f] uppercase tracking-widest mb-4 border-b border-[#0f281f]/10 pb-2">
                      <List class="w-5 h-5" /> 目录大纲
                   </h3>
                   <ul class="space-y-3">
                      <li v-for="(item, idx) in resource.contentOutline" :key="idx" class="flex items-start gap-3">
                         <span class="text-[#d4c5a3] font-bold font-serif">{{ (idx + 1).toString().padStart(2, '0') }}.</span>
                         <span class="text-[#0f281f]/80">{{ item }}</span>
                      </li>
                   </ul>
                </div>
             </div>

             <!-- 右侧：标签与操作 -->
             <div class="space-y-8">
                
                <!-- 操作区 -->
                <div class="bg-[#0f281f] text-[#f4f1ea] p-6 rounded-sm shadow-lg">
                   <h3 class="font-serif font-bold text-xl mb-4 text-[#d4c5a3]">开始研究</h3>
                   <p class="text-white/60 text-sm mb-6">点击下方按钮访问原始档案。</p>
                   
                   <button 
                      @click="handleStartLearning"
                      class="w-full py-3 bg-[#d4c5a3] text-[#0f281f] font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 mb-3"
                   >
                      访问链接 <ExternalLink class="w-4 h-4" />
                   </button>
                   
                   <div class="flex gap-2">
                      <button class="flex-1 py-2 border border-[#d4c5a3]/30 text-[#d4c5a3] text-xs font-bold uppercase hover:bg-[#d4c5a3]/10 transition-colors flex items-center justify-center gap-1">
                         <Bookmark class="w-3 h-3" /> 收藏
                      </button>
                      <button class="flex-1 py-2 border border-[#d4c5a3]/30 text-[#d4c5a3] text-xs font-bold uppercase hover:bg-[#d4c5a3]/10 transition-colors flex items-center justify-center gap-1">
                         <Share2 class="w-3 h-3" /> 分享
                      </button>
                   </div>
                </div>

                <!-- 标签云 -->
                <div v-if="resource.tags && resource.tags.length">
                   <h3 class="text-sm font-bold text-[#0f281f]/50 uppercase tracking-widest mb-3">关键词索引</h3>
                   <div class="flex flex-wrap gap-2">
                      <span v-for="tag in resource.tags" :key="tag" class="px-2 py-1 border border-[#0f281f]/20 text-[#0f281f] text-xs font-mono hover:bg-[#0f281f] hover:text-white transition-colors cursor-default">
                         #{{ tag }}
                      </span>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, FileText, User, BarChart3, Clock, 
  Eye, Star, List, ExternalLink, Bookmark, Share2 
} from 'lucide-vue-next'

const route = useRoute()

interface Resource {
  id: string
  title: string
  provider: string
  type: string
  difficulty: string
  description: string
  duration: string
  rating: number
  views: number
  likes: number
  status: string
  tags: string[]
  contentOutline: string[]
  url: string
}

const resource = ref<Resource | null>(null)

// 格式化类型显示
const formatType = (type: string) => {
  const map: Record<string, string> = {
    course: '系列课程',
    book: '电子书籍',
    video: '视频讲座',
    article: '学术文章',
    tool: '工具软件',
    other: '其他资料'
  }
  return map[type] || type || '未分类'
}

// 格式化难度显示
const formatDifficulty = (diff: string) => {
  const map: Record<string, string> = {
    beginner: '入门基础',
    intermediate: '进阶提升',
    advanced: '高阶研究'
  }
  return map[diff] || diff || '一般'
}

// 从数据库加载资源数据
const loadResource = async (id: string) => {
  try {
    const { supabaseService } = await import('@/services/supabase')
    const resourceData = await supabaseService.getResourceById(id)
    
    if (resourceData) {
      resource.value = {
        ...resourceData,
        views: resourceData.views || 0,
        likes: resourceData.likes || 0,
        status: '推荐',
        tags: resourceData.tags || [],
        contentOutline: [] // 数据库暂时没有这个字段
      }
    } else {
      console.error('资源未找到:', id)
    }
  } catch (error) {
    console.error('加载资源失败:', error)
  }
}

const handleStartLearning = () => {
  if (resource.value?.url) {
    window.open(resource.value.url, '_blank')
  }
}

onMounted(() => {
  const resourceId = route.params.id as string
  if (resourceId) {
    loadResource(resourceId)
  }
})
</script>

<style scoped>
/* 简单的旋转动效 */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>