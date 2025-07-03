import { Department } from '@/modules/academic/types'
import httpsAPI from './client'
import { AxiosError } from 'axios'

export class DepartmentsApi {
  // Lấy danh sách tất cả departments
  static async getAll(): Promise<Department[]> {
    try {
      const response = await httpsAPI.get('/Departments') as Department[]
      return response
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn vị:', error)
      throw new Error('Không thể lấy danh sách đơn vị. Vui lòng thử lại sau.')
    }
  }

  // Lấy department theo ID
  static async getById(id: number): Promise<Department> {
    try {
      const response = await httpsAPI.get(`/Departments/${id}`) as Department
      return response
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn vị:', error)
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error('Không tìm thấy đơn vị')
      }
      throw error
    }
  }

  // Tạo department mới
  static async create(department: Omit<Department, 'id'>): Promise<Department> {
    try {
      const response = await httpsAPI.post('/Departments', department) as Department
      return response
    } catch (error) {
      console.error('Lỗi khi tạo đơn vị:', error)
      throw error
    }
  }

  // Cập nhật department
  static async update(id: number, department: Department): Promise<void> {
    try {
      await httpsAPI.put(`/Departments/${id}`, department)
    } catch (error) {
      console.error('Lỗi khi cập nhật đơn vị:', error)
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error('Không tìm thấy đơn vị')
      }
      throw error
    }
  }

  // Xóa department
  static async delete(id: number): Promise<void> {
    try {
      await httpsAPI.delete(`/Departments/${id}`)
    } catch (error) {
      console.error('Lỗi khi xóa đơn vị:', error)
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new Error('Không tìm thấy đơn vị')
      }
      if (error instanceof AxiosError && error.response?.status === 400) {
        throw new Error('Không thể xóa đơn vị này vì có các đơn vị con.')
      }
      throw error
    }
  }
}
