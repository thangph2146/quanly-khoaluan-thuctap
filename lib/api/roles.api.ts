/**
 * Roles API
 * API functions for role management
 */
import type { PaginatedResponse, Role, RoleFilters, RoleMutationData } from '@/modules/roles/types'
import apiClient from './client'

/**
 * Get all roles (paginated)
 */
export const getRoles = async (filters: RoleFilters = {}): Promise<PaginatedResponse<Role>> => {
  try {
    const response = await apiClient.get('/roles', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

/**
 * Get all roles (flat list for dropdowns)
 */
export const getAllRoles = async (): Promise<Role[]> => {
    try {
        const response = await apiClient.get('/roles/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all roles:', error);
        throw error;
    }
}

/**
 * Get deleted roles (paginated)
 */
export const getDeletedRoles = async (filters: RoleFilters = {}): Promise<PaginatedResponse<Role>> => {
  try {
    const response = await apiClient.get('/roles/deleted', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching deleted roles:', error)
    throw error
  }
}

/**
 * Get role by ID
 */
export const getRoleById = async (id: number): Promise<Role> => {
  try {
    const response = await apiClient.get(`/roles/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error)
    throw error
  }
}

/**
 * Create new role
 */
export const createRole = async (data: RoleMutationData): Promise<Role> => {
  try {
    const response = await apiClient.post('/roles', data)
    return response.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

/**
 * Update role
 */
export const updateRole = async (id: number, data: RoleMutationData): Promise<Role> => {
  try {
    const response = await apiClient.put(`/roles/${id}`, { ...data, id })
    return response.data
  } catch (error) {
    console.error(`Error updating role ${id}:`, error)
    throw error
  }
}

/**
 * Soft delete a single role
 */
export const softDeleteRole = async (id: number): Promise<void> => {
  try {
    await apiClient.post(`/roles/soft-delete/${id}`)
  } catch (error) {
    console.error(`Error soft-deleting role ${id}:`, error)
    throw error
  }
}

/**
 * Permanently delete a single role
 */
export const permanentDeleteRole = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/roles/permanent-delete/${id}`)
  } catch (error) {
    console.error(`Error permanently deleting role ${id}:`, error)
    throw error
  }
}

/**
 * Bulk soft delete roles
 */
export const bulkSoftDeleteRoles = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/roles/bulk-soft-delete', ids)
  } catch (error) {
    console.error('Error bulk soft-deleting roles:', error)
    throw error
  }
}

/**
 * Bulk restore roles
 */
export const bulkRestoreRoles = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/roles/bulk-restore', ids)
  } catch (error) {
    console.error('Error bulk restoring roles:', error)
    throw error
  }
}

/**
 * Bulk permanent delete roles
 */
export const bulkPermanentDeleteRoles = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/roles/bulk-permanent-delete', ids)
  } catch (error) {
    console.error('Error bulk permanently deleting roles:', error)
    throw error
  }
} 