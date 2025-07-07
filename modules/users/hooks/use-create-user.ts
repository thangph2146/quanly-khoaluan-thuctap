/**
 * Create User Hook
 * Custom hook for creating users
 */
import { useState } from 'react'
import type { CreateUserData } from '../services'
import { UserService } from '../services'

/**
 * Hook for creating users
 */
export function useCreateUser() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = async (data: CreateUserData) => {
    try {
      setIsCreating(true)
      setError(null)
      await UserService.create(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createUser,
    isCreating,
    error,
  }
}
