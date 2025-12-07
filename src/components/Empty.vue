<template>
  <div 
    :class="cn('flex h-full items-center justify-center')" 
    @click="handleClick"
  >
    Empty
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'

const handleClick = () => {
  toast('Coming soon')
}
</script>