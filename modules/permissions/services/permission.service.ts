/**
 * Permission Service
 */
import { 
  getPermissions, 
  getPermissionById, 
  createPermission, 
  updatePermission, 
  softDeletePermission, 
  getDeletedPermissions,
  permanentDeletePermission,
  bulkPermanentDeletePermissions,
  bulkRestorePermissions,
  bulkSoftDeletePermissions,
  getPermissionModules,
  type PaginatedPermissions,
} from '@/modules/permissions/api/permissions.api'
import type { Permission, PermissionMutationData, PermissionFilters } from '../types'

export class PermissionService {
  static async getAll(filters: PermissionFilters): Promise<PaginatedPermissions> {
    const response = await getPermissions(filters);
    // The API might return a flat list for non-paginated endpoints
    if (Array.isArray(response)) {
      return {
        data: response,
        total: response.length,
        page: 1,
        limit: response.length,
      };
    }
    return response;
  }

  static async getDeleted(filters: PermissionFilters): Promise<PaginatedPermissions> {
    return getDeletedPermissions(filters)
  }

  static async getById(id: number): Promise<Permission> {
    return getPermissionById(id)
  }

  static async create(data: PermissionMutationData): Promise<Permission> {
    return createPermission(data);
  }

  static async update(id: number, data: PermissionMutationData): Promise<Permission> {
    return updatePermission(id, data);
  }

  static async delete(id: number): Promise<void> {
    return softDeletePermission(id)
  }

  static async bulkSoftDelete(ids: (number|string)[]): Promise<void> {
    return bulkSoftDeletePermissions(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeletePermission(id);
  }

  static async bulkPermanentDelete(ids: (number|string)[]): Promise<void> {
    return bulkPermanentDeletePermissions(ids);
  }
  
  static async bulkRestore(ids: (number|string)[]): Promise<Permission[]> {
    return bulkRestorePermissions(ids);
  }

  static async getModules(): Promise<string[]> {
    return getPermissionModules();
  }
} 