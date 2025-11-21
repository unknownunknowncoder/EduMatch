// 检查当前数据库状态
// 使用方法：node check-current-state.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkCurrentState() {
  try {
    console.log('🔍 检查当前数据库状态...\n')
    
    // 1. 测试插入（看看 RLS 是否真的是问题）
    console.log('🧪 测试学习计划插入...')
    const testPlan = {
      user_id: 'b6c871eb-717c-4a40-859b-b639cf8ccd08',
      title: '测试学习计划',
      description: '测试描述',
      progress: 0,
      status: 'pending',
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
      console.log('🔍 错误代码:', error.code)
      console.log('📝 错误详情:', error)
      
      // 根据错误类型给出建议
      if (error.message.includes('row-level security')) {
        console.log('\n💡 建议: 需要禁用 RLS')
        console.log('📋 执行: ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;')
      } else if (error.message.includes('already exists')) {
        console.log('\n💡 建议: 触发器或策略已存在，需要清理')
        console.log('📋 执行: DROP POLICY IF EXISTS "策略名" ON study_plans;')
      }
    } else {
      console.log('✅ 插入成功!')
      console.log('📊 数据:', data[0])
      
      // 清理测试数据
      await supabase
        .from('study_plans')
        .delete()
        .eq('title', '测试学习计划')
      console.log('🧹 测试数据已清理')
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

checkCurrentState()