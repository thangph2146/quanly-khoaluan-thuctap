/**
 * Role Utility Functions
 */
import type { Role } from '../types'

/**
 * Sort roles by name
 */
export function sortRolesByName(roles: Role[], order: 'asc' | 'desc' = 'asc'): Role[] {
  return [...roles].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter roles by search term
 */
export function filterRoles(roles: Role[], searchTerm: string): Role[] {
  if (!searchTerm) return roles
  
  const term = searchTerm.toLowerCase()
  return roles.filter(role => 
    role.name.toLowerCase().includes(term)
  )
}

/**
 * Get role by ID
 */
export function getRoleById(roles: Role[], id: number): Role | undefined {
  return roles.find(role => role.id === id)
}
