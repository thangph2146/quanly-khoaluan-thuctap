/**
 * Business API
 * API functions for business management
 */

import client from '@/lib/api/client';

export interface Business {
  id: number;
  name: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface BusinessFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedBusinesses {
  data: Business[];
  total: number;
  page?: number;
  limit?: number;
}

export const getBusinesses = async (filters: BusinessFilters = {}): Promise<PaginatedBusinesses> => {
  try {
    const response = await client.get('/businesses', { params: filters });
    if (Array.isArray(response.data)) {
      return { data: response.data, total: response.data.length };
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  try {
    const response = await client.get('/businesses/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all businesses:', error);
    throw error;
  }
};

export const getBusinessById = async (id: number): Promise<Business> => {
  try {
    const response = await client.get(`/businesses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching business:', error);
    throw error;
  }
};

export const createBusiness = async (data: Omit<Business, 'id' | 'createdAt'>): Promise<Business> => {
  try {
    const response = await client.post('/businesses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

export const updateBusiness = async (id: number, data: Omit<Business, 'createdAt'>): Promise<Business> => {
  try {
    const response = await client.put(`/businesses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

export const getDeletedBusinesses = async (filters: BusinessFilters = {}): Promise<PaginatedBusinesses> => {
  try {
    const response = await client.get('/businesses/deleted', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching deleted businesses:', error);
    throw error;
  }
};

export const softDeleteBusiness = async (id: number): Promise<void> => {
  try {
    await client.post(`/businesses/soft-delete/${id}`);
  } catch (error) {
    console.error('Error soft deleting business:', error);
    throw error;
  }
};

export const bulkSoftDeleteBusinesses = async (ids: number[]): Promise<void> => {
  try {
    await client.post('/businesses/bulk-soft-delete', ids);
  } catch (error) {
    console.error('Error bulk soft deleting businesses:', error);
    throw error;
  }
};

export const permanentDeleteBusiness = async (id: number): Promise<void> => {
  try {
    await client.post(`/businesses/permanent-delete/${id}`);
  } catch (error) {
    console.error('Error permanent deleting business:', error);
    throw error;
  }
};

export const bulkPermanentDeleteBusinesses = async (ids: number[]): Promise<void> => {
  try {
    await client.post('/businesses/bulk-permanent-delete', ids);
  } catch (error) {
    console.error('Error bulk permanent deleting businesses:', error);
    throw error;
  }
};

export const bulkRestoreBusinesses = async (ids: number[]): Promise<void> => {
  try {
    await client.post('/businesses/bulk-restore', ids);
  } catch (error) {
    console.error('Error bulk restoring businesses:', error);
    throw error;
  }
};
