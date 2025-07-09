/**
 * Thesis Hooks
 * Custom hooks for thesis management
 */
import { useState, useEffect } from 'react'
import type { CreateThesisData, Thesis, UpdateThesisData } from '../types'
import { ThesisService } from '../services'

/**
 * Hook for managing theses data with pagination and search
 */
export function useTheses(params: { page: number; limit: number; search?: string }) {
  const [theses, setTheses] = useState<Thesis[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTheses = async (params: { page: number; limit: number; search?: string }) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await ThesisService.getAll(params)
      setTheses(result.data)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch when params change
  useEffect(() => {
    fetchTheses(params)
  }, [params.page, params.limit, params.search])

  const refetch = () => {
    fetchTheses(params)
  }

  return {
    theses,
    total,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing single thesis operations
 */
export function useThesis(id?: number) {
  const [thesis, setThesis] = useState<Thesis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThesis = async (thesisId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ThesisService.getById(thesisId)
      setThesis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchThesis(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchThesis(id)
    }
  }

  return {
    thesis,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing thesis actions (create, update, delete)
 */
export function useThesisActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createThesis = async (data: CreateThesisData) => {
    try {
      setIsCreating(true)
      await ThesisService.create(data)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating thesis:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateThesis = async (id: number, data: UpdateThesisData) => {
    try {
      setIsUpdating(true)
      await ThesisService.update(id, data)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating thesis:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteThesis = async (id: number) => {
    try {
      setIsDeleting(true)
      await ThesisService.remove(id)
      onSuccess?.()
      return true
    } catch (error) {
      console.error('Error deleting thesis:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createThesis,
    updateThesis,
    deleteThesis,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
