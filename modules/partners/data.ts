import { Partner } from './types'

export const partnersData: Partner[] = [
	{
		id: 1,
		name: 'FPT Software',
		address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
		phoneNumber: '02473007575',
		email: 'contact@fptsoftware.com',
	},
	{
		id: 2,
		name: 'Viettel Digital',
		address: 'Số 1 Trần Hữu Dực, Mỹ Đình, Nam Từ Liêm, Hà Nội',
		phoneNumber: '0987654321',
		email: 'digital@viettel.com.vn',
	},
	{
		id: 3,
		name: 'VNG Corporation',
		address: 'Khu chế xuất Tân Thuận, Quận 7, TP. Hồ Chí Minh',
		phoneNumber: '02839623888',
		email: 'contact@vng.com.vn',
	},
	{
		id: 4,
		name: 'VNPT Technology',
		address: '57 Huỳnh Thúc Kháng, Đống Đa, Hà Nội',
		phoneNumber: '02437686868',
		email: 'info@vnpt-technology.vn',
	},
	{
		id: 5,
		name: 'TMA Solutions',
		address: 'Tòa nhà TMA, Quận 12, TP. Hồ Chí Minh',
		phoneNumber: '02838156420',
		email: 'contact@tmasolutions.com',
	},
]

export function findPartnerById(id: number | string) {
	const numericId = typeof id === 'string' ? parseInt(id, 10) : id
	return partnersData.find(partner => partner.id === numericId)
} 