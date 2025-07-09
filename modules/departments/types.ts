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

export interface CreateDepartmentData {
  name: string
  code: string
  parentDepartmentId?: number | null
}

export interface UpdateDepartmentData {
  name: string
  code: string
  parentDepartmentId?: number | null
}

export interface DepartmentFormData {
  name: string
  code: string
  parentDepartmentId?: number | null
}

export interface DepartmentFilters {
  search?: string
  parentDepartmentId?: number | null
}

export interface DepartmentListProps {
  departments: Department[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  onView: (department: Department) => void
}

export interface DepartmentFormProps {
  department?: Department | null
  allDepartments: Department[]
  onSubmit: (data: CreateDepartmentData | UpdateDepartmentData) => void
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
