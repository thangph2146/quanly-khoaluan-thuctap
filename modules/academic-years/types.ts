// Academic Year types

// Based on AcademicYear.cs
export interface AcademicYear {
	id: number
	name: string // e.g., "2023-2024"
	startDate: string // Changed from DateTime
	endDate: string // Changed from DateTime
}

// Create and Update types for AcademicYear
export interface CreateAcademicYearData {
	name: string
	startYear: number
	endYear: number
	isCurrent?: boolean
}

export interface UpdateAcademicYearData {
	name?: string
	startYear?: number
	endYear?: number
	isCurrent?: boolean
}
