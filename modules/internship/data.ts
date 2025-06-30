import { Internship } from './types'

export const internshipData: Internship[] = [
	{
		id: 'INT001',
		student: { id: '20210011', name: 'Trần Văn Long' },
		company: { name: 'VNG Corporation', address: 'TP. Hồ Chí Minh' },
		supervisor: { name: 'Lê Thị Mỹ Hạnh', email: 'hanh.ltm@vng.com.vn' },
		startDate: '2024-10-01',
		endDate: '2024-12-31',
		status: 'IN_PROGRESS',
	},
	{
		id: 'INT002',
		student: { id: '20210022', name: 'Nguyễn Thị Thu' },
		company: { name: 'NashTech Vietnam', address: 'Hà Nội' },
		supervisor: { name: 'Phạm Văn Hùng', email: 'hung.pv@nashtech.com' },
		startDate: '2024-09-15',
		endDate: '2024-12-15',
		status: 'IN_PROGRESS',
	},
	{
		id: 'INT003',
		student: { id: '20210033', name: 'Hoàng Văn An' },
		company: { name: 'KMS Technology', address: 'TP. Hồ Chí Minh' },
		supervisor: { name: 'Vũ Thị Lan', email: 'lan.vt@kms-technology.com' },
		startDate: '2024-07-01',
		endDate: '2024-09-30',
		status: 'COMPLETED',
	},
	{
		id: 'INT004',
		student: { id: '20210044', name: 'Lý Thị Bích' },
		company: { name: 'Grab Vietnam', address: 'TP. Hồ Chí Minh' },
		supervisor: { name: 'Trần Minh Quang', email: 'quang.tm@grab.com' },
		startDate: '2025-01-10',
		endDate: '2025-04-10',
		status: 'UPCOMING',
	},
] 