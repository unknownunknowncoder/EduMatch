import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://aonlahundnkxuyxfsmcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbmxhaHVuZG5reHV5eGZzbWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjYwNTUsImV4cCI6MjA3ODY0MjA1NX0.IQswPG1NkJKht83isjWJk5nzuhymzETAf81_71kXaVE';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // 查询用户表的所有字段
    const { data: users, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('查询失败:', error.message);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('用户表字段:', Object.keys(users[0]));
      console.log('用户数据:', users[0]);
    } else {
      console.log('用户表为空');
    }
  } catch (e) {
    console.error('执行失败:', e.message);
  }
})();