import { 
  getAcademicYears, 
  getAcademicYearById, 
  createAcademicYear, 
  updateAcademicYear, 
  deleteAcademicYear
} from '@/lib/api/academic-years.api'
import { DepartmentsApi } from '@/lib/api/departments.api'
import { StudentsApi } from '@/lib/api/students.api'
import { 
  getSemesters, 
  getSemesterById, 
  createSemester, 
  updateSemester, 
  deleteSemester,
  type CreateSemesterData,
  type UpdateSemesterData
} from '@/lib/api/semesters.api'
import type { AcademicYear, Department, Student } from '../types'

/**
 * Academic Year Service
 * Business logic layer for academic year operations
 */
export class AcademicYearService {
  static async getAll(): Promise<AcademicYear[]> {
    return await getAcademicYears()
  }

  static async getById(id: number): Promise<AcademicYear> {
    return await getAcademicYearById(id)
  }

  static async create(data: Omit<AcademicYear, 'id'>): Promise<AcademicYear> {
    return await createAcademicYear(data)
  }

  static async update(id: number, data: Omit<Partial<AcademicYear>, 'id'>): Promise<AcademicYear> {
    return await updateAcademicYear(id, data as AcademicYear)
  }

  static async remove(id: number): Promise<void> {
    return await deleteAcademicYear(id)
  }
}

/**
 * Department Service
 * Business logic layer for department operations
 */
export class DepartmentService {
  static async getAll(): Promise<Department[]> {
    return await DepartmentsApi.getAll()
  }

  static async getById(id: number): Promise<Department> {
    return await DepartmentsApi.getById(id)
  }

  static async create(data: Omit<Department, 'id'>): Promise<Department> {
    return await DepartmentsApi.create(data)
  }

  static async update(id: number, data: Omit<Partial<Department>, 'id'>): Promise<void> {
    const fullData = { ...data, id } as Department
    return await DepartmentsApi.update(id, fullData)
  }

  static async remove(id: number): Promise<void> {
    return await DepartmentsApi.delete(id)
  }
}

/**
 * Student Service
 * Business logic layer for student operations
 */
export class StudentService {
  static async getAll(): Promise<Student[]> {
    return await StudentsApi.getAll()
  }

  static async getById(id: number): Promise<Student> {
    return await StudentsApi.getById(id)
  }

  static async create(data: Omit<Student, 'id'>): Promise<Student> {
    return await StudentsApi.create(data)
  }

  static async update(id: number, data: Partial<Student>): Promise<Student> {
    return await StudentsApi.update(id, data)
  }

  static async remove(id: number): Promise<void> {
    return await StudentsApi.delete(id)
  }
}

/**
 * Semester Service
 * Business logic layer for semester operations
 */
export class SemesterService {
  static async getAll() {
    return await getSemesters()
  }

  static async getById(id: number) {
    return await getSemesterById(id)
  }

  static async create(data: CreateSemesterData) {
    return await createSemester(data)
  }

  static async update(id: number, data: UpdateSemesterData) {
    return await updateSemester(id, data)
  }

  static async remove(id: number): Promise<void> {
    return await deleteSemester(id)
  }
}

// Export types
export type { CreateSemesterData, UpdateSemesterData }
