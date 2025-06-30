'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Target,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for assignments
const assignments = [
  {
    id: 'AS001',
    title: 'Nghiên cứu tài liệu về Machine Learning',
    description: 'Tìm hiểu và tổng hợp các tài liệu nghiên cứu về Machine Learning trong lĩnh vực xử lý ngôn ngữ tự nhiên',
    student: {
      id: 'SV001',
      name: 'Nguyễn Văn An',
      code: '20IT001'
    },
    supervisor: {
      id: 'GV001',
      name: 'TS. Nguyễn Văn A'
    },
    thesis: {
      id: 'KL001',
      title: 'Xây dựng hệ thống chatbot thông minh sử dụng NLP'
    },
    dueDate: '2024-12-20',
    assignedDate: '2024-11-15',
    status: 'Đang thực hiện',
    priority: 'Cao',
    progress: 65,
    estimatedHours: 40,
    actualHours: 26,
    category: 'Nghiên cứu',
    attachments: [
      { name: 'Danh sách tài liệu.pdf', size: '2.5 MB' },
      { name: 'Outline nghiên cứu.docx', size: '1.2 MB' }
    ]
  },
  {
    id: 'AS002',
    title: 'Thiết kế kiến trúc hệ thống',
    description: 'Thiết kế kiến trúc tổng thể cho hệ thống quản lý thư viện số, bao gồm database design và API structure',
    student: {
      id: 'SV002',
      name: 'Trần Thị Bình',
      code: '20IT002'
    },
    supervisor: {
      id: 'GV002',
      name: 'PGS. Trần Thị B'
    },
    thesis: {
      id: 'KL002',
      title: 'Hệ thống quản lý thư viện số với công nghệ blockchain'
    },
    dueDate: '2024-12-15',
    assignedDate: '2024-11-10',
    status: 'Hoàn thành',
    priority: 'Cao',
    progress: 100,
    estimatedHours: 30,
    actualHours: 28,
    category: 'Thiết kế',
    attachments: [
      { name: 'System Architecture.pdf', size: '3.8 MB' },
      { name: 'Database Schema.sql', size: '156 KB' }
    ]
  },
  {
    id: 'AS003',
    title: 'Cài đặt module xử lý dữ liệu',
    description: 'Implement các function cơ bản để xử lý và làm sạch dữ liệu đầu vào cho hệ thống phân tích',
    student: {
      id: 'SV003',
      name: 'Lê Văn Cường',
      code: '20IT003'
    },
    supervisor: {
      id: 'GV003',
      name: 'TS. Lê Văn C'
    },
    thesis: {
      id: 'KL003',
      title: 'Hệ thống phân tích dữ liệu lớn cho doanh nghiệp'
    },
    dueDate: '2024-12-25',
    assignedDate: '2024-11-18',
    status: 'Chờ review',
    priority: 'Trung bình',
    progress: 85,
    estimatedHours: 35,
    actualHours: 30,
    category: 'Lập trình',
    attachments: [
      { name: 'data_processing.py', size: '45 KB' },
      { name: 'test_cases.py', size: '23 KB' }
    ]
  },
  {
    id: 'AS004',
    title: 'Viết báo cáo tiến độ tháng 11',
    description: 'Tổng hợp tiến độ thực hiện khóa luận trong tháng 11, bao gồm các kết quả đạt được và khó khăn gặp phải',
    student: {
      id: 'SV004',
      name: 'Phạm Thị Dung',
      code: '20IT004'
    },
    supervisor: {
      id: 'GV001',
      name: 'TS. Nguyễn Văn A'
    },
    thesis: {
      id: 'KL004',
      title: 'Ứng dụng IoT trong nông nghiệp thông minh'
    },
    dueDate: '2024-12-01',
    assignedDate: '2024-11-25',
    status: 'Quá hạn',
    priority: 'Thấp',
    progress: 30,
    estimatedHours: 8,
    actualHours: 3,
    category: 'Báo cáo',
    attachments: []
  }
]

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignments[0] | null>(null)

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800'
      case 'Đang thực hiện': return 'bg-blue-100 text-blue-800'
      case 'Chờ review': return 'bg-yellow-100 text-yellow-800'
      case 'Quá hạn': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao': return 'bg-red-100 text-red-800'
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800'
      case 'Thấp': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nghiên cứu': return 'bg-blue-100 text-blue-800'
      case 'Thiết kế': return 'bg-purple-100 text-purple-800'
      case 'Lập trình': return 'bg-green-100 text-green-800'
      case 'Báo cáo': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Phân công nhiệm vụ' },
	]

  return (
		<PageHeader
			title="Phân công nhiệm vụ"
			description="Quản lý và theo dõi các nhiệm vụ được giao cho sinh viên làm khóa luận"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Xuất báo cáo
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Tạo nhiệm vụ mới
					</Button>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng nhiệm vụ</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{assignments.length}</div>
							<p className="text-xs text-muted-foreground">Đang theo dõi</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{assignments.filter(a => a.status === 'Hoàn thành').length}
							</div>
							<p className="text-xs text-muted-foreground">Đã hoàn thành</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{assignments.filter(a => a.status === 'Đang thực hiện').length}
							</div>
							<p className="text-xs text-muted-foreground">Cần theo dõi</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
							<AlertCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{assignments.filter(a => a.status === 'Quá hạn').length}
							</div>
							<p className="text-xs text-muted-foreground">Cần xử lý</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Tìm kiếm nhiệm vụ, sinh viên, danh mục..."
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
						<option value="Đang thực hiện">Đang thực hiện</option>
						<option value="Hoàn thành">Hoàn thành</option>
						<option value="Chờ review">Chờ review</option>
						<option value="Quá hạn">Quá hạn</option>
					</select>
				</div>

				{/* Assignments List */}
				<div className="space-y-4">
					{filteredAssignments.map((assignment) => (
						<Card key={assignment.id} className="hover:shadow-md transition-shadow">
							<CardContent className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1 space-y-3">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="font-semibold text-lg">{assignment.title}</h3>
												<p className="text-sm text-muted-foreground mt-1">
													{assignment.description}
												</p>
											</div>
											<div className="flex flex-col space-y-2 items-end">
												<Badge className={getStatusColor(assignment.status)}>
													{assignment.status}
												</Badge>
												<Badge className={getPriorityColor(assignment.priority)}>
													{assignment.priority}
												</Badge>
											</div>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
											<div className="flex items-center">
												<User className="mr-2 h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">{assignment.student.name}</p>
													<p className="text-muted-foreground">{assignment.student.code}</p>
												</div>
											</div>
											<div className="flex items-center">
												<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</p>
													<p className="text-xs text-muted-foreground">
														{new Date(assignment.dueDate) < new Date() ? 'Quá hạn' : 'Còn thời gian'}
													</p>
												</div>
											</div>
											<div className="flex items-center">
												<Clock className="mr-2 h-4 w-4 text-muted-foreground" />
												<div>
													<p className="font-medium">{assignment.actualHours}h / {assignment.estimatedHours}h</p>
													<p className="text-xs text-muted-foreground">Thời gian</p>
												</div>
											</div>
											<div className="flex items-center">
												<Target className="mr-2 h-4 w-4 text-muted-foreground" />
												<Badge className={getCategoryColor(assignment.category)} variant="outline">
													{assignment.category}
												</Badge>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span>Tiến độ hoàn thành</span>
												<span className="font-medium">{assignment.progress}%</span>
											</div>
											<Progress value={assignment.progress} className="h-2" />
										</div>

										<div className="flex items-center justify-between">
											<div className="text-sm text-muted-foreground">
												GVHD: {assignment.supervisor.name}
											</div>
											<div className="flex space-x-2">
												<Button variant="outline" size="sm">
													<Edit className="mr-2 h-4 w-4" />
													Sửa
												</Button>
												<Button 
													variant="outline" 
													size="sm"
													onClick={() => setSelectedAssignment(assignment)}
												>
													Xem chi tiết
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Assignment Detail Modal */}
				{selectedAssignment && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-xl">{selectedAssignment.title}</CardTitle>
										<CardDescription>
											{selectedAssignment.thesis.title}
										</CardDescription>
									</div>
									<Button variant="outline" onClick={() => setSelectedAssignment(null)}>
										Đóng
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<h4 className="font-medium">Thông tin nhiệm vụ</h4>
										<div className="space-y-1 text-sm">
											<p><span className="font-medium">Sinh viên:</span> {selectedAssignment.student.name} ({selectedAssignment.student.code})</p>
											<p><span className="font-medium">GVHD:</span> {selectedAssignment.supervisor.name}</p>
											<p><span className="font-medium">Ngày giao:</span> {new Date(selectedAssignment.assignedDate).toLocaleDateString('vi-VN')}</p>
											<p><span className="font-medium">Hạn nộp:</span> {new Date(selectedAssignment.dueDate).toLocaleDateString('vi-VN')}</p>
										</div>
									</div>

									<div className="space-y-2">
										<h4 className="font-medium">Tiến độ & Thời gian</h4>
										<div className="space-y-1 text-sm">
											<p><span className="font-medium">Tiến độ:</span> {selectedAssignment.progress}%</p>
											<p><span className="font-medium">Thời gian ước tính:</span> {selectedAssignment.estimatedHours} giờ</p>
											<p><span className="font-medium">Thời gian thực tế:</span> {selectedAssignment.actualHours} giờ</p>
											<p><span className="font-medium">Hiệu suất:</span> {((selectedAssignment.actualHours / selectedAssignment.estimatedHours) * 100).toFixed(0)}%</p>
										</div>
									</div>
								</div>

								<div>
									<h4 className="font-medium mb-2">Mô tả chi tiết</h4>
									<p className="text-sm text-muted-foreground">{selectedAssignment.description}</p>
								</div>

								<div>
									<h4 className="font-medium mb-2">Tài liệu đính kèm</h4>
									{selectedAssignment.attachments.length > 0 ? (
										<div className="space-y-2">
											{selectedAssignment.attachments.map((file, index) => (
												<div key={index} className="flex items-center justify-between p-2 border rounded">
													<div className="flex items-center">
														<FileText className="mr-2 h-4 w-4 text-muted-foreground" />
														<div>
															<p className="text-sm font-medium">{file.name}</p>
															<p className="text-xs text-muted-foreground">{file.size}</p>
														</div>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground">Chưa có tài liệu đính kèm</p>
									)}
								</div>

								<div className="flex space-x-2">
									<Button className="flex-1">
										<Edit className="mr-2 h-4 w-4" />
										Chỉnh sửa
									</Button>
									<Button variant="outline" className="flex-1">
										<FileText className="mr-2 h-4 w-4" />
										Thêm nhận xét
									</Button>
									<Button variant="outline">
										<Trash2 className="mr-2 h-4 w-4" />
										Xóa
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</PageHeader>
	)
} 