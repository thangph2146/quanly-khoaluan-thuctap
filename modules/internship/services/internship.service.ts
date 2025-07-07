import { 
  getInternships, 
  getInternshipById, 
  createInternship, 
  updateInternship, 
  deleteInternship,
  type CreateInternshipData,
  type UpdateInternshipData
} from '@/lib/api/internships.api'
import type { Internship } from '../types'

/**
 * Internship Service
 * Business logic layer for internship operations
 */
export class InternshipService {
  /**
   * Get all internships
   */
  static async getAll(): Promise<Internship[]> {
    return await getInternships()
  }

  /**
   * Get internship by ID
   */
  static async getById(id: number): Promise<Internship> {
    return await getInternshipById(id)
  }

  /**
   * Create new internship
   */
  static async create(data: CreateInternshipData): Promise<Internship> {
    return await createInternship(data)
  }

  /**
   * Update internship
   */
  static async update(id: number, data: UpdateInternshipData): Promise<void> {
    return await updateInternship(id, data)
  }

  /**
   * Delete internship
   */
  static async remove(id: number): Promise<void> {
    return await deleteInternship(id)
  }
}

// Export types
export type { CreateInternshipData, UpdateInternshipData }
