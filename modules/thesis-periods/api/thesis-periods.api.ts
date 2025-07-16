import client from '../../../lib/api/client';

export interface ThesisPeriod {
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

export interface ThesisPeriodFilters {
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

export interface ThesisPeriodMutationData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
}

export const getThesisPeriods = async (filters: ThesisPeriodFilters = {}): Promise<PaginatedResponse<ThesisPeriod>> => {
  const response = await client.get('/thesis-periods', { params: filters });
  return response.data;
};

export const getDeletedThesisPeriods = async (filters: ThesisPeriodFilters = {}): Promise<PaginatedResponse<ThesisPeriod>> => {
  const response = await client.get('/thesis-periods/deleted', { params: filters });
  return response.data;
};

export const getThesisPeriodById = async (id: number): Promise<ThesisPeriod> => {
  const response = await client.get(`/thesis-periods/${id}`);
  return response.data;
};

export const createThesisPeriod = async (data: ThesisPeriodMutationData): Promise<ThesisPeriod> => {
  const response = await client.post('/thesis-periods', data);
  return response.data;
};

export const updateThesisPeriod = async (id: number, data: Partial<ThesisPeriodMutationData>): Promise<ThesisPeriod> => {
  const response = await client.put(`/thesis-periods/${id}`, data);
  return response.data;
};

export const softDeleteThesisPeriod = async (id: number): Promise<void> => {
  await client.post(`/thesis-periods/soft-delete/${id}`);
};

export const bulkSoftDeleteThesisPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/thesis-periods/bulk-soft-delete', ids);
};

export const permanentDeleteThesisPeriod = async (id: number): Promise<void> => {
  await client.delete(`/thesis-periods/permanent-delete/${id}`);
};

export const bulkPermanentDeleteThesisPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/thesis-periods/bulk-permanent-delete', ids);
};

export const bulkRestoreThesisPeriods = async (ids: number[]): Promise<void> => {
  await client.post('/thesis-periods/bulk-restore', ids);
}; 