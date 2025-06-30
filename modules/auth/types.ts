/**
 * Định danh các quyền hạn cụ thể trong hệ thống.
 * Ví dụ: 'users:create', 'thesis:view_all', 'reports:generate'
 */
export type Permission =
	| 'dashboard:view'
	| 'users:manage'
	| 'thesis:register'
	| 'thesis:manage_all'
	| 'thesis:view_own'
	| 'thesis:view_all'
	| 'internship:register'
	| 'internship:manage_all'
	| 'internship:view_own'
	| 'internship:view_all'
	| 'documents:manage'
	| 'settings:manage'

/**
 * Đại diện cho một vai trò trong hệ thống.
 * Mỗi vai trò có một tập hợp các quyền hạn.
 */
export interface Role {
	id: string
	name: 'ADMIN' | 'LECTURER' | 'STUDENT'
	permissions: Permission[]
}

/**
 * Đại diện cho một người dùng trong hệ thống.
 * Người dùng có thể có nhiều vai trò.
 */
export interface User {
	id: string
	name: string
	email: string
	avatarUrl?: string
	roles: Role[]
} 