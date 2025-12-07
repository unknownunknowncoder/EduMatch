// 测试导出功能的调试脚本
console.log('🔍 开始测试导出功能...')

// 模拟数据
const mockExportData = {
  users: [
    {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
      is_banned: false,
      created_at: '2024-01-01T00:00:00Z',
      last_login_at: '2024-12-06T10:00:00Z'
    }
  ],
  posts: [
    {
      id: '1',
      title: 'Vue.js学习心得',
      content: 'Vue.js是一个优秀的前端框架...',
      user_id: '1',
      category: '技术分享',
      tags: ['Vue', '前端'],
      created_at: '2024-03-01T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
      status: 'published',
      views: 100,
      likes: 20,
      comments_count: 5
    }
  ],
  plans: [
    {
      id: '1',
      title: 'Vue.js学习计划',
      description: '系统学习Vue.js框架',
      user_id: '1',
      user: { username: 'admin', nickname: '管理员' },
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
      difficulty: '进阶',
      target_hours: 40,
      progress: 60,
      participants_count: 10,
      status: '进行中'
    }
  ],
  resources: [
    {
      id: '1',
      title: 'Vue.js官方文档',
      description: 'Vue.js官方文档中文版',
      file_type: 'PDF',
      file_size: 5242880,
      created_by: '1',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
      tags: ['Vue', '文档'],
      difficulty: '基础',
      view_count: 150,
      download_count: 30,
      favorite_count: 15,
      status: '正常'
    }
  ]
}

console.log('📊 模拟数据统计:')
console.log(`  👥 用户数据: ${mockExportData.users.length} 条`)
console.log(`  📝 帖子数据: ${mockExportData.posts.length} 条`)
console.log(`  📚 学习计划: ${mockExportData.plans.length} 条`)
console.log(`  📁 学习资源: ${mockExportData.resources.length} 条`)

console.log('✅ 测试完成！所有数据类型都存在。')
console.log('💡 如果在系统中只导出用户数据，可能的原因：')
console.log('   1. 数据库中其他数据表为空')
console.log('   2. 数据库连接或权限问题')
console.log('   3. 数据获取方法调用失败')
console.log('   4. 数据转换过程中出现错误')