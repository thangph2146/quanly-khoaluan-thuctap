import { 
  getRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole
} from '@/lib/api/roles.api'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types'

/**
 * Role Service
 * Business logic layer for role operations
 */
export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(): Promise<Role[]> {
    return await getRoles()
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
   * Delete role
   */
  static async remove(id: number): Promise<void> {
    return await deleteRole(id)
  }
}
