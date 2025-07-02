import httpsAPI from './client'
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/modules/roles/types'

// Get all roles
export const getRoles = async (): Promise<Role[]> => {
	try {
		return await httpsAPI.get('/Roles')
	} catch (error) {
		console.error('Failed to fetch roles:', error)
		throw error
	}
}

// Get role by ID
export const getRoleById = async (id: number): Promise<Role> => {
	try {
		return await httpsAPI.get(`/Roles/${id}`)
	} catch (error) {
		console.error(`Failed to fetch role ${id}:`, error)
		throw error
	}
}

// Create a new role
export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
	try {
		return await httpsAPI.post('/Roles', data)
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
		return await httpsAPI.put(`/Roles/${id}`, data)
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