// 测试打卡功能的 Node.js 脚本
// 在浏览器控制台中运行以测试修复后的功能

async function testCheckinFunction() {
  console.log('🧪 开始测试打卡功能...')
  
  try {
    // 1. 检查 Supabase 配置
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('❌ Supabase 配置缺失')
    }
    
    console.log('✅ Supabase 配置正常')
    
    // 2. 创建客户端并检查认证状态
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, supabaseKey)
    
    const { data: { user }, error: authError } = await client.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ 用户未认证:', authError)
      return false
    }
    
    console.log('✅ 用户认证成功:', { id: user.id, email: user.email })
    
    // 3. 测试查询打卡表
    const { data: checkins, error: queryError } = await client
      .from('study_plan_checkins')
      .select('*')
      .limit(1)
    
    if (queryError) {
      console.error('❌ 查询打卡表失败:', queryError)
      return false
    }
    
    console.log('✅ 打卡表查询成功，记录数:', checkins?.length || 0)
    
    // 4. 测试插入一条测试打卡记录（如果有学习计划的话）
    const { data: plans } = await client
      .from('study_plans')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
    
    if (plans && plans.length > 0) {
      const testCheckin = {
        study_plan_id: plans[0].id,
        user_id: user.id,
        checkin_date: new Date().toISOString().split('T')[0],
        checkin_time: new Date().toTimeString().split(' ')[0],
        notes: '测试打卡记录'
      }
      
      const { data: insertResult, error: insertError } = await client
        .from('study_plan_checkins')
        .insert([testCheckin])
        .select()
      
      if (insertError) {
        console.error('❌ 插入打卡记录失败:', insertError)
        return false
      }
      
      console.log('✅ 插入打卡记录成功:', insertResult)
      
      // 删除测试记录
      await client
        .from('study_plan_checkins')
        .delete()
        .eq('id', insertResult[0].id)
        
      console.log('🧹 测试记录已清理')
    }
    
    console.log('🎉 所有测试通过！打卡功能应该正常工作')
    return true
    
  } catch (error) {
    console.error('❌ 测试失败:', error)
    return false
  }
}

// 自动运行测试
testCheckinFunction()