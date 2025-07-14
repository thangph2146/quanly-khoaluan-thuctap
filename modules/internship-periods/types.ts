/**
 * Internship Periods Module Types
 */

export interface InternshipPeriod {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  // Nếu có liên kết với các entity khác, có thể bổ sung ở đây
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface InternshipPeriodFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface InternshipPeriodMutationData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  academicYearId: number;
  semesterId: number;
}

export interface InternshipPeriodListProps {
  internshipPeriods: InternshipPeriod[];
  isLoading: boolean;
  onEdit: (internshipPeriod: InternshipPeriod) => void;
  onDelete: (internshipPeriod: InternshipPeriod) => void;
  onView: (internshipPeriod: InternshipPeriod) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface InternshipPeriodFormProps {
  internshipPeriod?: InternshipPeriod | null;
  onSubmit: (data: InternshipPeriodMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface InternshipPeriodDetailsProps {
  internshipPeriod: InternshipPeriod | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface InternshipPeriodDeletedListProps {
  internshipPeriods: InternshipPeriod[];
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