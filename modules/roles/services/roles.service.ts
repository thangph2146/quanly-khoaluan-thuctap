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
  bulkPermanentDeleteRoles
} from '@/lib/api/roles.api'
import type { Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters, PaginatedResponse } from '../types'

/**
 * Role Service
 * Business logic layer for role operations
 */
export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(params: RoleFilters): Promise<PaginatedResponse<Role>> {
    return await getRoles(params)
  }

  /**
   * Get deleted roles
   */
  static async getDeleted(params: RoleFilters): Promise<PaginatedResponse<Role>> {
    return await getDeletedRoles(params);
  }

  /**
   * Get role by ID
   */
  static async getById(id: number): Promise<Role> {
    return await getRoleById(id)
  }

  /**
   * Create new role
   */
  static async create(data: CreateRoleRequest): Promise<Role> {
    return await createRole(data)
  }

  /**
   * Update role
   */
  static async update(id: number, data: UpdateRoleRequest): Promise<Role> {
    return await updateRole(id, data)
  }

  /**
   * Soft delete role
   */
  static async softDelete(id: number): Promise<void> {
    return await softDeleteRole(id)
  }

  /**
   * Permanent delete role
   */
  static async permanentDelete(id: number): Promise<void> {
    return await permanentDeleteRole(id);
  }

  /**
   * Bulk soft delete roles
   */
  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return await bulkSoftDeleteRoles(ids);
  }

  /**
   * Bulk restore roles
   */
  static async bulkRestore(ids: number[]): Promise<void> {
    return await bulkRestoreRoles(ids);
  }

  /**
   * Bulk permanent delete roles
   */
  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return await bulkPermanentDeleteRoles(ids);
  }
}
