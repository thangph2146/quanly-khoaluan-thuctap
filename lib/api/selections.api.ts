import apiClient from './client';

export interface SelectionOption {
  id: number;
  name: string;
}

export const getAcademicYearOptions = async (search?: string): Promise<SelectionOption[]> => {
  const response = await apiClient.get('/selections/academic-years', { params: { search } });
  return response.data;
};

export const getSemesterOptions = async (search?: string): Promise<SelectionOption[]> => {
  const response = await apiClient.get('/selections/semesters', { params: { search } });
  return response.data;
};

export const getStudentOptions = async (search?: string): Promise<SelectionOption[]> => {
  const response = await apiClient.get('/selections/students', { params: { search } });
  return response.data;
};

export const getLecturerOptions = async (search?: string): Promise<SelectionOption[]> => {
  const response = await apiClient.get('/selections/lecturers', { params: { search } });
  return response.data;
}; 