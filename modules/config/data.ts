import {
	Home,
	LineChart,
	Users,
	BookOpen,
	Briefcase,
	Settings,
	BarChart,
	Building2,
	Library,
} from 'lucide-react'
import type { AppConfig, User, Role, Permission, UserRole, RolePermission } from '@/modules/config/types'

// Core permissions based on C# models
const permissions: Permission[] = [
	{ id: 1, module: 'dashboard', name: 'dashboard:view', description: 'Xem tổng quan' },
	{ id: 2, module: 'users', name: 'users:manage', description: 'Quản lý người dùng' },
	{ id: 3, module: 'thesis', name: 'thesis:manage', description: 'Quản lý khóa luận' },
	{ id: 4, module: 'internship', name: 'internship:manage', description: 'Quản lý thực tập' },
	{ id: 5, module: 'partners', name: 'partners:manage', description: 'Quản lý doanh nghiệp' },
	{ id: 6, module: 'academic', name: 'academic:manage', description: 'Quản lý đào tạo' },
	{ id: 7, module: 'analytics', name: 'analytics:view', description: 'Xem phân tích' },
	{ id: 8, module: 'reports', name: 'reports:view', description: 'Xem báo cáo' },
	{ id: 9, module: 'settings', name: 'settings:manage', description: 'Quản lý cài đặt' },
]

// Admin role with all permissions
const adminRole: Role = {
	id: 1,
	name: 'ADMIN',
	description: 'Quản trị viên hệ thống',
}

// Create role permissions for admin
const adminRolePermissions: RolePermission[] = permissions.map(p => ({
	roleId: adminRole.id,
	permissionId: p.id,
	permission: p,
	role: adminRole,
}))

adminRole.rolePermissions = adminRolePermissions

// Admin user
const adminUser: User = {
	id: 1,
	keycloakUserId: 'admin-uuid-001',
	name: 'Quản trị viên',
	email: 'admin@university.edu.vn',
	avatarUrl: '/avatars/admin.png',
	isActive: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
}

// Create user role for admin
const adminUserRole: UserRole = {
	userId: adminUser.id,
	roleId: adminRole.id,
	user: adminUser,
	role: adminRole,
}

adminUser.userRoles = [adminUserRole]

export const appConfig: AppConfig = {
	user: adminUser,
	navMain: [
		{
			title: 'Tổng quan',
			url: '/dashboard',
			icon: Home,
			permission: 'dashboard:view',
		},
		{
			title: 'Phân tích',
			url: '/dashboard/analytics',
			icon: LineChart,
			permission: 'analytics:view',
		},
		{
			title: 'Báo cáo',
			url: '/dashboard/reports',
			icon: BarChart,
			permission: 'reports:view',
		},
		{
			title: 'Người dùng',
			url: '/users',
			icon: Users,
			permission: 'users:manage',
		},
		{
			title: 'Khóa luận',
			url: '/thesis',
			icon: BookOpen,
			permission: 'thesis:manage',
		},
		{
			title: 'Thực tập',
			url: '/internship',
			icon: Briefcase,
			permission: 'internship:manage',
		},
		{
			title: 'Doanh nghiệp',
			url: '/partners',
			icon: Building2,
			permission: 'partners:manage',
		},
		{
			title: 'Quản lý đào tạo',
			url: '/academic',
			icon: Library,
			permission: 'academic:manage',
			items: [
				{
					title: 'Niên khóa',
					url: '/academic/years',
					permission: 'academic:manage',
				},
				{
					title: 'Khoa & Chuyên ngành',
					url: '/academic/departments',
					permission: 'academic:manage',
				},
				{
					title: 'Sinh viên',
					url: '/academic/students',
					permission: 'academic:manage',
				},
			],
		},
		{
			title: 'Cài đặt',
			url: '/settings',
			icon: Settings,
			permission: 'settings:manage',
		},
	],
} 