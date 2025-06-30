'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  Target,
  TrendingUp,
  MessageSquare,
  Upload,
  Eye,
  Edit
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for thesis progress
const thesesProgress = [
  {
    id: 'TH001',
    title: 'Ứng dụng AI trong chẩn đoán y tế',
    student: {
      name: 'Nguyễn Văn An',
      code: '20IT001',
      email: 'an.nv@student.edu.vn'
    },
    supervisor: 'TS. Trần Thị Bình',
    startDate: '2024-02-15',
    expectedEndDate: '2024-06-15',
    currentPhase: 'IMPLEMENTATION',
    overallProgress: 65,
    status: 'ON_TRACK',
    lastUpdate: '2024-01-20',
    milestones: [
      { id: 1, title: 'Đăng ký đề tài', status: 'COMPLETED', dueDate: '2024-02-15', completedDate: '2024-02-15' },
      { id: 2, title: 'Nghiên cứu tài liệu', status: 'COMPLETED', dueDate: '2024-03-15', completedDate: '2024-03-10' },
      { id: 3, title: 'Thiết kế hệ thống', status: 'COMPLETED', dueDate: '2024-04-15', completedDate: '2024-04-12' },
      { id: 4, title: 'Lập trình ứng dụng', status: 'IN_PROGRESS', dueDate: '2024-05-15', completedDate: null },
      { id: 5, title: 'Kiểm thử và đánh giá', status: 'PENDING', dueDate: '2024-06-01', completedDate: null },
      { id: 6, title: 'Hoàn thiện báo cáo', status: 'PENDING', dueDate: '2024-06-10', completedDate: null },
      { id: 7, title: 'Bảo vệ khóa luận', status: 'PENDING', dueDate: '2024-06-15', completedDate: null }
    ],
    meetings: [
      { date: '2024-01-20', topic: 'Thảo luận tiến độ lập trình', notes: 'Sinh viên đã hoàn thành 60% module chẩn đoán' },
      { date: '2024-01-10', topic: 'Review thiết kế database', notes: 'Cần điều chỉnh cấu trúc bảng patient_records' },
      { date: '2023-12-25', topic: 'Báo cáo giai đoạn 1', notes: 'Hoàn thành nghiên cứu tài liệu, bắt đầu thiết kế' }
    ],
    documents: [
      { name: 'Đề cương chi tiết', type: 'PDF', uploadDate: '2024-02-20', status: 'APPROVED' },
      { name: 'Báo cáo tiến độ T1', type: 'DOC', uploadDate: '2024-01-15', status: 'APPROVED' },
      { name: 'Source code v1.0', type: 'ZIP', uploadDate: '2024-01-18', status: 'PENDING' }
    ]
  },
  {
    id: 'TH002',
    title: 'Hệ thống quản lý thư viện thông minh',
    student: {
      name: 'Lê Thị Cẩm',
      code: '20IT002',
      email: 'cam.lt@student.edu.vn'
    },
    supervisor: 'PGS.TS. Phạm Văn Dũng',
    startDate: '2024-02-20',
    expectedEndDate: '2024-06-20',
    currentPhase: 'DESIGN',
    overallProgress: 45,
    status: 'DELAYED',
    lastUpdate: '2024-01-18',
    milestones: [
      { id: 1, title: 'Đăng ký đề tài', status: 'COMPLETED', dueDate: '2024-02-20', completedDate: '2024-02-20' },
      { id: 2, title: 'Nghiên cứu tài liệu', status: 'COMPLETED', dueDate: '2024-03-20', completedDate: '2024-03-25' },
      { id: 3, title: 'Thiết kế hệ thống', status: 'IN_PROGRESS', dueDate: '2024-04-20', completedDate: null },
      { id: 4, title: 'Lập trình ứng dụng', status: 'PENDING', dueDate: '2024-05-20', completedDate: null },
      { id: 5, title: 'Kiểm thử và đánh giá', status: 'PENDING', dueDate: '2024-06-05', completedDate: null },
      { id: 6, title: 'Hoàn thiện báo cáo', status: 'PENDING', dueDate: '2024-06-15', completedDate: null },
      { id: 7, title: 'Bảo vệ khóa luận', status: 'PENDING', dueDate: '2024-06-20', completedDate: null }
    ],
    meetings: [
      { date: '2024-01-18', topic: 'Thảo luận thiết kế UI/UX', notes: 'Cần nghiên cứu thêm về user experience' },
      { date: '2024-01-05', topic: 'Review tài liệu nghiên cứu', notes: 'Bổ sung thêm tài liệu về IoT trong thư viện' }
    ],
    documents: [
      { name: 'Đề cương chi tiết', type: 'PDF', uploadDate: '2024-02-25', status: 'APPROVED' },
      { name: 'Wireframe thiết kế', type: 'PDF', uploadDate: '2024-01-10', status: 'PENDING' }
    ]
  },
  {
    id: 'TH003',
    title: 'Chatbot hỗ trợ học tập với NLP',
    student: {
      name: 'Hoàng Minh Đức',
      code: '20IT003',
      email: 'duc.hm@student.edu.vn'
    },
    supervisor: 'TS. Lê Văn Giang',
    startDate: '2024-03-01',
    expectedEndDate: '2024-07-01',
    currentPhase: 'RESEARCH',
    overallProgress: 25,
    status: 'ON_TRACK',
    lastUpdate: '2024-01-22',
    milestones: [
      { id: 1, title: 'Đăng ký đề tài', status: 'COMPLETED', dueDate: '2024-03-01', completedDate: '2024-03-01' },
      { id: 2, title: 'Nghiên cứu tài liệu', status: 'IN_PROGRESS', dueDate: '2024-04-01', completedDate: null },
      { id: 3, title: 'Thiết kế hệ thống', status: 'PENDING', dueDate: '2024-05-01', completedDate: null },
      { id: 4, title: 'Lập trình ứng dụng', status: 'PENDING', dueDate: '2024-06-01', completedDate: null },
      { id: 5, title: 'Kiểm thử và đánh giá', status: 'PENDING', dueDate: '2024-06-20', completedDate: null },
      { id: 6, title: 'Hoàn thiện báo cáo', status: 'PENDING', dueDate: '2024-06-25', completedDate: null },
      { id: 7, title: 'Bảo vệ khóa luận', status: 'PENDING', dueDate: '2024-07-01', completedDate: null }
    ],
    meetings: [
      { date: '2024-01-22', topic: 'Khởi động dự án', notes: 'Thảo luận hướng nghiên cứu và timeline' }
    ],
    documents: [
      { name: 'Đề cương chi tiết', type: 'PDF', uploadDate: '2024-03-05', status: 'APPROVED' }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ON_TRACK': return 'bg-green-100 text-green-800'
    case 'DELAYED': return 'bg-red-100 text-red-800'
    case 'AT_RISK': return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getMilestoneStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'text-green-600'
    case 'IN_PROGRESS': return 'text-blue-600'
    case 'PENDING': return 'text-gray-400'
    case 'OVERDUE': return 'text-red-600'
    default: return 'text-gray-400'
  }
}

const getMilestoneIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-600" />
    case 'OVERDUE': return <AlertTriangle className="h-5 w-5 text-red-600" />
    default: return <Clock className="h-5 w-5 text-gray-400" />
  }
}

const getPhaseText = (phase: string) => {
  switch (phase) {
    case 'RESEARCH': return 'Nghiên cứu'
    case 'DESIGN': return 'Thiết kế'
    case 'IMPLEMENTATION': return 'Lập trình'
    case 'TESTING': return 'Kiểm thử'
    case 'DOCUMENTATION': return 'Báo cáo'
    case 'DEFENSE': return 'Bảo vệ'
    default: return phase
  }
}

export default function ThesisProgressPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedThesis, setSelectedThesis] = useState<string | null>(null)

  const filteredTheses = thesesProgress.filter(thesis => {
    const matchesSearch = thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.student.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || thesis.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const selectedThesisData = selectedThesis ? thesesProgress.find(t => t.id === selectedThesis) : null

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Tiến độ' },
	]

  return (
		<PageHeader
			title="Tiến độ Khóa luận"
			description="Theo dõi và quản lý tiến độ thực hiện khóa luận"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex gap-2">
					<Button variant="outline">
						<Upload className="h-4 w-4 mr-2" />
						Import dữ liệu
					</Button>
					<Button>
						<FileText className="h-4 w-4 mr-2" />
						Báo cáo tiến độ
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng khóa luận</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{thesesProgress.length}</div>
							<p className="text-xs text-muted-foreground">
								Đang theo dõi
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đúng tiến độ</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{thesesProgress.filter(t => t.status === 'ON_TRACK').length}
							</div>
							<p className="text-xs text-muted-foreground">
								{Math.round((thesesProgress.filter(t => t.status === 'ON_TRACK').length / thesesProgress.length) * 100)}% tổng số
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Chậm tiến độ</CardTitle>
							<AlertTriangle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{thesesProgress.filter(t => t.status === 'DELAYED').length}
							</div>
							<p className="text-xs text-muted-foreground">
								Cần can thiệp
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tiến độ trung bình</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{Math.round(thesesProgress.reduce((sum, t) => sum + t.overallProgress, 0) / thesesProgress.length)}%
							</div>
							<p className="text-xs text-muted-foreground">
								Tất cả khóa luận
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Tổng quan</TabsTrigger>
						<TabsTrigger value="timeline">Timeline</TabsTrigger>
						<TabsTrigger value="meetings">Họp hướng dẫn</TabsTrigger>
						<TabsTrigger value="documents">Tài liệu</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-4">
						{/* Filters */}
						<div className="flex items-center space-x-4">
							<div className="flex-1">
								<Input
									placeholder="Tìm kiếm khóa luận, sinh viên..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="max-w-sm"
								/>
							</div>
							<Select value={selectedStatus} onValueChange={setSelectedStatus}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Chọn trạng thái" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Tất cả trạng thái</SelectItem>
									<SelectItem value="ON_TRACK">Đúng tiến độ</SelectItem>
									<SelectItem value="DELAYED">Chậm tiến độ</SelectItem>
									<SelectItem value="AT_RISK">Có rủi ro</SelectItem>
									<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Thesis List */}
						<div className="grid gap-4">
							{filteredTheses.map((thesis) => (
								<Card key={thesis.id} className="cursor-pointer hover:shadow-md transition-shadow">
									<CardContent className="pt-6">
										<div className="space-y-4">
											{/* Header */}
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<h3 className="text-lg font-semibold">{thesis.title}</h3>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<span className="flex items-center">
															<User className="h-4 w-4 mr-1" />
															{thesis.student.name} ({thesis.student.code})
														</span>
														<span className="flex items-center">
															<User className="h-4 w-4 mr-1" />
															GVHD: {thesis.supervisor}
														</span>
														<span className="flex items-center">
															<Calendar className="h-4 w-4 mr-1" />
															{thesis.startDate} - {thesis.expectedEndDate}
														</span>
													</div>
												</div>
												<div className="text-right space-y-2">
													<Badge className={getStatusColor(thesis.status)}>
														{thesis.status === 'ON_TRACK' ? 'Đúng tiến độ' :
														 thesis.status === 'DELAYED' ? 'Chậm tiến độ' :
														 thesis.status === 'AT_RISK' ? 'Có rủi ro' : 'Hoàn thành'}
													</Badge>
													<div className="text-sm text-muted-foreground">
														Giai đoạn: {getPhaseText(thesis.currentPhase)}
													</div>
												</div>
											</div>

											{/* Progress Bar */}
											<div className="space-y-2">
												<div className="flex items-center justify-between text-sm">
													<span>Tiến độ tổng thể</span>
													<span className="font-medium">{thesis.overallProgress}%</span>
												</div>
												<Progress value={thesis.overallProgress} className="h-2" />
											</div>

											{/* Milestones Summary */}
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4 text-sm">
													<span className="flex items-center text-green-600">
														<CheckCircle2 className="h-4 w-4 mr-1" />
														{thesis.milestones.filter(m => m.status === 'COMPLETED').length} hoàn thành
													</span>
													<span className="flex items-center text-blue-600">
														<Clock className="h-4 w-4 mr-1" />
														{thesis.milestones.filter(m => m.status === 'IN_PROGRESS').length} đang thực hiện
													</span>
													<span className="flex items-center text-gray-600">
														<Target className="h-4 w-4 mr-1" />
														{thesis.milestones.filter(m => m.status === 'PENDING').length} chưa bắt đầu
													</span>
												</div>
												<div className="flex gap-2">
													<Button 
														size="sm" 
														variant="outline"
														onClick={() => setSelectedThesis(thesis.id)}
													>
														<Eye className="h-4 w-4 mr-2" />
														Xem chi tiết
													</Button>
													<Button size="sm" variant="outline">
														<Edit className="h-4 w-4 mr-2" />
														Cập nhật
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Timeline Tab */}
					<TabsContent value="timeline" className="space-y-4">
						{selectedThesisData ? (
							<Card>
								<CardHeader>
									<CardTitle>{selectedThesisData.title}</CardTitle>
									<CardDescription>Timeline chi tiết các mốc thời gian</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										{selectedThesisData.milestones.map((milestone, index) => (
											<div key={milestone.id} className="flex items-start space-x-4">
												<div className="flex-shrink-0 mt-1">
													{getMilestoneIcon(milestone.status)}
												</div>
												<div className="flex-1 space-y-2">
													<div className="flex items-center justify-between">
														<h4 className={`font-medium ${getMilestoneStatusColor(milestone.status)}`}>
															{milestone.title}
														</h4>
														<div className="text-sm text-muted-foreground">
															Hạn: {milestone.dueDate}
															{milestone.completedDate && (
																<span className="ml-2 text-green-600">
																	(Hoàn thành: {milestone.completedDate})
																</span>
															)}
														</div>
													</div>
													{index < selectedThesisData.milestones.length - 1 && (
														<div className="ml-2 border-l-2 border-gray-200 h-6"></div>
													)}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="pt-6">
									<div className="text-center py-8">
										<Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">Chọn khóa luận để xem timeline</h3>
										<p className="text-muted-foreground">
											Vui lòng chọn một khóa luận từ danh sách để xem timeline chi tiết
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					{/* Meetings Tab */}
					<TabsContent value="meetings" className="space-y-4">
						{selectedThesisData ? (
							<Card>
								<CardHeader>
									<CardTitle>Lịch sử họp hướng dẫn</CardTitle>
									<CardDescription>{selectedThesisData.title}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{selectedThesisData.meetings.map((meeting, index) => (
											<div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
												<div className="flex items-center justify-between mb-2">
													<h4 className="font-medium">{meeting.topic}</h4>
													<span className="text-sm text-muted-foreground">{meeting.date}</span>
												</div>
												<p className="text-sm text-muted-foreground">{meeting.notes}</p>
											</div>
										))}
										<Button className="w-full" variant="outline">
											<MessageSquare className="h-4 w-4 mr-2" />
											Thêm cuộc họp mới
										</Button>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="pt-6">
									<div className="text-center py-8">
										<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">Chọn khóa luận để xem lịch họp</h3>
										<p className="text-muted-foreground">
											Vui lòng chọn một khóa luận để xem lịch sử họp hướng dẫn
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					{/* Documents Tab */}
					<TabsContent value="documents" className="space-y-4">
						{selectedThesisData ? (
							<Card>
								<CardHeader>
									<CardTitle>Tài liệu đã nộp</CardTitle>
									<CardDescription>{selectedThesisData.title}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{selectedThesisData.documents.map((doc, index) => (
											<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center space-x-3">
													<FileText className="h-5 w-5 text-blue-600" />
													<div>
														<h4 className="font-medium">{doc.name}</h4>
														<p className="text-sm text-muted-foreground">
															{doc.type} • Tải lên: {doc.uploadDate}
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													<Badge variant={doc.status === 'APPROVED' ? 'default' : 'secondary'}>
														{doc.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
													</Badge>
													<Button size="sm" variant="outline">
														<Eye className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
										<Button className="w-full" variant="outline">
											<Upload className="h-4 w-4 mr-2" />
											Tải tài liệu mới
										</Button>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="pt-6">
									<div className="text-center py-8">
										<FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
										<h3 className="text-lg font-semibold mb-2">Chọn khóa luận để xem tài liệu</h3>
										<p className="text-muted-foreground">
											Vui lòng chọn một khóa luận để xem danh sách tài liệu
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</PageHeader>
	)
} 