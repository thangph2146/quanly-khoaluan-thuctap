import { FormTemplate, Submission } from './types'

export const formTemplates: FormTemplate[] = [
	{
		id: 'FORM001',
		name: 'Đơn đăng ký khóa luận tốt nghiệp',
		category: 'THESIS',
		description:
			'Mẫu đơn đăng ký đề tài khóa luận tốt nghiệp cho sinh viên năm cuối',
		version: '2024.1',
		lastUpdated: '2024-12-01',
		downloadCount: 156,
		fileSize: '245 KB',
		format: 'PDF',
		status: 'ACTIVE',
		requiredFields: [
			'Thông tin sinh viên',
			'Đề tài khóa luận',
			'Giảng viên hướng dẫn',
			'Kế hoạch thực hiện',
			'Tài liệu tham khảo',
		],
	},
	{
		id: 'FORM002',
		name: 'Biên bản họp hướng dẫn khóa luận',
		category: 'THESIS',
		description:
			'Mẫu biên bản ghi lại nội dung các buổi họp hướng dẫn giữa sinh viên và GVHD',
		version: '2024.1',
		lastUpdated: '2024-11-15',
		downloadCount: 89,
		fileSize: '180 KB',
		format: 'DOCX',
		status: 'ACTIVE',
		requiredFields: [
			'Thời gian họp',
			'Người tham dự',
			'Nội dung thảo luận',
			'Kết luận và nhiệm vụ',
			'Lịch họp tiếp theo',
		],
	},
	{
		id: 'FORM003',
		name: 'Đơn đăng ký thực tập doanh nghiệp',
		category: 'INTERNSHIP',
		description:
			'Mẫu đơn đăng ký thực tập tại doanh nghiệp cho sinh viên năm 3-4',
		version: '2024.2',
		lastUpdated: '2024-12-10',
		downloadCount: 234,
		fileSize: '198 KB',
		format: 'PDF',
		status: 'ACTIVE',
		requiredFields: [
			'Thông tin sinh viên',
			'Thông tin doanh nghiệp',
			'Vị trí thực tập',
			'Thời gian thực tập',
			'Cam kết thực tập',
		],
	},
	{
		id: 'FORM004',
		name: 'Báo cáo tuần thực tập',
		category: 'INTERNSHIP',
		description: 'Mẫu báo cáo tiến độ thực tập hàng tuần của sinh viên',
		version: '2024.1',
		lastUpdated: '2024-10-20',
		downloadCount: 167,
		fileSize: '156 KB',
		format: 'DOCX',
		status: 'ACTIVE',
		requiredFields: [
			'Tuần thực tập',
			'Công việc đã thực hiện',
			'Kiến thức học được',
			'Khó khăn gặp phải',
			'Kế hoạch tuần tiếp theo',
		],
	},
	{
		id: 'FORM005',
		name: 'Phiếu đánh giá thực tập của doanh nghiệp',
		category: 'INTERNSHIP',
		description:
			'Mẫu phiếu đánh giá sinh viên thực tập từ phía doanh nghiệp',
		version: '2024.1',
		lastUpdated: '2024-11-30',
		downloadCount: 78,
		fileSize: '201 KB',
		format: 'PDF',
		status: 'ACTIVE',
		requiredFields: [
			'Thông tin sinh viên',
			'Đánh giá kỹ năng chuyên môn',
			'Đánh giá thái độ làm việc',
			'Điểm số tổng kết',
			'Nhận xét và đề xuất',
		],
	},
	{
		id: 'FORM006',
		name: 'Đề cương khóa luận chi tiết',
		category: 'THESIS',
		description: 'Mẫu đề cương khóa luận chi tiết với cấu trúc chuẩn',
		version: '2023.2',
		lastUpdated: '2024-09-15',
		downloadCount: 203,
		fileSize: '312 KB',
		format: 'DOCX',
		status: 'ARCHIVED',
		requiredFields: [
			'Tên đề tài',
			'Lý do chọn đề tài',
			'Mục tiêu nghiên cứu',
			'Phương pháp nghiên cứu',
			'Kế hoạch thực hiện',
		],
	},
]

export const submissions: Submission[] = [
	{
		id: 'SUB001',
		formId: 'FORM001',
		formName: 'Đơn đăng ký khóa luận tốt nghiệp',
		student: {
			name: 'Nguyễn Văn An',
			code: '20IT001',
			email: 'an.nv@student.edu.vn',
		},
		submittedDate: '2024-12-20',
		status: 'APPROVED',
		reviewedBy: 'TS. Trần Thị Bình',
		reviewDate: '2024-12-21',
		comments: 'Đề tài phù hợp, sinh viên có nền tảng tốt',
	},
	{
		id: 'SUB002',
		formId: 'FORM003',
		formName: 'Đơn đăng ký thực tập doanh nghiệp',
		student: {
			name: 'Lê Thị Cẩm',
			code: '20IT002',
			email: 'cam.lt@student.edu.vn',
		},
		submittedDate: '2024-12-19',
		status: 'PENDING',
		reviewedBy: null,
		reviewDate: null,
		comments: null,
	},
	{
		id: 'SUB003',
		formId: 'FORM001',
		formName: 'Đơn đăng ký khóa luận tốt nghiệp',
		student: {
			name: 'Hoàng Minh Đức',
			code: '20IT003',
			email: 'duc.hm@student.edu.vn',
		},
		submittedDate: '2024-12-18',
		status: 'REJECTED',
		reviewedBy: 'PGS.TS. Phạm Văn Dũng',
		reviewDate: '2024-12-19',
		comments:
			'Đề tài chưa rõ ràng, cần bổ sung phương pháp nghiên cứu',
	},
]

export function findFormTemplateById(id: string) {
	return formTemplates.find(template => template.id === id)
}

export function findSubmissionById(id: string) {
	return submissions.find(submission => submission.id === id)
} 