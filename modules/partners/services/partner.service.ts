import {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  softDeletePartner,
  getDeletedPartners,
  bulkSoftDeletePartners,
  bulkRestorePartners,
  bulkPermanentDeletePartners,
} from '@/lib/api/partners.api';
import type { Partner, PartnerMutationData, PartnerFilters, PaginatedResponse } from '../types';

export class PartnerService {
  static async getAll(filters: PartnerFilters): Promise<PaginatedResponse<Partner>> {
    return getPartners(filters);
  }

  static async getDeleted(filters: PartnerFilters): Promise<PaginatedResponse<Partner>> {
    return getDeletedPartners(filters);
  }

  static async getById(id: number): Promise<Partner> {
    return getPartnerById(id);
  }

  static async create(data: PartnerMutationData): Promise<Partner> {
    return createPartner(data);
  }

  static async update(id: number, data: PartnerMutationData): Promise<Partner> {
    return updatePartner(id, data);
  }

  static async softDelete(id: number): Promise<void> {
    return softDeletePartner(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<{ message: string }> {
    return bulkSoftDeletePartners(ids);
  }

  static async bulkRestore(ids: number[]): Promise<{ message: string }> {
    return bulkRestorePartners(ids);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<{ message: string }> {
    return bulkPermanentDeletePartners(ids);
  }
} 