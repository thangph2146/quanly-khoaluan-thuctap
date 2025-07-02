'use client'

import { useRouter } from 'next/navigation'
import { councilMembers, rooms } from '@/modules/thesis/defense/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'
import { thesisData } from '@/modules/thesis/data'
import { Thesis } from '@/modules/thesis/types'

export default function NewDefenseSchedulePage() {
  const router = useRouter()

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Khóa luận', href: '/thesis' },
    { label: 'Lịch bảo vệ', href: '/thesis/defense' },
    { label: 'Tạo mới' }
  ]
  
  // A real implementation would filter theses that don't have a schedule yet
  const availableTheses = thesisData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save new schedule would go here
    alert('Lịch bảo vệ mới đã được tạo (chức năng giả lập)');
    router.push('/thesis/defense');
  }

  return (
    <PageHeader
      title="Tạo Lịch bảo vệ mới"
      breadcrumbs={breadcrumbs}
      description="Điền thông tin để tạo một buổi bảo vệ khóa luận mới."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Tạo lịch bảo vệ
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
                <CardDescription>Chọn khóa luận và điền thời gian, địa điểm bảo vệ.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thesis">Chọn khóa luận</Label>
                  <Select>
                    <SelectTrigger id="thesis">
                      <SelectValue placeholder="Chọn khóa luận để lên lịch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTheses.map((thesis: Thesis) => <SelectItem key={thesis.id} value={thesis.id}>{thesis.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Ngày bảo vệ</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Giờ bảo vệ</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Phòng bảo vệ</Label>
                  <Select>
                    <SelectTrigger id="room">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => <SelectItem key={room.id} value={room.name}>{room.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hội đồng chấm</CardTitle>
                <CardDescription>Chọn các thành viên cho hội đồng.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chairman">Chủ tịch</Label>
                  <Select>
                    <SelectTrigger id="chairman"><SelectValue placeholder="Chọn chủ tịch" /></SelectTrigger>
                    <SelectContent>{councilMembers.filter(m => m.role === 'CHAIRMAN').map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretary">Thư ký</Label>
                  <Select>
                    <SelectTrigger id="secretary"><SelectValue placeholder="Chọn thư ký" /></SelectTrigger>
                    <SelectContent>{councilMembers.filter(m => m.role === 'SECRETARY').map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label>Thành viên</Label>
                    <div className="space-y-2 p-3 border rounded-md h-32 overflow-y-auto">
                        {councilMembers.filter(m => m.role === 'MEMBER').map(member => (
                            <div key={member.id} className="flex items-center space-x-2">
                                <Checkbox id={`member-${member.id}`} />
                                <Label htmlFor={`member-${member.id}`} className="font-normal">{member.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </PageHeader>
  )
} 