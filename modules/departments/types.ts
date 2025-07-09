/**
 * Department Module Types
 */

export interface Department {
  id: number
  name: string
  code: string
  parentDepartmentId?: number | null
  parentDepartment?: Department | null
  childDepartments?: Department[]
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DepartmentFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DepartmentMutationData {
  name: string
  code: string
  parentDepartmentId?: number | null
}

export interface DepartmentListProps {
  departments: Department[]
  isLoading: boolean
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  onView: (department: Department) => void
  onDeleteMany?: (ids: (string | number)[]) => void
}

export interface DepartmentFormProps {
  department?: Department | null
  allDepartments: Department[]
  onSubmit: (data: DepartmentMutationData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  isOpen: boolean
  title: string
}

export interface DepartmentDetailsProps {
  department: Department | null
  isOpen: boolean
  onClose: () => void
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
}

export interface DepartmentDeletedListProps {
  departments: Department[]
  isLoading: boolean
  onRestore: (ids: number[]) => void
  onPermanentDelete: (ids: (string | number)[]) => void
  deleteButtonText?: string
}
