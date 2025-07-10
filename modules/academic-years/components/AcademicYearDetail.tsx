/**
 * Academic Year Detail Component
 * Display detailed information about an academic year
 */
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Clock, Info } from 'lucide-react'
import type { AcademicYearDetailProps } from '../types'
import { Modal } from '@/components/common'
import { Button } from '@/components/ui/button'

export function AcademicYearDetail({ 
    academicYear,
    isOpen,
    onClose,
    onEdit,
    onDelete,
 }: AcademicYearDetailProps) {

    if (!academicYear) {
        return null;
    }

    const handleEditClick = () => {
        onEdit(academicYear);
        onClose();
    };

    const handleDeleteClick = () => {
        onDelete(academicYear);
        onClose();
    };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Helper function to format date with time
  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Helper function to get status info
  const getStatusInfo = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        status: 'upcoming',
        label: 'Sắp tới',
        variant: 'outline' as const,
        description: `Bắt đầu sau ${daysUntilStart} ngày`
      }
    } else if (now >= start && now <= end) {
      const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        status: 'current',
        label: 'Đang diễn ra',
        variant: 'default' as const,
        description: `Còn lại ${daysRemaining} ngày`
      }
    } else {
      const daysEnded = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24))
      return {
        status: 'ended',
        label: 'Đã kết thúc',
        variant: 'secondary' as const,
        description: `Đã kết thúc ${daysEnded} ngày trước`
      }
    }
  }

  const statusInfo = getStatusInfo(academicYear.startDate, academicYear.endDate)

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={`Chi tiết năm học: ${academicYear.name}`}
      className="max-w-4xl"
    >
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Thông tin cơ bản
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-medium text-muted-foreground">ID</label>
                    <p className="text-sm font-mono">{academicYear.id}</p>
                    </div>
                    <div>
                    <label className="text-sm font-medium text-muted-foreground">Tên năm học</label>
                    <p className="text-lg font-semibold">{academicYear.name}</p>
                    </div>
                </div>
                
                <div>
                    <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                    <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    <span className="text-sm text-muted-foreground">{statusInfo.description}</span>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* Date Information */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Thông tin thời gian
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</label>
                    <p className="text-sm">{formatDate(academicYear.startDate)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(academicYear.startDate)}</p>
                    </div>
                    <div>
                    <label className="text-sm font-medium text-muted-foreground">Ngày kết thúc</label>
                    <p className="text-sm">{formatDate(academicYear.endDate)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(academicYear.endDate)}</p>
                    </div>
                </div>
                
                </CardContent>
            </Card>

            {/* Timeline Information */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Timeline
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.status === 'upcoming' ? 'bg-blue-500' : statusInfo.status === 'current' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                        <p className="text-sm font-medium">Bắt đầu năm học</p>
                        <p className="text-xs text-muted-foreground">{formatDate(academicYear.startDate)}</p>
                    </div>
                    </div>
                    
                    {statusInfo.status === 'current' && (
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                        <p className="text-sm font-medium">Hiện tại</p>
                        <p className="text-xs text-muted-foreground">Năm học đang diễn ra</p>
                        </div>
                    </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.status === 'ended' ? 'bg-gray-400' : 'bg-gray-200'}`} />
                    <div>
                        <p className="text-sm font-medium">Kết thúc năm học</p>
                        <p className="text-xs text-muted-foreground">{formatDate(academicYear.endDate)}</p>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>
        <div className="flex gap-2 pt-4 mt-6 border-t">
            <Button variant="outline" onClick={handleEditClick}>
                Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={handleDeleteClick}>
                Xóa
            </Button>
      </div>
    </Modal>
  )
}
