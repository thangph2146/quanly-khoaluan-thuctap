import { ThesisStatus } from "./types"

export const getStatusColor = (status: ThesisStatus) => {
	switch (status) {
		case 'COMPLETED':
			return 'bg-green-500 hover:bg-green-600'
		case 'IN_PROGRESS':
			return 'bg-blue-500 hover:bg-blue-600'
		case 'PENDING_DEFENSE':
			return 'bg-yellow-500 hover:bg-yellow-600'
        case 'APPROVED':
            return 'bg-cyan-500 hover:bg-cyan-600'
		case 'OVERDUE':
			return 'bg-red-500 hover:bg-red-600'
		default:
			return 'bg-gray-500 hover:bg-gray-600'
	}
}

export const getStatusText = (status: ThesisStatus) => {
    switch (status) {
        case 'APPROVED':
            return 'Đã duyệt'
        case 'IN_PROGRESS':
            return 'Đang thực hiện'
        case 'PENDING_DEFENSE':
            return 'Chờ bảo vệ'
        case 'COMPLETED':
            return 'Hoàn thành'
        case 'OVERDUE':
            return 'Quá hạn'
        default:
            return 'Không rõ'
    }
} 