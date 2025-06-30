import { LucideIcon } from 'lucide-react'

export interface DashboardStats {
	totalTheses: number
	totalInternships: number
	totalStudents: number
	totalSupervisors: number
}

export type ActivityType = 'APPROVAL' | 'SUBMISSION' | 'UPDATE' | 'ALERT'

export interface RecentActivity {
	type: ActivityType
	icon: LucideIcon
	title: string
	description: string
}

export interface StatusItem {
	label: string
	value: number
	color: string
}

export interface StatusCategory {
	title: string
	total: number
	items: StatusItem[]
} 