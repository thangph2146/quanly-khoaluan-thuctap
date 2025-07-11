/**
 * Role Service
 */
import { 
  getRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  softDeleteRole, 
  getDeletedRoles,
  permanentDeleteRole,
  bulkPermanentDeleteRoles,
  bulkRestoreRoles,
  bulkSoftDeleteRoles,
} from '@/lib/api/roles.api'
import type { Role, RoleFilters, PaginatedResponse, RoleMutationData } from '../types'

export class RoleService {
  static async getAll(filters: RoleFilters): Promise<PaginatedResponse<Role>> {
    return getRoles(filters)
  }

  static async getDeleted(filters: RoleFilters): Promise<PaginatedResponse<Role>> {
    return getDeletedRoles(filters)
  }

  static async getById(id: number): Promise<Role> {
    return getRoleById(id)
  }

  static async create(data: RoleMutationData): Promise<Role> {
    return createRole({
      name: data.name,
      description: data.description || null,
      permissionIds: data.permissionIds || [],
    })
  }

  static async update(id: number, data: RoleMutationData): Promise<Role> {
    return updateRole(id, {
      name: data.name,
      description: data.description || null,
      permissionIds: data.permissionIds || [],
    })
  }

  static async delete(id: number): Promise<void> {
    return softDeleteRole(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteRoles(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteRole(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteRoles(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreRoles(ids);
  }
} 