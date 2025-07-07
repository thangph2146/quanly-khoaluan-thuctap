/**
 * Semester Service
 * Service for semester management
 */
import { SemestersApi } from '@/lib/api/semesters.api'
import type { Semester, CreateSemesterData, UpdateSemesterData } from '../types'

export class SemesterService {
  /**
   * Get all semesters
   */
  static async getAll(): Promise<Semester[]> {
    return await SemestersApi.getAll()
  }

  /**
   * Create a new semester
   */
  static async create(data: CreateSemesterData): Promise<Semester> {
    return await SemestersApi.create(data)
  }

  /**
   * Update an existing semester
   */
  static async update(id: number, data: UpdateSemesterData): Promise<Semester> {
    return await SemestersApi.update(id, data)
  }

  /**
   * Delete a semester
   */
  static async remove(id: number): Promise<void> {
    return await SemestersApi.delete(id)
  }
}
