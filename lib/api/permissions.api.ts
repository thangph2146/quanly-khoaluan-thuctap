import httpsAPI from './client'
import type { Permission, CreatePermissionData, UpdatePermissionData } from '@/modules/permission/types'

/**
 * Fetches all permissions from the API.
 * @returns A promise that resolves to an array of permissions.
 */
export const getPermissions = async (): Promise<Permission[]> => {
	try {
		const response = await httpsAPI.get('/Permissions')
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching permissions:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách permission'
		throw new Error(message)
	}
}

/**
 * Fetches a single permission by ID.
 * @param id The ID of the permission to fetch.
 * @returns A promise that resolves to the permission object.
 */
export const getPermissionById = async (id: number): Promise<Permission> => {
	try {
		const response = await httpsAPI.get(`/Permissions/${id}`)
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching permission:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải thông tin permission'
		throw new Error(message)
	}
}

/**
 * Fetches permissions by module.
 * @param module The module to filter by.
 * @returns A promise that resolves to an array of permissions.
 */
export const getPermissionsByModule = async (module: string): Promise<Permission[]> => {
	try {
		const response = await httpsAPI.get(`/Permissions/by-module/${module}`)
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching permissions by module:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách permission theo module'
		throw new Error(message)
	}
}

/**
 * Fetches all available modules.
 * @returns A promise that resolves to an array of module names.
 */
export const getModules = async (): Promise<string[]> => {
	try {
		const response = await httpsAPI.get('/Permissions/modules')
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching modules:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách module'
		throw new Error(message)
	}
}

/**
 * Creates a new permission.
 * @param data The data for creating the permission.
 * @returns A promise that resolves to the newly created permission object.
 */
export const createPermission = async (data: CreatePermissionData): Promise<Permission> => {
	try {
		const response = await httpsAPI.post('/Permissions', data)
		return response.data
	} catch (error: unknown) {
		console.error('Error creating permission:', error)
		const message = error instanceof Error ? error.message : 'Không thể tạo permission mới'
		throw new Error(message)
	}
}

/**
 * Updates an existing permission.
 * @param id The ID of the permission to update.
 * @param data The data to update the permission with.
 * @returns A promise that resolves to the updated permission object.
 */
export const updatePermission = async (id: number, data: UpdatePermissionData): Promise<Permission> => {
	try {
		const response = await httpsAPI.put(`/Permissions/${id}`, data)
		return response.data
	} catch (error: unknown) {
		console.error('Error updating permission:', error)
		const message = error instanceof Error ? error.message : 'Không thể cập nhật permission'
		throw new Error(message)
	}
}

/**
 * Deletes a permission by ID.
 * @param id The ID of the permission to delete.
 * @returns A promise that resolves when the permission is deleted.
 */
export const deletePermission = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Permissions/${id}`)
	} catch (error: unknown) {
		console.error('Error deleting permission:', error)
		const message = error instanceof Error ? error.message : 'Không thể xóa permission'
		throw new Error(message)
	}
}

export const PermissionsApi = {
	getAll: getPermissions,
	getById: getPermissionById,
	getByModule: getPermissionsByModule,
	getModules: getModules,
	create: createPermission,
	update: updatePermission,
	delete: deletePermission,
}
