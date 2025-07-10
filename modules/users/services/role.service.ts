/**
 * Role Service
 * Service for role management
 */
import { getAllRoles } from '@/lib/api/roles.api'
import type { Role as UserModuleRole } from '../types'
import type { Role as RolesModuleRole } from '@/modules/roles/types'

export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(): Promise<UserModuleRole[]> {
    const rolesFromApi = await getAllRoles()
    
    // The Role type from roles/types is slightly different from users/types
    // due to how the nested 'User' type is defined to avoid circular deps.
    // We map the properties to satisfy TypeScript. The structures are compatible
    // for what the UserForm needs (id, name, description).
    const mappedRoles: UserModuleRole[] = (rolesFromApi as RolesModuleRole[]).map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
    }));

    return mappedRoles;
  }
}
