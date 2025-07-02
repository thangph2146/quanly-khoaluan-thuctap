import { User, Role } from './types'

export const roles: Role[] = [
	{ id: 1, name: 'ADMIN' },
	{ id: 2, name: 'LECTURER' },
	{ id: 3, name: 'STUDENT' },
	{ id: 4, name: 'BUSINESS_REP' },
]

export const users: User[] = [
	{
		id: 1,
		keycloakUserId: 'uuid-admin-01',
		name: 'Trần Thị Admin',
		email: 'admin@university.edu.vn',
		avatarUrl: '/avatars/01.png',
		isActive: true,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-10-26T10:00:00Z',
		userRoles: [{ userId: 1, roleId: 1, role: roles[0] }]
	},
	{
		id: 2,
		keycloakUserId: 'uuid-lecturer-01',
		name: 'Nguyễn Văn Giảng Viên',
		email: 'lecturer.nguyen@university.edu.vn',
		avatarUrl: '/avatars/02.png',
		isActive: true,
		createdAt: '2024-02-20T09:30:00Z',
		updatedAt: '2024-10-26T09:30:00Z',
		userRoles: [{ userId: 2, roleId: 2, role: roles[1] }]
	},
	{
		id: 3,
		keycloakUserId: 'uuid-student-01',
		name: 'Lê Thị Sinh Viên',
		email: 'student.le@student.university.edu.vn',
		avatarUrl: '/avatars/03.png',
		isActive: true,
		createdAt: '2024-03-10T14:00:00Z',
		updatedAt: '2024-10-25T15:20:00Z',
		userRoles: [{ userId: 3, roleId: 3, role: roles[2] }]
	},
	{
		id: 4,
		keycloakUserId: 'uuid-business-01',
		name: 'Phạm Văn Doanh Nghiệp',
		email: 'hr@fpt.com.vn',
		avatarUrl: '/avatars/04.png',
		isActive: true,
		createdAt: '2024-05-01T11:00:00Z',
		updatedAt: '2024-10-24T11:00:00Z',
		userRoles: [{ userId: 4, roleId: 4, role: roles[3] }]
	},
	{
		id: 5,
		keycloakUserId: 'uuid-lecturer-02',
		name: 'Hoàng Văn Giảng Viên',
		email: 'lecturer.hoang@university.edu.vn',
		avatarUrl: '/avatars/05.png',
		isActive: false,
		createdAt: '2024-02-21T11:00:00Z',
		updatedAt: '2024-08-15T11:00:00Z',
		userRoles: [{ userId: 5, roleId: 2, role: roles[1] }]
	},
	{
		id: 6,
		keycloakUserId: 'uuid-student-02',
		name: 'Đặng Thị Sinh Viên',
		email: 'student.dang@student.university.edu.vn',
		avatarUrl: '/avatars/06.png',
		isActive: true,
		createdAt: '2024-03-12T08:00:00Z',
		updatedAt: '2024-10-26T12:00:00Z',
		userRoles: [{ userId: 6, roleId: 3, role: roles[2] }]
	},
] 