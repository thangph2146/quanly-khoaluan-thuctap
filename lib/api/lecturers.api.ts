/**
 * API service for lecturers
 */
import client from './client'
import type { Department } from './departments.api' // Assuming you might want this type

// Base Lecturer type from the backend
export interface Lecturer {
  id: number
  name: string
  email: string
  phoneNumber?: string | null
  departmentId?: number | null
  department?: Department | null // Nested object
  academicRank?: string | null
  degree?: string | null
  specialization?: string | null
  avatarUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt?: string | null
  deletedAt?: string | null
}

// Data for creating a lecturer
export interface CreateLecturerData {
  name: string
  email: string
  phoneNumber?: string | null
  departmentId?: number | null
  academicRank?: string | null
  degree?: string | null
  specialization?: string | null
  avatarUrl?: string | null
  isActive: boolean
}

// Data for updating a lecturer
export type UpdateLecturerData = Partial<CreateLecturerData> & { id: number }

// Response for paginated data
export interface PaginatedLecturers {
  data: Lecturer[]
  total: number
  page: number
  limit: number
}

// Filters for fetching lecturers
export interface LecturerFilters {
  page?: number
  limit?: number
  search?: string
  departmentId?: number // Added for potential filtering
}

/**
 * Fetch a paginated list of active lecturers
 */
export async function getLecturers(filters: LecturerFilters): Promise<PaginatedLecturers> {
  const params = new URLSearchParams()
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())
  if (filters.search) params.append('search', filters.search)
  if (filters.departmentId) params.append('departmentId', filters.departmentId.toString())

  const { data } = await client.get<PaginatedLecturers>('lecturers', { params })
  return data
}

/**
 * Fetch a paginated list of soft-deleted lecturers
 */
export async function getDeletedLecturers(filters: LecturerFilters): Promise<PaginatedLecturers> {
  const params = new URLSearchParams()
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())
  if (filters.search) params.append('search', filters.search)

  const { data } = await client.get<PaginatedLecturers>('lecturers/deleted', { params })
  return data
}

/**
 * Fetch a single lecturer by ID
 */
export async function getLecturerById(id: number): Promise<Lecturer> {
  const { data } = await client.get<Lecturer>(`lecturers/${id}`)
  return data
}

/**
 * Fetch all active lecturers (for dropdowns, etc.)
 */
export async function getAllLecturers(): Promise<Lecturer[]> {
    const { data } = await client.get<Lecturer[]>('lecturers/all');
    return data;
}

/**
 * Create a new lecturer
 */
export async function createLecturer(lecturerData: CreateLecturerData): Promise<Lecturer> {
  const { data } = await client.post<Lecturer>('lecturers', lecturerData)
  return data
}

/**
 * Update an existing lecturer
 */
export async function updateLecturer(id: number, lecturerData: Partial<UpdateLecturerData>): Promise<Lecturer> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = lecturerData;
    const { data } = await client.put<Lecturer>(`lecturers/${id}`, updateData);
    return data;
}

/**
 * Soft delete a single lecturer
 */
export async function softDeleteLecturer(id: number): Promise<void> {
  await client.post(`lecturers/soft-delete/${id}`)
}

/**
 * Permanently delete a single lecturer
 */
export async function permanentDeleteLecturer(id: number): Promise<void> {
    await client.delete(`lecturers/permanent-delete/${id}`);
}

/**
 * Bulk soft delete lecturers
 */
export async function bulkSoftDeleteLecturers(ids: number[]): Promise<{ softDeleted: number }> {
    const { data } = await client.post('lecturers/bulk-soft-delete', ids);
    return data;
}

/**
 * Bulk restore lecturers
 */
export async function bulkRestoreLecturers(ids: number[]): Promise<{ restored: number }> {
    const { data } = await client.post('lecturers/bulk-restore', ids);
    return data;
}

/**
 * Bulk permanently delete lecturers
 */
export async function bulkPermanentDeleteLecturers(ids: number[]): Promise<{ permanentlyDeleted: number }> {
    const { data } = await client.post('lecturers/bulk-permanent-delete', ids);
    return data;
}