/**
 * Thesis Periods Module Types
 */

export interface ThesisPeriod {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  academicYearName: string;
  semesterId: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ThesisPeriodFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ThesisPeriodMutationData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
}

export interface ThesisPeriodListProps {
  thesisPeriods: ThesisPeriod[];
  isLoading: boolean;
  onEdit: (thesisPeriod: ThesisPeriod) => void;
  onDelete: (thesisPeriod: ThesisPeriod) => void;
  onView: (thesisPeriod: ThesisPeriod) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface ThesisPeriodFormProps {
  thesisPeriod?: ThesisPeriod | null;
  onSubmit: (data: ThesisPeriodMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface ThesisPeriodDetailsProps {
  thesisPeriod: ThesisPeriod | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ThesisPeriodDeletedListProps {
  thesisPeriods: ThesisPeriod[];
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