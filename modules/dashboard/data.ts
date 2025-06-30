import {
	CheckCircle,
	FileText,
	Clock,
	AlertCircle
} from 'lucide-react'
import { DashboardStats, RecentActivity, StatusCategory } from './types'

export const dashboardStats: DashboardStats = {
  totalTheses: 156,
  totalInternships: 89,
  totalStudents: 245,
  totalSupervisors: 42,
}

export const recentActivities: RecentActivity[] = [
  {
    type: 'APPROVAL',
    icon: CheckCircle,
    title: 'Khóa luận "AI trong Y học" đã được phê duyệt',
    description: 'Sinh viên: Nguyễn Văn A - 2 giờ trước',
  },
  {
    type: 'SUBMISSION',
    icon: FileText,
    title: 'Đăng ký thực tập tại Công ty FPT',
    description: 'Sinh viên: Trần Thị B - 4 giờ trước',
  },
  {
    type: 'UPDATE',
    icon: Clock,
    title: 'Lịch bảo vệ khóa luận đã được cập nhật',
    description: '15 khóa luận - Tuần tới',
  },
  {
    type: 'ALERT',
    icon: AlertCircle,
    title: 'Cần xử lý: 3 khóa luận quá hạn nộp',
    description: 'Cần liên hệ sinh viên',
  },
]

export const thesisStatus: StatusCategory = {
  title: 'Khóa luận',
  total: 156,
  items: [
    { label: 'Đang thực hiện', value: 89, color: 'text-blue-600' },
    { label: 'Chờ bảo vệ', value: 34, color: 'text-yellow-600' },
    { label: 'Hoàn thành', value: 28, color: 'text-green-600' },
    { label: 'Chờ phê duyệt', value: 5, color: 'text-orange-600' },
  ],
}

export const internshipStatus: StatusCategory = {
  title: 'Thực tập',
  total: 89,
  items: [
    { label: 'Đang thực tập', value: 67, color: 'text-blue-600' },
    { label: 'Chờ đánh giá', value: 15, color: 'text-yellow-600' },
    { label: 'Hoàn thành', value: 7, color: 'text-green-600' },
  ],
} 