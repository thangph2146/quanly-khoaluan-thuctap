export type InternshipStatus =
	| 'APPROVED'
	| 'IN_PROGRESS'
	| 'PENDING_EVALUATION'
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
	title: string
	student: string
	studentId: string
	company: string
	position: string
	supervisor: string
	companySupervisor: string
	status: InternshipStatus
	startDate: string
	endDate: string
	location: string
	salary: string
	rating: number
} 