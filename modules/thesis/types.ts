/**
 * Thesis Module Types
 */

export interface Thesis {
  id: number;
  title: string;
  description?: string | null;
  studentId: number;
  studentName?: string | null;
  studentCode?: string | null;
  supervisorId: number;
  supervisorName?: string | null;
  supervisorEmail?: string | null;
  examinerId?: number | null;
  examinerName?: string | null;
  examinerEmail?: string | null;
  academicYearId: number;
  academicYearName?: string | null;
  semesterId: number;
  semesterName?: string | null;
  submissionDate: string; // Using string for date
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ThesisFilters {
  page?: number;
  limit?: number;
  search?: string;
  submissionDate?: string; // Date as string
}

export interface ThesisMutationData {
  title: string;
  description?: string | null;
  studentId: number;
  supervisorId: number;
  examinerId?: number | null;
  academicYearId: number;
  semesterId: number;
  submissionDate: string; // Date as string
  status?: string | null;
}

export interface ThesisListProps {
  theses: Thesis[];
  isLoading: boolean;
  onEdit: (thesis: Thesis) => void;
  onDelete: (thesis: Thesis) => void;
  onView: (thesis: Thesis) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface ThesisFormProps {
  thesis?: Thesis | null;
  // TODO: Add props for dropdown data (students, lecturers, etc.)
  onSubmit: (data: ThesisMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface ThesisDetailsProps {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ThesisDeletedListProps {
  theses: Thesis[];
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