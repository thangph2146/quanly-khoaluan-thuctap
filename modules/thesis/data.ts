import { Thesis } from './types'
import { Student } from '@/modules/users/types'
import { AcademicYear, Semester } from '@/modules/config/types'

// Mock Data for relations
export const mockStudents: Student[] = [
	{
		id: 20210001,
		studentCode: '20210001',
		fullName: 'Nguyễn Văn A',
		dateOfBirth: '2003-01-01',
		email: 'nva@example.com',
		phoneNumber: '0123456789',
	},
	{
		id: 20210002,
		studentCode: '20210002',
		fullName: 'Lê Thị C',
		dateOfBirth: '2003-02-02',
		email: 'ltc@example.com',
		phoneNumber: '0987654321',
	},
	{
		id: 20210003,
		studentCode: '20210003',
		fullName: 'Trần Văn B',
		dateOfBirth: '2003-03-03',
		email: 'tvb@example.com',
		phoneNumber: '0369852147',
	},
]

export const mockAcademicYears: AcademicYear[] = [
	{ id: 1, name: '2023-2024', startDate: '2023-09-01', endDate: '2024-06-30' },
	{ id: 2, name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30' },
]

export const mockSemesters: Semester[] = [
	{
		id: 1,
		name: 'Học kỳ 1',
		academicYearId: 1,
		academicYear: mockAcademicYears[0],
	},
	{
		id: 2,
		name: 'Học kỳ 2',
		academicYearId: 1,
		academicYear: mockAcademicYears[0],
	},
	{
		id: 3,
		name: 'Học kỳ 1',
		academicYearId: 2,
		academicYear: mockAcademicYears[1],
	},
]

export const thesisData: Thesis[] = [
	{
		id: 1,
		title: 'Ứng dụng Machine Learning trong dự đoán xu hướng thị trường',
		studentId: mockStudents[0].id,
		student: mockStudents[0],
		academicYearId: mockAcademicYears[1].id,
		academicYear: mockAcademicYears[1],
		semesterId: mockSemesters[2].id,
		semester: mockSemesters[2],
		submissionDate: '2024-12-15',
	},
	{
		id: 2,
		title: 'Hệ thống quản lý thư viện điện tử sử dụng React và Node.js',
		studentId: mockStudents[1].id,
		student: mockStudents[1],
		academicYearId: mockAcademicYears[1].id,
		academicYear: mockAcademicYears[1],
		semesterId: mockSemesters[2].id,
		semester: mockSemesters[2],
		submissionDate: '2024-12-10',
	},
	{
		id: 3,
		title: 'Phát triển ứng dụng mobile quản lý tài chính cá nhân',
		studentId: mockStudents[2].id,
		student: mockStudents[2],
		academicYearId: mockAcademicYears[0].id,
		academicYear: mockAcademicYears[0],
		semesterId: mockSemesters[1].id,
		semester: mockSemesters[1],
		submissionDate: '2024-06-20',
	},
]

export function findThesisById(id: number | string) {
	const numericId = typeof id === 'string' ? parseInt(id, 10) : id
	return thesisData.find(thesis => thesis.id === numericId)
} 