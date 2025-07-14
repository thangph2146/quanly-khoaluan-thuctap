import httpsAPI from '../../../lib/api/client'
import type { Role, User, PaginatedResponse, UserFilters } from '@/modules/users/types'

// Define the structure for creating a user, matching backend CreateUserRequest
export interface CreateUserData {
	keycloakUserId: string
	name: string
	email: string
	avatarUrl?: string
	isActive: boolean
	roleIds: number[]
}

// Define the structure for updating a user, matching backend UpdateUserRequest
export interface UpdateUserData {
	name?: string
	email?: string
	avatarUrl?: string
	isActive?: boolean
	roleIds?: number[]
}

/**
 * Fetches all users from the API with pagination and filtering.
 * @returns A promise that resolves to a paginated response of users.
 */
export const getUsers = async (params: UserFilters): Promise<PaginatedResponse<User>> => {
	const response = await httpsAPI.get('/users', { params })
	return response.data
}

/**
 * Fetches all soft-deleted users from the API with pagination and filtering.
 * @returns A promise that resolves to a paginated response of deleted users.
 */
export const getDeletedUsers = async (params: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await httpsAPI.get('/users/deleted', { params });
    return response.data;
}


/**
 * Fetches a single user by their ID.
 * @param id The ID of the user to fetch.
 * @returns A promise that resolves to the user object.
 */
export const getUserById = async (id: number): Promise<User> => {
	const response = await httpsAPI.get(`/users/${id}`)
	return response.data
}

/**
 * Creates a new user.
 * @param data The data for the new user.
 * @returns A promise that resolves to the newly created user object.
 */
export const createUser = async (data: CreateUserData): Promise<User> => {
	const response = await httpsAPI.post('/users', data)
	return response.data
}

/**
 * Updates an existing user.
 * @param id The ID of the user to update.
 * @param data The data to update the user with.
 * @returns A promise that resolves to the updated user object.
 */
export const updateUser = async (
	id: number,
	data: UpdateUserData,
): Promise<User> => {
	const response = await httpsAPI.put(`/users/${id}`, data)
	return response.data
}

/**
 * Soft deletes a user by their ID.
 * @param id The ID of the user to soft delete.
 * @returns A promise that resolves when the user is soft deleted.
 */
export const softDeleteUser = async (id: number): Promise<void> => {
	await httpsAPI.post(`/users/soft-delete/${id}`)
}

/**
 * Permanently deletes a user by their ID.
 * This should be used with caution.
 * @param id The ID of the user to permanently delete.
 */
export const permanentDeleteUser = async (id: number): Promise<void> => {
    await httpsAPI.delete(`/users/permanent-delete/${id}`);
};

/**
 * Bulk soft deletes users by their IDs.
 * @param ids Array of user IDs to soft delete.
 */
export const bulkSoftDeleteUsers = async (ids: number[]): Promise<void> => {
    await httpsAPI.post('/users/bulk-soft-delete', ids);
};

/**
 * Bulk restores users by their IDs.
 * @param ids Array of user IDs to restore.
 */
export const bulkRestoreUsers = async (ids: number[]): Promise<void> => {
    await httpsAPI.post('/users/bulk-restore', ids);
};

/**
 * Bulk permanently deletes users by their IDs.
 * @param ids Array of user IDs to permanently delete.
 */
export const bulkPermanentDeleteUsers = async (ids: number[]): Promise<void> => {
    await httpsAPI.post('/users/bulk-permanent-delete', ids);
};


/**
 * Fetches all roles from the API.
 * @returns A promise that resolves to an array of roles.
 */
export const getRoles = async (): Promise<Role[]> => {
	const response = await httpsAPI.get('/roles')
	return response.data
}
