/**
 * Partners Hooks
 * Custom hooks for partner management
 */
import { useState, useEffect } from 'react'
import type { Partner } from '../types'
import { PartnerService } from '../services'

/**
 * Hook for managing partners data
 */
export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await PartnerService.getAll()
      setPartners(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const refetch = () => {
    fetchPartners()
  }

  return {
    partners,
    isLoading,
    error,
    refetch,
  }
}
