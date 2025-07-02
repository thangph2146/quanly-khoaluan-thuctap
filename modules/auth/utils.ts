import { User } from '@/modules/users/types'

/**
 * Checks if a user has a specific permission based on the permission name.
 * @param user The user object.
 * @param permissionName The name of the permission to check for (e.g., "dashboard:view").
 * @returns `true` if the user has the permission, otherwise `false`.
 */
export const hasPermission = (
	user: User,
	permissionName: string | undefined
): boolean => {
	if (!permissionName) {
		// If the item doesn't require a permission, show it.
		return true
	}

	// Check if any of the user's roles is 'ADMIN'
	const isAdmin = user.userRoles?.includes('ADMIN')
	if (isAdmin) {
		return true
	}

	// For now, since userRoles is simplified to string array,
	// we'll need to implement more sophisticated permission checking
	// by fetching role permissions from the backend when needed
	// This is a simplified version that grants access based on role names
	const hasRequiredRole = user.userRoles?.some(roleName => {
		// Add role-based permission logic here based on your requirements
		switch (roleName) {
			case 'ADMIN':
				return true
			case 'LECTURER':
				return permissionName.includes('lecture') || permissionName.includes('student')
			case 'STUDENT':
				return permissionName.includes('student') && !permissionName.includes('manage')
			default:
				return false
		}
	})

	return hasRequiredRole ?? false
} 