// 通用工具函数

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 合并 Tailwind CSS 类名的工具函数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'YYYY-MM-DD HH:mm':
      return `${year}-${month}-${day} ${hours}:${minutes}`
    case 'YYYY-MM-DD HH:mm:ss':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    default:
      return `${year}-${month}-${day}`
  }
}

// 相对时间格式化
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) {
    return `${diffDays}天前`
  } else if (diffHours > 0) {
    return `${diffHours}小时前`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`
  } else {
    return '刚刚'
  }
}

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, wait)
    }
  }
}

// 深拷贝
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

// 生成随机ID
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// 检查是否为空值
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }
  
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  
  if (Array.isArray(value)) {
    return value.length === 0
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  
  return false
}