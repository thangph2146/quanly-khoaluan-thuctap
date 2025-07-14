import { SemestersApi } from "@/modules/semesters/api/semesters.api";
import type {
  Semester,
  SemesterFilters,
  SemesterMutationData,
  PaginatedResponse,
} from "../types";

export class SemesterService {
  static async getAll(
    filters: SemesterFilters
  ): Promise<PaginatedResponse<Semester>> {
    return SemestersApi.getAll(filters);
  }

  static async getDeleted(
    filters: SemesterFilters
  ): Promise<PaginatedResponse<Semester>> {
    return SemestersApi.getDeleted(filters);
  }

  static async getById(id: number): Promise<Semester> {
    return SemestersApi.getById(id);
  }

  static async create(data: SemesterMutationData): Promise<Semester> {
    return SemestersApi.create(data);
  }

  static async update(
    id: number,
    data: SemesterMutationData
  ): Promise<Semester> {
    return SemestersApi.update(id, data);
  }

  static async softDelete(id: number): Promise<void> {
    return SemestersApi.softDelete(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    await SemestersApi.bulkSoftDelete(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return SemestersApi.permanentDelete(id);
  }

  static async bulkPermanentDelete(
    ids: number[]
  ): Promise<void> {
    await SemestersApi.bulkPermanentDelete(ids);
  }

  static async bulkRestore(ids: number[]): Promise<void> {
    await SemestersApi.bulkRestore(ids);
  }
}
