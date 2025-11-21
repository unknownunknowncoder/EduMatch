// 这个脚本用于调试社区搜索功能
// 在浏览器控制台中运行此脚本

async function debugSearch() {
  try {
    console.log('🔍 开始调试搜索功能...')
    
    // 1. 测试数据库连接
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'
    const client = createClient(supabaseUrl, supabaseKey)
    
    // 2. 获取所有帖子
    const { data: allPosts, error } = await client
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 数据库查询失败:', error)
      return
    }
    
    console.log(`✅ 获取到 ${allPosts.length} 个帖子`)
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" by ${post.author}`)
    })
    
    // 3. 测试搜索逻辑
    const keyword = 'Vue 3'
    console.log(`\n🔍 测试搜索: "${keyword}"`)
    
    const keywordLower = keyword.toLowerCase()
    const matchedPosts = allPosts.filter(post => {
      // 标题匹配
      if (post.title && post.title.toLowerCase().includes(keywordLower)) {
        console.log('✅ 标题匹配:', post.title)
        return true
      }
      return false
    })
    
    console.log(`✅ 搜索结果: ${matchedPosts.length} 条`)
    matchedPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`)
    })
    
    // 4. 检查Vue响应式数据
    if (window.Vue && window.Vue.createApp) {
      console.log('\n📱 Vue 已加载')
      // 尝试获取Vue组件实例
      const app = document.querySelector('#app')
      if (app) {
        console.log('✅ 找到Vue应用根元素')
      }
    }
    
  } catch (error) {
    console.error('❌ 调试失败:', error)
  }
}

// 导出调试函数
window.debugSearch = debugSearch
console.log('🔧 调试函数已加载，运行 debugSearch() 开始调试')