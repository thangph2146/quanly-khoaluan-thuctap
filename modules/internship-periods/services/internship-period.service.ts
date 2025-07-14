import {
  getInternshipPeriods,
  getInternshipPeriodById,
  createInternshipPeriod,
  updateInternshipPeriod,
  softDeleteInternshipPeriod,
  permanentDeleteInternshipPeriod,
  // Các hàm bulk sẽ cần bổ sung ở file api nếu chưa có
  // bulkSoftDeleteInternshipPeriods,
  // bulkPermanentDeleteInternshipPeriods,
  // bulkRestoreInternshipPeriods,
  // getDeletedInternshipPeriods,
} from '@/modules/internship-periods/api/internship-periods.api';
import type {
  InternshipPeriod,
  InternshipPeriodFilters,
  PaginatedResponse,
  InternshipPeriodMutationData,
} from '../types';

export class InternshipPeriodService {
  static async getAll(filters: InternshipPeriodFilters): Promise<PaginatedResponse<InternshipPeriod>> {
    return getInternshipPeriods(filters);
  }

  static async getDeleted(filters: InternshipPeriodFilters): Promise<PaginatedResponse<InternshipPeriod>> {
    // Nếu có API riêng cho deleted, thay thế hàm này
    // return getDeletedInternshipPeriods(filters);
    return getInternshipPeriods({ ...filters, deleted: true } as InternshipPeriodFilters);
  }

  static async getById(id: number): Promise<InternshipPeriod> {
    return getInternshipPeriodById(id);
  }

  static async create(data: InternshipPeriodMutationData): Promise<InternshipPeriod> {
    return createInternshipPeriod(data);
  }

  static async update(id: number, data: Partial<InternshipPeriodMutationData>): Promise<InternshipPeriod> {
    return updateInternshipPeriod(id, data);
  }

  static async delete(id: number): Promise<void> {
    return softDeleteInternshipPeriod(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    // return bulkSoftDeleteInternshipPeriods(ids);
    // Nếu chưa có API, lặp từng cái
    await Promise.all(ids.map(id => softDeleteInternshipPeriod(id)));
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteInternshipPeriod(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    // return bulkPermanentDeleteInternshipPeriods(ids);
    await Promise.all(ids.map(id => permanentDeleteInternshipPeriod(id)));
  }

  // static async bulkRestore(ids: number[]): Promise<void> {
  //   // return bulkRestoreInternshipPeriods(ids);
  //   // Nếu chưa có API, có thể cần bổ sung
  // }
} 