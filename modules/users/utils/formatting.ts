/**
 * User Utility Functions
 */
import type { User } from '../types'

/**
 * Format user full name
 */
export function formatUserName(user: User): string {
  return user.name
}

/**
 * Sort users by name
 */
export function sortUsersByName(users: User[], order: 'asc' | 'desc' = 'asc'): User[] {
  return [...users].sort((a, b) => {
    const nameA = formatUserName(a)
    const nameB = formatUserName(b)
    const comparison = nameA.localeCompare(nameB)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter users by search term
 */
export function filterUsers(users: User[], searchTerm: string): User[] {
  if (!searchTerm) return users
  
  const term = searchTerm.toLowerCase()
  return users.filter(user => 
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    user.keycloakUserId.toLowerCase().includes(term)
  )
}

/**
 * Get user by ID
 */
export function getUserById(users: User[], id: number): User | undefined {
  return users.find(user => user.id === id)
}

/**
 * Get user by email
 */
export function getUserByEmail(users: User[], email: string): User | undefined {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase())
}
