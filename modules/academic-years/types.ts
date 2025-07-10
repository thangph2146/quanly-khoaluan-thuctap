import type { 
  AcademicYear as ApiAcademicYear, 
  CreateAcademicYearData,
  UpdateAcademicYearData,
  AcademicYearFilters as ApiAcademicYearFilters 
} from '@/lib/api/academic-years.api'

export type AcademicYear = ApiAcademicYear;
export type AcademicYearMutationData = CreateAcademicYearData | UpdateAcademicYearData;
export type { CreateAcademicYearData as ApiCreateAcademicYearData, UpdateAcademicYearData as ApiUpdateAcademicYearData };
export type AcademicYearFilters = Omit<ApiAcademicYearFilters, 'startDate' | 'endDate'>;
export type PaginatedAcademicYears = {
  data: AcademicYear[];
  total: number;
  page: number;
  limit: number;
};

export interface AcademicYearListProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
  onEdit: (year: AcademicYear) => void;
  onView: (year: AcademicYear) => void;
  onDelete: (year: AcademicYear) => void;
  onDeleteMany: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface AcademicYearFormProps {
  academicYear?: AcademicYear | null;
  onSubmit: (data: AcademicYearMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  isOpen: boolean;
  title: string;
}

export interface AcademicYearDetailProps {
  academicYear: AcademicYear | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (year: AcademicYear) => void;
  onDelete: (year: AcademicYear) => void;
}

export interface AcademicYearDeletedListProps {
  academicYears: AcademicYear[];
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
