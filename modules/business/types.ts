/**
 * Business Module Types
 */

export interface Business {
  id: number;
  name: string;
  displayOrder: number;
  createdAt: string;
  description?: string;
  updatedAt?: string;
  deletedAt?: string;
  // Tree structure properties
  parentBusinessId?: number | null;
  childBusinesses?: Business[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface BusinessFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BusinessMutationData {
  name: string;
  displayOrder: number;
  description?: string;
}

export interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
  onView: (business: Business) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface BusinessFormProps {
  business?: Business | null;
  allBusinesses: Business[];
  onSubmit: (data: BusinessMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface BusinessDetailsProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface BusinessDeletedListProps {
  businesses: Business[];
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
