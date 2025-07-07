/**
 * Internship Hooks
 * Custom hooks for internship management
 */
import { useState, useEffect } from 'react'
import type { CreateInternshipData, Internship, UpdateInternshipData } from '../types'
import { InternshipService } from '../services'

/**
 * Hook for managing internships data
 */
export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInternships = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await InternshipService.getAll()
      setInternships(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  const refetch = () => {
    fetchInternships()
  }

  return {
    internships,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing single internship operations
 */
export function useInternship(id?: number) {
  const [internship, setInternship] = useState<Internship | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInternship = async (internshipId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await InternshipService.getById(internshipId)
      setInternship(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchInternship(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchInternship(id)
    }
  }

  return {
    internship,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing internship actions (create, update, delete)
 */
export function useInternshipActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createInternship = async (data: CreateInternshipData) => {
    try {
      setIsCreating(true)
      await InternshipService.create(data)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating internship:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateInternship = async (id: number, data: UpdateInternshipData) => {
    try {
      setIsUpdating(true)
      await InternshipService.update(id, data)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating internship:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteInternship = async (id: number) => {
    try {
      setIsDeleting(true)
      await InternshipService.remove(id)
      onSuccess?.()
      return true
    } catch (error) {
      console.error('Error deleting internship:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createInternship,
    updateInternship,
    deleteInternship,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
