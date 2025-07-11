import apiClient from '@/lib/api/client';
import type { Partner, PartnerMutationData, PaginatedResponse, PartnerFilters } from '@/modules/partners/types';

export const getPartners = async (filters: PartnerFilters): Promise<PaginatedResponse<Partner>> => {
    const response = await apiClient.get('/partners', { params: filters });
    return response.data;
};

export const getDeletedPartners = async (filters: PartnerFilters): Promise<PaginatedResponse<Partner>> => {
    const response = await apiClient.get('/partners/deleted', { params: filters });
    return response.data;
};

export const getPartnerById = async (id: number): Promise<Partner> => {
    const response = await apiClient.get(`/partners/${id}`);
    return response.data;
};

export const createPartner = async (data: PartnerMutationData): Promise<Partner> => {
    const response = await apiClient.post('/partners', data);
    return response.data;
};

export const updatePartner = async (id: number, data: PartnerMutationData): Promise<Partner> => {
    const response = await apiClient.put(`/partners/${id}`, data);
    return response.data;
};

export const softDeletePartner = async (id: number): Promise<void> => {
    await apiClient.post(`/partners/soft-delete/${id}`);
};

export const bulkSoftDeletePartners = async (ids: number[]): Promise<{ message: string }> => {
    const response = await apiClient.post('/partners/bulk-soft-delete', ids);
    return response.data;
};

export const bulkRestorePartners = async (ids: number[]): Promise<{ message: string }> => {
    const response = await apiClient.post('/partners/bulk-restore', ids);
    return response.data;
};

export const bulkPermanentDeletePartners = async (ids: number[]): Promise<{ message: string }> => {
    const response = await apiClient.post('/partners/bulk-permanent-delete', ids);
    return response.data;
};
