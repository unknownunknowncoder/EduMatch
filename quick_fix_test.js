// 快速修复测试脚本
// 在浏览器控制台运行

(async function quickTest() {
  console.log('🚀 开始快速修复测试...')
  
  try {
    // 1. 检查环境配置
    console.log('🔧 检查环境配置...')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ 环境配置缺失')
      alert('请检查 .env 文件中的 Supabase 配置')
      return
    }
    console.log('✅ 环境配置正常')
    
    // 2. 测试数据库连接
    console.log('🗄️ 测试数据库连接...')
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, supabaseKey)
    
    // 3. 检查用户认证状态
    console.log('👤 检查用户认证状态...')
    const { data: { user }, error: authError } = await client.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ 用户未认证:', authError)
      alert('请先登录系统')
      return
    }
    console.log('✅ 用户认证成功:', { id: user.id, email: user.email })
    
    // 4. 测试表访问
    console.log('📋 测试表访问权限...')
    
    // 测试 study_plans 表
    const { data: plans, error: plansError } = await client
      .from('study_plans')
      .select('id, title')
      .eq('user_id', user.id)
      .limit(5)
    
    if (plansError) {
      console.error('❌ study_plans 表访问失败:', plansError)
      console.log('💡 建议执行 check_and_create_tables.sql 脚本')
    } else {
      console.log('✅ study_plans 表访问成功，找到', plans?.length || 0, '个计划')
    }
    
    // 测试 study_plan_checkins 表
    const { data: checkins, error: checkinsError } = await client
      .from('study_plan_checkins')
      .select('id, checkin_date')
      .eq('user_id', user.id)
      .limit(5)
    
    if (checkinsError) {
      console.error('❌ study_plan_checkins 表访问失败:', checkinsError)
      console.log('💡 建议执行 check_and_create_tables.sql 脚本')
    } else {
      console.log('✅ study_plan_checkins 表访问成功，找到', checkins?.length || 0, '条打卡记录')
    }
    
    // 5. 如果没有学习计划，创建一个测试计划
    if (!plans || plans.length === 0) {
      console.log('📝 创建测试学习计划...')
      
      const testPlan = {
        user_id: user.id,
        title: 'Vue.js 入门学习',
        description: '学习 Vue.js 基础知识，包括组件、指令、生命周期等',
        start_date: new Date().toISOString().split('T')[0],
        target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_hours: 2,
        total_hours: 28,
        status: 'in_progress'
      }
      
      const { data: newPlan, error: createError } = await client
        .from('study_plans')
        .insert([testPlan])
        .select()
      
      if (createError) {
        console.error('❌ 创建测试计划失败:', createError)
      } else {
        console.log('✅ 测试学习计划创建成功:', newPlan[0].title)
        console.log('🔄 请刷新页面查看新创建的学习计划')
      }
    }
    
    console.log('🎉 快速测试完成！')
    console.log('📝 接下来请：')
    console.log('   1. 如果有表错误，执行 check_and_create_tables.sql')
    console.log('   2. 如果有权限错误，执行 simple_rls_fix.sql')
    console.log('   3. 刷新页面测试学习计划功能')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error)
  }
})()