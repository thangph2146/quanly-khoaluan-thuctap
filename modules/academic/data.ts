import type { AcademicYear, Department, Student } from './types'

export const academicYears: AcademicYear[] = [
	{
		id: 1,
		name: '2024-2025',
		startDate: '2024-09-05',
		endDate: '2025-06-30',
	},
	{
		id: 2,
		name: '2023-2024',
		startDate: '2023-09-05',
		endDate: '2024-06-30',
	},
	{
		id: 3,
		name: '2022-2023',
		startDate: '2022-09-05',
		endDate: '2023-06-30',
	},
]

export const departments: Department[] = [
	{ id: 1, name: 'Khoa Công nghệ Thông tin', code: 'CNTT', parentDepartmentId: null },
	{ id: 2, name: 'Bộ môn Kỹ thuật Phần mềm', code: 'KTPM', parentDepartmentId: 1 },
	{ id: 3, name: 'Bộ môn Khoa học Máy tính', code: 'KHMT', parentDepartmentId: 1 },
	{ id: 4, name: 'Bộ môn An toàn Thông tin', code: 'ATTT', parentDepartmentId: 1 },
	{ id: 5, name: 'Khoa Quản trị Kinh doanh', code: 'QTKD', parentDepartmentId: null },
]

export const students: Student[] = [
    { id: 1, studentCode: 'SV001', fullName: 'Nguyễn Văn An', dateOfBirth: '2002-01-15', email: 'annv@example.com', phoneNumber: '0912345678' },
    { id: 2, studentCode: 'SV002', fullName: 'Trần Thị Bích', dateOfBirth: '2002-05-20', email: 'bichtp@example.com', phoneNumber: '0987654321' },
    { id: 3, studentCode: 'SV003', fullName: 'Lê Văn Cường', dateOfBirth: '2002-03-10', email: 'cuonglv@example.com', phoneNumber: '0905123456' },
] 