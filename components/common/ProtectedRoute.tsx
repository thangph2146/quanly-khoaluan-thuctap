'use client'

import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { usePermissions } from '@/contexts/PermissionContext'
import type { PermissionAction } from '@/types/permissions'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProtectedRouteProps {
  module: string
  action: PermissionAction
  children: ReactNode
  fallbackRoute?: string
  showAccessDenied?: boolean
  customAccessDeniedContent?: ReactNode
}

export function ProtectedRoute({ 
  module, 
  action,
  children,
  fallbackRoute = '/access-denied',
  showAccessDenied = true,
  customAccessDeniedContent
}: ProtectedRouteProps) {
  const router = useRouter()
  const { status } = useSession()
  const { canPerform, isLoading, error } = usePermissions()

  const hasPermission = canPerform(module, action)

  useEffect(() => {
    // If not authenticated, let middleware handle redirect to login
    if (status === 'unauthenticated') {
      return
    }

    // If permissions loaded and user doesn't have access, redirect
    if (!isLoading && status === 'authenticated' && !hasPermission && !showAccessDenied) {
      router.replace(fallbackRoute)
    }
  }, [status, isLoading, hasPermission, router, fallbackRoute, showAccessDenied])

  // Still loading session or permissions
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - middleware should handle this, but just in case
  if (status === 'unauthenticated') {
    return null
  }

  // Error loading permissions
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Lỗi kiểm tra quyền truy cập</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button onClick={() => router.push('/')}>
              <Home className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No permission
  if (!hasPermission) {
    // Show custom access denied content
    if (customAccessDeniedContent) {
      return <>{customAccessDeniedContent}</>
    }

    // Show default access denied page
    if (showAccessDenied) {
      return <AccessDeniedContent module={module} action={action} />
    }

    // This shouldn't happen as useEffect should redirect, but just in case
    return null
  }

  // Permission granted, show protected content
  return <>{children}</>
}

// Multi-action protected route
interface MultiActionProtectedRouteProps extends Omit<ProtectedRouteProps, 'action'> {
  module: string
  actions: PermissionAction[]
  requireAll?: boolean
}

export function MultiActionProtectedRoute({ 
  module, 
  actions,
  requireAll = false,
  ...props 
}: MultiActionProtectedRouteProps) {
  const { canPerform } = usePermissions()
  
  const hasPermission = requireAll 
    ? actions.every(action => canPerform(module, action))
    : actions.some(action => canPerform(module, action))

  // Create a fake single action for the base component to work with
  const fakeAction: PermissionAction = 'read'
  
  return (
    <ProtectedRoute 
      {...props} 
      module={module} 
      action={fakeAction}
      children={hasPermission ? props.children : undefined}
    />
  )
}

// Access denied content component
function AccessDeniedContent({ module, action }: { module: string, action: string }) {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Truy cập bị từ chối</CardTitle>
          <CardDescription>
            Bạn không có quyền <strong>{action}</strong> cho module <strong>{module}</strong>.
            Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Tự động chuyển về trang chủ sau 10 giây...
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button onClick={() => router.push('/')}>
              <Home className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specific route protections for common patterns
interface ModuleProtectedRouteProps extends Omit<ProtectedRouteProps, 'action'> {
  module: string
}

export function AdminOnlyRoute(props: ModuleProtectedRouteProps) {
  return (
    <MultiActionProtectedRoute 
      {...props} 
      actions={['create', 'update', 'delete']} 
      requireAll={true}
    />
  )
}

export function ReadOnlyRoute(props: ModuleProtectedRouteProps) {
  return <ProtectedRoute {...props} action="read" />
}

export function EditorRoute(props: ModuleProtectedRouteProps) {
  return (
    <MultiActionProtectedRoute 
      {...props} 
      actions={['update', 'delete']} 
      requireAll={false}
    />
  )
} 