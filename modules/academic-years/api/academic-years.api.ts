/**
 * API functions for Academic Years
 */
import client from '../../../lib/api/client';

// Keep in sync with backend
export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface PaginatedAcademicYears {
  data: AcademicYear[];
  total: number;
  page: number;
  limit: number;
}

export interface AcademicYearFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export type CreateAcademicYearData = Omit<AcademicYear, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateAcademicYearData = Partial<CreateAcademicYearData>;

/**
 * Get paginated list of active academic years
 */
export async function getAcademicYears(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const response = await client.get(`/academic-years`, { params });
  return response.data;
}

/**
 * Get all active academic years (for dropdowns)
 */
export async function getAllAcademicYears(): Promise<AcademicYear[]> {
    const response = await client.get(`/academic-years/all`);
    return response.data;
}

/**
 * Get paginated list of deleted academic years
 */
export async function getDeletedAcademicYears(filters: AcademicYearFilters): Promise<PaginatedAcademicYears> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const response = await client.get(`/academic-years/deleted`, { params });
  return response.data;
}

/**
 * Get a single academic year by ID
 */
export async function getAcademicYearById(id: number): Promise<AcademicYear> {
  const response = await client.get(`/academic-years/${id}`);
  return response.data;
}

/**
 * Create a new academic year
 */
export async function createAcademicYear(data: CreateAcademicYearData): Promise<AcademicYear> {
  const response = await client.post('/academic-years', data);
  return response.data;
}

/**
 * Update an existing academic year
 */
export async function updateAcademicYear(id: number, data: AcademicYear): Promise<AcademicYear> {
  const response = await client.put(`/academic-years/${id}`, data);
  return response.data;
}

/**
 * Soft delete an academic year
 */
export async function softDeleteAcademicYear(id: number): Promise<void> {
  await client.post(`/academic-years/soft-delete/${id}`);
}

/**
 * Bulk soft delete academic years
 */
export async function bulkSoftDeleteAcademicYears(ids: number[]): Promise<{ softDeleted: number }> {
    const response = await client.post('/academic-years/bulk-soft-delete', ids);
    return response.data;
}

/**
 * Permanently delete an academic year
 */
export async function permanentDeleteAcademicYear(id: number): Promise<void> {
  await client.delete(`/academic-years/permanent-delete/${id}`);
}

/**
 * Bulk permanently delete academic years
 */
export async function bulkPermanentDeleteAcademicYears(ids: number[]): Promise<{ permanentlyDeleted: number }> {
    const response = await client.post('/academic-years/bulk-permanent-delete', ids);
    return response.data;
}

/**
 * Bulk restore academic years
 */
export async function bulkRestoreAcademicYears(ids: number[]): Promise<{ restored: number }> {
    const response = await client.post('/academic-years/bulk-restore', ids);
    return response.data;
}
