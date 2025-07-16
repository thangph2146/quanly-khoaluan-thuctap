import {
  getThesisPeriods,
  getThesisPeriodById,
  createThesisPeriod,
  updateThesisPeriod,
  softDeleteThesisPeriod,
  permanentDeleteThesisPeriod,
  bulkSoftDeleteThesisPeriods,
  bulkPermanentDeleteThesisPeriods,
  bulkRestoreThesisPeriods,
  getDeletedThesisPeriods,
} from '@/modules/thesis-periods/api/thesis-periods.api';
import type {
  ThesisPeriod,
  ThesisPeriodFilters,
  PaginatedResponse,
  ThesisPeriodMutationData,
} from '../types';

export class ThesisPeriodService {
  static async getAll(filters: ThesisPeriodFilters): Promise<PaginatedResponse<ThesisPeriod>> {
    return getThesisPeriods(filters);
  }

  static async getDeleted(filters: ThesisPeriodFilters): Promise<PaginatedResponse<ThesisPeriod>> {
    return getDeletedThesisPeriods(filters);
  }

  static async getById(id: number): Promise<ThesisPeriod> {
    return getThesisPeriodById(id);
  }

  static async create(data: ThesisPeriodMutationData): Promise<ThesisPeriod> {
    return createThesisPeriod(data);
  }

  static async update(id: number, data: Partial<ThesisPeriodMutationData>): Promise<ThesisPeriod> {
    return updateThesisPeriod(id, data);
  }

  static async delete(id: number): Promise<void> {
    return softDeleteThesisPeriod(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    return bulkSoftDeleteThesisPeriods(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteThesisPeriod(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    return bulkPermanentDeleteThesisPeriods(ids);
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    return bulkRestoreThesisPeriods(ids);
  }
} 