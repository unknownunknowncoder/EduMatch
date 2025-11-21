// 检查用户ID问题
// 使用方法：node check-user-id.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkUserIds() {
  try {
    console.log('🔍 检查用户ID问题...\n')
    
    // 1. 获取所有用户
    console.log('👥 获取数据库中的用户列表:')
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, username')
    
    if (userError) {
      console.error('❌ 获取用户失败:', userError.message)
      return
    }
    
    console.log('📊 数据库中的用户:')
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, 用户名: ${user.username}`)
    })
    
    // 2. 模拟获取当前用户（从localStorage模拟）
    console.log('\n🔐 检查当前用户信息:')
    console.log('⚠️ 需要确认前端实际使用的用户ID')
    console.log('📝 建议: 在浏览器控制台执行 localStorage.getItem("currentUser") 查看实际用户ID')
    
    // 3. 测试使用第一个用户的ID
    if (users && users.length > 0) {
      const testUserId = users[0].id
      console.log(`\n🧪 使用第一个用户ID测试: ${testUserId}`)
      
      const testPlan = {
        user_id: testUserId,
        title: '用户ID测试',
        description: '测试用户ID外键',
        progress: 0,
        status: 'in_progress',
        start_date: '2024-01-01',
        target_date: '2024-12-31',
        daily_hours: 2.5,
        resource_name: '测试资源',
        resource_url: 'https://test.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('study_plans')
        .insert([testPlan])
        .select()
      
      if (error) {
        console.error('❌ 插入失败:', error.message)
      } else {
        console.log('✅ 插入成功!')
        console.log('📊 数据:', data[0])
        
        // 清理测试数据
        await supabase
          .from('study_plans')
          .delete()
          .eq('title', '用户ID测试')
        console.log('🧹 测试数据已清理')
      }
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

checkUserIds()