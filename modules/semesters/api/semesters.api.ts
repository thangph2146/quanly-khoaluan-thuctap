import httpsAPI from '../../../lib/api/client';
import type { Semester, SemesterMutationData, SemesterFilters, PaginatedResponse } from '@/modules/semesters/types';

/**
 * Fetches paginated semesters from the API.
 */
const getAll = async (filters: SemesterFilters = {}): Promise<PaginatedResponse<Semester>> => {
  const response = await httpsAPI.get('/Semesters', { params: filters });
  return response.data;
};

/**
 * Fetches all semesters (for dropdowns, etc.).
 */
const getAllSemesters = async (): Promise<Semester[]> => {
	const response = await httpsAPI.get('/Semesters/all');
	return response.data;
}

/**
 * Fetches a single semester by their ID.
 */
const getById = async (id: number): Promise<Semester> => {
  const response = await httpsAPI.get(`/Semesters/${id}`);
  return response.data;
};

/**
 * Creates a new semester.
 */
const create = async (data: SemesterMutationData): Promise<Semester> => {
  const response = await httpsAPI.post('/Semesters', data);
  return response.data;
};

/**
 * Updates an existing semester.
 */
const update = async (id: number, data: Partial<SemesterMutationData & { id: number }>): Promise<Semester> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...updateData } = data;
  const response = await httpsAPI.put(`/Semesters/${id}`, updateData);
  return response.data;
};

/**
 * Soft deletes a semester by its ID.
 */
const softDelete = async (id: number): Promise<void> => {
  await httpsAPI.post(`/Semesters/soft-delete/${id}`);
};

/**
 * Bulk soft deletes semesters.
 */
const bulkSoftDelete = async (ids: number[]): Promise<{ softDeleted: number }> => {
  const response = await httpsAPI.post('/Semesters/bulk-soft-delete', ids);
  return response.data;
};

/**
 * Permanently deletes a semester by its ID.
 */
const permanentDelete = async (id: number): Promise<void> => {
  await httpsAPI.delete(`/Semesters/permanent-delete/${id}`);
};

/**
 * Bulk permanently deletes semesters.
 */
const bulkPermanentDelete = async (ids: number[]): Promise<{ permanentlyDeleted: number }> => {
  const response = await httpsAPI.post('/Semesters/bulk-permanent-delete', ids);
  return response.data;
};

/**
 * Fetches paginated deleted semesters from the API.
 */
const getDeleted = async (filters: SemesterFilters = {}): Promise<PaginatedResponse<Semester>> => {
  const response = await httpsAPI.get('/Semesters/deleted', { params: filters });
  return response.data;
};

/**
 * Bulk restores semesters.
 */
const bulkRestore = async (ids: number[]): Promise<{ restored: number }> => {
  const response = await httpsAPI.post('/Semesters/bulk-restore', ids);
  return response.data;
};

export const SemestersApi = {
  getAll,
  getAllSemesters,
  getById,
  create,
  update,
  softDelete,
  bulkSoftDelete,
  permanentDelete,
  bulkPermanentDelete,
  getDeleted,
  bulkRestore,
};