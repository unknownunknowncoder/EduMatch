// 数据库配置文件
export interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'mongodb' | 'firebase' | 'supabase'
  host?: string
  port?: number
  database: string
  username?: string
  password?: string
  connectionString?: string
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

// 数据库连接状态枚举
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

// 数据库连接接口
export interface DatabaseConnection {
  status: ConnectionStatus
  lastConnected?: Date
  error?: string
}

// 数据库连接状态枚举
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

// 数据库连接接口
export interface DatabaseConnection {
  status: ConnectionStatus
  lastConnected?: Date
  error?: string
}

// Supabase配置
export const supabaseConfig: DatabaseConfig = {
  type: 'supabase',
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  connectionString: import.meta.env.VITE_SUPABASE_URL || ''
}

// 开发环境配置 (使用Supabase)
export const devConfig: DatabaseConfig = supabaseConfig

// 生产环境配置 (使用环境变量)
export const prodConfig: DatabaseConfig = supabaseConfig

// Firebase配置示例
export const firebaseConfig: DatabaseConfig = {
  type: 'firebase',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// 获取当前环境的数据库配置
export const getDatabaseConfig = (): DatabaseConfig => {
  const env = import.meta.env.MODE
  
  if (env === 'production') {
    return prodConfig
  }
  
  return devConfig
}

// 导出当前配置
export const dbConfig = getDatabaseConfig()

// 检查Supabase配置是否完整
export const isSupabaseConfigured = (): boolean => {
  const config = getDatabaseConfig()
  return !!(config.connectionString && config.apiKey)
}

// 数据库连接状态
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

export interface DatabaseConnection {
  status: ConnectionStatus
  error?: string
  lastConnected?: Date
}

// 默认连接状态
export const defaultConnection: DatabaseConnection = {
  status: ConnectionStatus.DISCONNECTED
}