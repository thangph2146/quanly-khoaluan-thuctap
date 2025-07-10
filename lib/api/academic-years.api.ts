import apiClient from './client'

export interface AcademicYear {
  id: number
  name: string
  startDate: string
  endDate: string
  deletedAt?: string | null
}

export interface CreateAcademicYearData {
	name: string
	startDate: string 
	endDate: string 
}

export interface UpdateAcademicYearData {
	name?: string
	startDate?: string
	endDate?: string
}

export interface AcademicYearFilters {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
}

export interface PaginatedAcademicYears {
  data: AcademicYear[]
  total: number
  page: number
  limit: number
}

export const getAcademicYears = async (filters: AcademicYearFilters = {}): Promise<PaginatedAcademicYears> => {
  const response = await apiClient.get('/academicyears/list', { params: filters })
  return response.data
}

export const getDeletedAcademicYears = async (filters: AcademicYearFilters = {}): Promise<PaginatedAcademicYears> => {
    const response = await apiClient.get('/academicyears/deleted', { params: filters });
    return response.data;
};

export const getAcademicYearById = async (id: number): Promise<AcademicYear> => {
  const response = await apiClient.get(`/academicyears/${id}`)
  return response.data
}

export const createAcademicYear = async (data: CreateAcademicYearData): Promise<AcademicYear> => {
  const response = await apiClient.post('/academicyears', data)
  return response.data
}

export const updateAcademicYear = async (
	id: number,
	data: UpdateAcademicYearData,
): Promise<AcademicYear> => {
  const response = await apiClient.put(`/academicyears/${id}`, data)
  return response.data
}

export const softDeleteAcademicYear = async (id: number): Promise<void> => {
  await apiClient.post(`/academicyears/soft-delete/${id}`)
}

export const bulkSoftDeleteAcademicYears = async (ids: number[]): Promise<void> => {
    await apiClient.post('/academicyears/bulk-soft-delete', ids);
};

export const permanentDeleteAcademicYear = async (id: number): Promise<void> => {
    await apiClient.delete(`/academicyears/permanent-delete/${id}`);
};

export const bulkPermanentDeleteAcademicYears = async (ids: number[]): Promise<void> => {
    await apiClient.post('/academicyears/bulk-permanent-delete', ids);
};

export const bulkRestoreAcademicYears = async (ids: number[]): Promise<void> => {
    await apiClient.post('/academicyears/bulk-restore', ids);
};


export const AcademicYearsApi = {
	getAll: getAcademicYears,
	getDeleted: getDeletedAcademicYears,
	getById: getAcademicYearById,
	create: createAcademicYear,
	update: updateAcademicYear,
	softDelete: softDeleteAcademicYear,
    bulkSoftDelete: bulkSoftDeleteAcademicYears,
    permanentDelete: permanentDeleteAcademicYear,
    bulkPermanentDelete: bulkPermanentDeleteAcademicYears,
    bulkRestore: bulkRestoreAcademicYears,
}
