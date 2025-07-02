import { Role } from './types'

export const rolesData: Role[] = [
	{
		id: 1,
		name: 'ADMIN',
		description: 'Quản trị viên hệ thống - Có toàn quyền truy cập và quản lý',
		userRoles: [],
		rolePermissions: [],
		roleMenus: [],
	},
	{
		id: 2,
		name: 'LECTURER',
		description: 'Giảng viên - Hướng dẫn khóa luận và thực tập sinh viên',
		userRoles: [],
		rolePermissions: [],
		roleMenus: [],
	},
	{
		id: 3,
		name: 'STUDENT',
		description: 'Sinh viên - Thực hiện khóa luận và thực tập',
		userRoles: [],
		rolePermissions: [],
		roleMenus: [],
	},
	{
		id: 4,
		name: 'BUSINESS_REP',
		description: 'Đại diện doanh nghiệp - Quản lý sinh viên thực tập',
		userRoles: [],
		rolePermissions: [],
		roleMenus: [],
	},
]

export function findRoleById(id: number | string) {
	const numericId = typeof id === 'string' ? parseInt(id, 10) : id
	return rolesData.find(role => role.id === numericId)
}

export function findRoleByName(name: string) {
	return rolesData.find(role => role.name === name)
} 