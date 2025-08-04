export interface ModulePermissions {
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  canExport?: boolean
  canApprove?: boolean
  canAssign?: boolean
  canManageRoles?: boolean
}

export interface UserPermissions {
  [moduleName: string]: ModulePermissions
}

export interface ModuleDefinition {
  name: string
  displayName: string
  description: string
  category: string
  displayOrder: number
  availablePermissions: string[]
  apiPaths: string[]
  menuPaths: string[]
}

export interface ModulesByCategory {
  [category: string]: ModuleDefinition[]
}

export type PermissionAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete'
  | 'export'
  | 'approve'
  | 'assign'
  | 'manageRoles'

export interface PermissionCheckOptions {
  module: string
  action: PermissionAction
  showError?: boolean
} 