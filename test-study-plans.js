// 测试学习计划数据库连接
// 使用方法：node test-study-plans.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStudyPlansConnection() {
  try {
    console.log('🔍 测试 study_plans 表连接...')
    
    // 尝试查询表结构
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ study_plans 表不存在')
        console.log('📝 请先创建表，参考 STUDY_PLANS_TABLE_SETUP.md')
      } else {
        console.error('❌ 查询失败:', error.message)
        console.log('🔍 错误代码:', error.code)
      }
      return false
    }
    
    console.log('✅ study_plans 表连接成功!')
    console.log('📊 当前记录数:', data?.length || 0)
    return true
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error.message)
    return false
  }
}

async function testUserTable() {
  try {
    console.log('🔍 测试 users 表连接...')
    
    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .limit(5)
    
    if (error) {
      console.error('❌ users 表查询失败:', error.message)
      return false
    }
    
    console.log('✅ users 表连接成功!')
    console.log('👥 用户数量:', data?.length || 0)
    if (data && data.length > 0) {
      console.log('📝 用户示例:', data[0])
    }
    return data
    
  } catch (error) {
    console.error('❌ users 表连接测试失败:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 开始数据库连接测试...\n')
  
  // 测试 users 表
  const users = await testUserTable()
  console.log()
  
  // 测试 study_plans 表
  const studyPlansOk = await testStudyPlansConnection()
  console.log()
  
  if (users && studyPlansOk) {
    console.log('🎉 所有测试通过! 可以开始使用学习计划功能')
  } else if (!studyPlansOk) {
    console.log('⚠️ 需要先创建 study_plans 表')
    console.log('📖 参考: STUDY_PLANS_TABLE_SETUP.md')
  } else {
    console.log('⚠️ 部分测试失败，请检查数据库配置')
  }
}

main()