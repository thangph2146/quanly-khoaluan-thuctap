/**
 * Department Service
 */
import { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  softDeleteDepartment, 
  getDeletedDepartments,
  permanentDeleteDepartment,
  bulkPermanentDeleteDepartments,
  bulkRestoreDepartments,
  bulkSoftDeleteDepartments,
  type Department,
  type DepartmentFilters,
  type PaginatedDepartments
} from '@/lib/api/departments.api'
import type { DepartmentMutationData } from '../types'

export class DepartmentService {
  static async getAll(filters: DepartmentFilters): Promise<PaginatedDepartments> {
    return getDepartments(filters)
  }

  static async getDeleted(filters: DepartmentFilters): Promise<PaginatedDepartments> {
    return getDeletedDepartments(filters)
  }

  static async getById(id: number): Promise<Department> {
    return getDepartmentById(id)
  }

  static async create(data: DepartmentMutationData): Promise<Department> {
    return createDepartment({
      name: data.name,
      code: data.code,
      parentDepartmentId: data.parentDepartmentId || undefined,
    })
  }

  static async update(id: number, data: DepartmentMutationData): Promise<Department> {
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

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteDepartments(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteDepartment(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteDepartments(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreDepartments(ids);
  }
}
