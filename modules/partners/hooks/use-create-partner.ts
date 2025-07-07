/**
 * Create Partner Hook
 * Custom hook for creating partners
 */
import { useState } from 'react'
import type { CreatePartnerData } from '../types'
import { PartnerService } from '../services'

/**
 * Hook for creating partners
 */
export function useCreatePartner() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPartner = async (data: CreatePartnerData) => {
    try {
      setIsCreating(true)
      setError(null)
      await PartnerService.create(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createPartner,
    isCreating,
    error,
  }
}
