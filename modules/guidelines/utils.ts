import { GuidelineCategory } from './types'

export const getCategoryColor = (category: GuidelineCategory) => {
	switch (category) {
		case 'THESIS_PROCESS':
			return 'border-blue-500/50 bg-blue-500/10 text-blue-700'
		case 'INTERNSHIP_PROCESS':
			return 'border-green-500/50 bg-green-500/10 text-green-700'
		case 'REPORTING_GUIDE':
			return 'border-purple-500/50 bg-purple-500/10 text-purple-700'
		case 'SYSTEM_USAGE':
			return 'border-orange-500/50 bg-orange-500/10 text-orange-700'
		case 'GENERAL_REGULATION':
			return 'border-red-500/50 bg-red-500/10 text-red-700'
		default:
			return 'border-gray-500/50 bg-gray-500/10 text-gray-700'
	}
}

export const getCategoryText = (category: GuidelineCategory) => {
	switch (category) {
		case 'THESIS_PROCESS':
			return 'Quy trình Khóa luận'
		case 'INTERNSHIP_PROCESS':
			return 'Quy trình Thực tập'
		case 'REPORTING_GUIDE':
			return 'Hướng dẫn Báo cáo'
		case 'SYSTEM_USAGE':
			return 'Sử dụng Hệ thống'
		case 'GENERAL_REGULATION':
			return 'Quy định chung'
		default:
			return 'Chung'
	}
} 