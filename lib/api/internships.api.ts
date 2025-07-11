import apiClient from '@/lib/api/client';
import type { Internship, CreateInternshipData, UpdateInternshipData } from '@/modules/internship/types';

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export async function getInternships(filters: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Internship>> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  
  const response = await apiClient.get<PaginatedResponse<Internship>>(`/internships?${params.toString()}`);
  return response.data;
}

export async function getDeletedInternships(filters: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Internship>> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);

  const response = await apiClient.get<PaginatedResponse<Internship>>(`/internships/deleted?${params.toString()}`);
  return response.data;
}

export async function getInternshipById(id: number): Promise<Internship> {
  const response = await apiClient.get<Internship>(`/internships/${id}`);
  return response.data;
}

export async function createInternship(data: CreateInternshipData): Promise<Internship> {
  const response = await apiClient.post<Internship>('/internships', data);
  return response.data;
}

export async function updateInternship(id: number, data: UpdateInternshipData): Promise<Internship> {
  const response = await apiClient.put<Internship>(`/internships/${id}`, data);
  return response.data;
}

export async function softDeleteInternship(id: number): Promise<void> {
  await apiClient.post(`/internships/soft-delete/${id}`);
}

export async function permanentDeleteInternship(id: number): Promise<void> {
  await apiClient.delete(`/internships/permanent-delete/${id}`);
}

export async function bulkSoftDeleteInternships(ids: number[]): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/internships/bulk-soft-delete', ids);
    return response.data;
}

export async function bulkRestoreInternships(ids: number[]): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/internships/bulk-restore', ids);
    return response.data;
}

export async function bulkPermanentDeleteInternships(ids: number[]): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/internships/bulk-permanent-delete', ids);
    return response.data;
}

// Re-export types for convenience
export type { CreateInternshipData, UpdateInternshipData };