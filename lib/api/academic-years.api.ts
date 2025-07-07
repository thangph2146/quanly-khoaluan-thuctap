import httpsAPI from './client'
import type { AcademicYear } from '@/modules/config/types'

/**
 * Fetches all academic years from the API.
 * @returns A promise that resolves to an array of academic years.
 */
export const getAcademicYears = async (): Promise<AcademicYear[]> => {
	const response = await httpsAPI.get('/AcademicYears')
	return response.data
}

/**
 * Fetches a single academic year by ID.
 * @param id The ID of the academic year to fetch.
 * @returns A promise that resolves to the academic year object.
 */
export const getAcademicYearById = async (id: number): Promise<AcademicYear> => {
	const response = await httpsAPI.get(`/AcademicYears/${id}`)
	return response.data
}

/**
 * Creates a new academic year.
 * @param data The data for the new academic year.
 * @returns A promise that resolves to the newly created academic year object.
 */
export const createAcademicYear = async (data: Omit<AcademicYear, 'id'>): Promise<AcademicYear> => {
	try {
		const response = await httpsAPI.post('/AcademicYears', data)
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Updates an existing academic year.
 * @param id The ID of the academic year to update.
 * @param data The data to update the academic year with.
 * @returns A promise that resolves to the updated academic year object.
 */
export const updateAcademicYear = async (
	id: number,
	data: AcademicYear,
): Promise<AcademicYear> => {
	try {
		const response = await httpsAPI.put(`/AcademicYears/${id}`, data)
		return response.data
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Deletes an academic year by ID.
 * @param id The ID of the academic year to delete.
 * @returns A promise that resolves when the academic year is deleted.
 */
export const deleteAcademicYear = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/AcademicYears/${id}`)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

export const AcademicYearsApi = {
	getAll: getAcademicYears,
	getById: getAcademicYearById,
	create: createAcademicYear,
	update: updateAcademicYear,
	delete: deleteAcademicYear,
}
