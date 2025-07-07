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
	const response = await httpsAPI.get('/Semesters')
	return response.data
}

/**
 * Fetches a single semester by their ID.
 * @param id The ID of the semester to fetch.
 * @returns A promise that resolves to the semester object.
 */
export const getSemesterById = async (id: number): Promise<Semester> => {
	const response = await httpsAPI.get(`/Semesters/${id}`)
	return response.data
}

/**
 * Creates a new semester.
 * @param data The data for the new semester.
 * @returns A promise that resolves to the newly created semester object.
 */
export const createSemester = async (data: CreateSemesterData): Promise<Semester> => {
	try {
		// Prepare payload with both academicYearId and complete AcademicYear object
		const payload = {
			name: data.name,
			academicYearId: data.academicYearId,
			academicYear: {
				id: data.academicYearId,
				name: 'AcademicYear', // Add required name field
				startDate: new Date().toISOString(), // Add required dates
				endDate: new Date().toISOString(),
			},
		}

		const response = await httpsAPI.post('/Semesters', payload)
		return response.data
	} catch (error: unknown) {
		console.error('Error creating semester:', error)
		const message = error instanceof Error ? error.message : 'Không thể tạo học kỳ mới'
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
	const { name, academicYearId } = data
	const response = await httpsAPI.put(`/Semesters/${id}`, { name, academicYearId })
	return response.data
}

/**
 * Deletes a semester by their ID.
 * @param id The ID of the semester to delete.
 * @returns A promise that resolves when the semester is deleted.
 */
export const deleteSemester = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Semesters/${id}`)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
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