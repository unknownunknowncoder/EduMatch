<template>
  <div 
    :class="cn('flex h-full items-center justify-center')" 
    @click="handleClick"
  >
    Empty
  </div>
</template>

<script setup lang="ts">
import { toast } from 'sonner-vue'
import { cn } from '@/lib/utils'

const handleClick = () => {
  toast('Coming soon')
}
</script>