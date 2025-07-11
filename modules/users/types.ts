export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

export interface RolePermission {
	roleId: number;
	permissionId: number;
	permission: {
	  id: number;
	  name: string;
	  module: string;
	}
  }

export interface Role {
	id: number;
	name: string;
	description?: string | null;
	deletedAt?: string | null;
	rolePermissions?: RolePermission[];
  }
export interface User {
	id: number;
	keycloakUserId: string;
	name: string;
	email: string;
	avatarUrl?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
	userRoles: string[];
}

export interface ComboboxOption {
  value: string | number;
  label: string;
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