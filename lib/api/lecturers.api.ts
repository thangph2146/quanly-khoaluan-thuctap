/**
 * Lecturers API
 * API functions for lecturer management
 */
import apiClient from './client'

export interface CreateLecturerData {
  name: string
  email: string
  phoneNumber?: string
  departmentId?: number
  academicRank?: string
  degree?: string
  specialization?: string
  avatarUrl?: string
  isActive: boolean
}

export interface UpdateLecturerData {
  name: string
  email: string
  phoneNumber?: string
  departmentId?: number
  academicRank?: string
  degree?: string
  specialization?: string
  avatarUrl?: string
  isActive: boolean
}

export interface Lecturer {
  id: number
  name: string
  email: string
  phoneNumber?: string
  departmentId?: number
  department?: {
    id: number
    name: string
  }
  departmentName?: string
  academicRank?: string
  degree?: string
  specialization?: string
  avatarUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LecturerSearchParams {
  departmentId?: number
  search?: string
  isActive?: boolean
}

/**
 * Get all lecturers with optional filtering
 */
export const getLecturers = async (params?: LecturerSearchParams): Promise<Lecturer[]> => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params?.departmentId) {
      queryParams.append('departmentId', params.departmentId.toString())
    }
    
    if (params?.search && params.search.trim()) {
      queryParams.append('search', params.search.trim())
    }
    
    if (params?.isActive !== undefined) {
      queryParams.append('isActive', params.isActive.toString())
    }
    
    const queryString = queryParams.toString()
    const url = queryString ? `/lecturers?${queryString}` : '/lecturers'
    
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching lecturers:', error)
    throw error
  }
}

/**
 * Get lecturer by ID
 */
export const getLecturerById = async (id: number): Promise<Lecturer> => {
  try {
    const response = await apiClient.get(`/lecturers/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching lecturer:', error)
    throw error
  }
}

/**
 * Create new lecturer
 */
export const createLecturer = async (data: CreateLecturerData): Promise<Lecturer> => {
  try {
    const response = await apiClient.post('/lecturers', data)
    return response.data
  } catch (error) {
    console.error('Error creating lecturer:', error)
    throw error
  }
}

/**
 * Update lecturer
 */
export const updateLecturer = async (id: number, data: UpdateLecturerData): Promise<Lecturer> => {
  try {
    const response = await apiClient.put(`/lecturers/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating lecturer:', error)
    throw error
  }
}

/**
 * Delete lecturer
 */
export const deleteLecturer = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/lecturers/${id}`)
  } catch (error) {
    console.error('Error deleting lecturer:', error)
    throw error
  }
}