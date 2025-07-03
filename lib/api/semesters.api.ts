import httpsAPI from './client'
import type { Semester } from '@/modules/config/types'

// Define the structure for creating a semester - match backend Semester model
export interface CreateSemesterData {
	name: string
	academicYearId: number
}

// Define the structure for updating a semester
export interface UpdateSemesterData {
	name?: string
	academicYearId?: number
}

/**
 * Fetches all semesters from the API.
 * @returns A promise that resolves to an array of semesters.
 */
export const getSemesters = async (): Promise<Semester[]> => {
	const response = (await httpsAPI.get('/Semesters')) as Semester[]
	return response
}

/**
 * Fetches a single semester by their ID.
 * @param id The ID of the semester to fetch.
 * @returns A promise that resolves to the semester object.
 */
export const getSemesterById = async (id: number): Promise<Semester> => {
	const response = (await httpsAPI.get(`/Semesters/${id}`)) as Semester
	return response
}

/**
 * Creates a new semester.
 * @param data The data for the new semester.
 * @returns A promise that resolves to the newly created semester object.
 */
export const createSemester = async (data: CreateSemesterData): Promise<Semester> => {
	try {
		// Send minimal data that matches what the backend can handle
		const semesterPayload = {
			name: data.name,
			academicYearId: data.academicYearId
		}
		const response = (await httpsAPI.post('/Semesters', semesterPayload)) as Semester
		return response
	} catch (error: any) {
		const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Updates an existing semester.
 * @param id The ID of the semester to update.
 * @param data The data to update the semester with.
 * @returns A promise that resolves to the updated semester object.
 */
export const updateSemester = async (
	id: number,
	data: UpdateSemesterData,
): Promise<Semester> => {
	try {
		// Send minimal data that matches what the backend can handle
		const semesterPayload = {
			name: data.name,
			academicYearId: data.academicYearId
		}
		const response = (await httpsAPI.put(`/Semesters/${id}`, semesterPayload)) as Semester
		return response
	} catch (error: any) {
		const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

/**
 * Deletes a semester by their ID.
 * @param id The ID of the semester to delete.
 * @returns A promise that resolves when the semester is deleted.
 */
export const deleteSemester = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Semesters/${id}`)
	} catch (error: any) {
		const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi không xác định'
		throw new Error(message)
	}
}

export const SemestersApi = {
	getAll: getSemesters,
	getById: getSemesterById,
	create: createSemester,
	update: updateSemester,
	delete: deleteSemester,
}
	