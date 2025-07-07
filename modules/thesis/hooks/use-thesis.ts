/**
 * Thesis Hooks
 * Custom hooks for thesis management
 */
import { useState, useEffect, useMemo } from 'react'
import type { CreateThesisData, Thesis, UpdateThesisData } from '../types'
import { ThesisService } from '../services'

/**
 * Hook for managing theses data
 */
export function useTheses() {
  const [theses, setTheses] = useState<Thesis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTheses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ThesisService.getAll()
      setTheses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTheses()
  }, [])

  const refetch = () => {
    fetchTheses()
  }

  return {
    theses,
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
