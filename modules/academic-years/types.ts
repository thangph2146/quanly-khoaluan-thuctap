// Academic Year types

// Based on AcademicYear.cs and API response structure
export interface AcademicYear {
	id: number
	name: string // e.g., "2024-2025"
	startDate: string // ISO date string format
	endDate: string // ISO date string format
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
