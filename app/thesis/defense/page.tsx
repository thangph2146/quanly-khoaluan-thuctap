'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Download,
  User,
  MapPin,
  Star
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for thesis defense
const defenseSchedules = [
  {
    id: 'DEF001',
    thesis: {
      id: 'TH001',
      title: 'Ứng dụng AI trong chẩn đoán y tế',
      student: {
        name: 'Nguyễn Văn An',
        code: '20IT001',
        email: 'an.nv@student.edu.vn'
      },
      supervisor: 'TS. Trần Thị Bình'
    },
    date: '2024-06-15',
    time: '08:00',
    duration: 45,
    room: 'Phòng 301 - Tòa A',
    status: 'SCHEDULED',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: true, approved: true },
      presentation: { submitted: true, approved: false },
      summary: { submitted: false, approved: false }
    },
    result: null
  },
  {
    id: 'DEF002',
    thesis: {
      id: 'TH002',
      title: 'Hệ thống quản lý thư viện thông minh',
      student: {
        name: 'Lê Thị Cẩm',
        code: '20IT002',
        email: 'cam.lt@student.edu.vn'
      },
      supervisor: 'PGS.TS. Phạm Văn Dũng'
    },
    date: '2024-06-20',
    time: '09:00',
    duration: 45,
    room: 'Phòng 302 - Tòa A',
    status: 'PENDING_APPROVAL',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: false, approved: false },
      presentation: { submitted: false, approved: false },
      summary: { submitted: false, approved: false }
    },
    result: null
  },
  {
    id: 'DEF003',
    thesis: {
      id: 'TH003',
      title: 'Phân tích dữ liệu lớn với Hadoop và Spark',
      student: {
        name: 'Hoàng Minh Đức',
        code: '20IT003',
        email: 'duc.hm@student.edu.vn'
      },
      supervisor: 'TS. Lê Văn Giang'
    },
    date: '2024-05-25',
    time: '14:00',
    duration: 45,
    room: 'Phòng 303 - Tòa A',
    status: 'COMPLETED',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: true, approved: true },
      presentation: { submitted: true, approved: true },
      summary: { submitted: true, approved: true }
    },
    result: {
      grade: 8.5,
      classification: 'GOOD',
      chairman_score: 8.5,
      secretary_score: 8.0,
      member_scores: [8.5, 9.0, 8.0],
      comments: 'Sinh viên thể hiện tốt kiến thức chuyên môn, trình bày rõ ràng và trả lời câu hỏi thuyết phục.',
      recommendations: 'Tiếp tục nghiên cứu sâu hơn về tối ưu hóa hiệu suất xử lý dữ liệu lớn.'
    }
  }
]

const councilMembers = [
  {
    id: 'CM001',
    name: 'PGS.TS. Nguyễn Văn Chủ tịch',
    title: 'Phó Giáo sư - Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Trí tuệ nhân tạo, Machine Learning',
    role: 'CHAIRMAN',
    experience: 15,
    defensesCount: 45
  },
  {
    id: 'CM002',
    name: 'TS. Lê Thị Thư ký',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Hệ thống thông tin, Cơ sở dữ liệu',
    role: 'SECRETARY',
    experience: 8,
    defensesCount: 32
  },
  {
    id: 'CM003',
    name: 'TS. Phạm Văn Thành viên 1',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Kỹ thuật phần mềm, Kiểm thử phần mềm',
    role: 'MEMBER',
    experience: 10,
    defensesCount: 38
  },
  {
    id: 'CM004',
    name: 'TS. Hoàng Thị Thành viên 2',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'An toàn thông tin, Mật mã học',
    role: 'MEMBER',
    experience: 12,
    defensesCount: 41
  },
  {
    id: 'CM005',
    name: 'ThS. Trần Văn Thành viên 3',
    title: 'Thạc sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Mạng máy tính, IoT',
    role: 'MEMBER',
    experience: 6,
    defensesCount: 25
  }
]

const rooms = [
  { id: 'R301', name: 'Phòng 301 - Tòa A', capacity: 50, equipment: ['Projector', 'Microphone', 'Whiteboard'] },
  { id: 'R302', name: 'Phòng 302 - Tòa A', capacity: 40, equipment: ['Projector', 'Sound System'] },
  { id: 'R303', name: 'Phòng 303 - Tòa A', capacity: 30, equipment: ['Projector', 'Whiteboard'] },
  { id: 'R401', name: 'Phòng 401 - Tòa B', capacity: 60, equipment: ['Projector', 'Microphone', 'Camera'] }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
    case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'Đã lên lịch'
    case 'PENDING_APPROVAL': return 'Chờ phê duyệt'
    case 'COMPLETED': return 'Đã hoàn thành'
    case 'CANCELLED': return 'Đã hủy'
    default: return status
  }
}

const getGradeColor = (grade: number) => {
  if (grade >= 9.0) return 'text-green-600 font-bold'
  if (grade >= 8.0) return 'text-blue-600 font-semibold'
  if (grade >= 7.0) return 'text-yellow-600 font-medium'
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

export default function ThesisDefensePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('ALL')

  const filteredDefenses = defenseSchedules.filter(defense => {
    const matchesSearch = defense.thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         defense.thesis.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         defense.thesis.student.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || defense.status === selectedStatus
    const matchesDate = selectedDate === 'ALL' || defense.date.startsWith(selectedDate)
    return matchesSearch && matchesStatus && matchesDate
  })

  const completedDefenses = defenseSchedules.filter(d => d.status === 'COMPLETED')
  const avgGrade = completedDefenses.length > 0 ? 
    completedDefenses.reduce((sum, d) => sum + (d.result?.grade || 0), 0) / completedDefenses.length : 0

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Bảo vệ khóa luận' },
	]

  return (
		<PageHeader
			title="Bảo vệ khóa luận"
			description="Quản lý lịch, hội đồng và kết quả bảo vệ khóa luận tốt nghiệp"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Xuất báo cáo
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Tạo lịch bảo vệ
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng lịch bảo vệ</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{defenseSchedules.length}</div>
							<p className="text-xs text-muted-foreground">
								Trong học kỳ này
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{completedDefenses.length}</div>
							<p className="text-xs text-muted-foreground">
								{Math.round((completedDefenses.length / defenseSchedules.length) * 100)}% tổng số
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Chờ bảo vệ</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{defenseSchedules.filter(d => d.status === 'SCHEDULED').length}
							</div>
							<p className="text-xs text-muted-foreground">
								Đã lên lịch
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
							<Award className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{avgGrade.toFixed(1)}</div>
							<p className="text-xs text-muted-foreground">
								Các buổi đã hoàn thành
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="schedule" className="space-y-4">
					<TabsList>
						<TabsTrigger value="schedule">Lịch bảo vệ</TabsTrigger>
						<TabsTrigger value="council">Hội đồng</TabsTrigger>
						<TabsTrigger value="results">Kết quả</TabsTrigger>
						<TabsTrigger value="rooms">Phòng bảo vệ</TabsTrigger>
					</TabsList>

					{/* Schedule Tab */}
					<TabsContent value="schedule" className="space-y-4">
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
									<SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
									<SelectItem value="PENDING_APPROVAL">Chờ phê duyệt</SelectItem>
									<SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
									<SelectItem value="CANCELLED">Đã hủy</SelectItem>
								</SelectContent>
							</Select>
							<Select value={selectedDate} onValueChange={setSelectedDate}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Chọn tháng" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Tất cả tháng</SelectItem>
									<SelectItem value="2024-05">Tháng 5/2024</SelectItem>
									<SelectItem value="2024-06">Tháng 6/2024</SelectItem>
									<SelectItem value="2024-07">Tháng 7/2024</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Defense Schedule List */}
						<div className="grid gap-4">
							{filteredDefenses.map((defense) => (
								<Card key={defense.id}>
									<CardContent className="pt-6">
										<div className="space-y-4">
											{/* Header */}
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<h3 className="text-lg font-semibold">{defense.thesis.title}</h3>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<span className="flex items-center">
															<User className="h-4 w-4 mr-1" />
															{defense.thesis.student.name} ({defense.thesis.student.code})
														</span>
														<span className="flex items-center">
															<User className="h-4 w-4 mr-1" />
															GVHD: {defense.thesis.supervisor}
														</span>
													</div>
												</div>
												<Badge className={getStatusColor(defense.status)}>
													{getStatusText(defense.status)}
												</Badge>
											</div>

											{/* Defense Details */}
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
												<div className="flex items-center space-x-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span>{defense.date}</span>
												</div>
												<div className="flex items-center space-x-2">
													<Clock className="h-4 w-4 text-muted-foreground" />
													<span>{defense.time} ({defense.duration} phút)</span>
												</div>
												<div className="flex items-center space-x-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<span>{defense.room}</span>
												</div>
											</div>

											{/* Council Info */}
											<div className="space-y-2">
												<h4 className="font-medium text-sm">Hội đồng bảo vệ:</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
													<div>Chủ tịch: {defense.council.chairman}</div>
													<div>Thư ký: {defense.council.secretary}</div>
												</div>
												<div className="text-sm text-muted-foreground">
													Thành viên: {defense.council.members.join(', ')}
												</div>
											</div>

											{/* Documents Status */}
											<div className="space-y-2">
												<h4 className="font-medium text-sm">Trạng thái tài liệu:</h4>
												<div className="flex items-center space-x-4 text-sm">
													<div className="flex items-center space-x-1">
														{defense.documents.thesis.approved ? 
															<CheckCircle2 className="h-4 w-4 text-green-600" /> : 
															<AlertTriangle className="h-4 w-4 text-yellow-600" />
														}
														<span>Khóa luận</span>
													</div>
													<div className="flex items-center space-x-1">
														{defense.documents.presentation.approved ? 
															<CheckCircle2 className="h-4 w-4 text-green-600" /> : 
															<AlertTriangle className="h-4 w-4 text-yellow-600" />
														}
														<span>Slide thuyết trình</span>
													</div>
													<div className="flex items-center space-x-1">
														{defense.documents.summary.approved ? 
															<CheckCircle2 className="h-4 w-4 text-green-600" /> : 
															<AlertTriangle className="h-4 w-4 text-yellow-600" />
														}
														<span>Tóm tắt</span>
													</div>
												</div>
											</div>

											{/* Result Preview */}
											{defense.result && (
												<div className="p-3 bg-green-50 rounded-lg">
													<div className="flex items-center justify-between">
														<span className="font-medium text-sm">Kết quả bảo vệ:</span>
														<div className="flex items-center space-x-2">
															<span className={`text-lg ${getGradeColor(defense.result.grade)}`}>
																{defense.result.grade}/10
															</span>
															<Badge variant="outline">
																{getClassificationText(defense.result.classification)}
															</Badge>
														</div>
													</div>
												</div>
											)}

											{/* Actions */}
											<div className="flex gap-2">
												<Button size="sm" variant="outline">
													<Eye className="h-4 w-4 mr-2" />
													Xem chi tiết
												</Button>
												<Button size="sm" variant="outline">
													<Edit className="h-4 w-4 mr-2" />
													Chỉnh sửa
												</Button>
												{defense.status === 'COMPLETED' && (
													<Button size="sm" variant="outline">
														<Download className="h-4 w-4 mr-2" />
														Biên bản
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Council Tab */}
					<TabsContent value="council" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Danh sách thành viên hội đồng</CardTitle>
								<CardDescription>Quản lý thông tin các thành viên tham gia hội đồng bảo vệ</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Họ tên</TableHead>
											<TableHead>Học hàm/Học vị</TableHead>
											<TableHead>Chuyên môn</TableHead>
											<TableHead>Vai trò</TableHead>
											<TableHead>Kinh nghiệm</TableHead>
											<TableHead>Số buổi bảo vệ</TableHead>
											<TableHead>Thao tác</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{councilMembers.map((member) => (
											<TableRow key={member.id}>
												<TableCell className="font-medium">{member.name}</TableCell>
												<TableCell>{member.title}</TableCell>
												<TableCell>{member.specialization}</TableCell>
												<TableCell>
													<Badge variant={member.role === 'CHAIRMAN' ? 'default' : 
																  member.role === 'SECRETARY' ? 'secondary' : 'outline'}>
														{member.role === 'CHAIRMAN' ? 'Chủ tịch' :
														 member.role === 'SECRETARY' ? 'Thư ký' : 'Thành viên'}
													</Badge>
												</TableCell>
												<TableCell>{member.experience} năm</TableCell>
												<TableCell>{member.defensesCount}</TableCell>
												<TableCell>
													<div className="flex gap-2">
														<Button size="sm" variant="outline">
															<Eye className="h-4 w-4" />
														</Button>
														<Button size="sm" variant="outline">
															<Edit className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Results Tab */}
					<TabsContent value="results" className="space-y-4">
						<div className="grid gap-4">
							{defenseSchedules.filter(d => d.status === 'COMPLETED').map((defense) => (
								<Card key={defense.id}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle className="text-lg">{defense.thesis.title}</CardTitle>
												<CardDescription>
													{defense.thesis.student.name} ({defense.thesis.student.code}) • {defense.date}
												</CardDescription>
											</div>
											<div className="text-right">
												<div className={`text-2xl font-bold ${getGradeColor(defense.result!.grade)}`}>
													{defense.result!.grade}/10
												</div>
												<Badge variant="outline" className="mt-1">
													{getClassificationText(defense.result!.classification)}
												</Badge>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Detailed Scores */}
										<div>
											<h4 className="font-medium mb-2">Điểm chi tiết:</h4>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">Chủ tịch HĐ:</span>
													<span className="ml-2 font-medium">{defense.result!.chairman_score}</span>
												</div>
												<div>
													<span className="text-muted-foreground">Thư ký HĐ:</span>
													<span className="ml-2 font-medium">{defense.result!.secretary_score}</span>
												</div>
												<div>
													<span className="text-muted-foreground">Thành viên:</span>
													<span className="ml-2 font-medium">
														{defense.result!.member_scores.join(', ')}
													</span>
												</div>
											</div>
										</div>

										{/* Comments */}
										<div>
											<h4 className="font-medium mb-2">Nhận xét của hội đồng:</h4>
											<p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
												{defense.result!.comments}
											</p>
										</div>

										{/* Recommendations */}
										<div>
											<h4 className="font-medium mb-2">Kiến nghị:</h4>
											<p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
												{defense.result!.recommendations}
											</p>
										</div>

										{/* Rating */}
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium">Đánh giá chung:</span>
											<div className="flex">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star 
														key={star} 
														className={`h-4 w-4 ${
															star <= Math.round(defense.result!.grade / 2) ? 
															'text-yellow-400 fill-current' : 'text-gray-300'
														}`} 
													/>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Rooms Tab */}
					<TabsContent value="rooms" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Phòng bảo vệ khóa luận</CardTitle>
								<CardDescription>Quản lý thông tin các phòng dành cho bảo vệ khóa luận</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-2">
									{rooms.map((room) => (
										<Card key={room.id}>
											<CardContent className="pt-6">
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<h3 className="font-semibold">{room.name}</h3>
														<Badge variant="outline">
															{room.capacity} chỗ ngồi
														</Badge>
													</div>
													<div>
														<h4 className="text-sm font-medium mb-2">Trang thiết bị:</h4>
														<div className="flex flex-wrap gap-1">
															{room.equipment.map((eq, index) => (
																<Badge key={index} variant="secondary" className="text-xs">
																	{eq}
																</Badge>
															))}
														</div>
													</div>
													<div className="flex gap-2">
														<Button size="sm" variant="outline" className="flex-1">
															<Calendar className="h-4 w-4 mr-2" />
															Xem lịch
														</Button>
														<Button size="sm" variant="outline" className="flex-1">
															<Edit className="h-4 w-4 mr-2" />
															Chỉnh sửa
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</PageHeader>
	)
} 