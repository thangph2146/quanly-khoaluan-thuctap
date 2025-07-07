/**
 * Thesis Details Component
 * Display detailed information about a thesis
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Thesis } from '../types'

interface ThesisDetailsProps {
  thesis: Thesis
}

export function ThesisDetails({ thesis }: ThesisDetailsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default'
      case 'PENDING_DEFENSE':
        return 'secondary'
      case 'IN_PROGRESS':
        return 'outline'
      case 'COMPLETED':
        return 'default'
      case 'OVERDUE':
        return 'destructive'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã phê duyệt'
      case 'PENDING_DEFENSE':
        return 'Chờ bảo vệ'
      case 'IN_PROGRESS':
        return 'Đang thực hiện'
      case 'COMPLETED':
        return 'Hoàn thành'
      case 'OVERDUE':
        return 'Quá hạn'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{thesis.title}</CardTitle>
              <CardDescription className="mt-2">
                Mã số: {thesis.id}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant('IN_PROGRESS')}>
              {getStatusLabel('IN_PROGRESS')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Thông tin sinh viên</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Tên:</span> {thesis.student?.fullName}</p>
                <p><span className="font-medium">Mã SV:</span> {thesis.student?.studentCode}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Thông tin học tập</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Năm học:</span> {thesis.academicYear?.name}</p>
                <p><span className="font-medium">Học kỳ:</span> {thesis.semester?.name}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-semibold mb-2">Thông tin khác</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Ngày nộp:</span> {thesis.submissionDate ? new Date(thesis.submissionDate).toLocaleDateString('vi-VN') : 'Chưa nộp'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
