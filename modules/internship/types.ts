export type InternshipStatus =
	| 'UPCOMING'
	| 'IN_PROGRESS'
	| 'COMPLETED'
	| 'CANCELLED'

export interface Student {
	id: string
	name: string
}

export interface Company {
	name: string
	address: string
}

export interface Supervisor {
	name: string
	email: string
}

export interface Internship {
	id: string
	student: Student
	company: Company
	supervisor: Supervisor
	startDate: string
	endDate: string
	status: InternshipStatus
} 