import { Internship, Partner } from './types'
import { Student } from '@/modules/users/types'
import { AcademicYear, Semester } from '@/modules/config/types'

// Mock Data
export const students: Student[] = [
	{
		id: 20210001,
		studentCode: '20210001',
		fullName: 'Nguyễn Thị A',
		dateOfBirth: '2003-01-15',
		email: 'a.nguyen@example.com',
		phoneNumber: '0901234567',
	},
	{
		id: 20210002,
		studentCode: '20210002',
		fullName: 'Lê Văn D',
		dateOfBirth: '2003-02-20',
		email: 'd.le@example.com',
		phoneNumber: '0902345678',
	},
	{
		id: 20210003,
		studentCode: '20210003',
		fullName: 'Trần Thị B',
		dateOfBirth: '2003-03-10',
		email: 'b.tran@example.com',
		phoneNumber: '0903456789',
	},
]

export const partners: Partner[] = [
	{
		id: 1,
		name: 'FPT Software',
		address: 'Khu công nghệ cao Hòa Lạc, Hà Nội',
		phoneNumber: '02473007575',
		email: 'contact@fptsoftware.com',
	},
	{
		id: 2,
		name: 'Viettel Digital',
		address: 'Số 1 Trần Hữu Dực, Hà Nội',
		phoneNumber: '0987654321',
		email: 'digital@viettel.com.vn',
	},
	{
		id: 3,
		name: 'VNG Corporation',
		address: 'Khu chế xuất Tân Thuận, Quận 7, TP.HCM',
		phoneNumber: '02839623888',
		email: 'contact@vng.com.vn',
	},
]

export const academicYears: AcademicYear[] = [
	{ id: 1, name: '2023-2024', startDate: '2023-09-05', endDate: '2024-06-30' },
	{ id: 2, name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30' },
]

export const semesters: Semester[] = [
	{
		id: 1,
		name: 'Học kỳ 1',
		academicYearId: 1,
		academicYear: academicYears[0],
	},
	{
		id: 2,
		name: 'Học kỳ 2',
		academicYearId: 1,
		academicYear: academicYears[0],
	},
	{
		id: 3,
		name: 'Học kỳ 1',
		academicYearId: 2,
		academicYear: academicYears[1],
	},
]

export const internshipsData: Internship[] = [
	{
		id: 1,
		studentId: 20210001,
		student: students[0],
		partnerId: 1,
		partner: partners[0],
		academicYearId: 2,
		academicYear: academicYears[1],
		semesterId: 3,
		semester: semesters[2],
		reportUrl: null,
		grade: null,
	},
	{
		id: 2,
		studentId: 20210002,
		student: students[1],
		partnerId: 2,
		partner: partners[1],
		academicYearId: 1,
		academicYear: academicYears[0],
		semesterId: 2,
		semester: semesters[1],
		reportUrl: '/reports/internship-report-2.pdf',
		grade: 8.5,
	},
	{
		id: 3,
		studentId: 20210003,
		student: students[2],
		partnerId: 3,
		partner: partners[2],
		academicYearId: 1,
		academicYear: academicYears[0],
		semesterId: 1,
		semester: semesters[0],
		reportUrl: '/reports/internship-report-3.pdf',
		grade: 9.0,
	},
]

export function findInternshipById(id: string | number) {
	const numericId = typeof id === 'string' ? parseInt(id, 10) : id
	return internshipsData.find(internship => internship.id === numericId)
} 