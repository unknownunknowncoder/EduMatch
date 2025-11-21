// 修复用户ID匹配问题
// 使用方法：node fix-user-id-match.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixUserIdMatch() {
  try {
    console.log('🔧 修复用户ID匹配问题...
')
    
    // 1. 获取数据库中的第一个用户
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username')
      .limit(1)
    
    if (error) {
      console.error('❌ 获取用户失败:', error.message)
      return
    }
    
    if (!users || users.length === 0) {
      console.error('❌ 数据库中没有用户')
      return
    }
    
    const dbUser = users[0]
    console.log('📊 数据库用户:', dbUser)
    
    // 2. 创建修复建议
    console.log('\n🔧 修复方案:')
    console.log('在浏览器控制台执行以下命令更新 localStorage:')
    console.log(`localStorage.setItem("currentUser", JSON.stringify({`)
    console.log(`  "id": "${dbUser.id}",`)
    console.log(`  "username": "${dbUser.username}",`)
    console.log(`  "nickname": "${dbUser.username}"`
    console.log(`}))`)

    console.log('\n📝 或者直接复制这个:')
    console.log(`localStorage.setItem("currentUser", JSON.stringify({"id":"${dbUser.id}","username":"${dbUser.username}","nickname":"${dbUser.username}"}))`)

    // 3. 验证修复后的插入
    console.log('\n🧪 验证修复效果...')
    const testPlan = {
      user_id: dbUser.id,
      title: '修复验证',
      description: '验证用户ID修复',
      progress: 0,
      status: 'in_progress',
      start_date: '2024-01-01',
      target_date: '2024-12-31',
      daily_hours: 2.5,
      resource_name: '验证资源',
      resource_url: 'https://test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error: insertError } = await supabase
      .from('study_plans')
      .insert([testPlan])
      .select()
    
    if (insertError) {
      console.error('❌ 验证插入失败:', insertError.message)
    } else {
      console.log('✅ 验证插入成功!')
      console.log('📊 数据:', data[0])
      
      // 清理测试数据
      await supabase
        .from('study_plans')
        .delete()
        .eq('title', '修复验证')
      console.log('🧹 测试数据已清理')
    }
    
  } catch (error) {
    console.error('❌ 修复失败:', error.message)
  }
}

fixUserIdMatch()