import type { 
  Lecturer as ApiLecturer, 
  CreateLecturerData as ApiCreateLecturerData,
  LecturerFilters as ApiLecturerFilters 
} from '@/modules/lecturers/api/lecturers.api'
import type { Department } from '@/modules/departments/api/departments.api'

export type Lecturer = ApiLecturer & {
  department?: Department | null
}

export type LecturerMutationData = ApiCreateLecturerData

export type LecturerFilters = ApiLecturerFilters

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface LecturerListProps {
  lecturers: Lecturer[]
  isLoading: boolean
  onEdit: (lecturer: Lecturer) => void
  onDelete: (lecturer: Lecturer) => void
  onView: (lecturer: Lecturer) => void
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void
}

export interface LecturerFormProps {
  lecturer?: Lecturer | null
  allDepartments: Department[]
  onSubmit: (data: LecturerMutationData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  isOpen: boolean
  title: string
}

export interface LecturerDetailsProps {
  lecturer: Lecturer | null
  isOpen: boolean
  onClose: () => void
}

export interface LecturerDeletedListProps {
  lecturers: Lecturer[]
  isLoading: boolean
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void
  deleteButtonText?: string
} 