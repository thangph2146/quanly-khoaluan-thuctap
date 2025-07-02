import { Menu } from '@/modules/config/types'
import { Role } from '@/modules/users/types'

/**
 * Defines specific permissions in the system.
 * Based on Permission.cs
 */
export interface Permission {
	id: number
	name: string // e.g., "users:create", "users:read"
	description?: string
	module: string // e.g., "UserManagement", "Academic"
	rolePermissions?: RolePermission[]
}

/**
 * Represents a many-to-many relationship between Role and Permission.
 * Based on RolePermission.cs
 */
export interface RolePermission {
	roleId: number
	role: Role
	permissionId: number
	permission: Permission
}

/**
 * Represents a many-to-many relationship between Role and Menu.
 * Based on RoleMenu.cs
 */
export interface RoleMenu {
	roleId: number
	role: Role
	menuId: number
	menu: Menu
} 