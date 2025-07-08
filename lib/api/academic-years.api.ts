import httpsAPI from './client'
import { logger } from '@/lib/utils/logger'
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '@/modules/academic-years/types'

/**
 * Fetches all academic years from the API.
 * @returns A promise that resolves to an array of academic years.
 */
export const getAcademicYears = async (): Promise<AcademicYear[]> => {
	try {
		logger.debug('Fetching all academic years', undefined, 'AcademicYearsAPI')
		
		const response = await httpsAPI.get('/AcademicYears')
		
		logger.info('Successfully fetched academic years', {
			count: response.data?.length || 0,
			data: response.data
		}, 'AcademicYearsAPI')
		
		return response.data
	} catch (error: unknown) {
		logger.error('Error fetching academic years', error, 'AcademicYearsAPI')
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách năm học'
		throw new Error(message)
	}
}

/**
 * Fetches a single academic year by ID.
 * @param id The ID of the academic year to fetch.
 * @returns A promise that resolves to the academic year object.
 */
export const getAcademicYearById = async (id: number): Promise<AcademicYear> => {
	try {
		logger.debug('Fetching academic year by ID', { id }, 'AcademicYearsAPI')
		
		const response = await httpsAPI.get(`/AcademicYears/${id}`)
		
		logger.info('Successfully fetched academic year', {
			id,
			academicYear: response.data
		}, 'AcademicYearsAPI')
		
		return response.data
	} catch (error: unknown) {
		logger.error('Error fetching academic year', { id, error }, 'AcademicYearsAPI')
		const message = error instanceof Error ? error.message : 'Không thể tải thông tin năm học'
		throw new Error(message)
	}
}

/**
 * Creates a new academic year.
 * @param data The data for the new academic year.
 * @returns A promise that resolves to the newly created academic year object.
 */
export const createAcademicYear = async (data: CreateAcademicYearData): Promise<AcademicYear> => {
	try {
		logger.groupStart('Creating Academic Year')
		logger.debug('Input data received', data, 'AcademicYearsAPI')
		
		// Transform camelCase to PascalCase for backend
		const backendData = {
			Name: data.name,
			StartDate: data.startDate,
			EndDate: data.endDate,
		}
		
		logger.debug('Transformed data for backend', {
			original: data,
			transformed: backendData
		}, 'AcademicYearsAPI')
		
		logger.info('Sending POST request to /AcademicYears', backendData, 'AcademicYearsAPI')
		
		const response = await httpsAPI.post('/AcademicYears', backendData)
		
		logger.info('Successfully created academic year', {
			request: backendData,
			response: response.data,
			status: response.status
		}, 'AcademicYearsAPI')
		
		logger.groupEnd()
		return response.data
	} catch (error: unknown) {
		logger.error('Error creating academic year', {
			inputData: data,
			error: error,
			errorMessage: error instanceof Error ? error.message : 'Unknown error'
		}, 'AcademicYearsAPI')
		logger.groupEnd()
		
		const message = error instanceof Error ? error.message : 'Không thể tạo năm học mới'
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
	data: UpdateAcademicYearData,
): Promise<AcademicYear> => {
	try {
		logger.groupStart('Updating Academic Year')
		logger.debug('Update request started', { id, data }, 'AcademicYearsAPI')
		
		// Transform camelCase to PascalCase for backend and include required Id
		const backendData: any = { Id: id } // Backend requires Id field to match URL parameter
		if (data.name !== undefined) backendData.Name = data.name
		if (data.startDate !== undefined) backendData.StartDate = data.startDate
		if (data.endDate !== undefined) backendData.EndDate = data.endDate
		
		logger.debug('Transformed update data for backend', {
			id,
			original: data,
			transformed: backendData,
			fieldsToUpdate: Object.keys(backendData)
		}, 'AcademicYearsAPI')
		
		logger.info('Sending PUT request', { 
			url: `/AcademicYears/${id}`,
			data: backendData 
		}, 'AcademicYearsAPI')
		
		const response = await httpsAPI.put(`/AcademicYears/${id}`, backendData)
		
		logger.info('Successfully updated academic year', {
			id,
			request: backendData,
			response: response.data,
			status: response.status
		}, 'AcademicYearsAPI')
		
		logger.groupEnd()
		return response.data
	} catch (error: unknown) {
		logger.error('Error updating academic year', {
			id,
			inputData: data,
			error: error,
			errorMessage: error instanceof Error ? error.message : 'Unknown error'
		}, 'AcademicYearsAPI')
		logger.groupEnd()
		
		const message = error instanceof Error ? error.message : 'Không thể cập nhật năm học'
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
		logger.debug('Deleting academic year', { id }, 'AcademicYearsAPI')
		
		await httpsAPI.delete(`/AcademicYears/${id}`)
		
		logger.info('Successfully deleted academic year', { id }, 'AcademicYearsAPI')
	} catch (error: unknown) {
		logger.error('Error deleting academic year', {
			id,
			error: error,
			errorMessage: error instanceof Error ? error.message : 'Unknown error'
		}, 'AcademicYearsAPI')
		
		const message = error instanceof Error ? error.message : 'Không thể xóa năm học'
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
