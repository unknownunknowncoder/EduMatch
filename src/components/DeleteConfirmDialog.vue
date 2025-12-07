<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a3c34]/90 backdrop-blur-sm px-4"
      @click="handleCancel"
    >
      <!-- Modal Container -->
      <div 
        class="bg-[#f4f1ea] w-full max-w-md shadow-2xl relative border-t-8 border-[#b03e3e] overflow-hidden rounded-sm"
        @click.stop
      >
        <!-- Background Watermark -->
        <Trash2 class="absolute -right-8 -bottom-8 w-40 h-40 text-[#b03e3e]/5 -z-0 pointer-events-none rotate-12" />

        <div class="p-8 relative z-10">
          
          <!-- Header & Message -->
          <div class="flex items-start gap-5 mb-6">
            <!-- Icon Box -->
            <div class="w-12 h-12 flex-shrink-0 bg-[#b03e3e]/10 border border-[#b03e3e]/20 flex items-center justify-center rounded-sm">
              <AlertTriangle class="w-6 h-6 text-[#b03e3e]" />
            </div>
            
            <div>
              <h3 class="text-xl font-serif font-bold text-[#1a3c34] mb-2 leading-none">
                Confirm Deletion
              </h3>
              <p class="text-[#1a3c34]/70 font-serif text-sm leading-relaxed">
                {{ message || 'Are you sure you want to permanently remove this record? This action is irreversible.' }}
              </p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end items-center gap-4 pt-6 border-t border-[#1a3c34]/10">
            <button
              @click="handleCancel"
              class="px-4 py-2 text-[#1a3c34]/50 font-bold uppercase tracking-widest text-xs hover:text-[#1a3c34] transition-colors"
            >
              Preserve
            </button>
            <button
              @click="handleConfirm"
              class="px-6 py-2.5 bg-[#b03e3e] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#8a2c2c] transition-all shadow-md flex items-center gap-2 rounded-sm"
            >
              <Trash2 class="w-3 h-3" />
              <span>Expunge</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Trash2, AlertTriangle } from 'lucide-vue-next'

interface Props {
  show: boolean
  message?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 弹窗进入时的缩放微动效 */
.fade-enter-active > div,
.fade-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from > div,
.fade-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>