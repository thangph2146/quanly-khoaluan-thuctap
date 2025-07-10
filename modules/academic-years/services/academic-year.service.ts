/**
 * Academic Year Service
 * Service for academic year management
 */
import { AcademicYearsApi } from '@/lib/api/academic-years.api'
import type { 
    AcademicYear, 
    CreateAcademicYearData, 
    UpdateAcademicYearData,
    AcademicYearFilters,
    PaginatedAcademicYears
} from '../types'

export class AcademicYearService {
  static async getAll(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
    return AcademicYearsApi.getAll(filters)
  }

  static async getDeleted(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
    return AcademicYearsApi.getDeleted(filters);
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
    return AcademicYearsApi.update(id, data)
  }

  static async softDelete(id: number): Promise<void> {
    return AcademicYearsApi.softDelete(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return AcademicYearsApi.bulkSoftDelete(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return AcademicYearsApi.permanentDelete(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return AcademicYearsApi.bulkPermanentDelete(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    return AcademicYearsApi.bulkRestore(ids);
  }
}
