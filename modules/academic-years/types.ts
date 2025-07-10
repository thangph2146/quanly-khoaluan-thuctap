// Academic Year types

// Based on AcademicYear.cs and API response structure
export interface AcademicYear {
	id: number
	name: string // e.g., "2024-2025"
	startDate: string // ISO date string format
	endDate: string // ISO date string format
    deletedAt?: string | null
}

// Create and Update types for AcademicYear
export interface CreateAcademicYearData {
	name: string
	startDate: string // ISO date string format
	endDate: string // ISO date string format
}

export interface UpdateAcademicYearData {
	name?: string
	startDate?: string // ISO date string format
	endDate?: string // ISO date string format
}

export interface AcademicYearFilters {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export interface PaginatedAcademicYears {
    data: AcademicYear[];
    total: number;
    page: number;
    limit: number;
}

export interface AcademicYearDetailProps {
  academicYear: AcademicYear | null
  isOpen: boolean
  onClose: () => void
}

export interface AcademicYearListProps {
  academicYears: AcademicYear[];
  isLoading: boolean;
  onEdit: (academicYear: AcademicYear) => void;
  onView: (academicYear: AcademicYear) => void;
  onDelete: (academicYear: AcademicYear) => void;
  onDeleteMany: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
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
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
}
