/**
 * Academic Year Service
 * Service for academic year management
 */
import { AcademicYearsApi } from '@/lib/api/academic-years.api'
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '../types'

export class AcademicYearService {
  /**
   * Get all academic years
   */
  static async getAll(): Promise<AcademicYear[]> {
    return await AcademicYearsApi.getAll()
  }

  /**
   * Create a new academic year
   */
  static async create(data: CreateAcademicYearData): Promise<AcademicYear> {
    return await AcademicYearsApi.create(data)
  }

  /**
   * Update an existing academic year
   */
  static async update(id: number, data: UpdateAcademicYearData): Promise<AcademicYear> {
    return await AcademicYearsApi.update(id, data)
  }

  /**
   * Delete an academic year
   */
  static async remove(id: number): Promise<void> {
    return await AcademicYearsApi.delete(id)
  }
}
