export type FormCategory = 'THESIS' | 'INTERNSHIP'
export type FormStatus = 'ACTIVE' | 'ARCHIVED' | 'DRAFT'
export type SubmissionStatus = 'APPROVED' | 'REJECTED' | 'PENDING'

export interface FormTemplate {
	id: string
	name: string
	category: FormCategory
	description: string
	version: string
	lastUpdated: string
	downloadCount: number
	fileSize: string
	format: 'PDF' | 'DOC'
	status: FormStatus
	requiredFields: string[]
}

export interface SubmissionStudent {
	name: string
	code: string
	email: string
}

export interface Submission {
	id: string
	formId: string
	formName: string
	student: SubmissionStudent
	submittedDate: string
	status: SubmissionStatus
	reviewedBy: string | null
	reviewDate: string | null
	comments: string | null
} 