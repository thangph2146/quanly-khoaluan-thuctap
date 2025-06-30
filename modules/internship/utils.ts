import { InternshipStatus } from './types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export function getInternshipStatusVariant(
	status: InternshipStatus
): BadgeVariant {
	switch (status) {
		case 'IN_PROGRESS':
			return 'default'
		case 'COMPLETED':
			return 'secondary'
		case 'UPCOMING':
			return 'outline'
		case 'CANCELLED':
			return 'destructive'
		default:
			return 'secondary'
	}
} 