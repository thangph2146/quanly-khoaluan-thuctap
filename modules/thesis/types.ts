export type ThesisStatus =
	| 'APPROVED'
	| 'IN_PROGRESS'
	| 'PENDING_DEFENSE'
	| 'COMPLETED'
	| 'OVERDUE'

export interface Thesis {
	id: string
	title: string
	student: string
	studentId: string
	supervisor: string
	status: ThesisStatus
	semester: string
	registrationDate: string
	deadline: string
	progress: number
} 