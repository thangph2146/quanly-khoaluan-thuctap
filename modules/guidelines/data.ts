import { Guideline } from './types'

export const guidelines: Guideline[] = [
	{
		id: 'GUIDE001',
		title: 'Quy trình thực hiện Khóa luận tốt nghiệp từ A-Z',
		category: 'THESIS_PROCESS',
		description:
			'Tài liệu chi tiết hướng dẫn sinh viên các bước thực hiện khóa luận, từ đăng ký đề tài đến bảo vệ thành công.',
		version: '3.1',
		lastUpdated: '2024-09-01',
		author: 'Phòng Đào tạo',
		tags: ['khóa luận', 'quy trình', 'bảo vệ', 'đề tài'],
		contentUrl: '/docs/thesis-process-v3.1.pdf',
		relatedDocs: ['FORM001', 'FORM002'],
	},
	{
		id: 'GUIDE002',
		title: 'Hướng dẫn quy trình đi thực tập tại doanh nghiệp',
		category: 'INTERNSHIP_PROCESS',
		description:
			'Các bước cần thiết cho một kỳ thực tập thành công, bao gồm tìm công ty, nộp đơn, báo cáo và đánh giá.',
		version: '2.5',
		lastUpdated: '2024-08-15',
		author: 'Phòng Công tác Sinh viên',
		tags: ['thực tập', 'doanh nghiệp', 'báo cáo', 'đánh giá'],
		contentUrl: '/docs/internship-process-v2.5.pdf',
		relatedDocs: ['FORM003', 'FORM004', 'FORM005'],
	},
	{
		id: 'GUIDE003',
		title: 'Quy định về báo cáo và định dạng tài liệu',
		category: 'REPORTING_GUIDE',
		description:
			'Các tiêu chuẩn về định dạng, trích dẫn và cấu trúc của các báo cáo, khóa luận, và tài liệu nộp trong hệ thống.',
		version: '2.0',
		lastUpdated: '2024-07-30',
		author: 'Hội đồng Khoa học',
		tags: ['định dạng', 'báo cáo', 'trích dẫn', 'template'],
		contentUrl: '/docs/reporting-guide-v2.0.pdf',
		relatedDocs: [],
	},
	{
		id: 'GUIDE004',
		title: 'Hướng dẫn sử dụng hệ thống Quản lý Khóa luận & Thực tập',
		category: 'SYSTEM_USAGE',
		description:
			'Tài liệu hướng dẫn các chức năng chính của hệ thống cho từng vai trò: Sinh viên, Giảng viên và Quản trị viên.',
		version: '1.2',
		lastUpdated: '2024-09-05',
		author: 'Ban Quản trị Hệ thống',
		tags: ['hướng dẫn', 'hệ thống', 'chức năng'],
		contentUrl: '/docs/system-guide-v1.2.pdf',
		relatedDocs: [],
	},
	{
		id: 'GUIDE005',
		title: 'Quy định chung của nhà trường về hoạt động học thuật',
		category: 'GENERAL_REGULATION',
		description:
			'Tổng hợp các quy định, chính sách chung của nhà trường liên quan đến hoạt động học thuật và nghiên cứu khoa học.',
		version: '2024',
		lastUpdated: '2024-08-01',
		author: 'Phòng Đào tạo',
		tags: ['quy định', 'chính sách', 'học thuật'],
		contentUrl: '/docs/general-regulations-2024.pdf',
		relatedDocs: [],
	},
] 