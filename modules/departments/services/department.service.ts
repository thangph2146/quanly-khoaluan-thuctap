/**
 * Department Service
 */
import { DepartmentsApi } from '@/lib/api/departments.api'
import type { Department, CreateDepartmentData, UpdateDepartmentData } from '../types'

export class DepartmentService {
  static async getAll(): Promise<Department[]> {
    return DepartmentsApi.getAll() as Promise<Department[]>
  }

  static async getById(id: number): Promise<Department> {
    return DepartmentsApi.getById(id) as Promise<Department>
  }

  static async create(data: CreateDepartmentData): Promise<Department> {
    return DepartmentsApi.create({
      name: data.name,
      code: data.code,
      parentDepartmentId: data.parentDepartmentId,
    }) as Promise<Department>
  }

  static async update(id: number, data: UpdateDepartmentData): Promise<void> {
    const fullData = {
      id,
      name: data.name,
      code: data.code,
      parentDepartmentId: data.parentDepartmentId,
    }
    return DepartmentsApi.update(id, fullData as any)
  }

  static async delete(id: number): Promise<void> {
    return DepartmentsApi.delete(id)
  }
}
