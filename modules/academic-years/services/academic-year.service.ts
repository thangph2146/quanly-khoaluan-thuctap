/**
 * Academic Year Service
 * Business logic layer for academic year operations
 */
import { 
  getAcademicYears,
  getDeletedAcademicYears,
  getAcademicYearById,
  getAllAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  softDeleteAcademicYear,
  bulkSoftDeleteAcademicYears,
  permanentDeleteAcademicYear,
  bulkPermanentDeleteAcademicYears,
  bulkRestoreAcademicYears,
  type AcademicYear,
  type CreateAcademicYearData,
  type UpdateAcademicYearData,
  type PaginatedAcademicYears,
  type AcademicYearFilters
} from '@/modules/academic-years/api/academic-years.api'

export class AcademicYearService {
  static async getAll(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
    return getAcademicYears(filters)
  }
  
  static async getAllList(): Promise<AcademicYear[]> {
    return getAllAcademicYears()
  }

  static async getDeleted(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
    return getDeletedAcademicYears(filters)
  }

  static async getById(id: number): Promise<AcademicYear> {
    return getAcademicYearById(id)
  }

  static async create(data: CreateAcademicYearData): Promise<AcademicYear> {
    return createAcademicYear(data)
  }

  static async update(id: number, data: AcademicYear): Promise<AcademicYear> {
    return updateAcademicYear(id, data)
  }

  static async softDelete(id: number): Promise<void> {
    return softDeleteAcademicYear(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    await bulkSoftDeleteAcademicYears(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteAcademicYear(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    await bulkPermanentDeleteAcademicYears(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    await bulkRestoreAcademicYears(ids);
  }
}

export type { CreateAcademicYearData, UpdateAcademicYearData }
