// 测试CommunityPage.vue的导入
import('@/views/CommunityPage.vue').then(module => {
  console.log('✅ CommunityPage.vue 导入成功:', module.default)
}).catch(error => {
  console.error('❌ CommunityPage.vue 导入失败:', error)
})