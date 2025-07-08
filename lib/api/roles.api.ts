import httpsAPI from './client'
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/modules/roles/types'

// Get all roles
export const getRoles = async (): Promise<Role[]> => {
	try {
		const response = await httpsAPI.get('/Roles')
		return response.data
	} catch (error) {
		console.error('Failed to fetch roles:', error)
		throw error
	}
}

// Get role by ID
export const getRoleById = async (id: number): Promise<Role> => {
	try {
		const response = await httpsAPI.get(`/Roles/${id}`)
		return response.data
	} catch (error) {
		console.error(`Failed to fetch role ${id}:`, error)
		throw error
	}
}

// Create a new role
export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
	try {
		const response = await httpsAPI.post('/Roles', data)
		return response.data
	} catch (error) {
		console.error('Failed to create role:', error)
		throw error
	}
}

// Update role
export const updateRole = async (
	id: number,
	data: UpdateRoleRequest,
): Promise<Role> => {
	try {
		// First get the current role to merge with update data
		const currentRole = await getRoleById(id)
		
		// The backend expects a full Role object with Id
		const roleData = {
			id: id,
			name: data.name || currentRole.name,
			description: data.description !== undefined ? data.description : currentRole.description,
			// Note: Backend Role model doesn't include permissionIds/menuIds directly
			// These would need to be handled separately through RolePermissions/RoleMenus
		}
		const response = await httpsAPI.put(`/Roles/${id}`, roleData)
		return response.data
	} catch (error) {
		console.error(`Failed to update role ${id}:`, error)
		throw error
	}
}

// Delete role
export const deleteRole = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Roles/${id}`)
	} catch (error) {
		console.error(`Failed to delete role ${id}:`, error)
		throw error
	}
} 