import httpsAPI from './client'
import type { Partner } from '@/modules/partners/types'

// Define the structure for creating a partner, matching backend Partner model
export interface CreatePartnerData {
	name: string
	address: string
	phoneNumber: string
	email: string
}

// Define the structure for updating a partner
export interface UpdatePartnerData {
	name?: string
	address?: string
	phoneNumber?: string
	email?: string
}

/**
 * Fetches all partners from the API.
 * @returns A promise that resolves to an array of partners.
 */
export const getPartners = async (): Promise<Partner[]> => {
	try {
		const response = await httpsAPI.get('/Partners')
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Fetches a single partner by their ID.
 * @param id The ID of the partner to fetch.
 * @returns A promise that resolves to the partner object.
 */
export const getPartnerById = async (id: number): Promise<Partner> => {
	try {
		const response = await httpsAPI.get(`/Partners/${id}`)
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Creates a new partner.
 * @param data The data for the new partner.
 * @returns A promise that resolves to the newly created partner object.
 */
export const createPartner = async (data: CreatePartnerData): Promise<Partner> => {
	try {
		const response = await httpsAPI.post('/Partners', data)
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Updates an existing partner.
 * @param id The ID of the partner to update.
 * @param data The data to update the partner with.
 * @returns A promise that resolves when the partner is updated.
 */
export const updatePartner = async (
	id: number,
	data: UpdatePartnerData,
): Promise<void> => {
	try {
		await httpsAPI.put(`/Partners/${id}`, { id, ...data })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Deletes a partner by their ID.
 * @param id The ID of the partner to delete.
 * @returns A promise that resolves when the partner is deleted.
 */
export const deletePartner = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Partners/${id}`)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}
