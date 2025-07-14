/**
 * Business Service
 */
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  softDeleteBusiness,
  getDeletedBusinesses,
  permanentDeleteBusiness,
  bulkPermanentDeleteBusinesses,
  bulkRestoreBusinesses,
  bulkSoftDeleteBusinesses,
  type Business,
  type BusinessFilters,
  type PaginatedBusinesses
} from '../api/business.api';
import type { BusinessMutationData } from '../types';

export class BusinessService {
  static async getAll(filters: BusinessFilters): Promise<PaginatedBusinesses> {
    return getBusinesses(filters);
  }

  static async getDeleted(filters: BusinessFilters): Promise<PaginatedBusinesses> {
    return getDeletedBusinesses(filters);
  }

  static async getById(id: number): Promise<Business> {
    return getBusinessById(id);
  }

  static async create(data: BusinessMutationData): Promise<Business> {
    return createBusiness({
      name: data.name,
    });
  }

  static async update(id: number, data: BusinessMutationData): Promise<Business> {
    const fullData: Business = {
      id,
      name: data.name,
    };
    return updateBusiness(id, fullData);
  }

  static async delete(id: number): Promise<void> {
    return softDeleteBusiness(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteBusinesses(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteBusiness(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteBusinesses(ids);
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreBusinesses(ids);
  }
}
