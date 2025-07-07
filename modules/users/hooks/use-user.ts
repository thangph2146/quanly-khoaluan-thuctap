/**
 * User Hooks
 * Custom hooks for user management
 */
import { useState, useEffect } from 'react'
import type { User } from '../types'
import type { CreateUserData, UpdateUserData } from '../services'
import { UserService } from '../services'

/**
 * Hook for managing users data
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UserService.getAll()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const refetch = () => {
    fetchUsers()
  }

  return {
    users,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing single user operations
 */
export function useUser(id?: number) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async (userId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UserService.getById(userId)
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUser(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchUser(id)
    }
  }

  return {
    user,
    isLoading,
    error,
    refetch,
  }
}
