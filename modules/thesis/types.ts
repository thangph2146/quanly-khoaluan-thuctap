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

export interface Supervisor {
	id: string
	name: string
	department: string
	specialization: string
	currentTheses: number
	maxTheses: number
	researchAreas: string[]
	avatar?: string
}

export type ResearchTopic = string

export interface ThesisRegistration {
	id: string
	studentId: string
	studentName: string
	studentEmail: string
	studentPhone: string
	proposedTitle: string
	topic: ResearchTopic
	supervisorId: string
	outlineUrl: string // URL to the uploaded proposal outline
	submissionDate: string
	status: 'PENDING' | 'APPROVED' | 'REJECTED'
	comments?: string
}

export interface ThesisAssignment {
	id: string
	title: string
	description: string
	student: {
		id: string
		name: string
		code: string
	}
	supervisor: {
		id:string
		name: string
	}
	thesis: {
		id: string
		title: string
	}
	dueDate: string
	assignedDate: string
	status: 'Đang thực hiện' | 'Hoàn thành' | 'Chờ review' | 'Quá hạn'
	priority: 'Cao' | 'Trung bình' | 'Thấp'
	progress: number
	estimatedHours: number
	actualHours: number
	category: string
	attachments: {
		name: string
		size: string
		url?: string
	}[]
}

export interface Milestone {
	id: number
	title: string
	status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE'
	dueDate: string
	completedDate: string | null
}

export interface Meeting {
	date: string
	topic: string
	notes: string
}

export interface Document {
	name: string
	type: 'PDF' | 'DOC' | 'ZIP' | 'PPT' | 'XLS' | 'OTHER'
	uploadDate: string
	status: 'APPROVED' | 'PENDING' | 'REJECTED'
	url?: string
}

export interface ThesisProgress {
	id: string
	title: string
	student: {
		name: string
		code: string
		email: string
	}
	supervisor: string
	startDate: string
	expectedEndDate: string
	currentPhase: 'RESEARCH' | 'DESIGN' | 'IMPLEMENTATION' | 'TESTING' | 'DOCUMENTATION' | 'DEFENSE'
	overallProgress: number
	status: 'ON_TRACK' | 'DELAYED' | 'AT_RISK' | 'COMPLETED'
	lastUpdate: string
	milestones: Milestone[]
	meetings: Meeting[]
	documents: Document[]
}

export interface DefenseDocuments {
	thesis: { submitted: boolean; approved: boolean }
	presentation: { submitted: boolean; approved: boolean }
	summary: { submitted: boolean; approved: boolean }
}

export interface DefenseResult {
	grade: number
	classification: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'AVERAGE' | 'POOR'
	chairman_score: number
	secretary_score: number
	member_scores: number[]
	comments: string
	recommendations: string
}

export interface DefenseSchedule {
	id: string
	thesis: {
		id: string
		title: string
		student: {
			name: string
			code: string
			email: string
		}
		supervisor: string
	}
	date: string
	time: string
	duration: number
	room: string
	status: 'SCHEDULED' | 'PENDING_APPROVAL' | 'COMPLETED' | 'CANCELLED'
	council: {
		chairman: string
		secretary: string
		members: string[]
	}
	documents: DefenseDocuments
	result: DefenseResult | null
}

export interface CouncilMember {
	id: string
	name: string
	title: string
	department: string
	specialization: string
	role: 'CHAIRMAN' | 'SECRETARY' | 'MEMBER'
	experience: number
	defensesCount: number
}

export interface DefenseRoom {
	id: string
	name: string
	capacity: number
	equipment: string[]
} 