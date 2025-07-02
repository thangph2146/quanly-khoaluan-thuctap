import { RoleName } from './types'

export const getRoleDisplayName = (roleName: RoleName): string => {
	switch (roleName) {
		case 'ADMIN':
			return 'Quản trị viên'
		case 'LECTURER':
			return 'Giảng viên'
		case 'STUDENT':
			return 'Sinh viên'
		case 'BUSINESS_REP':
			return 'Đại diện doanh nghiệp'
		default:
			return roleName
	}
}

export const getRoleColor = (roleName: RoleName): string => {
	switch (roleName) {
		case 'ADMIN':
			return 'bg-red-100 text-red-800 border-red-200'
		case 'LECTURER':
			return 'bg-blue-100 text-blue-800 border-blue-200'
		case 'STUDENT':
			return 'bg-green-100 text-green-800 border-green-200'
		case 'BUSINESS_REP':
			return 'bg-purple-100 text-purple-800 border-purple-200'
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200'
	}
}

export const getRoleDescription = (roleName: RoleName): string => {
	switch (roleName) {
		case 'ADMIN':
			return 'Có toàn quyền truy cập và quản lý hệ thống'
		case 'LECTURER':
			return 'Hướng dẫn và đánh giá khóa luận, thực tập của sinh viên'
		case 'STUDENT':
			return 'Thực hiện khóa luận và tham gia thực tập'
		case 'BUSINESS_REP':
			return 'Quản lý và đánh giá sinh viên thực tập tại doanh nghiệp'
		default:
			return 'Vai trò trong hệ thống'
	}
} 