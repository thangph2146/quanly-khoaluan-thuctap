import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getCurrentUser } from '@/modules/users/api/users.api'
import type { User } from '@/modules/users/types'

export function useCurrentUser() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Chỉ fetch khi user đã authenticated
      if (status === 'authenticated' && session?.accessToken) {
        try {
          setIsLoading(true)
          setError(null)
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Không thể lấy thông tin user')
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      } else if (status === 'unauthenticated') {
        // User chưa đăng nhập
        setUser(null)
        setIsLoading(false)
        setError(null)
      }
      // Nếu status === 'loading', giữ isLoading = true
    }

    fetchCurrentUser()
  }, [status, session?.accessToken])

  const refetch = async () => {
    if (status === 'authenticated' && session?.accessToken) {
      try {
        setIsLoading(true)
        setError(null)
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể lấy thông tin user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated: status === 'authenticated',
    refetch,
  }
} 