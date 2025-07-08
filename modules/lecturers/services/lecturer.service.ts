import { 
  getLecturers, 
  getLecturerById, 
  createLecturer, 
  updateLecturer, 
  deleteLecturer,
  type CreateLecturerData,
  type UpdateLecturerData,
  type Lecturer as ApiLecturer,
  type LecturerSearchParams
} from '@/lib/api/lecturers.api'
import type { Lecturer } from '../types'

/**
 * Lecturer Service
 * Business logic layer for lecturer operations
 */
export class LecturerService {
  /**
   * Get all lecturers with optional filtering
   */
  static async getAll(params?: LecturerSearchParams): Promise<Lecturer[]> {
    return await getLecturers(params)
  }

  /**
   * Get lecturer by ID
   */
  static async getById(id: number): Promise<Lecturer> {
    return await getLecturerById(id)
  }

  /**
   * Create new lecturer
   */
  static async create(data: CreateLecturerData): Promise<Lecturer> {
    return await createLecturer(data)
  }

  /**
   * Update lecturer
   */
  static async update(id: number, data: UpdateLecturerData): Promise<Lecturer> {
    return await updateLecturer(id, data)
  }

  /**
   * Delete lecturer
   */
  static async remove(id: number): Promise<void> {
    return await deleteLecturer(id)
  }
}

export type { CreateLecturerData, UpdateLecturerData }