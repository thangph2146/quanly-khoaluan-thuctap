import { Student } from '@/modules/students/types'
import httpsAPI from './client'
import { AxiosError } from 'axios'

export class StudentsApi {
	// Lấy danh sách tất cả sinh viên
	static async getAll(): Promise<Student[]> {
		try {
			const response = await httpsAPI.get('/Students')
			return response.data
		} catch (error) {
			console.error('Error fetching students:', error)
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || 'Không thể tải danh sách sinh viên')
			}
			throw new Error('Không thể tải danh sách sinh viên')
		}
	}

	// Lấy thông tin sinh viên theo ID
	static async getById(id: number): Promise<Student> {
		try {
			const response = await httpsAPI.get(`/Students/${id}`)
			return response.data
		} catch (error) {
			console.error('Error fetching student:', error)
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || 'Không thể tải thông tin sinh viên')
			}
			throw new Error('Không thể tải thông tin sinh viên')
		}
	}

	// Tạo sinh viên mới
	static async create(student: Omit<Student, 'id'>): Promise<Student> {
		try {
			const response = await httpsAPI.post('/Students', student)
			return response.data
		} catch (error) {
			console.error('Error creating student:', error)
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || 'Không thể tạo sinh viên mới')
			}
			throw new Error('Không thể tạo sinh viên mới')
		}
	}

	// Cập nhật thông tin sinh viên
	static async update(id: number, student: Student): Promise<Student> {
		try {
			const response = await httpsAPI.put(`/Students/${id}`, student)
			return response.data
		} catch (error) {
			console.error('Error updating student:', error)
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin sinh viên')
			}
			throw new Error('Không thể cập nhật thông tin sinh viên')
		}
	}

	// Xóa sinh viên
	static async delete(id: number): Promise<void> {
		try {
			await httpsAPI.delete(`/Students/${id}`)
		} catch (error) {
			console.error('Error deleting student:', error)
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || 'Không thể xóa sinh viên')
			}
			throw new Error('Không thể xóa sinh viên')
		}
	}
}
