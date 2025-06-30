import { type LucideIcon } from 'lucide-react'
import { type Permission, type User } from '@/modules/auth/types'

export interface Team {
	name: string
	logo: LucideIcon
	plan: string
}

export interface NavItem {
	title: string
	url: string
	icon: LucideIcon
	permission?: Permission
	isActive?: boolean
	items?: {
		title: string
		url: string
		permission?: Permission
	}[]
}

export interface ProjectLink {
	name: string
	url: string
	icon: LucideIcon
}

export interface AppConfig {
	user: User
	teams: Team[]
	navMain: NavItem[]
	projects: ProjectLink[]
}