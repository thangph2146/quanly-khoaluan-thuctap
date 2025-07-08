/**
 * Lecturer Types
 * Type definitions for lecturer management
 */

export interface Lecturer {
  id: number
  name: string
  email: string
  phoneNumber?: string
  departmentId?: number
  departmentName?: string
  academicRank?: string
  degree?: string
  specialization?: string
  avatarUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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

export type LecturerStatus = 'ACTIVE' | 'INACTIVE' 