export type UserRole = 'ADMIN' | 'LECTURER' | 'STUDENT' | 'BUSINESS_REP'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

export interface User {
	id: string
	name: string
	email: string
	avatar: string
	role: UserRole
	status: UserStatus
	department: string
	studentId?: string
	employeeId?: string
	company?: string
	lastLogin: string
	thesesManaged?: number
	internshipsSupervised?: number
	phone?: string
	address?: string
	dateOfBirth?: string
} 