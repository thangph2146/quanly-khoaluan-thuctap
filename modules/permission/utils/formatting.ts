import { Permission } from '../types'

/**
 * Get formatted display name for permission
 */
export function getPermissionDisplayName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Get permission statistics
 */
export function getPermissionStats(permission: Permission) {
  return {
    roleCount: permission.rolePermissions?.length || 0,
    id: permission.id,
    module: permission.module,
  }
}

/**
 * Get module color for display
 */
export function getModuleColor(module: string): string {
  const colors: Record<string, string> = {
    User: 'bg-blue-100 text-blue-800 border-blue-200',
    Role: 'bg-green-100 text-green-800 border-green-200',
    Permission: 'bg-purple-100 text-purple-800 border-purple-200',
    Menu: 'bg-orange-100 text-orange-800 border-orange-200',
    Thesis: 'bg-red-100 text-red-800 border-red-200',
    Internship: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Student: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Partner: 'bg-pink-100 text-pink-800 border-pink-200',
    Department: 'bg-teal-100 text-teal-800 border-teal-200',
    AcademicYear: 'bg-lime-100 text-lime-800 border-lime-200',
    Semester: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  }
  return colors[module] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Group permissions by module
 */
export function groupPermissionsByModule(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = []
    }
    acc[permission.module].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)
}

/**
 * Sort permissions by name
 */
export function sortPermissionsByName(permissions: Permission[], order: 'asc' | 'desc' = 'asc'): Permission[] {
  return [...permissions].sort((a, b) => {
    const result = a.name.localeCompare(b.name)
    return order === 'asc' ? result : -result
  })
}

/**
 * Sort permissions by module
 */
export function sortPermissionsByModule(permissions: Permission[], order: 'asc' | 'desc' = 'asc'): Permission[] {
  return [...permissions].sort((a, b) => {
    const result = a.module.localeCompare(b.module)
    return order === 'asc' ? result : -result
  })
}

/**
 * Filter permissions by search term
 */
export function filterPermissions(permissions: Permission[], searchTerm: string): Permission[] {
  if (!searchTerm.trim()) {
    return permissions
  }

  const term = searchTerm.toLowerCase()
  return permissions.filter(
    permission =>
      permission.name.toLowerCase().includes(term) ||
      permission.module.toLowerCase().includes(term) ||
      (permission.description && permission.description.toLowerCase().includes(term))
  )
}

/**
 * Get permission action from name
 */
export function getPermissionAction(name: string): string {
  const parts = name.split('_')
  return parts[0] || 'UNKNOWN'
}

/**
 * Get permission resource from name  
 */
export function getPermissionResource(name: string): string {
  const parts = name.split('_')
  return parts.slice(1).join('_') || 'UNKNOWN'
}

/**
 * Check if permission name is valid format
 */
export function isValidPermissionName(name: string): boolean {
  const pattern = /^[A-Z][A-Z0-9_]*[A-Z0-9]$|^[A-Z]$/
  return pattern.test(name.trim())
}

/**
 * Format permission name to standard format
 */
export function formatPermissionName(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '_')
}
