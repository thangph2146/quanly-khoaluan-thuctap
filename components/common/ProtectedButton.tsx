'use client'

import { type ReactNode, type ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/contexts/PermissionContext'
import type { PermissionAction } from '@/types/permissions'
import { type VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'

interface ProtectedButtonProps extends ComponentProps<typeof Button> {
  module: string
  action: PermissionAction
  fallback?: ReactNode
  showTooltip?: boolean
  tooltipMessage?: string
}

export function ProtectedButton({ 
  module, 
  action, 
  fallback = null,
  showTooltip = false,
  tooltipMessage,
  children,
  disabled,
  ...props 
}: ProtectedButtonProps) {
  const { canPerform, isLoading } = usePermissions()
  
  // Show loading state
  if (isLoading) {
    return (
      <Button disabled {...props}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        Loading...
      </Button>
    )
  }
  
  const hasPermission = canPerform(module, action)
  
  // No permission, show fallback or nothing
  if (!hasPermission) {
    return <>{fallback}</>
  }
  
  // Permission granted, show button
  return (
    <Button 
      disabled={disabled} 
      {...props}
      title={showTooltip ? tooltipMessage || `${action} ${module}` : undefined}
    >
      {children}
    </Button>
  )
}

// Specific protected buttons for common actions
interface ModuleProtectedButtonProps extends Omit<ProtectedButtonProps, 'action'> {
  module: string
}

export function CreateButton(props: ModuleProtectedButtonProps) {
  return <ProtectedButton {...props} action="create" />
}

export function UpdateButton(props: ModuleProtectedButtonProps) {
  return <ProtectedButton {...props} action="update" />
}

export function DeleteButton(props: ModuleProtectedButtonProps) {
  return <ProtectedButton {...props} action="delete" />
}

export function ExportButton(props: ModuleProtectedButtonProps) {
  return <ProtectedButton {...props} action="export" />
}

export function ApproveButton(props: ModuleProtectedButtonProps) {
  return <ProtectedButton {...props} action="approve" />
}

// Compound button - only shows if user has ANY of the specified actions
interface CompoundProtectedButtonProps extends Omit<ProtectedButtonProps, 'action'> {
  module: string
  actions: PermissionAction[]
  requireAll?: boolean // true = AND logic, false = OR logic
}

export function CompoundProtectedButton({ 
  module, 
  actions, 
  requireAll = false,
  children,
  fallback = null,
  ...props 
}: CompoundProtectedButtonProps) {
  const { canPerform } = usePermissions()
  
  const hasPermission = requireAll 
    ? actions.every(action => canPerform(module, action))
    : actions.some(action => canPerform(module, action))
  
  if (!hasPermission) {
    return <>{fallback}</>
  }
  
  return <Button {...props}>{children}</Button>
} 