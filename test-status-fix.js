// 测试 status 字段修复
// 使用方法：node test-status-fix.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStatusFix() {
  try {
    console.log('🧪 测试 status 字段修复...\n')
    
    // 测试正确的 status 值
    const testPlan = {
      user_id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
      title: 'Status测试',
      description: '测试status字段',
      progress: 0,
      status: 'in_progress', // 使用正确的下划线格式
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
      return false
    }
    
    console.log('✅ 插入成功!')
    console.log('📊 数据:', data[0])
    
    // 清理测试数据
    await supabase
      .from('study_plans')
      .delete()
      .eq('title', 'Status测试')
    console.log('🧹 测试数据已清理')
    
    return true
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    return false
  }
}

testStatusFix()