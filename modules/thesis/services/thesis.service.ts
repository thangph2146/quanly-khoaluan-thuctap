import { 
  getTheses, 
  getThesis, 
  createThesis, 
  updateThesis, 
  deleteThesis,
  type CreateThesisData,
  type UpdateThesisData
} from '@/lib/api/theses.api'
import type { Thesis } from '../types'

/**
 * Thesis Service
 * Business logic layer for thesis operations
 */
export class ThesisService {
  /**
   * Get all theses with optional filtering
   */
  static async getAll(params: import('@/lib/api/theses.api').ThesisSearchParams = {}): Promise<{ data: Thesis[]; total: number }> {
    return await getTheses(params)
  }

  /**
   * Get thesis by ID
   */
  static async getById(id: number): Promise<Thesis> {
    return await getThesis(id)
  }

  /**
   * Create new thesis
   */
  static async create(data: CreateThesisData): Promise<Thesis> {
    return await createThesis(data)
  }

  /**
   * Update thesis
   */
  static async update(id: number, data: UpdateThesisData): Promise<Thesis> {
    return await updateThesis(id, data)
  }

  /**
   * Delete thesis
   */
  static async remove(id: number): Promise<void> {
    return await deleteThesis(id)
  }
}
