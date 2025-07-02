// Import related types needed for Role
import { RoleMenu, RolePermission } from '@/modules/auth/types'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

// Based on Role.cs
export interface Role {
	id: number
	name: 'ADMIN' | 'LECTURER' | 'STUDENT' | 'BUSINESS_REP'
	description?: string

	// Navigation properties
	userRoles?: UserRole[]
	rolePermissions?: RolePermission[]
	roleMenus?: RoleMenu[]
}

// Based on UserRole.cs - Junction table
export interface UserRole {
	userId: number
	roleId: number
	user?: User
	role: Role
}

// Based on Student.cs
export interface Student {
	id: number
	studentCode: string
	fullName: string
	dateOfBirth: string // DateTime in C# is string in TS
	email: string
	phoneNumber: string
}

// Based on User.cs
export interface User {
	id: number
	keycloakUserId: string
	name: string
	email: string
	avatarUrl?: string
	isActive: boolean
	createdAt: string // DateTime in C# is string in TS
	updatedAt: string // DateTime in C# is string in TS

	// Navigation property from User.cs
	userRoles?: UserRole[]
} 