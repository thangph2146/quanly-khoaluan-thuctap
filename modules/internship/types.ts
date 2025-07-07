import { AcademicYear, Semester } from '@/modules/config/types'
import { User } from '@/modules/users/types'

// Based on Partner.cs
export interface Partner {
	id: number
	name: string
	address: string
	phoneNumber: string
	email: string
}

// Based on Internship.cs - updated to use User instead of Student
export interface Internship {
	id: number
	studentId: number
	student: User
	partnerId: number
	partner: Partner
	academicYearId: number
	academicYear: AcademicYear
	semesterId: number
	semester: Semester
	reportUrl?: string | null
	grade?: number | null
}

// Internship Status enum
export type InternshipStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING_EVALUATION' | 'APPROVED' | 'CANCELLED'