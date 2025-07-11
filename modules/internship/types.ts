/**
 * Internship Module Types
 */
import type { User } from '@/modules/users/types'
import type { Partner } from '@/modules/partners/types'
import type { AcademicYear } from '@/modules/academic-years/types'
import type { Semester } from '@/modules/semesters/types'

export interface Internship {
  id: number
  studentId: number
  student?: User
  partnerId: number
  partner?: Partner
  academicYearId: number
  academicYear?: AcademicYear
  semesterId: number
  semester?: Semester
  reportUrl?: string | null
  grade?: number | null
  deletedAt?: string | null
}

export interface CreateInternshipData {
  studentId: number
  partnerId: number
  academicYearId: number
  semesterId: number
  reportUrl?: string | null
  grade?: number | null
}

export type UpdateInternshipData = Partial<CreateInternshipData>

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface InternshipFilters {
  page?: number
  limit?: number
  search?: string
}

export interface InternshipListProps {
  internships: Internship[]
  isLoading: boolean
  onEdit: (internship: Internship) => void
  onDelete: (internship: Internship) => void
  onView: (internship: Internship) => void
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void
  filterBar?: React.ReactNode
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
}

export interface InternshipFormProps {
  internship?: Internship | null
  onSubmit: (data: CreateInternshipData | UpdateInternshipData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  isOpen: boolean
  title: string
}

export interface InternshipDetailsProps {
  internship: Internship | null
  isOpen: boolean
  onClose: () => void
}

export interface InternshipDeletedListProps {
  internships: Internship[]
  isLoading: boolean
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void
  deleteButtonText?: string
  filterBar?: React.ReactNode
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
} 