import { UserRole, UserStatus } from './types'

export const getRoleText = (role: UserRole) => {
	switch (role) {
		case 'ADMIN':
			return 'Quản trị viên'
		case 'LECTURER':
			return 'Giảng viên'
		case 'STUDENT':
			return 'Sinh viên'
		case 'BUSINESS_REP':
			return 'Đại diện Doanh nghiệp'
		default:
			return 'Không xác định'
	}
}

export const getStatusVariant = (
	status: UserStatus
): 'default' | 'secondary' | 'destructive' => {
	switch (status) {
		case 'ACTIVE':
			return 'default'
		case 'INACTIVE':
			return 'secondary'
		case 'PENDING':
			return 'destructive'
		default:
			return 'secondary'
	}
}
