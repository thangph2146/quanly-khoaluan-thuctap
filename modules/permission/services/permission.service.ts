import { Permission, CreatePermissionData, UpdatePermissionData } from '../types'
import { 
  getPermissions, 
  getPermissionById, 
  getPermissionsByModule, 
  getPermissionModules, 
  createPermission, 
  updatePermission, 
  deletePermission 
} from '@/lib/api/permissions.api'

/**
 * Permission Service
 * Business logic layer for permission operations
 */
export class PermissionService {
  /**
   * Get all permissions
   */
  static async getAll(): Promise<Permission[]> {
    return await getPermissions()
  }

  /**
   * Get permission by ID
   */
  static async getById(id: number): Promise<Permission> {
    return await getPermissionById(id)
  }

  /**
   * Get permissions by module
   */
  static async getByModule(module: string): Promise<Permission[]> {
    return await getPermissionsByModule(module)
  }

  /**
   * Get all modules
   */
  static async getModules(): Promise<string[]> {
    return await getPermissionModules()
  }

  /**
   * Create new permission
   */
  static async create(data: CreatePermissionData): Promise<Permission> {
    return await createPermission(data)
  }

  /**
   * Update permission
   */
  static async update(id: number, data: UpdatePermissionData): Promise<Permission> {
    return await updatePermission(id, data)
  }

  /**
   * Delete permission
   */
  static async remove(id: number): Promise<void> {
    return await deletePermission(id)
  }
}
