/**
 * Lecturer Hooks
 * Custom hooks for lecturer management
 */
import { useState, useEffect, useCallback } from 'react'
import type { Lecturer } from '../types'
import { LecturerService, type CreateLecturerData, type UpdateLecturerData } from '../services'
import type { LecturerSearchParams } from '@/lib/api/lecturers.api'

/**
 * Hook for managing lecturers data with optional filtering
 */
export function useLecturers(searchParams?: LecturerSearchParams) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLecturers = useCallback(async (params?: LecturerSearchParams) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await LecturerService.getAll(params)
      setLecturers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLecturers(searchParams)
  }, [fetchLecturers, searchParams])

  const refetch = useCallback((params?: LecturerSearchParams) => {
    fetchLecturers(params || searchParams)
  }, [fetchLecturers, searchParams])

  return {
    lecturers,
    isLoading,
    error,
    refetch,
    fetchLecturers,
  }
}

/**
 * Hook for managing single lecturer operations
 */
export function useLecturer(id?: number) {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLecturer = async (lecturerId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await LecturerService.getById(lecturerId)
      setLecturer(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchLecturer(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchLecturer(id)
    }
  }

  return {
    lecturer,
    isLoading,
    error,
    refetch,
  }
}