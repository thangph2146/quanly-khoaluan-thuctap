// Based on Partner.cs
export interface Partner {
	id: number
	name: string
	address: string
	phoneNumber: string
	email: string
}

export interface CreatePartnerData {
	name: string
	address: string
	phoneNumber: string
	email: string
}

export interface UpdatePartnerData {
	name: string
	address: string
	phoneNumber: string
	email: string
}