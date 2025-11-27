// 修复学习计划加载问题的调试脚本
// 在浏览器控制台中运行

async function debugStudyPlanLoading() {
  console.log('🔍 开始调试学习计划加载问题...')
  
  try {
    // 1. 检查 Supabase 配置
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    console.log('🔧 Supabase 配置:', { url: supabaseUrl, hasKey: !!supabaseKey })
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase 配置缺失')
      return
    }
    
    // 2. 创建客户端并检查认证
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, supabaseKey)
    
    const { data: { user }, error: authError } = await client.auth.getUser()
    console.log('👤 认证用户:', user, authError)
    
    if (!user) {
      console.error('❌ 用户未认证')
      return
    }
    
    // 3. 检查 study_plans 表是否存在和可访问
    console.log('🗂️ 检查 study_plans 表...')
    const { data: tableInfo, error: tableError } = await client
      .from('study_plans')
      .select('*')
      .limit(1)
    
    console.log('表访问结果:', { data: tableInfo, error: tableError })
    
    if (tableError) {
      console.error('❌ 表访问失败:', tableError)
      
      // 尝试列出所有表
      const { data: tables } = await client.rpc('get_table_info')
      console.log('📋 可用表:', tables)
      return
    }
    
    // 4. 检查用户的学习计划
    console.log('📚 查询用户学习计划...')
    const { data: plans, error: plansError } = await client
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    console.log('学习计划查询结果:', { data: plans, error: plansError })
    
    if (plansError) {
      console.error('❌ 学习计划查询失败:', plansError)
      
      // 如果是权限问题，尝试查询所有数据
      console.log('🔓 尝试查询所有学习计划（绕过用户过滤）...')
      const { data: allPlans, error: allPlansError } = await client
        .from('study_plans')
        .select('*')
        .limit(5)
      
      console.log('所有学习计划:', { data: allPlans, error: allPlansError })
    }
    
    // 5. 检查表结构
    console.log('🏗️ 检查表结构...')
    const { data: columns } = await client
      .rpc('get_column_info', { table_name: 'study_plans' })
    
    console.log('study_plans 表结构:', columns)
    
    // 6. 如果没有数据，尝试创建一条测试记录
    if (plans && plans.length === 0) {
      console.log('📝 创建测试学习计划...')
      const testPlan = {
        user_id: user.id,
        title: '测试学习计划',
        description: '这是一个测试计划',
        start_date: new Date().toISOString().split('T')[0],
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_hours: 2,
        total_hours: 60,
        progress: 0,
        status: 'in_progress'
      }
      
      const { data: insertedPlan, error: insertError } = await client
        .from('study_plans')
        .insert([testPlan])
        .select()
      
      console.log('测试计划创建结果:', { data: insertedPlan, error: insertError })
      
      if (!insertError && insertedPlan) {
        console.log('✅ 测试计划创建成功，ID:', insertedPlan[0].id)
        
        // 立即删除测试记录
        await client
          .from('study_plans')
          .delete()
          .eq('id', insertedPlan[0].id)
        
        console.log('🧹 测试记录已清理')
      }
    }
    
    console.log('🎉 调试完成')
    
  } catch (error) {
    console.error('❌ 调试过程中出错:', error)
  }
}

// 立即执行调试
debugStudyPlanLoading()