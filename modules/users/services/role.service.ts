/**
 * Role Service
 * Service for role management
 */
import { getRoles } from '@/lib/api/roles.api'
import type { Role } from '../types'

export class RoleService {
  /**
   * Get all roles
   */
  static async getAll(): Promise<Role[]> {
    const roles = await getRoles()
    return roles as Role[]
  }
}
