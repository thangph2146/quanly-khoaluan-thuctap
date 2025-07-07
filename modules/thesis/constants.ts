/**
 * Thesis Constants
 */

export const THESIS_STATUS = {
  COMPLETED: 'COMPLETED',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_DEFENSE: 'PENDING_DEFENSE',
  APPROVED: 'APPROVED',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const

export const THESIS_STATUS_LABELS = {
  COMPLETED: 'Hoàn thành',
  IN_PROGRESS: 'Đang thực hiện',
  PENDING_DEFENSE: 'Chờ bảo vệ',
  APPROVED: 'Đã duyệt',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã hủy',
} as const
