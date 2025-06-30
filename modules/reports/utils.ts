import {
	ReportCategory,
	ReportStatus,
	GeneratedReportStatus,
	ReportFrequency,
} from './types'

export const getCategoryColor = (category: ReportCategory) => {
	switch (category) {
		case 'THESIS':
			return 'bg-blue-100 text-blue-800'
		case 'INTERNSHIP':
			return 'bg-green-100 text-green-800'
		case 'FACULTY':
			return 'bg-purple-100 text-purple-800'
		case 'PARTNERS':
			return 'bg-orange-100 text-orange-800'
		case 'FINANCIAL':
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export const getStatusColor = (status: ReportStatus | GeneratedReportStatus) => {
	switch (status) {
		case 'ACTIVE':
			return 'bg-green-100 text-green-800'
		case 'DRAFT':
			return 'bg-yellow-100 text-yellow-800'
		case 'COMPLETED':
			return 'bg-blue-100 text-blue-800'
		case 'PROCESSING':
			return 'bg-orange-100 text-orange-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export const getFrequencyText = (frequency: ReportFrequency) => {
	switch (frequency) {
		case 'DAILY':
			return 'Hàng ngày'
		case 'WEEKLY':
			return 'Hàng tuần'
		case 'MONTHLY':
			return 'Hàng tháng'
		case 'QUARTERLY':
			return 'Hàng quý'
		case 'YEARLY':
			return 'Hàng năm'
		default:
			return frequency
	}
} 