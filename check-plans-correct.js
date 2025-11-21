import { createClient } from '@supabase/supabase-js'

// 使用正确的配置
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStudyPlans() {
  try {
    console.log('🔍 检查数据库中的学习计划...')
    
    // 尝试查询学习计划
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ 查询失败:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log(`✅ 找到 ${data.length} 个学习计划:`)
      data.forEach((plan, index) => {
        console.log(`\n📚 计划 ${index + 1}:`)
        console.log(`   ID: ${plan.id}`)
        console.log(`   标题: ${plan.title}`)
        console.log(`   描述: ${plan.description || '无描述'}`)
        console.log(`   状态: ${plan.status}`)
        console.log(`   进度: ${plan.progress}%`)
        console.log(`   开始日期: ${plan.start_date}`)
        console.log(`   目标日期: ${plan.target_date}`)
        console.log(`   每日时长: ${plan.daily_hours}小时`)
        console.log(`   资源名称: ${plan.resource_name || '无'}`)
        console.log(`   资源链接: ${plan.resource_url || '无'}`)
        console.log(`   创建时间: ${plan.created_at}`)
      })
    } else {
      console.log('📭 数据库中没有学习计划')
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error)
  }
}

checkStudyPlans()