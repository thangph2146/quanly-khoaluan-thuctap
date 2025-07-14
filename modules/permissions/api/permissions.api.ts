import client from '../../../lib/api/client'
import type { PermissionFilters, PermissionMutationData } from '@/modules/permissions/types'
import apiClient from '@/lib/api/client';

// The backend returns a different structure for paginated responses, so we define a specific one here.
export interface PaginatedPermissions {
  data: Permission[]
  total: number
  page: number
  limit: number
}

export interface Permission {
  id: number;
  name: string;
  module: string;
  description?: string;
}

/**
 * Get all permissions (flat list for dropdowns)
 */
export const getAllPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await apiClient.get('/permissions/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all permissions:', error);
    throw error;
  }
};

export const getPermissions = async (
  filters: PermissionFilters = {},
): Promise<PaginatedPermissions> => {
  try {
    const response = await client.get('/permissions', { params: filters })
    if (Array.isArray(response.data)) {
      return { data: response.data, total: response.data.length, page: filters.page || 1, limit: filters.limit || response.data.length };
    }
    return response.data
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

export const getDeletedPermissions = async (
  filters: PermissionFilters = {},
): Promise<PaginatedPermissions> => {
  try {
    const response = await client.get('/permissions/deleted', { params: filters })
    if (Array.isArray(response.data)) {
      return { data: response.data, total: response.data.length, page: filters.page || 1, limit: filters.limit || response.data.length };
    }
    return response.data
  } catch (error) {
    console.error('Error fetching deleted permissions:', error);
    throw error;
  }
}

export const getPermissionById = async (id: number): Promise<Permission> => {
  try {
    const { data } = await client.get(`/permissions/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching permission by ID:', error);
    throw error;
  }
}

export const createPermission = async (permissionData: PermissionMutationData): Promise<Permission> => {
  try {
    const { data } = await client.post('/permissions', permissionData)
    return data
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
}

export const updatePermission = async (
  id: number,
  permissionData: Partial<PermissionMutationData>,
): Promise<Permission> => {
  try {
    const updateData = { id, ...permissionData };
    const { data } = await client.put(`/permissions/${id}`, updateData)
    return data
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
}

export const softDeletePermission = async (id: number): Promise<void> => {
  try {
    await client.post(`/permissions/soft-delete/${id}`)
  } catch (error) {
    console.error('Error soft deleting permission:', error);
    throw error;
  }
}

export const bulkSoftDeletePermissions = async (ids: (number|string)[]): Promise<void> => {
  try {
    await client.post('/permissions/bulk-soft-delete', ids)
  } catch (error) {
    console.error('Error bulk soft deleting permissions:', error);
    throw error;
  }
}

export const restorePermission = async (id: number): Promise<void> => {
  try {
    await client.post(`/permissions/restore/${id}`)
  } catch (error) {
    console.error('Error restoring permission:', error);
    throw error;
  }
}

export const bulkRestorePermissions = async (ids: (number|string)[]): Promise<Permission[]> => {
  try {
    const { data } = await client.post('/permissions/bulk-restore', ids);
    return data;
  } catch (error) {
    console.error('Error bulk restoring permissions:', error);
    throw error;
  }
}

export const permanentDeletePermission = async (id: number): Promise<void> => {
  try {
    await client.delete(`/permissions/permanent-delete/${id}`);
  } catch (error) {
    console.error('Error permanently deleting permission:', error);
    throw error;
  }
}

export const bulkPermanentDeletePermissions = async (ids: (number|string)[]): Promise<void> => {
  try {
    await client.post('/permissions/bulk-permanent-delete', ids);
  } catch (error) {
    console.error('Error bulk permanently deleting permissions:', error);
    throw error;
  }
}

export const getPermissionModules = async (): Promise<string[]> => {
  try {
    const { data } = await client.get('/permissions/modules');
    return data;
  } catch (error) {
    console.error('Error fetching permission modules:', error);
    throw error;
  }
}
