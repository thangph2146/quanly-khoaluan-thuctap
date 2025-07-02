import httpsAPI from './client'
import type { Role, User } from '@/modules/users/types'

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
 * Fetches all users from the API.
 * @returns A promise that resolves to an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
	const response = (await httpsAPI.get('/Users')) as User[]
	return response
}

/**
 * Fetches a single user by their ID.
 * @param id The ID of the user to fetch.
 * @returns A promise that resolves to the user object.
 */
export const getUserById = async (id: number): Promise<User> => {
	const response = (await httpsAPI.get(`/Users/${id}`)) as User
	return response
}

/**
 * Creates a new user.
 * @param data The data for the new user.
 * @returns A promise that resolves to the newly created user object.
 */
export const createUser = async (data: CreateUserData): Promise<User> => {
	const response = (await httpsAPI.post('/Users', data)) as User
	return response
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
	const response = (await httpsAPI.put(`/Users/${id}`, data)) as User
	return response
}

/**
 * Deletes a user by their ID.
 * @param id The ID of the user to delete.
 * @returns A promise that resolves when the user is deleted.
 */
export const deleteUser = async (id: number): Promise<void> => {
	await httpsAPI.delete(`/Users/${id}`)
}

/**
 * Fetches all roles from the API.
 * @returns A promise that resolves to an array of roles.
 */
export const getRoles = async (): Promise<Role[]> => {
	const response = (await httpsAPI.get('/Roles')) as Role[]
	return response
}
