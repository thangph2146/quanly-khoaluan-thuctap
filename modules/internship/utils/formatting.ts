import { InternshipStatus } from "../types"

export const getStatusColor = (status: InternshipStatus) => {
	switch (status) {
		case 'PENDING':
			return 'bg-gray-500 hover:bg-gray-600'
		case 'COMPLETED':
			return 'bg-green-500 hover:bg-green-600'
		case 'IN_PROGRESS':
			return 'bg-blue-500 hover:bg-blue-600'
		case 'PENDING_EVALUATION':
			return 'bg-yellow-500 hover:bg-yellow-600'
        case 'APPROVED':
            return 'bg-cyan-500 hover:bg-cyan-600'
		case 'CANCELLED':
			return 'bg-red-500 hover:bg-red-600'
		default:
			return 'bg-gray-500 hover:bg-gray-600'
	}
}

export const getStatusText = (status: InternshipStatus) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ xử lý'
        case 'APPROVED':
            return 'Đã duyệt'
        case 'IN_PROGRESS':
            return 'Đang thực hiện'
        case 'PENDING_EVALUATION':
            return 'Chờ đánh giá'
        case 'COMPLETED':
            return 'Hoàn thành'
        case 'CANCELLED':
            return 'Đã hủy'
        default:
            return 'Không rõ'
    }
} 