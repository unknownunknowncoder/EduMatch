// 管理员认证相关工具函数

interface AdminUserInfo {
  id: string
  username: string
  nickname?: string
  role: string
  loginTime: number
  expiresAt: number
}

const ADMIN_TOKEN_KEY = 'adminToken'
const ADMIN_USER_KEY = 'adminUserInfo'
const TOKEN_DURATION = 24 * 60 * 60 * 1000 // 24小时

// 检查管理员是否已登录
export function isAdminLoggedIn(): boolean {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    const userInfo = localStorage.getItem(ADMIN_USER_KEY)
    
    if (!token || !userInfo) {
      return false
    }
    
    const user: AdminUserInfo = JSON.parse(userInfo)
    
    // 检查是否过期
    if (Date.now() > user.expiresAt) {
      clearAdminAuth()
      return false
    }
    
    return true
  } catch (error) {
    console.error('检查管理员登录状态失败:', error)
    return false
  }
}

// 自动退出如果已过期
export function autoLogoutIfExpired(): boolean {
  if (!isAdminLoggedIn()) {
    clearAdminAuth()
    return true
  }
  return false
}

// 设置管理员认证信息
export function setAdminAuth(token: string, userInfo: Omit<AdminUserInfo, 'loginTime' | 'expiresAt'>): void {
  try {
    const now = Date.now()
    const fullUserInfo: AdminUserInfo = {
      ...userInfo,
      loginTime: now,
      expiresAt: now + TOKEN_DURATION
    }
    
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(fullUserInfo))
  } catch (error) {
    console.error('设置管理员认证信息失败:', error)
  }
}

// 清除管理员认证信息
export function clearAdminAuth(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
  } catch (error) {
    console.error('清除管理员认证信息失败:', error)
  }
}

// 获取当前管理员用户信息
export function getCurrentAdmin(): AdminUserInfo | null {
  try {
    const userInfo = localStorage.getItem(ADMIN_USER_KEY)
    if (!userInfo) {
      return null
    }
    
    const user: AdminUserInfo = JSON.parse(userInfo)
    
    // 检查是否过期
    if (Date.now() > user.expiresAt) {
      clearAdminAuth()
      return null
    }
    
    return user
  } catch (error) {
    console.error('获取当前管理员信息失败:', error)
    return null
  }
}

// 验证管理员权限
export function hasAdminPermission(requiredRole?: string): boolean {
  const admin = getCurrentAdmin()
  if (!admin) {
    return false
  }
  
  // 如果指定了角色要求，检查角色
  if (requiredRole && admin.role !== requiredRole) {
    return false
  }
  
  return true
}

// 更新管理员信息
export function updateAdminInfo(updates: Partial<AdminUserInfo>): boolean {
  try {
    const admin = getCurrentAdmin()
    if (!admin) {
      return false
    }
    
    const updatedAdmin = { ...admin, ...updates }
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(updatedAdmin))
    return true
  } catch (error) {
    console.error('更新管理员信息失败:', error)
    return false
  }
}

// 检查token是否即将过期（1小时内）
export function isTokenExpiringSoon(): boolean {
  const admin = getCurrentAdmin()
  if (!admin) {
    return false
  }
  
  const oneHour = 60 * 60 * 1000
  return (admin.expiresAt - Date.now()) < oneHour
}