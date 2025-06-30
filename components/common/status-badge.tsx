import { Badge } from "@/components/ui/badge"

export type StatusType = 
  | "approved"
  | "in_progress" 
  | "pending"
  | "completed"
  | "overdue"
  | "cancelled"
  | "draft"
  | "review"
  | "active"
  | "inactive"

interface StatusBadgeProps {
  status: StatusType
  label?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const statusConfig: Record<StatusType, { 
  label: string
  className: string
}> = {
  approved: {
    label: "Đã phê duyệt",
    className: "text-blue-600 border-blue-600 bg-blue-50"
  },
  in_progress: {
    label: "Đang thực hiện", 
    className: "text-green-600 border-green-600 bg-green-50"
  },
  pending: {
    label: "Chờ xử lý",
    className: "text-yellow-600 border-yellow-600 bg-yellow-50"
  },
  completed: {
    label: "Hoàn thành",
    className: "text-emerald-600 border-emerald-600 bg-emerald-50"
  },
  overdue: {
    label: "Quá hạn",
    className: "text-red-600 border-red-600 bg-red-50"
  },
  cancelled: {
    label: "Đã hủy",
    className: "text-gray-600 border-gray-600 bg-gray-50"
  },
  draft: {
    label: "Bản nháp",
    className: "text-gray-500 border-gray-500 bg-gray-50"
  },
  review: {
    label: "Đang xem xét",
    className: "text-purple-600 border-purple-600 bg-purple-50"
  },
  active: {
    label: "Hoạt động",
    className: "text-green-600 border-green-600 bg-green-50"
  },
  inactive: {
    label: "Không hoạt động",
    className: "text-gray-600 border-gray-600 bg-gray-50"
  }
}

export function StatusBadge({ 
  status, 
  label, 
  variant = "outline" 
}: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayLabel = label || config.label

  return (
    <Badge 
      variant={variant}
      className={config.className}
    >
      {displayLabel}
    </Badge>
  )
} 