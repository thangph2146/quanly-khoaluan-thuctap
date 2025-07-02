'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { findDefenseScheduleById } from '@/modules/thesis/defense/data'
import { DefenseSchedule } from '@/modules/thesis/types'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, User, FileText, CheckCircle, XCircle, Award, BookOpen, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const getStatusText = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'Đã lên lịch'
    case 'PENDING_APPROVAL': return 'Chờ phê duyệt'
    case 'COMPLETED': return 'Đã hoàn thành'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
  }
}

const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
}

const getGradeColor = (grade: number) => {
    if (grade >= 9.0) return 'text-green-600'
    if (grade >= 8.0) return 'text-blue-600'
    if (grade >= 7.0) return 'text-yellow-600'
    if (grade >= 5.5) return 'text-orange-600'
    return 'text-red-600'
}

const getClassificationText = (classification: string) => {
    switch (classification) {
      case 'EXCELLENT': return 'Xuất sắc'
      case 'GOOD': return 'Giỏi'
      case 'FAIR': return 'Khá'
      case 'AVERAGE': return 'Trung bình'
      case 'POOR': return 'Yếu'
      default: return classification
    }
}

export default function DefenseScheduleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [schedule, setSchedule] = useState<DefenseSchedule | null>(null)

  useEffect(() => {
    if (id) {
      const foundSchedule = findDefenseScheduleById(id as string)
      if (foundSchedule) {
        setSchedule(foundSchedule)
      } else {
        // Handle not found case
        router.push('/thesis/defense')
      }
    }
  }, [id, router])

  if (!schedule) {
    return <div>Loading...</div>
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Khóa luận', href: '/thesis' },
    { label: 'Lịch bảo vệ', href: '/thesis/defense' },
    { label: 'Chi tiết' }
  ]

  return (
    <PageHeader
      title="Chi tiết Lịch bảo vệ Khóa luận"
      breadcrumbs={breadcrumbs}
      description={`Thông tin chi tiết cho buổi bảo vệ mã số ${schedule.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Link href={`/thesis/defense/${schedule.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                {schedule.thesis.title}
              </CardTitle>
              <CardDescription>
                Sinh viên: {schedule.thesis.student.name} ({schedule.thesis.student.code})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Giảng viên hướng dẫn:</strong> {schedule.thesis.supervisor}</div>
                <div><strong>Trạng thái:</strong> <Badge className={getStatusColor(schedule.status)}>{getStatusText(schedule.status)}</Badge></div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Ngày:</strong> <span className="ml-2">{schedule.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Thời gian:</strong> <span className="ml-2">{schedule.time} ({schedule.duration} phút)</span>
                </div>
                <div className="flex items-center col-span-full">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Phòng:</strong> <span className="ml-2">{schedule.room}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {schedule.result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Kết quả bảo vệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className='flex justify-between items-center bg-gray-50 p-4 rounded-lg'>
                    <span className='font-semibold text-2xl'>Điểm tổng kết:</span>
                    <span className={`text-3xl font-bold ${getGradeColor(schedule.result.grade)}`}>
                      {schedule.result.grade.toFixed(1)}
                    </span>
                 </div>
                 <div className='text-center text-lg font-semibold'>
                    Phân loại: <span className={getGradeColor(schedule.result.grade)}>{getClassificationText(schedule.result.classification)}</span>
                 </div>
                 <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Điểm thành phần</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Chủ tịch hội đồng: <strong>{schedule.result.chairman_score.toFixed(1)}</strong></li>
                        <li>Thư ký hội đồng: <strong>{schedule.result.secretary_score.toFixed(1)}</strong></li>
                        <li>Các thành viên: <strong>{schedule.result.member_scores.join(', ')}</strong></li>
                    </ul>
                 </div>
                 <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Nhận xét của hội đồng</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-md">{schedule.result.comments}</p>
                 </div>
                 <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Đề xuất</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-md">{schedule.result.recommendations}</p>
                 </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Hội đồng chấm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <strong>Chủ tịch:</strong> {schedule.council.chairman}
                  </div>
                </li>
                <li className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <strong>Thư ký:</strong> {schedule.council.secretary}
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <strong>Thành viên:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      {schedule.council.members.map((member, index) => <li key={index}>{member}</li>)}
                    </ul>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Tài liệu nộp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span>Khóa luận</span>
                  {schedule.documents.thesis.submitted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </li>
                <li className="flex items-center justify-between">
                  <span>File trình chiếu</span>
                  {schedule.documents.presentation.submitted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </li>
                <li className="flex items-center justify-between">
                  <span>Tóm tắt khóa luận</span>
                  {schedule.documents.summary.submitted ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageHeader>
  )
} 