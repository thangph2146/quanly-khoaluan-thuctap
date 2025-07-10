// Import related types needed for Role
import { RoleMenu } from '@/modules/menu/types'
import { RolePermission } from '@/modules/permission/types'

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
	createdAt: string
	updatedAt: string
	deletedAt?: string
	userRoles: string[] // Changed from UserRole[] to string[]

	// Keep for backward compatibility if needed
	roles?: Role[]
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
}


export interface UserListProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onDeleteMany?: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface UserDeletedListProps {
  users: User[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void;
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void;
  deleteButtonText?: string;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

export interface CreateUserData {
	name: string
	email: string
	avatarUrl?: string
	isActive: boolean
	keycloakUserId: string
	roleIds: number[]
}

export interface UpdateUserData {
	name: string
	email: string
	avatarUrl?: string
	isActive: boolean
	keycloakUserId: string
	roleIds: number[]
}