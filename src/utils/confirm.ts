// 通用确认对话框工具
import { createApp, ref } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    // 创建一个容器div
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 创建Vue应用实例
    const app = createApp(ConfirmDialog, {
      ...options,
      onConfirm: () => {
        cleanup()
        resolve(true)
      },
      onCancel: () => {
        cleanup()
        resolve(false)
      }
    })

    // 挂载组件
    const vm = app.mount(container)

    // 显示对话框
    vm.show()

    // 清理函数
    const cleanup = () => {
      app.unmount()
      document.body.removeChild(container)
    }
  })
}