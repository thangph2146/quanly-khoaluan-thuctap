import { RoleMenu } from '@/modules/menu/types'
import { RolePermission } from '@/modules/permission/types'

export type RoleName = 'ADMIN' | 'LECTURER' | 'STUDENT' | 'BUSINESS_REP'

// Based on Role.cs
export interface Role {
	id: number
	name: RoleName
	description?: string
    deletedAt?: string

	// Navigation properties
	userRoles?: UserRole[]
	rolePermissions?: RolePermission[]
	roleMenus?: RoleMenu[]
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
}

// Based on UserRole.cs - Junction table
export interface UserRole {
	userId: number
	roleId: number
	user?: User
	role: Role
}

// For API requests
export interface CreateRoleRequest {
	name: string
	description?: string
	permissionIds?: number[]
	menuIds?: number[]
}

export interface UpdateRoleRequest {
	name?: string
	description?: string
	permissionIds?: number[]
	menuIds?: number[]
}

// Basic User interface to avoid circular dependencies
interface User {
	id: number
	name: string
	email: string
} 