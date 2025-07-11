/**
 * Role Module Types
 */

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  deletedAt?: string | null;
  rolePermissions?: RolePermission[];
}

export interface ComboboxOption {
  value: string | number;
  label: string;
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
  permission: {
    id: number;
    name: string;
    module: string;
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface RoleMutationData {
  name: string
  description?: string | null
  permissionIds?: number[]
}

export interface RoleListProps {
  roles: Role[]
  isLoading: boolean
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onView: (role: Role) => void
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void
  filterBar?: React.ReactNode
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
}

export interface RoleFormProps {
  role?: Role | null
  onSubmit: (data: RoleMutationData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  isOpen: boolean
  title: string
}

export interface RoleDetailsProps {
  role: Role | null
  isOpen: boolean
  onClose: () => void
}

export interface RoleDeletedListProps {
  roles: Role[]
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