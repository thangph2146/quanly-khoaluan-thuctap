import type { AcademicYear } from '@/modules/academic-years/types'

// Based on Semester.cs
export interface Semester {
	id: number
	name: string // e.g., "Học kỳ 1"
	academicYearId: number
	academicYear: AcademicYear
}

// Create and Update types for Semester
export interface CreateSemesterData {
	name: string
	academicYearId: number
}

export interface UpdateSemesterData {
	name?: string
	academicYearId?: number
}
