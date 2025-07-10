import type { AcademicYear } from '@/modules/academic-years/types'

// Based on Semester.cs
export interface Semester {
  id: number
  name: string // e.g., "Học kỳ 1"
  academicYearId: number
  academicYear: AcademicYear
  deletedAt?: string | null
}

// Create and Update types for Semester
export interface SemesterMutationData {
  id?: number
  name: string
  academicYearId: number
}

// Re-using from departments for consistency
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SemesterFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SemesterListProps {
  semesters: Semester[]
  isLoading: boolean
  onEdit: (semester: Semester) => void
  onDelete: (semester: Semester) => void
  onView: (semester: Semester) => void
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void
}

export interface SemesterFormProps {
  semester?: Semester | null
  academicYears: AcademicYear[]
  onSubmit: (data: SemesterMutationData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  isOpen: boolean
  title: string
}

export interface SemesterDetailsProps {
  semester: Semester | null
  isOpen:boolean
  onClose: () => void
}

export interface SemesterDeletedListProps {
  semesters: Semester[]
  isLoading: boolean
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void
  deleteButtonText?: string
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}
