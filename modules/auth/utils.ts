import { User, Permission } from './types'

/**
 * Checks if a user has a specific permission.
 * @param user The user object.
 * @param permission The permission to check for.
 * @returns `true` if the user has the permission, otherwise `false`.
 */
export const hasPermission = (
	user: User,
	permission: Permission | undefined
): boolean => {
	if (!permission) {
		// If the item doesn't require a permission, show it.
		return true
	}

	if (user.roles.some((role) => role.name === 'ADMIN')) {
		// Admins have all permissions.
		return true
	}

	return user.roles.some((role) => role.permissions.includes(permission))
} 