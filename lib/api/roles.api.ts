import client from '@/lib/api/client'
import type { PaginatedResponse, Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters } from '@/modules/roles/types'

export const getRoles = async (params: RoleFilters): Promise<PaginatedResponse<Role>> => {
  const response = await client.get('/roles', { params })
  return response.data
}

export const getDeletedRoles = async (params: RoleFilters): Promise<PaginatedResponse<Role>> => {
  const response = await client.get('/roles/deleted', { params })
  return response.data
}

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await client.get('/roles/all');
  return response.data;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const response = await client.get(`/roles/${id}`)
  return response.data
}

export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
  const response = await client.post('/roles', data)
  return response.data
}

export const updateRole = async (id: number, data: UpdateRoleRequest): Promise<Role> => {
  const response = await client.put(`/roles/${id}`, data)
  return response.data
}

export const softDeleteRole = async (id: number): Promise<void> => {
  await client.post(`/roles/soft-delete/${id}`)
}

export const permanentDeleteRole = async (id: number): Promise<void> => {
  await client.delete(`/roles/permanent-delete/${id}`)
}

export const bulkSoftDeleteRoles = async (ids: number[]): Promise<void> => {
  await client.post('/roles/bulk-soft-delete', ids)
}

export const bulkRestoreRoles = async (ids: number[]): Promise<void> => {
  await client.post('/roles/bulk-restore', ids)
}

export const bulkPermanentDeleteRoles = async (ids: number[]): Promise<void> => {
  await client.post('/roles/bulk-permanent-delete', ids)
} 