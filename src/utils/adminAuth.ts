// 管理员认证工具类

export interface AdminUserInfo {
  username: string
  loginTime: string
}

// 检查是否已登录
export const isAdminLoggedIn = (): boolean => {
  const token = localStorage.getItem('adminToken')
  const userInfo = localStorage.getItem('adminUserInfo')
  return !!(token && userInfo)
}

// 获取管理员用户信息
export const getAdminUserInfo = (): AdminUserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem('adminUserInfo')
    if (!userInfoStr) return null
    
    return JSON.parse(userInfoStr) as AdminUserInfo
  } catch (error) {
    console.error('Error parsing admin user info:', error)
    return null
  }
}

// 验证管理员token（这里可以扩展为更复杂的验证逻辑）
export const validateAdminToken = (): boolean => {
  const token = localStorage.getItem('adminToken')
  if (!token) return false
  
  // 简单的token格式验证
  return token.startsWith('admin-token-')
}

// 管理员登出
export const adminLogout = (): void => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUserInfo')
  // 注意：保留 adminUsername 用于"记住我"功能
}

// 检查登录状态是否过期（可选功能）
export const isLoginExpired = (): boolean => {
  const userInfo = getAdminUserInfo()
  if (!userInfo) return true
  
  const loginTime = new Date(userInfo.loginTime)
  const now = new Date()
  
  // 设置登录过期时间为24小时
  const expiryTime = 24 * 60 * 60 * 1000 // 24小时
  
  return (now.getTime() - loginTime.getTime()) > expiryTime
}

// 强制登出（如果过期）
export const autoLogoutIfExpired = (): boolean => {
  if (isLoginExpired()) {
    adminLogout()
    return true
  }
  return false
}

// 获取登录持续时间
export const getLoginDuration = (): string => {
  const userInfo = getAdminUserInfo()
  if (!userInfo) return '未登录'
  
  const loginTime = new Date(userInfo.loginTime)
  const now = new Date()
  const duration = now.getTime() - loginTime.getTime()
  
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}