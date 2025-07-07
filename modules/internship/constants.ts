/**
 * Internship Constants
 */

export const INTERNSHIP_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export const INTERNSHIP_STATUS_LABELS = {
  ACTIVE: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
} as const

export const GRADE_LEVELS = {
  EXCELLENT: 'A',
  GOOD: 'B',
  AVERAGE: 'C',
  POOR: 'D',
  FAIL: 'F',
} as const

export const GRADE_LABELS = {
  A: 'Xuất sắc',
  B: 'Giỏi',
  C: 'Khá',
  D: 'Trung bình',
  F: 'Không đạt',
} as const
