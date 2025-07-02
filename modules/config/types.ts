import { type LucideIcon } from 'lucide-react'
import { User } from '@/modules/users/types'
import { RoleMenu } from '@/modules/auth/types'

export interface Team {
	name: string
	logo: LucideIcon
	plan: string
}

export interface NavItem {
	title: string
	url: string
	icon: LucideIcon
	permission?: string
	isActive?: boolean
	items?: {
		title: string
		url: string
		permission?: string
	}[]
}

export interface ProjectLink {
	name: string
	url: string
	icon: LucideIcon
}

// Based on C# models
export interface Role {
	id: number
	name: string
	description?: string | null
	userRoles?: UserRole[]
	rolePermissions?: RolePermission[]
	roleMenus?: RoleMenu[]
}

export interface Permission {
	id: number
	name: string // "users:create", "users:read"
	description?: string | null
	module: string // "UserManagement", "Academic"
	rolePermissions?: RolePermission[]
}

export interface UserRole {
	userId: number
	roleId: number
	user?: User
	role: Role
}

export interface RolePermission {
	roleId: number
	permissionId: number
	role?: Role
	permission: Permission
}

export interface AppConfig {
	user: User
	navMain: NavItem[]
	roleMenus?: RoleMenu[]
}

// Based on AcademicYear.cs
export interface AcademicYear {
	id: number
	name: string // e.g., "2023-2024"
	startDate: string // Changed from DateTime
	endDate: string // Changed from DateTime
}

// Based on Semester.cs
export interface Semester {
	id: number
	name: string // e.g., "Học kỳ 1"
	academicYearId: number
	academicYear: AcademicYear
}

// Based on Department.cs
export interface Department {
	id: number
	name: string
	code: string
	parentDepartmentId?: number
	parentDepartment?: Department
	childDepartments?: Department[]
}

// Based on Menu.cs
export interface Menu {
	id: number
	name: string
	path: string
	icon?: string
	displayOrder: number
	parentId?: number
	parent?: Menu
	childMenus?: Menu[]
	roleMenus?: RoleMenu[]
}