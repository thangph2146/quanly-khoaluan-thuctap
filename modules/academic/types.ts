// Dựa trên models/AcademicYear.cs
export interface AcademicYear {
	id: number
	name: string // Ví dụ: "2023-2024"
	startDate: string
	endDate: string
}

// Dựa trên models/Department.cs
export interface Department {
	id: number
	name: string
	code: string
	parentDepartmentId?: number | null
	parentDepartment?: Department | null
	childDepartments?: Department[]
}

// Dựa trên models/Student.cs
export interface Student {
	id: number
	studentCode: string
	fullName: string
	dateOfBirth: string
	email: string
	phoneNumber: string
} 