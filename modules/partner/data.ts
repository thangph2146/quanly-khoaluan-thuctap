import { Partner } from './types'
import { AcademicYear, Semester } from '@/modules/config/types'



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
]

export const semesters: Semester[] = [
	{
		id: 1,
		name: 'Học kỳ 2',
		academicYearId: 1,
		academicYear: academicYears[0],
	},
]
