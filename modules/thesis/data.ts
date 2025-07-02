import {
	Thesis,
	Supervisor,
	ResearchTopic,
	ThesisRegistration,
	ThesisAssignment,
	ThesisProgress,
	DefenseSchedule,
	CouncilMember,
	DefenseRoom,
} from './types'

export const thesisData: Thesis[] = [
	{
		id: 'KL001',
		title: 'Ứng dụng Machine Learning trong dự đoán xu hướng thị trường',
		student: 'Nguyễn Văn A',
		studentId: '20210001',
		supervisor: 'TS. Trần Thị B',
		status: 'IN_PROGRESS',
		semester: '2024-2025',
		registrationDate: '2024-09-15',
		deadline: '2024-12-15',
		progress: 65,
	},
	{
		id: 'KL002',
		title: 'Hệ thống quản lý thư viện điện tử sử dụng React và Node.js',
		student: 'Lê Thị C',
		studentId: '20210002',
		supervisor: 'ThS. Nguyễn Văn D',
		status: 'PENDING_DEFENSE',
		semester: '2024-2025',
		registrationDate: '2024-09-10',
		deadline: '2024-12-10',
		progress: 95,
	},
	{
		id: 'KL003',
		title: 'Phát triển ứng dụng mobile quản lý chi tiêu cá nhân',
		student: 'Phạm Văn E',
		studentId: '20210003',
		supervisor: 'PGS. Hoàng Thị F',
		status: 'APPROVED',
		semester: '2024-2025',
		registrationDate: '2024-09-20',
		deadline: '2024-12-20',
		progress: 30,
	},
	{
		id: 'KL004',
		title: 'Nghiên cứu và ứng dụng Blockchain trong hệ thống thanh toán',
		student: 'Vũ Thị G',
		studentId: '20210004',
		supervisor: 'TS. Đặng Văn H',
		status: 'COMPLETED',
		semester: '2023-2024',
		registrationDate: '2024-02-15',
		deadline: '2024-06-15',
		progress: 100,
	},
	{
		id: 'KL005',
		title: 'Xây dựng chatbot hỗ trợ tư vấn học tập sử dụng AI',
		student: 'Bùi Văn I',
		studentId: '20210005',
		supervisor: 'ThS. Ngô Thị K',
		status: 'OVERDUE',
		semester: '2024-2025',
		registrationDate: '2024-08-15',
		deadline: '2024-11-15',
		progress: 40,
	},
]

export const availableSupervisors: Supervisor[] = [
	{
		id: 'GV001',
		name: 'TS. Trần Thị D',
		department: 'Công nghệ phần mềm',
		specialization: 'Web Development, Database',
		currentTheses: 8,
		maxTheses: 12,
		researchAreas: [
			'Web Applications',
			'Database Design',
			'Software Engineering',
		],
		avatar: '/avatars/supervisor-1.png',
	},
	{
		id: 'GV002',
		name: 'PGS. Nguyễn Văn E',
		department: 'Trí tuệ nhân tạo',
		specialization: 'Machine Learning, AI',
		currentTheses: 15,
		maxTheses: 18,
		researchAreas: [
			'Machine Learning',
			'Computer Vision',
			'Natural Language Processing',
		],
		avatar: '/avatars/supervisor-2.png',
	},
	{
		id: 'GV003',
		name: 'ThS. Lê Thị F',
		department: 'Hệ thống thông tin',
		specialization: 'Mobile Development, IoT',
		currentTheses: 5,
		maxTheses: 10,
		researchAreas: ['Mobile Applications', 'IoT Systems', 'Cloud Computing'],
		avatar: '/avatars/supervisor-3.png',
	},
]

export const researchTopics: ResearchTopic[] = [
	'Phát triển ứng dụng web',
	'Machine Learning và AI',
	'Phát triển ứng dụng di động',
	'Blockchain và Cryptocurrency',
	'Internet of Things (IoT)',
	'Cybersecurity',
	'Data Analytics',
	'Cloud Computing',
	'Game Development',
	'E-commerce Systems',
]

export const thesisRegistrations: ThesisRegistration[] = [
	{
		id: 'REG001',
		studentId: '20210001',
		studentName: 'Nguyễn Văn A',
		studentEmail: 'nguyenvana@email.com',
		studentPhone: '0987654321',
		proposedTitle: 'Xây dựng hệ thống quản lý thư viện trực tuyến',
		topic: 'Phát triển ứng dụng web',
		supervisorId: 'GV001',
		outlineUrl: '/uploads/outlines/REG001.pdf',
		submissionDate: '2024-12-25',
		status: 'PENDING',
	},
	{
		id: 'REG002',
		studentId: '20210002',
		studentName: 'Trần Thị B',
		studentEmail: 'tranthib@email.com',
		studentPhone: '0123456789',
		proposedTitle: 'Nghiên cứu mô hình nhận dạng khuôn mặt',
		topic: 'Machine Learning và AI',
		supervisorId: 'GV002',
		outlineUrl: '/uploads/outlines/REG002.pdf',
		submissionDate: '2024-12-26',
		status: 'APPROVED',
		comments: 'Đề tài rất tiềm năng, đề cương chi tiết. Đồng ý.',
	},
]

export const thesisAssignments: ThesisAssignment[] = [
	{
		id: 'AS001',
		title: 'Nghiên cứu tài liệu về Machine Learning',
		description:
			'Tìm hiểu và tổng hợp các tài liệu nghiên cứu về Machine Learning trong lĩnh vực xử lý ngôn ngữ tự nhiên',
		student: {
			id: 'SV001',
			name: 'Nguyễn Văn An',
			code: '20IT001',
		},
		supervisor: {
			id: 'GV001',
			name: 'TS. Nguyễn Văn A',
		},
		thesis: {
			id: 'KL001',
			title: 'Xây dựng hệ thống chatbot thông minh sử dụng NLP',
		},
		dueDate: '2024-12-20',
		assignedDate: '2024-11-15',
		status: 'Đang thực hiện',
		priority: 'Cao',
		progress: 65,
		estimatedHours: 40,
		actualHours: 26,
		category: 'Nghiên cứu',
		attachments: [
			{ name: 'Danh sách tài liệu.pdf', size: '2.5 MB' },
			{ name: 'Outline nghiên cứu.docx', size: '1.2 MB' },
		],
	},
	{
		id: 'AS002',
		title: 'Thiết kế kiến trúc hệ thống',
		description:
			'Thiết kế kiến trúc tổng thể cho hệ thống quản lý thư viện số, bao gồm database design và API structure',
		student: {
			id: 'SV002',
			name: 'Trần Thị Bình',
			code: '20IT002',
		},
		supervisor: {
			id: 'GV002',
			name: 'PGS. Trần Thị B',
		},
		thesis: {
			id: 'KL002',
			title: 'Hệ thống quản lý thư viện số với công nghệ blockchain',
		},
		dueDate: '2024-12-15',
		assignedDate: '2024-11-10',
		status: 'Hoàn thành',
		priority: 'Cao',
		progress: 100,
		estimatedHours: 30,
		actualHours: 28,
		category: 'Thiết kế',
		attachments: [
			{ name: 'System Architecture.pdf', size: '3.8 MB' },
			{ name: 'Database Schema.sql', size: '156 KB' },
		],
	},
	{
		id: 'AS003',
		title: 'Cài đặt module xử lý dữ liệu',
		description:
			'Implement các function cơ bản để xử lý và làm sạch dữ liệu đầu vào cho hệ thống phân tích',
		student: {
			id: 'SV003',
			name: 'Lê Văn Cường',
			code: '20IT003',
		},
		supervisor: {
			id: 'GV003',
			name: 'TS. Lê Văn C',
		},
		thesis: {
			id: 'KL003',
			title: 'Hệ thống phân tích dữ liệu lớn cho doanh nghiệp',
		},
		dueDate: '2024-12-25',
		assignedDate: '2024-11-18',
		status: 'Chờ review',
		priority: 'Trung bình',
		progress: 85,
		estimatedHours: 35,
		actualHours: 30,
		category: 'Lập trình',
		attachments: [
			{ name: 'data_processing.py', size: '45 KB' },
			{ name: 'test_cases.py', size: '23 KB' },
		],
	},
	{
		id: 'AS004',
		title: 'Viết báo cáo tiến độ tháng 11',
		description:
			'Tổng hợp tiến độ thực hiện khóa luận trong tháng 11, bao gồm các kết quả đạt được và khó khăn gặp phải',
		student: {
			id: 'SV004',
			name: 'Phạm Thị Dung',
			code: '20IT004',
		},
		supervisor: {
			id: 'GV001',
			name: 'TS. Nguyễn Văn A',
		},
		thesis: {
			id: 'KL004',
			title: 'Ứng dụng IoT trong nông nghiệp thông minh',
		},
		dueDate: '2024-12-01',
		assignedDate: '2024-11-25',
		status: 'Quá hạn',
		priority: 'Thấp',
		progress: 30,
		estimatedHours: 8,
		actualHours: 3,
		category: 'Báo cáo',
		attachments: [],
	},
]

export const thesesProgress: ThesisProgress[] = [
	{
		id: 'TH001',
		title: 'Ứng dụng AI trong chẩn đoán y tế',
		student: {
			name: 'Nguyễn Văn An',
			code: '20IT001',
			email: 'an.nv@student.edu.vn',
		},
		supervisor: 'TS. Trần Thị Bình',
		startDate: '2024-02-15',
		expectedEndDate: '2024-06-15',
		currentPhase: 'IMPLEMENTATION',
		overallProgress: 65,
		status: 'ON_TRACK',
		lastUpdate: '2024-01-20',
		milestones: [
			{
				id: 1,
				title: 'Đăng ký đề tài',
				status: 'COMPLETED',
				dueDate: '2024-02-15',
				completedDate: '2024-02-15',
			},
			{
				id: 2,
				title: 'Nghiên cứu tài liệu',
				status: 'COMPLETED',
				dueDate: '2024-03-15',
				completedDate: '2024-03-10',
			},
			{
				id: 3,
				title: 'Thiết kế hệ thống',
				status: 'COMPLETED',
				dueDate: '2024-04-15',
				completedDate: '2024-04-12',
			},
			{
				id: 4,
				title: 'Lập trình ứng dụng',
				status: 'IN_PROGRESS',
				dueDate: '2024-05-15',
				completedDate: null,
			},
			{
				id: 5,
				title: 'Kiểm thử và đánh giá',
				status: 'PENDING',
				dueDate: '2024-06-01',
				completedDate: null,
			},
			{
				id: 6,
				title: 'Hoàn thiện báo cáo',
				status: 'PENDING',
				dueDate: '2024-06-10',
				completedDate: null,
			},
			{
				id: 7,
				title: 'Bảo vệ khóa luận',
				status: 'PENDING',
				dueDate: '2024-06-15',
				completedDate: null,
			},
		],
		meetings: [
			{
				date: '2024-01-20',
				topic: 'Thảo luận tiến độ lập trình',
				notes: 'Sinh viên đã hoàn thành 60% module chẩn đoán',
			},
			{
				date: '2024-01-10',
				topic: 'Review thiết kế database',
				notes: 'Cần điều chỉnh cấu trúc bảng patient_records',
			},
			{
				date: '2023-12-25',
				topic: 'Báo cáo giai đoạn 1',
				notes: 'Hoàn thành nghiên cứu tài liệu, bắt đầu thiết kế',
			},
		],
		documents: [
			{
				name: 'Đề cương chi tiết',
				type: 'PDF',
				uploadDate: '2024-02-20',
				status: 'APPROVED',
			},
			{
				name: 'Báo cáo tiến độ T1',
				type: 'DOC',
				uploadDate: '2024-01-15',
				status: 'APPROVED',
			},
			{
				name: 'Source code v1.0',
				type: 'ZIP',
				uploadDate: '2024-01-18',
				status: 'PENDING',
			},
		],
	},
	{
		id: 'TH002',
		title: 'Hệ thống quản lý thư viện thông minh',
		student: {
			name: 'Lê Thị Cẩm',
			code: '20IT002',
			email: 'cam.lt@student.edu.vn',
		},
		supervisor: 'PGS.TS. Phạm Văn Dũng',
		startDate: '2024-02-20',
		expectedEndDate: '2024-06-20',
		currentPhase: 'DESIGN',
		overallProgress: 45,
		status: 'DELAYED',
		lastUpdate: '2024-01-18',
		milestones: [
			{
				id: 1,
				title: 'Đăng ký đề tài',
				status: 'COMPLETED',
				dueDate: '2024-02-20',
				completedDate: '2024-02-20',
			},
			{
				id: 2,
				title: 'Nghiên cứu tài liệu',
				status: 'COMPLETED',
				dueDate: '2024-03-20',
				completedDate: '2024-03-25',
			},
			{
				id: 3,
				title: 'Thiết kế hệ thống',
				status: 'IN_PROGRESS',
				dueDate: '2024-04-20',
				completedDate: null,
			},
			{
				id: 4,
				title: 'Lập trình ứng dụng',
				status: 'PENDING',
				dueDate: '2024-05-20',
				completedDate: null,
			},
			{
				id: 5,
				title: 'Kiểm thử và đánh giá',
				status: 'PENDING',
				dueDate: '2024-06-05',
				completedDate: null,
			},
			{
				id: 6,
				title: 'Hoàn thiện báo cáo',
				status: 'PENDING',
				dueDate: '2024-06-15',
				completedDate: null,
			},
			{
				id: 7,
				title: 'Bảo vệ khóa luận',
				status: 'PENDING',
				dueDate: '2024-06-20',
				completedDate: null,
			},
		],
		meetings: [
			{
				date: '2024-01-18',
				topic: 'Thảo luận thiết kế UI/UX',
				notes: 'Cần nghiên cứu thêm về user experience',
			},
			{
				date: '2024-01-05',
				topic: 'Review tài liệu nghiên cứu',
				notes: 'Bổ sung thêm tài liệu về IoT trong thư viện',
			},
		],
		documents: [
			{
				name: 'Đề cương chi tiết',
				type: 'PDF',
				uploadDate: '2024-02-25',
				status: 'APPROVED',
			},
			{
				name: 'Wireframe thiết kế',
				type: 'PDF',
				uploadDate: '2024-01-10',
				status: 'PENDING',
			},
		],
	},
	{
		id: 'TH003',
		title: 'Chatbot hỗ trợ học tập với NLP',
		student: {
			name: 'Hoàng Minh Đức',
			code: '20IT003',
			email: 'duc.hm@student.edu.vn',
		},
		supervisor: 'TS. Lê Văn Giang',
		startDate: '2024-03-01',
		expectedEndDate: '2024-07-01',
		currentPhase: 'RESEARCH',
		overallProgress: 25,
		status: 'ON_TRACK',
		lastUpdate: '2024-01-22',
		milestones: [
			{
				id: 1,
				title: 'Đăng ký đề tài',
				status: 'COMPLETED',
				dueDate: '2024-03-01',
				completedDate: '2024-03-01',
			},
			{
				id: 2,
				title: 'Nghiên cứu tài liệu',
				status: 'IN_PROGRESS',
				dueDate: '2024-04-01',
				completedDate: null,
			},
			{
				id: 3,
				title: 'Thiết kế hệ thống',
				status: 'PENDING',
				dueDate: '2024-05-01',
				completedDate: null,
			},
			{
				id: 4,
				title: 'Lập trình ứng dụng',
				status: 'PENDING',
				dueDate: '2024-06-01',
				completedDate: null,
			},
			{
				id: 5,
				title: 'Kiểm thử và đánh giá',
				status: 'PENDING',
				dueDate: '2024-06-20',
				completedDate: null,
			},
			{
				id: 6,
				title: 'Hoàn thiện báo cáo',
				status: 'PENDING',
				dueDate: '2024-06-25',
				completedDate: null,
			},
			{
				id: 7,
				title: 'Bảo vệ khóa luận',
				status: 'PENDING',
				dueDate: '2024-07-01',
				completedDate: null,
			},
		],
		meetings: [
			{
				date: '2024-01-22',
				topic: 'Khởi động dự án',
				notes: 'Thảo luận hướng nghiên cứu và timeline',
			},
		],
		documents: [
			{
				name: 'Đề cương chi tiết',
				type: 'PDF',
				uploadDate: '2024-03-05',
				status: 'APPROVED',
			},
		],
	},
]

export function findThesisById(id: string) {
	return thesisData.find(t => t.id === id)
}

export function findSupervisorById(id: string) {
	return availableSupervisors.find(s => s.id === id)
}

export function findRegistrationById(id: string) {
	return thesisRegistrations.find(r => r.id === id)
}

export function findAssignmentById(id: string) {
	return thesisAssignments.find(a => a.id === id)
}

export function findThesisProgressById(id: string) {
	return thesesProgress.find(progress => progress.id === id)
}

export const defenseSchedules: DefenseSchedule[] = [
	{
		id: 'DEF001',
		thesis: {
			id: 'TH001',
			title: 'Ứng dụng AI trong chẩn đoán y tế',
			student: {
				name: 'Nguyễn Văn An',
				code: '20IT001',
				email: 'an.nv@student.edu.vn',
			},
			supervisor: 'TS. Trần Thị Bình',
		},
		date: '2024-06-15',
		time: '08:00',
		duration: 45,
		room: 'Phòng 301 - Tòa A',
		status: 'SCHEDULED',
		council: {
			chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
			secretary: 'TS. Lê Thị Thư ký',
			members: [
				'TS. Phạm Văn Thành viên 1',
				'TS. Hoàng Thị Thành viên 2',
				'ThS. Trần Văn Thành viên 3',
			],
		},
		documents: {
			thesis: { submitted: true, approved: true },
			presentation: { submitted: true, approved: false },
			summary: { submitted: false, approved: false },
		},
		result: null,
	},
	{
		id: 'DEF002',
		thesis: {
			id: 'TH002',
			title: 'Hệ thống quản lý thư viện thông minh',
			student: {
				name: 'Lê Thị Cẩm',
				code: '20IT002',
				email: 'cam.lt@student.edu.vn',
			},
			supervisor: 'PGS.TS. Phạm Văn Dũng',
		},
		date: '2024-06-20',
		time: '09:00',
		duration: 45,
		room: 'Phòng 302 - Tòa A',
		status: 'PENDING_APPROVAL',
		council: {
			chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
			secretary: 'TS. Lê Thị Thư ký',
			members: [
				'TS. Phạm Văn Thành viên 1',
				'TS. Hoàng Thị Thành viên 2',
				'ThS. Trần Văn Thành viên 3',
			],
		},
		documents: {
			thesis: { submitted: false, approved: false },
			presentation: { submitted: false, approved: false },
			summary: { submitted: false, approved: false },
		},
		result: null,
	},
	{
		id: 'DEF003',
		thesis: {
			id: 'TH003',
			title: 'Phân tích dữ liệu lớn với Hadoop và Spark',
			student: {
				name: 'Hoàng Minh Đức',
				code: '20IT003',
				email: 'duc.hm@student.edu.vn',
			},
			supervisor: 'TS. Lê Văn Giang',
		},
		date: '2024-05-25',
		time: '14:00',
		duration: 45,
		room: 'Phòng 303 - Tòa A',
		status: 'COMPLETED',
		council: {
			chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
			secretary: 'TS. Lê Thị Thư ký',
			members: [
				'TS. Phạm Văn Thành viên 1',
				'TS. Hoàng Thị Thành viên 2',
				'ThS. Trần Văn Thành viên 3',
			],
		},
		documents: {
			thesis: { submitted: true, approved: true },
			presentation: { submitted: true, approved: true },
			summary: { submitted: true, approved: true },
		},
		result: {
			grade: 8.5,
			classification: 'GOOD',
			chairman_score: 8.5,
			secretary_score: 8.0,
			member_scores: [8.5, 9.0, 8.0],
			comments:
				'Sinh viên thể hiện tốt kiến thức chuyên môn, trình bày rõ ràng và trả lời câu hỏi thuyết phục.',
			recommendations:
				'Tiếp tục nghiên cứu sâu hơn về tối ưu hóa hiệu suất xử lý dữ liệu lớn.',
		},
	},
]

export const councilMembers: CouncilMember[] = [
	{
		id: 'CM001',
		name: 'PGS.TS. Nguyễn Văn Chủ tịch',
		title: 'Phó Giáo sư - Tiến sĩ',
		department: 'Khoa Công nghệ Thông tin',
		specialization: 'Trí tuệ nhân tạo, Machine Learning',
		role: 'CHAIRMAN',
		experience: 15,
		defensesCount: 45,
	},
	{
		id: 'CM002',
		name: 'TS. Lê Thị Thư ký',
		title: 'Tiến sĩ',
		department: 'Khoa Công nghệ Thông tin',
		specialization: 'Hệ thống thông tin, Cơ sở dữ liệu',
		role: 'SECRETARY',
		experience: 8,
		defensesCount: 32,
	},
	{
		id: 'CM003',
		name: 'TS. Phạm Văn Thành viên 1',
		title: 'Tiến sĩ',
		department: 'Khoa Công nghệ Thông tin',
		specialization: 'Kỹ thuật phần mềm, Kiểm thử phần mềm',
		role: 'MEMBER',
		experience: 10,
		defensesCount: 38,
	},
	{
		id: 'CM004',
		name: 'TS. Hoàng Thị Thành viên 2',
		title: 'Tiến sĩ',
		department: 'Khoa Công nghệ Thông tin',
		specialization: 'An toàn thông tin, Mật mã học',
		role: 'MEMBER',
		experience: 12,
		defensesCount: 41,
	},
	{
		id: 'CM005',
		name: 'ThS. Trần Văn Thành viên 3',
		title: 'Thạc sĩ',
		department: 'Khoa Công nghệ Thông tin',
		specialization: 'Mạng máy tính, IoT',
		role: 'MEMBER',
		experience: 6,
		defensesCount: 25,
	},
]

export const defenseRooms: DefenseRoom[] = [
	{
		id: 'R301',
		name: 'Phòng 301 - Tòa A',
		capacity: 50,
		equipment: ['Projector', 'Microphone', 'Whiteboard'],
	},
	{
		id: 'R302',
		name: 'Phòng 302 - Tòa A',
		capacity: 40,
		equipment: ['Projector', 'Sound System'],
	},
	{
		id: 'R303',
		name: 'Phòng 303 - Tòa A',
		capacity: 30,
		equipment: ['Projector', 'Whiteboard'],
	},
	{
		id: 'R401',
		name: 'Phòng 401 - Tòa B',
		capacity: 60,
		equipment: ['Projector', 'Microphone', 'Camera'],
	},
]

// THIS FUNCTION WILL BE MOVED
// export function findDefenseScheduleById(id: string) {
// 	return defenseSchedules.find(d => d.id === id)
// } 