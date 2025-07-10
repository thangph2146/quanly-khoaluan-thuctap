/**
 * Student Module Types
 */

export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface StudentMutationData {
  studentCode: string;
  fullName: string;
  dateOfBirth: string; // Keep as string to match form
  email: string;
  phoneNumber: string;
}

export interface StudentListProps {
  students: Student[];
  isLoading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onView: (student: Student) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
}

export interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: StudentMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface StudentDetailsProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface StudentDeletedListProps {
  students: Student[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void;
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void;
  deleteButtonText?: string;
}
