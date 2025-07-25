import {
	ReportTemplate,
	GeneratedReport,
	ReportStats,
} from './types'

export const reportTemplates: ReportTemplate[] = [
	{
		id: 'RPT001',
		name: 'Báo cáo tổng quan khóa luận',
		description:
			'Thống kê tổng quan về tình hình thực hiện khóa luận theo học kỳ',
		category: 'THESIS',
		frequency: 'MONTHLY',
		lastGenerated: '2024-01-15',
		status: 'ACTIVE',
		parameters: ['semester', 'department', 'supervisor'],
		formats: ['PDF', 'Excel', 'CSV'],
	},
	{
		id: 'RPT002',
		name: 'Báo cáo tiến độ thực tập',
		description: 'Theo dõi tiến độ và kết quả thực tập của sinh viên',
		category: 'INTERNSHIP',
		frequency: 'WEEKLY',
		lastGenerated: '2024-01-20',
		status: 'ACTIVE',
		parameters: ['company', 'supervisor', 'period'],
		formats: ['PDF', 'Excel'],
	},
	{
		id: 'RPT003',
		name: 'Báo cáo đánh giá giảng viên',
		description:
			'Thống kê năng suất và chất lượng hướng dẫn của giảng viên',
		category: 'FACULTY',
		frequency: 'QUARTERLY',
		lastGenerated: '2024-01-10',
		status: 'ACTIVE',
		parameters: ['department', 'period', 'criteria'],
		formats: ['PDF', 'Excel', 'PowerPoint'],
	},
	{
		id: 'RPT004',
		name: 'Báo cáo đối tác doanh nghiệp',
		description: 'Đánh giá hiệu quả hợp tác với các doanh nghiệp đối tác',
		category: 'PARTNERS',
		frequency: 'MONTHLY',
		lastGenerated: '2024-01-18',
		status: 'ACTIVE',
		parameters: ['company', 'partnership_type', 'evaluation'],
		formats: ['PDF', 'Excel'],
	},
	{
		id: 'RPT005',
		name: 'Báo cáo tài chính học phí',
		description: 'Thống kê thu chi liên quan đến khóa luận và thực tập',
		category: 'FINANCIAL',
		frequency: 'MONTHLY',
		lastGenerated: '2024-01-12',
		status: 'DRAFT',
		parameters: ['semester', 'fee_type', 'payment_status'],
		formats: ['PDF', 'Excel'],
	},
]

export const generatedReports: GeneratedReport[] = [
	{
		id: 'GEN001',
		templateId: 'RPT001',
		name: 'Báo cáo khóa luận HK1 2023-2024',
		generatedDate: '2024-01-15',
		generatedBy: 'Nguyễn Văn Admin',
		parameters: {
			semester: 'HK1 2023-2024',
			department: 'Tất cả',
			supervisor: 'Tất cả',
		},
		fileSize: '2.5 MB',
		format: 'PDF',
		downloadCount: 15,
		status: 'COMPLETED',
	},
	{
		id: 'GEN002',
		templateId: 'RPT002',
		name: 'Báo cáo thực tập tuần 3 tháng 1',
		generatedDate: '2024-01-20',
		generatedBy: 'Trần Thị Manager',
		parameters: {
			company: 'FPT Software',
			supervisor: 'Tất cả',
			period: 'Tuần 3/2024',
		},
		fileSize: '1.8 MB',
		format: 'Excel',
		downloadCount: 8,
		status: 'COMPLETED',
	},
	{
		id: 'GEN003',
		templateId: 'RPT003',
		name: 'Báo cáo đánh giá GV Q4 2023',
		generatedDate: '2024-01-10',
		generatedBy: 'Lê Văn Director',
		parameters: {
			department: 'CNTT',
			period: 'Q4 2023',
			criteria: 'Tất cả',
		},
		fileSize: '3.2 MB',
		format: 'PDF',
		downloadCount: 22,
		status: 'COMPLETED',
	},
	{
		id: 'GEN004',
		templateId: 'RPT004',
		name: 'Báo cáo đối tác tháng 12/2023',
		generatedDate: '2024-01-05',
		generatedBy: 'Phạm Thị Coordinator',
		parameters: {
			company: 'Tất cả',
			partnership_type: 'STRATEGIC',
			evaluation: 'Tất cả',
		},
		fileSize: '1.5 MB',
		format: 'Excel',
		downloadCount: 12,
		status: 'COMPLETED',
	},
]

export const reportStats: ReportStats = {
	totalReports: 156,
	thisMonth: 24,
	automated: 89,
	manual: 67,
	avgGenerationTime: '2.3 phút',
	totalDownloads: 1247,
} 