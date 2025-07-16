import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  softDeleteUser,
  getDeletedUsers,
  bulkRestoreUsers,
  bulkPermanentDeleteUsers,
  bulkSoftDeleteUsers,
  type CreateUserData,
  type UpdateUserData
} from '@/modules/users/api/users.api'
import type { User, PaginatedResponse, UserFilters } from '../types'

/**
 * User Service
 * Business logic layer for user operations
 */
export class UserService {
  /**
   * Get all users with pagination
   */
  static async getAll(params: UserFilters): Promise<PaginatedResponse<User>> {
    return await getUsers(params)
  }

  /**
   * Get deleted users with pagination
   */
  static async getDeleted(params: UserFilters): Promise<PaginatedResponse<User>> {
    return await getDeletedUsers(params)
  }

  /**
   * Get user by ID
   */
  static async getById(id: number): Promise<User> {
    return await getUserById(id)
  }

  /**
   * Create new user
   */
  static async create(data: CreateUserData): Promise<User> {
    return await createUser(data)
  }

  /**
   * Update user
   */
  static async update(id: number, data: UpdateUserData): Promise<User> {
    return await updateUser(id, data)
  }

  /**
   * Soft delete user
   */
  static async softDelete(id: number): Promise<void> {
    return await softDeleteUser(id)
  }

  /**
   * Bulk soft delete users
   */
  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return await bulkSoftDeleteUsers(ids);
  }

  /**
   * Bulk restore users
   */
  static async bulkRestore(ids: number[]): Promise<void> {
    return await bulkRestoreUsers(ids);
  }

  /**
   * Bulk permanent delete users
   */
  static async bulkPermanentDelete(ids: number[]): Promise<string> {
    return await bulkPermanentDeleteUsers(ids);
  }
}

// Export types
export type { CreateUserData, UpdateUserData }
