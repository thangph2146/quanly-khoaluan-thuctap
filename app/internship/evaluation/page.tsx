'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Download,
  Search,
  Building,
  Target,
  Award
} from 'lucide-react'

// Mock data for evaluations
const evaluations = [
  {
    id: 'EV001',
    student: {
      id: 'SV001',
      name: 'Nguyễn Văn An',
      code: '20IT001',
      avatar: '/avatars/student1.jpg'
    },
    internship: {
      id: 'TT001',
      company: 'FPT Software',
      position: 'Frontend Developer',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      duration: 16
    },
    supervisor: {
      name: 'Nguyễn Văn Minh',
      position: 'Senior Software Engineer'
    },
    evaluationPeriods: [
      {
        period: 'Giữa kỳ',
        date: '2024-10-15',
        status: 'Hoàn thành',
        scores: {
          technical: 8.5,
          teamwork: 9.0,
          communication: 8.0,
          attitude: 9.5,
          overall: 8.8
        },
        feedback: 'Sinh viên thể hiện tốt trong công việc, có khả năng học hỏi nhanh và tinh thần trách nhiệm cao.',
        recommendations: 'Nên cải thiện kỹ năng giao tiếp với khách hàng và tìm hiểu thêm về testing.'
      },
      {
        period: 'Cuối kỳ',
        date: '2024-12-15',
        status: 'Chờ đánh giá',
        scores: null,
        feedback: '',
        recommendations: ''
      }
    ],
    overallGrade: 8.8,
    status: 'Đang thực tập'
  },
  {
    id: 'EV002',
    student: {
      id: 'SV002',
      name: 'Trần Thị Bình',
      code: '20IT002',
      avatar: '/avatars/student2.jpg'
    },
    internship: {
      id: 'TT002',
      company: 'Viettel Digital',
      position: 'Mobile Developer',
      startDate: '2024-08-15',
      endDate: '2024-12-01',
      duration: 16
    },
    supervisor: {
      name: 'Trần Thị Lan',
      position: 'Tech Lead'
    },
    evaluationPeriods: [
      {
        period: 'Giữa kỳ',
        date: '2024-10-01',
        status: 'Hoàn thành',
        scores: {
          technical: 9.0,
          teamwork: 8.5,
          communication: 9.0,
          attitude: 9.0,
          overall: 8.9
        },
        feedback: 'Sinh viên có khả năng kỹ thuật tốt và làm việc hiệu quả trong nhóm.',
        recommendations: 'Tiếp tục phát triển kỹ năng lãnh đạo và quản lý dự án.'
      },
      {
        period: 'Cuối kỳ',
        date: '2024-12-01',
        status: 'Hoàn thành',
        scores: {
          technical: 9.2,
          teamwork: 9.0,
          communication: 8.8,
          attitude: 9.5,
          overall: 9.1
        },
        feedback: 'Sinh viên đã hoàn thành xuất sắc thời gian thực tập với nhiều đóng góp tích cực.',
        recommendations: 'Sẵn sàng cho vị trí full-time developer.'
      }
    ],
    overallGrade: 9.1,
    status: 'Hoàn thành'
  },
  {
    id: 'EV003',
    student: {
      id: 'SV003',
      name: 'Lê Văn Cường',
      code: '20IT003',
      avatar: '/avatars/student3.jpg'
    },
    internship: {
      id: 'TT003',
      company: 'TMA Solutions',
      position: 'Data Analyst',
      startDate: '2024-09-15',
      endDate: '2024-12-30',
      duration: 16
    },
    supervisor: {
      name: 'Lê Hoàng Nam',
      position: 'Data Scientist'
    },
    evaluationPeriods: [
      {
        period: 'Giữa kỳ',
        date: '2024-11-01',
        status: 'Hoàn thành',
        scores: {
          technical: 7.5,
          teamwork: 8.0,
          communication: 7.0,
          attitude: 8.5,
          overall: 7.8
        },
        feedback: 'Sinh viên cần cải thiện kỹ năng phân tích dữ liệu và trình bày kết quả.',
        recommendations: 'Tham gia thêm các khóa học về data visualization và statistical analysis.'
      },
      {
        period: 'Cuối kỳ',
        date: '2024-12-30',
        status: 'Chờ đánh giá',
        scores: null,
        feedback: '',
        recommendations: ''
      }
    ],
    overallGrade: 7.8,
    status: 'Đang thực tập'
  }
]

const evaluationCriteria = [
  { name: 'Kỹ năng kỹ thuật', key: 'technical', weight: 40 },
  { name: 'Làm việc nhóm', key: 'teamwork', weight: 20 },
  { name: 'Giao tiếp', key: 'communication', weight: 15 },
  { name: 'Thái độ làm việc', key: 'attitude', weight: 25 }
]

export default function EvaluationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEvaluation, setSelectedEvaluation] = useState<typeof evaluations[0] | null>(null)

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.internship.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800'
      case 'Đang thực tập': return 'bg-blue-100 text-blue-800'
      case 'Chờ đánh giá': return 'bg-yellow-100 text-yellow-800'
      case 'Tạm dừng': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'text-green-600'
    if (grade >= 8) return 'text-blue-600'
    if (grade >= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const calculateProgress = (evaluation: typeof evaluations[0]) => {
    const completedPeriods = evaluation.evaluationPeriods.filter(p => p.status === 'Hoàn thành').length
    const totalPeriods = evaluation.evaluationPeriods.length
    return (completedPeriods / totalPeriods) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đánh giá thực tập</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý đánh giá kết quả thực tập của sinh viên
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Tạo đánh giá mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
            <p className="text-xs text-muted-foreground">
              Trong kỳ hiện tại
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluations.filter(e => e.status === 'Hoàn thành').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Đã kết thúc thực tập
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evaluations.filter(e => e.status === 'Đang thực tập').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần theo dõi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(evaluations.reduce((sum, e) => sum + e.overallGrade, 0) / evaluations.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Trên thang 10
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm sinh viên, mã SV, công ty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang thực tập">Đang thực tập</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Chờ đánh giá">Chờ đánh giá</option>
        </select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh sách đánh giá</TabsTrigger>
          <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          <TabsTrigger value="criteria">Tiêu chí đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{evaluation.student.name}</h3>
                      <p className="text-sm text-muted-foreground">{evaluation.student.code}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Building className="mr-1 h-4 w-4 text-muted-foreground" />
                          {evaluation.internship.company}
                        </div>
                        <div className="flex items-center">
                          <Target className="mr-1 h-4 w-4 text-muted-foreground" />
                          {evaluation.internship.position}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {new Date(evaluation.internship.startDate).toLocaleDateString('vi-VN')} - 
                          {new Date(evaluation.internship.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(evaluation.status)}>
                      {evaluation.status}
                    </Badge>
                    <div className="text-2xl font-bold">
                      <span className={getGradeColor(evaluation.overallGrade)}>
                        {evaluation.overallGrade}
                      </span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tiến độ đánh giá</span>
                    <span>{calculateProgress(evaluation).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculateProgress(evaluation)} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Người hướng dẫn: {evaluation.supervisor.name}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEvaluation(evaluation)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố điểm số</CardTitle>
                <CardDescription>Thống kê điểm đánh giá tổng thể</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '9.0 - 10', count: evaluations.filter(e => e.overallGrade >= 9).length, color: 'bg-green-600' },
                    { range: '8.0 - 8.9', count: evaluations.filter(e => e.overallGrade >= 8 && e.overallGrade < 9).length, color: 'bg-blue-600' },
                    { range: '7.0 - 7.9', count: evaluations.filter(e => e.overallGrade >= 7 && e.overallGrade < 8).length, color: 'bg-yellow-600' },
                    { range: '< 7.0', count: evaluations.filter(e => e.overallGrade < 7).length, color: 'bg-red-600' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.range}</span>
                        <span className="font-medium">{item.count} sinh viên</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / evaluations.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đánh giá theo doanh nghiệp</CardTitle>
                <CardDescription>Điểm trung bình các doanh nghiệp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(evaluations.map(e => e.internship.company))).map(company => {
                    const companyEvaluations = evaluations.filter(e => e.internship.company === company)
                    const avgGrade = companyEvaluations.reduce((sum, e) => sum + e.overallGrade, 0) / companyEvaluations.length
                    return (
                      <div key={company} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{company}</h4>
                          <p className="text-sm text-muted-foreground">
                            {companyEvaluations.length} sinh viên
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getGradeColor(avgGrade)}`}>
                            {avgGrade.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">ĐTB</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tiêu chí đánh giá thực tập</CardTitle>
              <CardDescription>
                Các tiêu chí và trọng số đánh giá kết quả thực tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {evaluationCriteria.map((criteria, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{criteria.name}</h4>
                      <Badge variant="outline">{criteria.weight}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${criteria.weight}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {criteria.key === 'technical' && 'Đánh giá khả năng kỹ thuật, hiểu biết chuyên môn và khả năng áp dụng kiến thức vào công việc thực tế.'}
                      {criteria.key === 'teamwork' && 'Đánh giá khả năng làm việc nhóm, hỗ trợ đồng nghiệp và thích ứng với môi trường làm việc.'}
                      {criteria.key === 'communication' && 'Đánh giá kỹ năng giao tiếp, trình bày ý tưởng và tương tác với các bên liên quan.'}
                      {criteria.key === 'attitude' && 'Đánh giá thái độ làm việc, tinh thần trách nhiệm và mức độ chủ động trong công việc.'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Evaluation Detail Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Đánh giá thực tập - {selectedEvaluation.student.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedEvaluation.internship.position} tại {selectedEvaluation.internship.company}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedEvaluation(null)}>
                  Đóng
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Thông tin sinh viên</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Mã SV:</span> {selectedEvaluation.student.code}</p>
                    <p><span className="font-medium">Họ tên:</span> {selectedEvaluation.student.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Thông tin thực tập</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Thời gian:</span> {selectedEvaluation.internship.duration} tuần</p>
                    <p><span className="font-medium">Từ:</span> {new Date(selectedEvaluation.internship.startDate).toLocaleDateString('vi-VN')}</p>
                    <p><span className="font-medium">Đến:</span> {new Date(selectedEvaluation.internship.endDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Chi tiết đánh giá</h4>
                <div className="space-y-6">
                  {selectedEvaluation.evaluationPeriods.map((period, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{period.period}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(period.status)}>
                              {period.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(period.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {period.scores ? (
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              {evaluationCriteria.map((criteria, critIndex) => (
                                <div key={critIndex} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{criteria.name}</span>
                                    <span className="font-medium">
                                      {period.scores![criteria.key as keyof typeof period.scores]}/10
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ 
                                        width: `${(period.scores![criteria.key as keyof typeof period.scores] / 10) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Điểm tổng thể</span>
                                <span className={`text-xl font-bold ${getGradeColor(period.scores.overall)}`}>
                                  {period.scores.overall}/10
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium mb-2">Nhận xét</h5>
                                <p className="text-sm text-muted-foreground">{period.feedback}</p>
                              </div>
                              <div>
                                <h5 className="font-medium mb-2">Khuyến nghị</h5>
                                <p className="text-sm text-muted-foreground">{period.recommendations}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                            <p>Chưa có đánh giá cho giai đoạn này</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo đánh giá mới
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 