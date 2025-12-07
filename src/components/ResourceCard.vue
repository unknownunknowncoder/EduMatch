<template>
  <div class="group relative bg-white border border-[#1a3c34]/10 rounded-sm shadow-sm hover:shadow-xl hover:border-[#1a3c34]/30 transition-all duration-300 overflow-hidden hover:-translate-y-1">
    
    <!-- 左侧装饰条 (文件夹脊) -->
    <div class="absolute top-0 left-0 w-1 h-full bg-[#d4c5a3] group-hover:bg-[#1a3c34] transition-colors duration-300"></div>
    
    <!-- 背景水印 -->
    <FileText class="absolute -right-4 -bottom-4 w-32 h-32 text-[#1a3c34]/5 -z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500 rotate-[-10deg]" />

    <!-- 资源头部 (Header) -->
    <div class="p-6 border-b border-[#1a3c34]/5 relative z-10">
      <div class="flex justify-between items-start gap-4">
         <div>
            <!-- 排名印章 -->
            <div 
               class="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold font-serif mb-3 shadow-sm"
               :class="getRankBadgeClass(rank)"
            >
               #{{ rank }}
            </div>
            
            <h3 class="font-serif font-bold text-xl text-[#1a3c34] mb-1 line-clamp-2 leading-tight group-hover:text-[#b49b67] transition-colors">
               {{ resource.name || resource.title }}
            </h3>
            
            <div class="flex items-center gap-2 text-xs font-mono text-[#1a3c34]/50 uppercase tracking-widest">
               <User class="w-3 h-3" />
               <span>{{ resource.provider }}</span>
            </div>
         </div>
         
         <!-- 类型标签 -->
         <div class="flex-shrink-0">
            <span class="px-2 py-1 border border-[#1a3c34]/20 text-[#1a3c34] text-[10px] font-bold uppercase tracking-wider bg-[#f9f9f7]">
               {{ resource.type }}
            </span>
         </div>
      </div>
    </div>
    
    <!-- 资源内容 (Body) -->
    <div class="p-6 relative z-10 space-y-6">
      
      <!-- 核心契合点 (Highlights) -->
      <div class="bg-[#f9f9f7] border-l-2 border-[#1a3c34] p-3 text-sm text-[#1a3c34]/80 font-serif italic leading-relaxed">
        <span class="font-bold text-[#1a3c34] not-italic mr-1">Analysis:</span>
        {{ resource.matchPoints }}
      </div>
      
      <!-- 内容大纲 (Outline) -->
      <div v-if="resource.contentOutline && resource.contentOutline.length">
        <h4 class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-2 flex items-center gap-1">
          <List class="w-3 h-3" /> 课程大纲
        </h4>
        <ul class="space-y-1.5">
          <li 
            v-for="(item, index) in (resource.contentOutline || []).slice(0, 3)" 
            :key="index" 
            class="flex items-start text-xs text-[#1a3c34]/70 font-mono"
          >
            <span class="text-[#d4c5a3] mr-2">›</span>
            <span class="line-clamp-1">{{ item }}</span>
          </li>
          <li v-if="(resource.contentOutline || []).length > 3" class="text-xs text-[#1a3c34]/40 italic pl-4">
            +{{ (resource.contentOutline || []).length - 3 }} 个额外主题
          </li>
        </ul>
      </div>
      
      <!-- 关键信息 (Metrics) -->
      <div class="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#1a3c34]/5">
        <div class="text-center border-r border-[#1a3c34]/5">
           <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">时长</div>
           <div class="text-sm font-serif font-bold text-[#1a3c34]">{{ resource.duration }}</div>
        </div>
        <div class="text-center border-r border-[#1a3c34]/5">
           <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">评分</div>
           <div class="text-sm font-serif font-bold text-[#1a3c34] flex items-center justify-center gap-1">
              {{ resource.rating }}<span class="text-[#d4c5a3] text-xs">/10</span>
           </div>
        </div>
        <div class="text-center">
           <div class="text-[10px] font-bold text-[#1a3c34]/40 uppercase tracking-widest mb-1">Status</div>
           <div class="text-sm font-serif font-bold text-[#1a3c34]">Active</div>
        </div>
      </div>
      
      <!-- 底部操作栏 (Actions) -->
      <div class="flex items-center gap-3 pt-2">
        <!-- 点赞 -->
        <button
          @click.stop="handleLike"
          class="flex-1 flex items-center justify-center gap-2 py-2 border border-[#1a3c34]/10 hover:border-[#b03e3e] hover:text-[#b03e3e] transition-colors rounded-sm group/btn"
          :class="interaction.liked ? 'border-[#b03e3e] text-[#b03e3e] bg-[#b03e3e]/5' : 'text-[#1a3c34]/60'"
        >
          <ThumbsUp class="w-4 h-4" :class="{'fill-current': interaction.liked}" />
          <span class="text-xs font-bold">{{ interaction.likesCount }}</span>
        </button>
        
        <!-- 收藏 -->
        <button
          @click.stop="handleSave"
          class="flex-1 flex items-center justify-center gap-2 py-2 border border-[#1a3c34]/10 hover:border-[#d4c5a3] hover:text-[#1a3c34] transition-colors rounded-sm group/btn"
          :class="interaction.saved ? 'border-[#d4c5a3] text-[#1a3c34] bg-[#d4c5a3]/10' : 'text-[#1a3c34]/60'"
        >
          <Bookmark class="w-4 h-4" :class="{'fill-current text-[#d4c5a3]': interaction.saved}" />
          <span class="text-xs font-bold">{{ interaction.saved ? 'Saved' : 'Save' }}</span>
        </button>
        
        <!-- 立即学习 (Primary) -->
        <button
          @click.stop="handleResourceClick(resource.url)"
          class="flex-[2] flex items-center justify-center gap-2 py-2 bg-[#1a3c34] text-[#d4c5a3] hover:bg-[#235246] hover:text-white transition-colors rounded-sm shadow-md group/main"
        >
          <span class="text-xs font-bold uppercase tracking-widest">Access</span>
          <ExternalLink class="w-3 h-3 group-hover/main:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { 
  FileText, User, List, Clock, Star, 
  ThumbsUp, Bookmark, ExternalLink
} from 'lucide-vue-next'
import type { Resource, InteractionData } from '@/types'

interface Props {
  resource: Resource
  rank: number
}

const props = defineProps<Props>()

// 样式逻辑：排名前3使用特殊颜色，其余默认
const getRankBadgeClass = (rank: number) => {
  if (rank === 1) return 'border-[#d4c5a3] bg-[#d4c5a3] text-[#1a3c34]' // 金
  if (rank === 2) return 'border-slate-400 text-slate-600 bg-slate-100' // 银
  if (rank === 3) return 'border-orange-700 text-orange-800 bg-orange-100' // 铜
  return 'border-[#1a3c34]/20 text-[#1a3c34]/60 bg-transparent' // 普通
}

// 逻辑部分保持原样，仅适配 TS 类型
const getCurrentUserId = (): string => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return user.id.toString()
    } catch (error) { console.error(error) }
  }
  return 'default_user'
}

const getInteractionKey = () => `resource_interaction_${getCurrentUserId()}_${props.resource.id}`

const interaction = ref<InteractionData>({ liked: false, saved: false, likesCount: 0 })

// Init logic (Simplified for brevity, keep your original logic)
onMounted(() => {
  const saved = localStorage.getItem(getInteractionKey())
  if (saved) interaction.value = JSON.parse(saved)
  // Ensure we have initial counts if needed
})

watch(interaction, (val) => localStorage.setItem(getInteractionKey(), JSON.stringify(val)), { deep: true })

const handleResourceClick = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
  // Add to history logic here
}

const handleLike = () => {
  interaction.value.liked = !interaction.value.liked
  interaction.value.likesCount += interaction.value.liked ? 1 : -1
}

const handleSave = () => {
  interaction.value.saved = !interaction.value.saved
}
</script>