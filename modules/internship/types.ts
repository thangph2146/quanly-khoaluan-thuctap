import { AcademicYear, Semester } from '@/modules/config/types'
import { Student } from '@/modules/users/types'

export type InternshipStatus =
	| 'APPROVED'
	| 'IN_PROGRESS'
	| 'PENDING_EVALUATION'
	| 'COMPLETED'
	| 'CANCELLED'

// Based on Partner.cs
export interface Partner {
	id: number
	name: string
	address: string
	phoneNumber: string
	email: string
}

// Based on Internship.cs - simplified to match backend exactly
export interface Internship {
	id: number
	studentId: number
	student: Student
	partnerId: number
	partner: Partner
	academicYearId: number
	academicYear: AcademicYear
	semesterId: number
	semester: Semester
	reportUrl?: string | null
	grade?: number | null
} 