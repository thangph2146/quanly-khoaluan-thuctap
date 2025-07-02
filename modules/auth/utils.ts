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
	const isAdmin = user.userRoles?.some(
		(userRole) => userRole.role?.name === 'ADMIN'
	)
	if (isAdmin) {
		return true
	}

	// Check if any role explicitly grants the permission by name
	return (
		user.userRoles?.some((userRole) =>
			userRole.role?.rolePermissions?.some(
				(rp) => rp.permission?.name === permissionName
			)
		) ?? false
	)
} 