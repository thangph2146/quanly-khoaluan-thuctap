/**
 * Departments API
 * API functions for department management
 */
import apiClient from './client'

export interface Department {
  id: number
  name: string
  code: string
  parentDepartmentId?: number
  parentDepartment?: Department
  childDepartments?: Department[]
}

export interface DepartmentFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedDepartments {
  data: Department[];
  total: number;
}


/**
 * Get all departments (hierarchical)
 */
export const getDepartments = async (filters: DepartmentFilters = {}): Promise<PaginatedDepartments> => {
  try {
    const response = await apiClient.get('/departments', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw error
  }
}

/**
 * Get all departments (flat list for dropdown)
 */
export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await apiClient.get('/departments/all')
    return response.data
  } catch (error) {
    console.error('Error fetching all departments:', error)
    throw error
  }
}

/**
 * Get department by ID
 */
export const getDepartmentById = async (id: number): Promise<Department> => {
  try {
    const response = await apiClient.get(`/departments/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching department:', error)
    throw error
  }
}

/**
 * Create new department
 */
export const createDepartment = async (data: Omit<Department, 'id'>): Promise<Department> => {
  try {
    const response = await apiClient.post('/departments', data)
    return response.data
  } catch (error) {
    console.error('Error creating department:', error)
    throw error
  }
}

/**
 * Update department
 */
export const updateDepartment = async (id: number, data: Department): Promise<Department> => {
  try {
    const response = await apiClient.put(`/departments/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating department:', error)
    throw error
  }
}

/**
 * Bulk restore departments (if supported)
 */
export const bulkRestoreDepartments = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/departments/bulk-restore', ids)
  } catch (error) {
    console.error('Error bulk restoring departments:', error)
    throw error
  }
}

/**
 * Get all deleted departments (for recycle bin)
 */
export const getDeletedDepartments = async (filters: DepartmentFilters = {}): Promise<PaginatedDepartments> => {
  try {
    const response = await apiClient.get('/departments/deleted', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching deleted departments:', error)
    throw error
  }
}

/**
 * Get all departments (not deleted)
 */
export const getDepartmentList = async (): Promise<Department[]> => {
  try {
    const response = await apiClient.get('/departments/list')
    return response.data
  } catch (error) {
    console.error('Error fetching department list:', error)
    throw error
  }
}

/**
 * Soft delete department
 */
export const softDeleteDepartment = async (id: number): Promise<void> => {
  try {
    await apiClient.post(`/departments/soft-delete/${id}`)
  } catch (error) {
    console.error('Error soft deleting department:', error)
    throw error
  }
}

/**
 * Bulk soft delete departments
 */
export const bulkSoftDeleteDepartments = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/departments/bulk-soft-delete', ids)
  } catch (error) {
    console.error('Error bulk soft deleting departments:', error)
    throw error
  }
}

/**
 * Permanent delete department
 */
export const permanentDeleteDepartment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/departments/permanent-delete/${id}`)
  } catch (error) {
    console.error('Error permanent deleting department:', error)
    throw error
  }
}

/**
 * Bulk permanent delete departments
 */
export const bulkPermanentDeleteDepartments = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/departments/bulk-permanent-delete', ids)
  } catch (error) {
    console.error('Error bulk permanent deleting departments:', error)
    throw error
  }
}
