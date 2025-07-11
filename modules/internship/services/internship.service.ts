/**
 * Internship Service
 */
import * as api from '@/lib/api/internships.api'
import type {
  Internship,
  CreateInternshipData,
  UpdateInternshipData,
  InternshipFilters,
  PaginatedResponse,
} from '../types'

export class InternshipService {
  static async getAll(
    filters: InternshipFilters,
  ): Promise<PaginatedResponse<Internship>> {
    return api.getInternships(filters)
  }

  static async getDeleted(
    filters: InternshipFilters,
  ): Promise<PaginatedResponse<Internship>> {
    return api.getDeletedInternships(filters)
  }

  static async getById(id: number): Promise<Internship> {
    return api.getInternshipById(id)
  }

  static async create(data: CreateInternshipData): Promise<Internship> {
    return api.createInternship(data)
  }

  static async update(
    id: number,
    data: UpdateInternshipData,
  ): Promise<Internship> {
    return api.updateInternship(id, data)
  }

  static async delete(id: number): Promise<void> {
    return api.softDeleteInternship(id)
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    await api.bulkSoftDeleteInternships(ids)
  }

  static async permanentDelete(id: number): Promise<void> {
    return api.permanentDeleteInternship(id)
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    await api.bulkPermanentDeleteInternships(ids)
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    await api.bulkRestoreInternships(ids)
  }
} 