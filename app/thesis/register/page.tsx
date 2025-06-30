import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import {
	Save,
	X,
	Upload,
	Calendar,
	User,
	FileText,
	AlertCircle,
	CheckCircle,
	Info,
	GraduationCap,
	BookOpen,
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for available supervisors
const availableSupervisors = [
	{
		id: "GV001",
		name: "TS. Trần Thị D",
		department: "Công nghệ phần mềm",
		specialization: "Web Development, Database",
		currentTheses: 8,
		maxTheses: 12,
		researchAreas: ["Web Applications", "Database Design", "Software Engineering"]
	},
	{
		id: "GV002",
		name: "PGS. Nguyễn Văn E",
		department: "Trí tuệ nhân tạo",
		specialization: "Machine Learning, AI",
		currentTheses: 15,
		maxTheses: 18,
		researchAreas: ["Machine Learning", "Computer Vision", "Natural Language Processing"]
	},
	{
		id: "GV003",
		name: "ThS. Lê Thị F",
		department: "Hệ thống thông tin",
		specialization: "Mobile Development, IoT",
		currentTheses: 5,
		maxTheses: 10,
		researchAreas: ["Mobile Applications", "IoT Systems", "Cloud Computing"]
	}
]

const researchTopics = [
	"Phát triển ứng dụng web",
	"Machine Learning và AI",
	"Phát triển ứng dụng di động",
	"Blockchain và Cryptocurrency",
	"Internet of Things (IoT)",
	"Cybersecurity",
	"Data Analytics",
	"Cloud Computing",
	"Game Development",
	"E-commerce Systems"
]

export default function ThesisRegisterPage() {
	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: 'Đăng ký Khóa luận' },
	]
	return (
		<PageHeader
			title="Đăng ký Khóa luận"
			description="Đăng ký đề tài khóa luận tốt nghiệp và chọn giảng viên hướng dẫn"
			breadcrumbs={breadcrumbs}
			actions={
				<Badge variant="outline" className="text-blue-600 border-blue-600">
					<Calendar className="mr-2 h-4 w-4" />
					Học kỳ 2024-2025
				</Badge>
			}
		>
			<div className="space-y-4">
				{/* Information Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-blue-200 bg-blue-50/50">
						<CardHeader className="pb-3">
							<div className="flex items-center space-x-2">
								<Info className="h-5 w-5 text-blue-600" />
								<CardTitle className="text-sm">Điều kiện đăng ký</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<ul className="text-xs space-y-1 text-blue-700">
								<li>• Hoàn thành ít nhất 110 tín chỉ</li>
								<li>• GPA tích lũy ≥ 2.0</li>
								<li>• Không có môn nợ khóa trước</li>
								<li>• Đã hoàn thành thực tập</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-green-200 bg-green-50/50">
						<CardHeader className="pb-3">
							<div className="flex items-center space-x-2">
								<CheckCircle className="h-5 w-5 text-green-600" />
								<CardTitle className="text-sm">Quy trình thực hiện</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<ul className="text-xs space-y-1 text-green-700">
								<li>• Đăng ký đề tài và GVHD</li>
								<li>• Phê duyệt đề cương</li>
								<li>• Thực hiện 4 tháng</li>
								<li>• Nộp báo cáo và bảo vệ</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-orange-200 bg-orange-50/50">
						<CardHeader className="pb-3">
							<div className="flex items-center space-x-2">
								<AlertCircle className="h-5 w-5 text-orange-600" />
								<CardTitle className="text-sm">Thời gian quan trọng</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<ul className="text-xs space-y-1 text-orange-700">
								<li>• Đăng ký: 01/01 - 15/01/2025</li>
								<li>• Nộp đề cương: trước 15/02/2025</li>
								<li>• Bảo vệ: tháng 05/2025</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* Available Supervisors */}
				<Card>
					<CardHeader>
						<CardTitle>Giảng viên hướng dẫn có sẵn</CardTitle>
						<CardDescription>
							{availableSupervisors.length} giảng viên với{' '}
							{availableSupervisors.reduce(
								(total, sup) => total + (sup.maxTheses - sup.currentTheses),
								0
							)}{' '}
							chỗ trống
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{availableSupervisors.map(supervisor => (
							<div
								key={supervisor.id}
								className="border rounded-lg p-4 space-y-3"
							>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<h3 className="text-lg font-semibold">
												{supervisor.name}
											</h3>
											<Badge variant="outline">{supervisor.department}</Badge>
											<Badge
												variant={
													supervisor.currentTheses < supervisor.maxTheses
														? 'default'
														: 'secondary'
												}
											>
												{supervisor.currentTheses}/{supervisor.maxTheses} sinh
												viên
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											<strong>Chuyên môn:</strong> {supervisor.specialization}
										</p>
										<div className="flex flex-wrap gap-1">
											{supervisor.researchAreas.map((area, index) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs"
												>
													{area}
												</Badge>
											))}
										</div>
									</div>
									<Button
										size="sm"
										variant={
											supervisor.currentTheses < supervisor.maxTheses
												? 'default'
												: 'secondary'
										}
										disabled={supervisor.currentTheses >= supervisor.maxTheses}
									>
										<GraduationCap className="mr-2 h-4 w-4" />
										{supervisor.currentTheses < supervisor.maxTheses
											? 'Chọn GVHD'
											: 'Đầy chỗ'}
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Registration Form */}
				<Card>
					<CardHeader>
						<CardTitle>Đơn đăng ký khóa luận</CardTitle>
						<CardDescription>
							Điền thông tin đề tài và chọn giảng viên hướng dẫn
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Student Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<User className="mr-2 h-5 w-5" />
								Thông tin sinh viên
							</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-medium">Mã sinh viên</label>
									<Input
										placeholder="20210001"
										value="20210001"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Họ và tên</label>
									<Input
										placeholder="Nguyễn Văn A"
										value="Nguyễn Văn A"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Lớp</label>
									<Input placeholder="CNTT-K64" value="CNTT-K64" disabled />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Email</label>
									<Input
										placeholder="student@university.edu.vn"
										value="nguyenvana@university.edu.vn"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Số điện thoại *
									</label>
									<Input placeholder="0123456789" />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">GPA tích lũy</label>
									<Input placeholder="3.2" value="3.2" disabled />
								</div>
							</div>
						</div>

						<Separator />

						{/* Thesis Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<BookOpen className="mr-2 h-5 w-5" />
								Thông tin khóa luận
							</h3>
							<div className="grid gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">Tên đề tài *</label>
									<Input placeholder="Nhập tên đề tài khóa luận..." />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Lĩnh vực nghiên cứu *
									</label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Chọn lĩnh vực nghiên cứu" />
										</SelectTrigger>
										<SelectContent>
											{researchTopics.map(topic => (
												<SelectItem key={topic} value={topic}>
													{topic}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Mô tả đề tài *
									</label>
									<Textarea
										placeholder="Mô tả chi tiết về đề tài, mục tiêu, phạm vi nghiên cứu..."
										className="min-h-[100px]"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Giảng viên hướng dẫn mong muốn *
									</label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Chọn giảng viên hướng dẫn" />
										</SelectTrigger>
										<SelectContent>
											{availableSupervisors
												.filter(sup => sup.currentTheses < sup.maxTheses)
												.map(supervisor => (
													<SelectItem
														key={supervisor.id}
														value={supervisor.id}
													>
														{supervisor.name} - {supervisor.department} (
														{supervisor.currentTheses}/
														{supervisor.maxTheses})
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Lý do chọn GVHD *
									</label>
									<Textarea
										placeholder="Lý do bạn muốn được hướng dẫn bởi giảng viên này..."
										className="min-h-[80px]"
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* Technical Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<FileText className="mr-2 h-5 w-5" />
								Thông tin kỹ thuật
							</h3>
							<div className="grid gap-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Công nghệ dự kiến sử dụng
									</label>
									<Input placeholder="Java, React, MySQL, Spring Boot..." />
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Kế hoạch thực hiện
									</label>
									<Textarea
										placeholder="Kế hoạch thực hiện chi tiết theo từng giai đoạn..."
										className="min-h-[80px]"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Tài liệu tham khảo
									</label>
									<Textarea
										placeholder="Danh sách tài liệu, nghiên cứu liên quan..."
										className="min-h-[60px]"
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* File Upload */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<FileText className="mr-2 h-5 w-5" />
								Tài liệu đính kèm
							</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Đề cương sơ bộ (PDF)
									</label>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<Upload className="mx-auto h-12 w-12 text-gray-400" />
										<p className="mt-2 text-sm text-gray-600">
											Kéo thả file hoặc{' '}
											<span className="text-blue-600 cursor-pointer">
												chọn file
											</span>
										</p>
										<p className="text-xs text-gray-500">
											PDF, tối đa 10MB
										</p>
									</div>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Bảng điểm (PDF)
									</label>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										<Upload className="mx-auto h-12 w-12 text-gray-400" />
										<p className="mt-2 text-sm text-gray-600">
											Kéo thả file hoặc{' '}
											<span className="text-blue-600 cursor-pointer">
												chọn file
											</span>
										</p>
										<p className="text-xs text-gray-500">PDF, tối đa 5MB</p>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end space-x-4 pt-6">
							<Button variant="outline">
								<X className="mr-2 h-4 w-4" />
								Hủy bỏ
							</Button>
							<Button variant="outline">
								<Save className="mr-2 h-4 w-4" />
								Lưu nháp
							</Button>
							<Button>
								<BookOpen className="mr-2 h-4 w-4" />
								Nộp đăng ký
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 