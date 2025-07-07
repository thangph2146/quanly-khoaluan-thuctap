/**
 * Partner Service
 * Service for partner management
 */
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/api/partners.api'
import type { Partner, CreatePartnerData, UpdatePartnerData } from '../types'

export class PartnerService {
  /**
   * Get all partners
   */
  static async getAll(): Promise<Partner[]> {
    return await getPartners()
  }

  /**
   * Create a new partner
   */
  static async create(data: CreatePartnerData): Promise<void> {
    await createPartner(data)
  }

  /**
   * Update an existing partner
   */
  static async update(id: number, data: UpdatePartnerData): Promise<void> {
    await updatePartner(id, data)
  }

  /**
   * Delete a partner
   */
  static async remove(id: number): Promise<void> {
    await deletePartner(id)
  }
}
