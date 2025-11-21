// 测试学习计划插入功能
// 使用方法：node test-study-plan-insert.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsertStudyPlan() {
  try {
    console.log('🧪 测试学习计划插入功能...')

    // 模拟前端发送的数据格式（驼峰式）
    const planData = {
      title: '测试学习计划',
      description: '这是一个测试学习计划',
      progress: 0,
      status: 'pending',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      dailyHours: 2.5,
      resourceName: 'Vue.js 教程',
      resourceUrl: 'https://vuejs.org'
    }

    // 模拟用户ID（使用现有用户）
    const testUserId = 'b6c871eb-717c-4a40-859b-b639cf8ccd08'

    // 转换字段名（驼峰式转下划线式）
    const convertedPlan = {
      user_id: testUserId,
      title: planData.title,
      description: planData.description,
      progress: planData.progress || 0,
      status: planData.status || 'pending',
      start_date: planData.startDate,
      target_date: planData.targetDate,
      daily_hours: planData.dailyHours,
      resource_name: planData.resourceName,
      resource_url: planData.resourceUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('📝 插入数据:', convertedPlan)

    // 执行插入
    const { data, error } = await supabase
      .from('study_plans')
      .insert([convertedPlan])
      .select()

    if (error) {
      console.error('❌ 插入失败:', error.message)
      console.error('🔍 错误详情:', error)
      return false
    }

    console.log('✅ 插入成功!')
    console.log('📊 返回数据:', data[0])

    // 验证查询
    console.log('🔍 验证查询...')
    const { data: plans, error: fetchError } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', testUserId)

    if (fetchError) {
      console.error('❌ 查询失败:', fetchError.message)
      return false
    }

    console.log('📚 学习计划列表:')
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.title} - ${plan.status}`)
    })

    return true

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    return false
  }
}

// 清理测试数据
async function cleanupTestData() {
  try {
    console.log('🧹 清理测试数据...')
    
    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('title', '测试学习计划')

    if (error) {
      console.warn('⚠️ 清理失败:', error.message)
    } else {
      console.log('✅ 测试数据清理完成')
    }
  } catch (error) {
    console.warn('⚠️ 清理出错:', error.message)
  }
}

async function main() {
  console.log('🚀 开始学习计划插入测试...\n')
  
  const success = await testInsertStudyPlan()
  
  console.log('\n' + '='.repeat(50))
  
  if (success) {
    console.log('🎉 插入测试成功!')
    console.log('💡 现在可以在前端应用中正常创建学习计划了')
  } else {
    console.log('❌ 插入测试失败')
    console.log('🔧 请检查数据库表结构和字段名')
  }

  // 清理测试数据
  await cleanupTestData()
}

main()