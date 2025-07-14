import client from '../../../lib/api/client';

export interface InternshipPeriod {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface InternshipPeriodFilters {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface InternshipPeriodMutationData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
}

export const getInternshipPeriods = async (filters: InternshipPeriodFilters = {}): Promise<PaginatedResponse<InternshipPeriod>> => {
  const response = await client.get('/internship-periods', { params: filters });
  return response.data;
};

export const getDeletedInternshipPeriods = async (filters: InternshipPeriodFilters = {}): Promise<PaginatedResponse<InternshipPeriod>> => {
  const response = await client.get('/internship-periods/deleted', { params: filters });
  return response.data;
};

export const getInternshipPeriodById = async (id: number): Promise<InternshipPeriod> => {
  const response = await client.get(`/internship-periods/${id}`);
  return response.data;
};

export const createInternshipPeriod = async (data: InternshipPeriodMutationData): Promise<InternshipPeriod> => {
  const response = await client.post('/internship-periods', data);
  return response.data;
};

export const updateInternshipPeriod = async (id: number, data: Partial<InternshipPeriodMutationData>): Promise<InternshipPeriod> => {
  const response = await client.put(`/internship-periods/${id}`, data);
  return response.data;
};

export const softDeleteInternshipPeriod = async (id: number): Promise<void> => {
  await client.post(`/internship-periods/soft-delete/${id}`);
};

export const bulkSoftDeleteInternshipPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/internship-periods/bulk-soft-delete', ids);
};

export const permanentDeleteInternshipPeriod = async (id: number): Promise<void> => {
  await client.delete(`/internship-periods/permanent-delete/${id}`);
};

export const bulkPermanentDeleteInternshipPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/internship-periods/bulk-permanent-delete', ids);
};

export const bulkRestoreInternshipPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/internship-periods/bulk-restore', ids);
}; 