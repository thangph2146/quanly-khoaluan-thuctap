/**
 * Role Module Types
 */
import type { Permission } from '@/modules/permissions/types';
import type { RoleMenu } from '@/modules/menu/types';

// Based on Role.cs
export interface Role {
	id: number;
	name: string;
	description?: string;
	deletedAt?: string | null;

	// Navigation properties, assuming they might come from the API
	permissions?: Permission[];
	userRoles?: UserRole[];
	roleMenus?: RoleMenu[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RoleFilters {
  page?: number;
  limit?: number;
  search?: string;
}

// Based on UserRole.cs - Junction table
export interface UserRole {
	userId: number;
	roleId: number;
	user?: User; // Basic User interface to avoid circular deps
	role: Role;
}

// For API requests to create/update
export interface RoleMutationData {
	name: string;
	description?: string;
	permissionIds?: number[];
	menuIds?: number[];
}
// For API requests - can be split if needed but this is fine
export type CreateRoleRequest = RoleMutationData;
export type UpdateRoleRequest = Partial<RoleMutationData>;

// Basic User interface to avoid circular dependencies
interface User {
	id: number;
	name: string;
	email: string;
}

// Component Prop Types
export interface RoleListProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onView: (role: Role) => void;
  onDeleteMany: (ids: (string | number)[], onSuccess: () => void) => void;
  filterBar?: React.ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export interface RoleDeletedListProps {
  roles: Role[];
  isLoading: boolean;
  onRestore: (ids: (string | number)[], onSuccess: () => void) => void;
  onPermanentDelete: (ids: (string | number)[], onSuccess: () => void) => void;
  deleteButtonText?: string;
  filterBar?: React.ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

export interface RoleFormProps {
  isOpen: boolean;
  role?: Role | null;
  onSubmit: (data: RoleMutationData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  title: string;
}

export interface RoleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
} 