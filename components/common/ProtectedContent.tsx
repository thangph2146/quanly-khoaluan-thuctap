'use client'

import { type ReactNode } from 'react'
import { usePermissions } from '@/contexts/PermissionContext'
import type { PermissionAction } from '@/types/permissions'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProtectedContentProps {
  module: string
  action: PermissionAction
  children: ReactNode
  fallback?: ReactNode
  showPermissionDenied?: boolean
  permissionDeniedMessage?: string
  requireAll?: boolean // For multiple actions
}

export function ProtectedContent({ 
  module, 
  action,
  children,
  fallback = null,
  showPermissionDenied = false,
  permissionDeniedMessage = 'Bạn không có quyền truy cập nội dung này'
}: ProtectedContentProps) {
  const { canPerform, isLoading } = usePermissions()
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-2">Đang kiểm tra quyền truy cập...</span>
      </div>
    )
  }
  
  const hasPermission = canPerform(module, action)
  
  // No permission
  if (!hasPermission) {
    // Show custom permission denied message
    if (showPermissionDenied) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{permissionDeniedMessage}</AlertDescription>
        </Alert>
      )
    }
    
    // Show fallback or nothing
    return <>{fallback}</>
  }
  
  // Permission granted, show content
  return <>{children}</>
}

// Multi-action protected content
interface MultiActionProtectedContentProps extends Omit<ProtectedContentProps, 'action'> {
  module: string
  actions: PermissionAction[]
  requireAll?: boolean // true = AND logic, false = OR logic
}

export function MultiActionProtectedContent({ 
  module, 
  actions,
  requireAll = false,
  children,
  fallback = null,
  showPermissionDenied = false,
  permissionDeniedMessage = 'Bạn không có quyền truy cập nội dung này'
}: MultiActionProtectedContentProps) {
  const { canPerform, isLoading } = usePermissions()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-2">Đang kiểm tra quyền truy cập...</span>
      </div>
    )
  }
  
  const hasPermission = requireAll 
    ? actions.every(action => canPerform(module, action))
    : actions.some(action => canPerform(module, action))
  
  if (!hasPermission) {
    if (showPermissionDenied) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{permissionDeniedMessage}</AlertDescription>
        </Alert>
      )
    }
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Specific protected content for common patterns
interface ModuleProtectedContentProps extends Omit<ProtectedContentProps, 'action'> {
  module: string
}

export function ReadOnlyContent(props: ModuleProtectedContentProps) {
  return <ProtectedContent {...props} action="read" />
}

export function AdminOnlyContent(props: ModuleProtectedContentProps) {
  return <MultiActionProtectedContent {...props} actions={['create', 'update', 'delete']} requireAll={true} />
}

export function EditorContent(props: ModuleProtectedContentProps) {
  return <MultiActionProtectedContent {...props} actions={['update', 'delete']} requireAll={false} />
}

// HOC version for wrapping components
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  module: string,
  action: PermissionAction,
  fallback?: ReactNode
) {
  return function PermissionWrapper(props: P) {
    return (
      <ProtectedContent module={module} action={action} fallback={fallback}>
        <WrappedComponent {...props} />
      </ProtectedContent>
    )
  }
}

// Conditional rendering hook
export function useConditionalRender() {
  const { canPerform, isLoading } = usePermissions()
  
  return {
    renderIf: (module: string, action: PermissionAction, content: ReactNode, fallback?: ReactNode) => {
      if (isLoading) return <div>Loading permissions...</div>
      return canPerform(module, action) ? content : (fallback || null)
    },
    
    renderIfAny: (module: string, actions: PermissionAction[], content: ReactNode, fallback?: ReactNode) => {
      if (isLoading) return <div>Loading permissions...</div>
      const hasAnyPermission = actions.some(action => canPerform(module, action))
      return hasAnyPermission ? content : (fallback || null)
    },
    
    renderIfAll: (module: string, actions: PermissionAction[], content: ReactNode, fallback?: ReactNode) => {
      if (isLoading) return <div>Loading permissions...</div>
      const hasAllPermissions = actions.every(action => canPerform(module, action))
      return hasAllPermissions ? content : (fallback || null)
    },
    
    isLoading
  }
} 