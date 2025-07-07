import httpsAPI from './client'
import type { Internship } from '@/modules/internship/types'

// Define the structure for creating an internship, matching backend Internship model
export interface CreateInternshipData {
	studentId: number
	partnerId: number
	academicYearId: number
	semesterId: number
	reportUrl?: string | null
	grade?: number | null
}

// Define the structure for updating an internship
export interface UpdateInternshipData {
	studentId?: number
	partnerId?: number
	academicYearId?: number
	semesterId?: number
	reportUrl?: string | null
	grade?: number | null
}

/**
 * Fetches all internships from the API.
 * @returns A promise that resolves to an array of internships.
 */
export const getInternships = async (): Promise<Internship[]> => {
	try {
		const response = await httpsAPI.get('/Internships')
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Fetches a single internship by their ID.
 * @param id The ID of the internship to fetch.
 * @returns A promise that resolves to the internship object.
 */
export const getInternshipById = async (id: number): Promise<Internship> => {
	try {
		const response = await httpsAPI.get(`/Internships/${id}`)
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Creates a new internship.
 * @param data The data for the new internship.
 * @returns A promise that resolves to the newly created internship object.
 */
export const createInternship = async (data: CreateInternshipData): Promise<Internship> => {
	try {
		// Debug log the payload
		console.log('Creating internship with payload:', data);
		
		// Create a simplified payload with only the necessary fields
		const payload = {
			studentId: data.studentId,
			partnerId: data.partnerId,
			academicYearId: data.academicYearId,
			semesterId: data.semesterId,
			// Only include these if they're not null/undefined
			...(data.reportUrl ? { reportUrl: data.reportUrl } : {}),
			...(data.grade !== null && data.grade !== undefined ? { grade: data.grade } : {})
		};

		console.log('Sending simplified payload:', payload);
		
		const response = await httpsAPI.post('/Internships', payload);
		return response.data;
	} catch (error: unknown) {
		console.error('Failed to create internship:', error);
		const message = error instanceof Error ? error.message : 'Không thể tạo thực tập mới';
		throw new Error(message);
	}
}

/**
 * Updates an existing internship.
 * @param id The ID of the internship to update.
 * @param data The data to update the internship with.
 * @returns A promise that resolves when the internship is updated.
 */
export const updateInternship = async (
	id: number,
	data: UpdateInternshipData,
): Promise<void> => {
	try {
		await httpsAPI.put(`/Internships/${id}`, { id, ...data })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Deletes an internship by their ID.
 * @param id The ID of the internship to delete.
 * @returns A promise that resolves when the internship is deleted.
 */
export const deleteInternship = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Internships/${id}`)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}