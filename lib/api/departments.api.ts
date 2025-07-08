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

/**
 * Get all departments (hierarchical)
 */
export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await apiClient.get('/departments')
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
 * Delete department
 */
export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/departments/${id}`)
  } catch (error) {
    console.error('Error deleting department:', error)
    throw error
  }
}
