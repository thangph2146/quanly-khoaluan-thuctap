/**
 * Lecturer Service
 * Business logic layer for lecturer operations
 */
import { 
  getLecturers,
  getDeletedLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  softDeleteLecturer,
  bulkSoftDeleteLecturers,
  permanentDeleteLecturer,
  bulkPermanentDeleteLecturers,
  bulkRestoreLecturers,
  type Lecturer,
  type CreateLecturerData,
  type UpdateLecturerData,
  type PaginatedLecturers,
  type LecturerFilters
} from '@/modules/lecturers/api/lecturers.api'

export class LecturerService {
  static async getAll(filters: LecturerFilters): Promise<PaginatedLecturers> {
    return getLecturers(filters)
  }

  static async getDeleted(filters: LecturerFilters): Promise<PaginatedLecturers> {
    return getDeletedLecturers(filters)
  }

  static async getById(id: number): Promise<Lecturer> {
    return getLecturerById(id)
  }

  static async create(data: CreateLecturerData): Promise<Lecturer> {
    return createLecturer(data)
  }

  static async update(id: number, data: Partial<UpdateLecturerData>): Promise<Lecturer> {
    return updateLecturer(id, data)
  }

  static async softDelete(id: number): Promise<void> {
    return softDeleteLecturer(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    await bulkSoftDeleteLecturers(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteLecturer(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    await bulkPermanentDeleteLecturers(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    await bulkRestoreLecturers(ids);
  }
}

export type { CreateLecturerData, UpdateLecturerData }