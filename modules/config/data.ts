import {
	Home,
	LineChart,
	Users,
	BookOpen,
	Briefcase,
	FileText,
	Settings,
	BarChart,
} from 'lucide-react'
import type { AppConfig } from './types'

export const appConfig: AppConfig = {
	user: {
		id: 'user-admin-01',
		name: 'Admin User',
		email: 'admin@example.com',
		avatarUrl: '/avatars/admin.png',
		roles: [
			{
				id: '1',
				name: 'ADMIN',
				permissions: [
					'dashboard:view',
					'users:manage',
					'thesis:manage_all',
					'thesis:register',
					'thesis:view_own',
					'thesis:view_all',
					'internship:manage_all',
					'internship:register',
					'internship:view_own',
					'internship:view_all',
					'documents:manage',
					'settings:manage',
				],
			},
		],
	},
	teams: [],
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
			permission: 'dashboard:view',
		},
		{
			title: 'Báo cáo',
			url: '/dashboard/reports',
			icon: BarChart,
			permission: 'dashboard:view',
		},
		{
			title: 'Người dùng',
			url: '/users',
			icon: Users,
			permission: 'users:manage',
		},
		{
			title: 'Khóa luận',
			icon: BookOpen,
			permission: 'thesis:view_own',
			url: '/thesis',
			items: [
				{
					title: 'Đăng ký',
					url: '/thesis/register',
					permission: 'thesis:register',
				},
				{
					title: 'Tiến độ',
					url: '/thesis/progress',
					permission: 'thesis:view_own',
				},
				{
					title: 'Đang thực hiện',
					url: '/thesis/active',
					permission: 'thesis:view_all',
				},
				{
					title: 'Phân công',
					url: '/thesis/assignments',
					permission: 'thesis:manage_all',
				},
				{
					title: 'Bảo vệ',
					url: '/thesis/defense',
					permission: 'thesis:manage_all',
				},
			],
		},
		{
			title: 'Thực tập',
			icon: Briefcase,
			permission: 'internship:view_own',
			url: '/internship',
			items: [
				{
					title: 'Đăng ký',
					url: '/internship/register',
					permission: 'internship:register',
				},
				{
					title: 'Doanh nghiệp',
					url: '/internship/partners',
					permission: 'internship:view_own',
				},
				{
					title: 'Đang thực tập',
					url: '/internship/active',
					permission: 'internship:view_all',
				},
				{
					title: 'Đánh giá',
					url: '/internship/evaluation',
					permission: 'internship:manage_all',
				},
				{
					title: 'Giảng viên HD',
					url: '/internship/supervisors',
					permission: 'internship:manage_all',
				},
			],
		},
		{
			title: 'Tài liệu',
			url: '/documents',
			icon: FileText,
			permission: 'documents:manage',
			items: [
				{
					title: 'Biểu mẫu',
					url: '/documents/forms',
					permission: 'documents:manage',
				},
				{
					title: 'Hướng dẫn',
					url: '/documents/guidelines',
					permission: 'documents:manage',
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
	projects: [],
} 