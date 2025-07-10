/**
 * Student Service
 */
import { 
  getStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  softDeleteStudent, 
  getDeletedStudents,
  permanentDeleteStudent,
  bulkPermanentDeleteStudents,
  bulkRestoreStudents,
  bulkSoftDeleteStudents,
  type PaginatedStudents,
} from '@/lib/api/students.api';
import type { Student, StudentFilters, StudentMutationData } from '../types';

export class StudentService {
  static async getAll(filters: StudentFilters): Promise<PaginatedStudents> {
    return getStudents(filters);
  }

  static async getDeleted(filters: StudentFilters): Promise<PaginatedStudents> {
    return getDeletedStudents(filters);
  }

  static async getById(id: number): Promise<Student> {
    return getStudentById(id);
  }

  static async create(data: StudentMutationData): Promise<Student> {
    return createStudent(data);
  }

  static async update(id: number, data: StudentMutationData): Promise<void> {
    const fullData: Student = {
      id,
      ...data,
      // The API expects a string, so we just pass it along. 
      // The form should ensure it's in a valid date format.
      dateOfBirth: data.dateOfBirth,
    };
    return updateStudent(id, fullData);
  }

  static async softDelete(id: number): Promise<void> {
    return softDeleteStudent(id);
  }

  static async bulkSoftDelete(ids: number[]): Promise<void> {
    await bulkSoftDeleteStudents(ids);
  }

  static async permanentDelete(id: number): Promise<void> {
    return permanentDeleteStudent(id);
  }

  static async bulkPermanentDelete(ids: number[]): Promise<void> {
    await bulkPermanentDeleteStudents(ids);
  }
  
  static async bulkRestore(ids: number[]): Promise<void> {
    await bulkRestoreStudents(ids);
  }
}
