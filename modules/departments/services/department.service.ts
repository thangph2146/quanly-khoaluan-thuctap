/**
 * Department Service
 */
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, softDeleteDepartment, type Department } from '@/lib/api/departments.api'
import type { CreateDepartmentData, UpdateDepartmentData } from '../types'

export class DepartmentService {
  static async getAll(): Promise<Department[]> {
    return getDepartments()
  }

  static async getById(id: number): Promise<Department> {
    return getDepartmentById(id)
  }

  static async create(data: CreateDepartmentData): Promise<Department> {
    return createDepartment({
      name: data.name,
      code: data.code,
      parentDepartmentId: data.parentDepartmentId || undefined,
    })
  }

  static async update(id: number, data: UpdateDepartmentData): Promise<Department> {
    const fullData: Department = {
      id,
      name: data.name,
      code: data.code,
      parentDepartmentId: data.parentDepartmentId || undefined,
    }
    return updateDepartment(id, fullData)
  }

  static async delete(id: number): Promise<void> {
    return softDeleteDepartment(id)
  }
}
