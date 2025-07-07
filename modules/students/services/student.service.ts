/**
 * Students Service
 */
import { StudentsApi } from '@/lib/api/students.api'
import type { Student, CreateStudentData, UpdateStudentData } from '../types'

export class StudentService {
  static async getAll(): Promise<Student[]> {
    return StudentsApi.getAll() as Promise<Student[]>
  }

  static async getById(id: number): Promise<Student> {
    return StudentsApi.getById(id) as Promise<Student>
  }

  static async create(data: CreateStudentData): Promise<Student> {
    return StudentsApi.create({
      studentCode: data.studentCode,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      phoneNumber: data.phoneNumber,
    }) as Promise<Student>
  }

  static async update(id: number, data: UpdateStudentData): Promise<void> {
    const fullData = {
      id,
      studentCode: data.studentCode,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      phoneNumber: data.phoneNumber,
    }
    return StudentsApi.update(id, fullData as any)
  }

  static async delete(id: number): Promise<void> {
    return StudentsApi.delete(id)
  }
}
