import apiClient from './client';

export interface SelectionOption {
  id: number;
  name: string;
}

export async function getAcademicYearOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/academic-years', { params: { search } });
  return response.data;
}

export async function getSemesterOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/semesters', { params: { search } });
  return response.data;
}

export async function getStudentOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/students', { params: { search } });
  return response.data;
}

export async function getLecturerOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/lecturers', { params: { search } });
  return response.data;
}

export async function getDepartmentOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/departments', { params: { search } });
  return response.data;
}

export async function getPartnerOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/partners', { params: { search } });
  return response.data;
}

export async function getMenuOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/menus', { params: { search } });
  return response.data;
}

export async function getPermissionOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/permissions', { params: { search } });
  return response.data;
}

export async function getRoleOptions(search: string): Promise<SelectionOption[]> {
  const response = await apiClient.get('/selections/roles', { params: { search } });
  return response.data;
} 