import { ActivityType } from './types'

export const getActivityIconBgColor = (type: ActivityType): string => {
  switch (type) {
    case 'APPROVAL':
      return 'bg-green-100'
    case 'SUBMISSION':
      return 'bg-blue-100'
    case 'UPDATE':
      return 'bg-yellow-100'
    case 'ALERT':
      return 'bg-red-100'
    default:
      return 'bg-gray-100'
  }
}

export const getActivityIconColor = (type: ActivityType): string => {
  switch (type) {
    case 'APPROVAL':
      return 'text-green-600'
    case 'SUBMISSION':
      return 'text-blue-600'
    case 'UPDATE':
      return 'text-yellow-600'
    case 'ALERT':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
} 