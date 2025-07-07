/**
 * Students Module Types
 */

export interface Student {
  id: number
  studentCode: string
  fullName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export interface CreateStudentData {
  studentCode: string
  fullName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export interface UpdateStudentData {
  studentCode: string
  fullName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export interface StudentFormData {
  studentCode: string
  fullName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
}

export interface StudentFilters {
  search?: string
  code?: string
}

export interface StudentListProps {
  students: Student[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
  onView: (student: Student) => void
}

export interface StudentFormProps {
  student?: Student | null
  onSubmit: (data: CreateStudentData | UpdateStudentData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export interface StudentDetailsProps {
  student: Student
}
