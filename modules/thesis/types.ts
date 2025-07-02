import { AcademicYear, Semester } from '@/modules/config/types'
import { Student } from '@/modules/users/types'

// Based on Thesis.cs - simplified to match backend exactly
export interface Thesis {
	id: number
	title: string
	studentId: number
	student: Student
	academicYearId: number
	academicYear: AcademicYear
	semesterId: number
	semester: Semester
	submissionDate: string
}