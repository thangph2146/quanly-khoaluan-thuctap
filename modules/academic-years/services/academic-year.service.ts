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
    // Transform the form data to match the API requirements
    const apiData: Omit<AcademicYear, 'id'> = {
      name: data.name,
      startDate: `${data.startYear}-09-01`, // Default start date
      endDate: `${data.endYear}-06-30`, // Default end date
    }
    return await AcademicYearsApi.create(apiData)
  }

  /**
   * Update an existing academic year
   */
  static async update(id: number, data: UpdateAcademicYearData): Promise<AcademicYear> {
    // First get the existing academic year to preserve unchanged fields
    const existing = await AcademicYearsApi.getById(id)
    
    // Transform the form data to match the API requirements
    const apiData: AcademicYear = {
      ...existing,
      name: data.name ?? existing.name,
      startDate: data.startYear ? `${data.startYear}-09-01` : existing.startDate,
      endDate: data.endYear ? `${data.endYear}-06-30` : existing.endDate,
    }
    return await AcademicYearsApi.update(id, apiData)
  }

  /**
   * Delete an academic year
   */
  static async remove(id: number): Promise<void> {
    return await AcademicYearsApi.delete(id)
  }
}
