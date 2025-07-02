import { AcademicYear, Semester } from '@/modules/config/types'
import { Student } from '@/modules/users/types'

// Thesis status type
export type ThesisStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING_DEFENSE' | 'APPROVED' | 'OVERDUE' | 'CANCELLED'

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

// Additional types for thesis defense
export interface CouncilMember {
	id: string
	name: string
	title: string
	role: 'CHAIR' | 'MEMBER' | 'SECRETARY'
	department: string
}

export interface DefenseRoom {
	id: string
	name: string
	capacity: number
	equipment: string[]
}

export interface DefenseSchedule {
	id: string
	thesis: {
		id: string
		title: string
		student: {
			id: string
			name: string
			studentCode: string
		}
	}
	room: DefenseRoom
	dateTime: string
	duration: number
	councilMembers: CouncilMember[]
	status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}