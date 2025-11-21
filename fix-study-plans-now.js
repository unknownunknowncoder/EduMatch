// 直接修复 study_plans 表 RLS 问题的脚本
// 使用方法：node fix-study-plans-now.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixStudyPlansRLS() {
  try {
    console.log('🔧 开始修复 study_plans 表的 RLS 问题...')
    console.log('📍 请在 Supabase SQL Editor 中手动执行以下 SQL:\n')
    
    // 读取 SQL 文件
    const sqlContent = readFileSync('./disable-rls-study-plans.sql', 'utf8')
    
    // 提取关键的 SQL 语句
    const keyStatements = [
      'ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;',
      'DROP POLICY IF EXISTS "Users can view their own study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Users can create their own study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Users can update their own study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Users can delete their own study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Anyone can view study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Anyone can create study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Anyone can update study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Anyone can delete study plans" ON study_plans;',
      'DROP POLICY IF EXISTS "Enable read access for all users" ON study_plans;',
      'DROP POLICY IF EXISTS "Enable insert for all users" ON study_plans;',
      'DROP POLICY IF EXISTS "Enable update for all users" ON study_plans;',
      'DROP POLICY IF EXISTS "Enable delete for all users" ON study_plans;'
    ]
    
    console.log('=' .repeat(60))
    console.log('📋 在 Supabase SQL Editor 中依次执行以下语句:')
    console.log('=' .repeat(60))
    
    keyStatements.forEach((stmt, index) => {
      console.log(`\n${index + 1}. ${stmt}`)
    })
    
    console.log('\n' + '=' .repeat(60))
    console.log('🔗 Supabase 控制台: https://app.supabase.com/project/aonlahundnkxuyxfsmcy/database')
    console.log('=' .repeat(60))
    
    console.log('\n💡 执行完上述 SQL 后，学习计划功能就能正常工作了！')
    
  } catch (error) {
    console.error('❌ 修复脚本失败:', error.message)
  }
}

// 立即执行修复
fixStudyPlansRLS()