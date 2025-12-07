<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin System</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Welcome to Admin Panel</h2>
      
      <div class="space-y-4">
        <div class="p-4 bg-green-100 rounded">
          <p class="text-green-800">✅ Admin System loaded successfully!</p>
        </div>
        
        <div class="space-y-2">
          <button 
            @click="$router.push('/')"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 最小化脚本，不导入任何复杂依赖
console.log('AdminSystemMinimal component loaded')
</script>