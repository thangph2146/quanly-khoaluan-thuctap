export type ReportCategory =
	| 'THESIS'
	| 'INTERNSHIP'
	| 'FACULTY'
	| 'PARTNERS'
	| 'FINANCIAL'

export type ReportStatus = 'ACTIVE' | 'DRAFT'
export type GeneratedReportStatus = 'COMPLETED' | 'PROCESSING' | 'FAILED'
export type ReportFrequency =
	| 'DAILY'
	| 'WEEKLY'
	| 'MONTHLY'
	| 'QUARTERLY'
	| 'YEARLY'

export interface ReportTemplate {
	id: string
	name: string
	description: string
	category: ReportCategory
	frequency: ReportFrequency
	lastGenerated: string
	status: ReportStatus
	parameters: string[]
	formats: string[]
}

export interface GeneratedReport {
	id: string
	templateId: string
	name: string
	generatedDate: string
	generatedBy: string
	parameters: Record<string, string>
	fileSize: string
	format: 'PDF' | 'Excel' | 'CSV' | 'PowerPoint'
	downloadCount: number
	status: GeneratedReportStatus
}

export interface ReportStats {
	totalReports: number
	thisMonth: number
	automated: number
	manual: number
	avgGenerationTime: string
	totalDownloads: number
} 