/**
 * Thesis Service
 */
import {
  getTheses,
  getThesisById,
  createThesis,
  updateThesis,
  softDeleteThesis,
  getDeletedTheses,
  bulkPermanentDeleteTheses,
  bulkRestoreTheses,
  bulkSoftDeleteTheses,
  type Thesis,
  type ThesisFilters,
  type PaginatedTheses,
  type ThesisMutationData
} from '@/lib/api/theses.api'

export class ThesisService {
  static async getAll(filters: ThesisFilters): Promise<PaginatedTheses> {
    return getTheses(filters)
  }

  static async getDeleted(filters: ThesisFilters): Promise<PaginatedTheses> {
    return getDeletedTheses(filters)
  }

  static async getById(id: number): Promise<Thesis> {
    return getThesisById(id)
  }

  static async create(data: ThesisMutationData): Promise<Thesis> {
    return createThesis(data)
  }

  static async update(id: number, data: ThesisMutationData): Promise<void> {
    return updateThesis(id, data)
  }

  static async delete(id: number): Promise<void> {
    return softDeleteThesis(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteTheses(ids);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteTheses(ids);
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreTheses(ids);
  }
} 