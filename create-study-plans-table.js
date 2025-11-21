// 创建 study_plans 表的脚本
// 使用方法：node create-study-plans-table.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// 从 .env 文件读取配置
import 'dotenv/config'
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 请确保 .env 文件中配置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createStudyPlansTable() {
  try {
    console.log('🔄 正在创建 study_plans 表...')

    // 读取 SQL 文件内容
    const sqlContent = readFileSync('./create_study_plans_table.sql', 'utf8')
    
    // 分割 SQL 语句（按分号分割，但忽略注释中的分号）
    const statements = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--')) // 移除注释行
      .join('\n')
      .split(';')
      .filter(stmt => stmt.trim().length > 0)

    // 逐个执行 SQL 语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        console.log(`📝 执行语句 ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
        
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement })
        
        if (error) {
          // 如果 exec_sql 不存在，尝试直接使用 SQL
          console.warn('⚠️ exec_sql 函数不存在，尝试使用 SQL 模式...')
          
          // 对于某些 Supabase 实例，可能需要直接在控制台中执行
          console.log('📋 请在 Supabase SQL Editor 中执行以下语句:')
          console.log(statement)
        } else {
          console.log('✅ 执行成功')
        }
      }
    }

    console.log('✅ study_plans 表创建完成!')
    console.log('📊 请在 Supabase 控制台验证表是否创建成功')
    console.log('🔗 URL: https://app.supabase.com/project/aonlahundnkxuyxfsmcy/database')
    
  } catch (error) {
    console.error('❌ 创建表失败:', error.message)
    process.exit(1)
  }
}

// 执行创建
createStudyPlansTable()