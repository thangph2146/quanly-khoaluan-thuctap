'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { findDefenseScheduleById, councilMembers, rooms } from '@/modules/thesis/defense/data'
import { DefenseSchedule } from '@/modules/thesis/types'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'

export default function DefenseScheduleEditPage() {
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
    { label: schedule.id, href: `/thesis/defense/${schedule.id}` },
    { label: 'Chỉnh sửa' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save data would go here
    alert('Thông tin đã được lưu (chức năng giả lập)');
    router.push(`/thesis/defense/${schedule.id}`);
  }

  return (
    <PageHeader
      title="Chỉnh sửa Lịch bảo vệ"
      breadcrumbs={breadcrumbs}
      description={`Cập nhật thông tin cho buổi bảo vệ mã số ${schedule.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chính</CardTitle>
                <CardDescription>Thông tin về khóa luận và thời gian, địa điểm bảo vệ.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên khóa luận</Label>
                  <Input defaultValue={schedule.thesis.title} disabled />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Ngày bảo vệ</Label>
                    <Input id="date" type="date" defaultValue={schedule.date} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Giờ bảo vệ</Label>
                    <Input id="time" type="time" defaultValue={schedule.time} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Phòng bảo vệ</Label>
                  <Select defaultValue={schedule.room}>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => <SelectItem key={room.id} value={room.name}>{room.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                   <Select defaultValue={schedule.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Chờ phê duyệt</SelectItem>
                      <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {schedule.result && (
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả bảo vệ</CardTitle>
                  <CardDescription>Nhập điểm và nhận xét của hội đồng.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Điểm tổng kết</Label>
                      <Input id="grade" type="number" step="0.1" defaultValue={schedule.result.grade} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="classification">Xếp loại</Label>
                        <Select defaultValue={schedule.result.classification}>
                            <SelectTrigger id="classification">
                                <SelectValue placeholder="Chọn xếp loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EXCELLENT">Xuất sắc</SelectItem>
                                <SelectItem value="GOOD">Giỏi</SelectItem>
                                <SelectItem value="FAIR">Khá</SelectItem>
                                <SelectItem value="AVERAGE">Trung bình</SelectItem>
                                <SelectItem value="POOR">Yếu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Nhận xét của hội đồng</Label>
                    <Textarea id="comments" defaultValue={schedule.result.comments} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Đề xuất</Label>
                    <Textarea id="recommendations" defaultValue={schedule.result.recommendations} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hội đồng chấm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chairman">Chủ tịch</Label>
                  <Select defaultValue={schedule.council.chairman}>
                    <SelectTrigger id="chairman"><SelectValue/></SelectTrigger>
                    <SelectContent>{councilMembers.filter(m => m.role === 'CHAIRMAN').map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretary">Thư ký</Label>
                  <Select defaultValue={schedule.council.secretary}>
                    <SelectTrigger id="secretary"><SelectValue/></SelectTrigger>
                    <SelectContent>{councilMembers.filter(m => m.role === 'SECRETARY').map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label>Thành viên</Label>
                    <div className="space-y-2 p-3 border rounded-md">
                        {councilMembers.filter(m => m.role === 'MEMBER').map(member => (
                            <div key={member.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`member-${member.id}`} 
                                    defaultChecked={schedule.council.members.includes(member.name)}
                                />
                                <Label htmlFor={`member-${member.id}`} className="font-normal">{member.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tình trạng tài liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="doc-thesis" defaultChecked={schedule.documents.thesis.submitted} />
                    <Label htmlFor="doc-thesis">Đã nộp Khóa luận</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="doc-presentation" defaultChecked={schedule.documents.presentation.submitted} />
                    <Label htmlFor="doc-presentation">Đã nộp File trình chiếu</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="doc-summary" defaultChecked={schedule.documents.summary.submitted} />
                    <Label htmlFor="doc-summary">Đã nộp Tóm tắt khóa luận</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </PageHeader>
  )
} 