export type GuidelineCategory =
	| 'THESIS_PROCESS'
	| 'INTERNSHIP_PROCESS'
	| 'REPORTING_GUIDE'
	| 'SYSTEM_USAGE'
	| 'GENERAL_REGULATION'

export interface Guideline {
	id: string
	title: string
	category: GuidelineCategory
	description: string
	version: string
	lastUpdated: string
	author: string
	tags: string[]
	contentUrl: string
	relatedDocs: string[]
} 