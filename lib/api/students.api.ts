import client from './client';

// Re-defining interfaces here to avoid circular dependencies
// A more robust solution might involve a shared types package.
export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  dateOfBirth: string; // Assuming string for simplicity, will be formatted
  email: string;
  phoneNumber: string;
  deletedAt?: string | null;
}

export interface PaginatedStudents {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface StudentMutationData {
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
}

const API_URL = '/students';

/**
 * Fetches paginated active students.
 */
export async function getStudents(filters: StudentFilters): Promise<PaginatedStudents> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  
  const response = await client.get(API_URL, { params });
  return response.data;
}

/**
 * Fetches paginated soft-deleted students.
 */
export async function getDeletedStudents(filters: StudentFilters): Promise<PaginatedStudents> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);

    const response = await client.get(`${API_URL}/deleted`, { params });
    return response.data;
}

/**
 * Fetches a single student by their ID.
 */
export async function getStudentById(id: number): Promise<Student> {
  const response = await client.get(`${API_URL}/${id}`);
  return response.data;
}

/**
 * Creates a new student.
 */
export async function createStudent(data: StudentMutationData): Promise<Student> {
  const response = await client.post(API_URL, data);
  return response.data;
}

/**
 * Updates an existing student.
 */
export async function updateStudent(id: number, data: Student): Promise<void> {
  await client.put(`${API_URL}/${id}`, data);
}

/**
 * Soft deletes a student.
 */
export async function softDeleteStudent(id: number): Promise<void> {
  await client.post(`${API_URL}/soft-delete/${id}`);
}

/**
 * Permanently deletes a student.
 */
export async function permanentDeleteStudent(id: number): Promise<void> {
    await client.delete(`${API_URL}/permanent-delete/${id}`);
}

/**
 * Bulk soft deletes multiple students.
 */
export async function bulkSoftDeleteStudents(ids: number[]): Promise<{ softDeleted: number }> {
    const response = await client.post(`${API_URL}/bulk-soft-delete`, ids);
    return response.data;
}

/**
 * Bulk permanently deletes multiple students.
 */
export async function bulkPermanentDeleteStudents(ids: number[]): Promise<{ permanentlyDeleted: number }> {
    const response = await client.post(`${API_URL}/bulk-permanent-delete`, ids);
    return response.data;
}

/**
 * Bulk restores multiple students.
 */
export async function bulkRestoreStudents(ids: number[]): Promise<{ restored: number }> {
    const response = await client.post(`${API_URL}/bulk-restore`, ids);
    return response.data;
}
