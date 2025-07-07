// Based on Permission.cs model
export interface Permission {
	id: number
	name: string
	description?: string
	module: string
	rolePermissions?: RolePermission[]
}

// Based on RolePermission.cs model
export interface RolePermission {
	roleId: number
	permissionId: number
	role?: any // Reference to Role type
	permission?: Permission
}

// DTO for creating permission
export interface CreatePermissionData {
	name: string
	description?: string
	module: string
}

// DTO for updating permission
export interface UpdatePermissionData {
	name: string
	description?: string
	module: string
}

// Permission grouped by module for rendering
export interface PermissionModule {
	module: string
	permissions: Permission[]
}
