import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  type CreateUserData,
  type UpdateUserData
} from '@/lib/api/users.api'
import type { User } from '../types'

/**
 * User Service
 * Business logic layer for user operations
 */
export class UserService {
  /**
   * Get all users
   */
  static async getAll(): Promise<User[]> {
    return await getUsers()
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
   * Delete user
   */
  static async remove(id: number): Promise<void> {
    return await deleteUser(id)
  }
}

// Export types
export type { CreateUserData, UpdateUserData }
