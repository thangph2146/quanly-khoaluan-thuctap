import httpsAPI from './client'
import type { Thesis } from '@/modules/thesis/types'

// Define the structure for creating a thesis, matching backend Thesis model
export interface CreateThesisData {
	title: string
	studentId: number
	academicYearId: number
	semesterId: number
	submissionDate: string
}

// Define the structure for updating a thesis
export interface UpdateThesisData {
	title?: string
	studentId?: number
	academicYearId?: number
	semesterId?: number
	submissionDate?: string
}

// Get all theses
export const getTheses = async (): Promise<Thesis[]> => {
	try {
		const response = await httpsAPI.get<Thesis[]>('/Theses')
		return response.data
	} catch (error) {
		console.error('Error fetching theses:', error)
		throw new Error('Không thể tải danh sách khóa luận')
	}
}

// Get a single thesis by ID
export const getThesis = async (id: number): Promise<Thesis> => {
	try {
		const response = await httpsAPI.get<Thesis>(`/Theses/${id}`)
		return response.data
	} catch (error) {
		console.error('Error fetching thesis:', error)
		throw new Error('Không thể tải thông tin khóa luận')
	}
}

// Create a new thesis
export const createThesis = async (data: CreateThesisData): Promise<Thesis> => {
	try {
		const response = await httpsAPI.post<Thesis>('/Theses', data)
		return response.data
	} catch (error) {
		console.error('Error creating thesis:', error)
		throw new Error('Không thể tạo khóa luận mới')
	}
}

// Update an existing thesis
export const updateThesis = async (id: number, data: UpdateThesisData): Promise<Thesis> => {
	try {
		const response = await httpsAPI.put<Thesis>(`/Theses/${id}`, data)
		return response.data
	} catch (error) {
		console.error('Error updating thesis:', error)
		throw new Error('Không thể cập nhật khóa luận')
	}
}

// Delete a thesis
export const deleteThesis = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Theses/${id}`)
	} catch (error) {
		console.error('Error deleting thesis:', error)
		throw new Error('Không thể xóa khóa luận')
	}
}
