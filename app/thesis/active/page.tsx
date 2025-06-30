'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, User, BookOpen, AlertCircle, CheckCircle2, Target, FileText, Search } from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for active theses
const activeTheses = [
  {
    id: 'TH001',
    title: 'Ứng dụng Machine Learning trong dự đoán xu hướng thị trường chứng khoán',
    student: {
      id: 'SV001',
      name: 'Nguyễn Văn An',
      code: '20IT001',
      email: 'an.nv@student.edu.vn'
    },
    supervisor: {
      name: 'TS. Trần Thị Bình',
      email: 'binh.tt@edu.vn'
    },
    progress: 75,
    status: 'IN_PROGRESS',
    startDate: '2024-09-01',
    expectedEndDate: '2024-12-15',
    currentPhase: 'Thực hiện nghiên cứu',
    milestones: [
      { id: 1, name: 'Đăng ký đề tài', completed: true, dueDate: '2024-09-01', completedDate: '2024-08-30' },
      { id: 2, name: 'Nộp đề cương', completed: true, dueDate: '2024-09-15', completedDate: '2024-09-14' },
      { id: 3, name: 'Báo cáo tiến độ lần 1', completed: true, dueDate: '2024-10-15', completedDate: '2024-10-14' },
      { id: 4, name: 'Báo cáo tiến độ lần 2', completed: false, dueDate: '2024-11-15', completedDate: null },
      { id: 5, name: 'Nộp khóa luận hoàn chỉnh', completed: false, dueDate: '2024-12-01', completedDate: null },
      { id: 6, name: 'Bảo vệ khóa luận', completed: false, dueDate: '2024-12-15', completedDate: null }
    ]
  },
  {
    id: 'TH002',
    title: 'Phát triển hệ thống IoT giám sát môi trường thông minh',
    student: {
      id: 'SV002',
      name: 'Lê Thị Cẩm',
      code: '20IT002',
      email: 'cam.lt@student.edu.vn'
    },
    supervisor: {
      name: 'PGS.TS. Phạm Văn Dũng',
      email: 'dung.pv@edu.vn'
    },
    progress: 60,
    status: 'IN_PROGRESS',
    startDate: '2024-09-01',
    expectedEndDate: '2024-12-15',
    currentPhase: 'Phát triển prototype',
    milestones: [
      { id: 1, name: 'Đăng ký đề tài', completed: true, dueDate: '2024-09-01', completedDate: '2024-08-29' },
      { id: 2, name: 'Nộp đề cương', completed: true, dueDate: '2024-09-15', completedDate: '2024-09-13' },
      { id: 3, name: 'Báo cáo tiến độ lần 1', completed: true, dueDate: '2024-10-15', completedDate: '2024-10-15' },
      { id: 4, name: 'Báo cáo tiến độ lần 2', completed: false, dueDate: '2024-11-15', completedDate: null },
      { id: 5, name: 'Nộp khóa luận hoàn chỉnh', completed: false, dueDate: '2024-12-01', completedDate: null },
      { id: 6, name: 'Bảo vệ khóa luận', completed: false, dueDate: '2024-12-15', completedDate: null }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'DELAYED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function ActiveThesesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedThesis, setSelectedThesis] = useState<string | null>(null)

  const filteredTheses = activeTheses.filter(thesis =>
    thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thesis.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thesis.student.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const breadcrumbs = [
    { label: 'Hệ thống Quản lý', href: '/dashboard' },
    { label: 'Khóa luận', href: '/thesis' },
    { label: 'Đang thực hiện' },
  ]

  return (
    <PageHeader
      title="Khóa luận đang thực hiện"
      description="Theo dõi tiến độ và quản lý các khóa luận đang trong quá trình thực hiện"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khóa luận</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đúng tiến độ</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-muted-foreground">
                75% tổng số khóa luận
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chậm tiến độ</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">6</div>
              <p className="text-xs text-muted-foreground">
                25% cần hỗ trợ
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                +5% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên đề tài, sinh viên hoặc mã số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Thesis List */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTheses.map((thesis) => (
            <Card key={thesis.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-tight">{thesis.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>{thesis.student.name} ({thesis.student.code})</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(thesis.status)}>
                    {thesis.status === 'IN_PROGRESS' ? 'Đang thực hiện' : thesis.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ thực hiện</span>
                    <span className="font-medium">{thesis.progress}%</span>
                  </div>
                  <Progress value={thesis.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Giai đoạn hiện tại: {thesis.currentPhase}
                  </p>
                </div>

                {/* Timeline Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Bắt đầu</p>
                      <p className="text-muted-foreground">{new Date(thesis.startDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Dự kiến hoàn thành</p>
                      <p className="text-muted-foreground">{new Date(thesis.expectedEndDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>

                {/* Supervisor */}
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>GVHD: {thesis.supervisor.name}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedThesis(thesis.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Chi tiết
                  </Button>
                  <Button variant="outline" size="sm">
                    Cập nhật tiến độ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View Modal/Panel */}
        {selectedThesis && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết tiến độ khóa luận</CardTitle>
                <Button variant="outline" onClick={() => setSelectedThesis(null)}>
                  Đóng
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const thesis = activeTheses.find(t => t.id === selectedThesis)
                if (!thesis) return null

                return (
                  <Tabs defaultValue="milestones" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="milestones">Mốc thời gian</TabsTrigger>
                      <TabsTrigger value="documents">Tài liệu</TabsTrigger>
                      <TabsTrigger value="meetings">Cuộc họp</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="milestones" className="space-y-4">
                      <div className="space-y-4">
                        {thesis.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className={`w-4 h-4 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <div className="flex-1">
                              <h4 className="font-medium">{milestone.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Hạn: {new Date(milestone.dueDate).toLocaleDateString('vi-VN')}
                                {milestone.completedDate && (
                                  <span className="ml-2 text-green-600">
                                    (Hoàn thành: {new Date(milestone.completedDate).toLocaleDateString('vi-VN')})
                                  </span>
                                )}
                              </p>
                            </div>
                            <Badge variant={milestone.completed ? "default" : "secondary"}>
                              {milestone.completed ? "Hoàn thành" : "Chưa hoàn thành"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="documents" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        Chức năng quản lý tài liệu đang được phát triển
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="meetings" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        Chức năng quản lý cuộc họp đang được phát triển
                      </div>
                    </TabsContent>
                  </Tabs>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </PageHeader>
  )
} 