/**
 * Permission Module Types
 */

export interface Permission {
  id: number;
  name: string;
  module: string;
  description?: string | null;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PermissionFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PermissionMutationData {
  name: string;
  module: string;
  description?: string | null;
}

export interface PermissionListProps {
  permissions: Permission[];
  isLoading: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface PermissionFormProps {
  permission?: Permission | null;
  allModules: string[];
  onSubmit: (data: PermissionMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface PermissionDetailsProps {
  permission: Permission | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface PermissionDeletedListProps {
  permissions: Permission[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void;
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void;
  deleteButtonText?: string;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
} 