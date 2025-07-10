/**
 * Theses API
 * API functions for thesis management
 */
import apiClient from './client'

export interface Thesis {
  id: number;
  title: string;
  description?: string | null;
  studentId: number;
  studentName?: string | null;
  studentCode?: string | null;
  supervisorId: number;
  supervisorName?: string | null;
  supervisorEmail?: string | null;
  examinerId?: number | null;
  examinerName?: string | null;
  examinerEmail?: string | null;
  academicYearId: number;
  academicYearName?: string | null;
  semesterId: number;
  semesterName?: string | null;
  submissionDate: string; // Using string for date
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ThesisFilters {
  page?: number;
  limit?: number;
  search?: string;
  submissionDate?: string;
}

export interface PaginatedTheses {
  data: Thesis[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ThesisMutationData {
  title: string;
  description?: string | null;
  studentId: number;
  supervisorId: number;
  examinerId?: number | null;
  academicYearId: number;
  semesterId: number;
  submissionDate: string; // Date as string
  status?: string | null;
}

/**
 * Get all theses
 */
export const getTheses = async (filters: ThesisFilters = {}): Promise<PaginatedTheses> => {
  try {
    const response = await apiClient.get('/theses', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching theses:', error);
    throw error;
  }
};

/**
 * Get thesis by ID
 */
export const getThesisById = async (id: number): Promise<Thesis> => {
  try {
    const response = await apiClient.get(`/theses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching thesis:', error);
    throw error;
  }
};

/**
 * Create new thesis
 */
export const createThesis = async (data: ThesisMutationData): Promise<Thesis> => {
  try {
    const response = await apiClient.post('/theses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating thesis:', error);
    throw error;
  }
};

/**
 * Update thesis
 */
export const updateThesis = async (id: number, data: ThesisMutationData): Promise<void> => {
  try {
    await apiClient.put(`/theses/${id}`, data);
  } catch (error) {
    console.error('Error updating thesis:', error);
    throw error;
  }
};

/**
 * Soft delete thesis
 */
export const softDeleteThesis = async (id: number): Promise<void> => {
  try {
    await apiClient.post(`/theses/soft-delete/${id}`);
  } catch (error) {
    console.error('Error soft deleting thesis:', error);
    throw error;
  }
};

/**
 * Bulk soft delete theses
 */
export const bulkSoftDeleteTheses = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/theses/bulk-soft-delete', ids);
  } catch (error) {
    console.error('Error bulk soft deleting theses:', error);
    throw error;
  }
};

/**
 * Get all deleted theses (for recycle bin)
 */
export const getDeletedTheses = async (filters: ThesisFilters = {}): Promise<PaginatedTheses> => {
  try {
    const response = await apiClient.get('/theses/deleted', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching deleted theses:', error);
    throw error;
  }
};

/**
 * Bulk restore theses
 */
export const bulkRestoreTheses = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/theses/bulk-restore', ids);
  } catch (error) {
    console.error('Error bulk restoring theses:', error);
    throw error;
  }
};

/**
 * Bulk permanent delete theses
 */
export const bulkPermanentDeleteTheses = async (ids: number[]): Promise<void> => {
  try {
    await apiClient.post('/theses/bulk-permanent-delete', ids);
  } catch (error) {
    console.error('Error bulk permanent deleting theses:', error);
    throw error;
  }
};
