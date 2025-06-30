import { FormCategory, FormStatus, SubmissionStatus } from './types'

export const getCategoryColor = (category: FormCategory) => {
	switch (category) {
		case 'THESIS':
			return 'bg-blue-100 text-blue-800'
		case 'INTERNSHIP':
			return 'bg-green-100 text-green-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export const getStatusColor = (status: FormStatus) => {
	switch (status) {
		case 'ACTIVE':
			return 'bg-green-100 text-green-800'
		case 'ARCHIVED':
			return 'bg-gray-100 text-gray-800'
		case 'DRAFT':
			return 'bg-yellow-100 text-yellow-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export const getSubmissionStatusColor = (status: SubmissionStatus) => {
	switch (status) {
		case 'APPROVED':
			return 'bg-green-100 text-green-800'
		case 'REJECTED':
			return 'bg-red-100 text-red-800'
		case 'PENDING':
			return 'bg-yellow-100 text-yellow-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
} 