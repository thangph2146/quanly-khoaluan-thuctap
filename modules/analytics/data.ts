import {
	OverviewStats,
	MonthlyData,
	DepartmentStats,
	SupervisorPerformance,
	CompanyStats,
	RecentActivity,
} from './types'

// Mock data for analytics
export const overviewStats: OverviewStats = {
	totalStudents: 1245,
	totalTheses: 156,
	totalInternships: 89,
	totalSupervisors: 42,
	completedTheses: 134,
	completedInternships: 76,
	avgThesisGrade: 8.2,
	avgInternshipGrade: 8.5,
	pendingApprovals: 23,
	activeProjects: 67,
}

export const monthlyData: MonthlyData[] = [
	{ month: 'T7', theses: 12, internships: 8, completed: 15 },
	{ month: 'T8', theses: 18, internships: 12, completed: 22 },
	{ month: 'T9', theses: 25, internships: 18, completed: 28 },
	{ month: 'T10', theses: 22, internships: 15, completed: 25 },
	{ month: 'T11', theses: 28, internships: 20, completed: 32 },
	{ month: 'T12', theses: 35, internships: 25, completed: 40 },
]

export const departmentStats: DepartmentStats[] = [
	{
		name: 'Công nghệ Thông tin',
		theses: 45,
		internships: 32,
		students: 380,
		color: 'bg-blue-500',
	},
	{
		name: 'Kỹ thuật Phần mềm',
		theses: 38,
		internships: 28,
		students: 320,
		color: 'bg-green-500',
	},
	{
		name: 'An toàn Thông tin',
		theses: 42,
		internships: 18,
		students: 290,
		color: 'bg-purple-500',
	},
	{
		name: 'Khoa học Máy tính',
		theses: 31,
		internships: 11,
		students: 255,
		color: 'bg-orange-500',
	},
]

export const supervisorPerformance: SupervisorPerformance[] = [
	{
		name: 'TS. Nguyễn Văn A',
		theses: 8,
		avgGrade: 8.5,
		completionRate: 95,
		department: 'CNTT',
	},
	{
		name: 'PGS.TS. Trần Thị B',
		theses: 6,
		avgGrade: 8.8,
		completionRate: 100,
		department: 'KTPM',
	},
	{
		name: 'TS. Lê Văn C',
		theses: 7,
		avgGrade: 8.2,
		completionRate: 85,
		department: 'ATTT',
	},
	{
		name: 'TS. Phạm Thị D',
		theses: 5,
		avgGrade: 8.7,
		completionRate: 100,
		department: 'KHMT',
	},
	{
		name: 'TS. Hoàng Văn E',
		theses: 9,
		avgGrade: 8.0,
		completionRate: 88,
		department: 'CNTT',
	},
]

export const companyStats: CompanyStats[] = [
	{
		name: 'FPT Software',
		students: 25,
		avgRating: 4.8,
		positions: 8,
		completionRate: 96,
	},
	{
		name: 'Viettel Digital',
		students: 18,
		avgRating: 4.6,
		positions: 5,
		completionRate: 94,
	},
	{
		name: 'TMA Solutions',
		students: 15,
		avgRating: 4.7,
		positions: 4,
		completionRate: 100,
	},
	{
		name: 'VNPT Technology',
		students: 12,
		avgRating: 4.5,
		positions: 3,
		completionRate: 92,
	},
	{
		name: 'Samsung SDS',
		students: 10,
		avgRating: 4.9,
		positions: 2,
		completionRate: 100,
	},
]

export const recentActivities: RecentActivity[] = [
	{
		type: 'THESIS_APPROVED',
		message: 'Khóa luận AI trong y tế được phê duyệt',
		time: '2 giờ trước',
		user: 'TS. Nguyễn Văn A',
	},
	{
		type: 'INTERNSHIP_COMPLETED',
		message: 'Sinh viên Trần Văn B hoàn thành thực tập tại FPT',
		time: '4 giờ trước',
		user: 'Trần Văn B',
	},
	{
		type: 'DEFENSE_SCHEDULED',
		message: 'Lịch bảo vệ khóa luận được lên lịch',
		time: '6 giờ trước',
		user: 'Admin',
	},
	{
		type: 'NEW_PARTNER',
		message: 'Đối tác mới Samsung SDS tham gia chương trình',
		time: '1 ngày trước',
		user: 'Admin',
	},
	{
		type: 'GRADE_SUBMITTED',
		message: 'Điểm thực tập được cập nhật',
		time: '1 ngày trước',
		user: 'Viettel Digital',
	},
] 