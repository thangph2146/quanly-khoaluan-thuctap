import {
  getRoles,
  getDeletedRoles,
  getRoleById,
  createRole,
  updateRole,
  softDeleteRole,
  permanentDeleteRole,
  bulkSoftDeleteRoles,
  bulkRestoreRoles,
  bulkPermanentDeleteRoles,
} from '@/lib/api/roles.api'
import type {
  Role,
  RoleMutationData,
  RoleFilters,
  PaginatedResponse,
  UpdateRoleRequest,
} from '../types'

/**
 * Role Service
 * Abstraction layer for role-related business logic.
 */
export class RoleService {
  static async getAll(
    filters: RoleFilters,
  ): Promise<PaginatedResponse<Role>> {
    return getRoles(filters)
  }

  static async getDeleted(
    filters: RoleFilters,
  ): Promise<PaginatedResponse<Role>> {
    return getDeletedRoles(filters)
  }

  static async getById(id: number): Promise<Role> {
    return getRoleById(id)
  }

  static async create(data: RoleMutationData): Promise<Role> {
    return createRole(data)
  }

  static async update(
    id: number,
    data: UpdateRoleRequest,
  ): Promise<Role> {
    return updateRole(id, data)
  }

  static async softDelete(id: number): Promise<void> {
    return softDeleteRole(id)
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteRole(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteRoles(ids)
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreRoles(ids)
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteRoles(ids)
  }
}
