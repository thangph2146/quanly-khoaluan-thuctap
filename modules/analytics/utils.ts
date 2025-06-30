import {
	Award,
	Briefcase,
	Calendar,
	Building,
	FileText,
	Activity,
} from 'lucide-react'
import { ActivityType } from './types'
import { createElement } from 'react'

export const getActivityIcon = (type: ActivityType) => {
	switch (type) {
		case 'THESIS_APPROVED':
			return createElement(Award, { className: 'h-4 w-4 text-green-600' })
		case 'INTERNSHIP_COMPLETED':
			return createElement(Briefcase, { className: 'h-4 w-4 text-blue-600' })
		case 'DEFENSE_SCHEDULED':
			return createElement(Calendar, { className: 'h-4 w-4 text-purple-600' })
		case 'NEW_PARTNER':
			return createElement(Building, { className: 'h-4 w-4 text-orange-600' })
		case 'GRADE_SUBMITTED':
			return createElement(FileText, { className: 'h-4 w-4 text-indigo-600' })
		default:
			return createElement(Activity, { className: 'h-4 w-4 text-gray-600' })
	}
}

export const getCompletionRateColor = (rate: number) => {
	if (rate >= 95) return 'text-green-600'
	if (rate >= 85) return 'text-yellow-600'
	return 'text-red-600'
} 