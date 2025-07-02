'use client'
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
import {
	Save,
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
import {
	availableSupervisors,
	researchTopics,
} from '@/modules/thesis/data'
import { Supervisor } from '@/modules/thesis/types'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

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
						{availableSupervisors.map((supervisor: Supervisor) => (
							<div
								key={supervisor.id}
								className="border rounded-lg p-4 space-y-3"
							>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Link href={`/thesis/supervisors/${supervisor.id}`}>
												<h3 className="text-lg font-semibold hover:underline">
													{supervisor.name}
												</h3>
											</Link>
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
									<Label>Mã sinh viên</Label>
									<Input
										placeholder="20210001"
										value="20210001"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<Label>Họ và tên</Label>
									<Input
										placeholder="Nguyễn Văn A"
										value="Nguyễn Văn A"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<Label>Lớp</Label>
									<Input placeholder="CNTT-K64" value="CNTT-K64" disabled />
								</div>
								<div className="space-y-2">
									<Label>Email</Label>
									<Input
										placeholder="nguyenvana@email.com"
										value="nguyenvana@email.com"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<Label>Điện thoại</Label>
									<Input placeholder="0987654321" value="0987654321" />
								</div>
								<div className="space-y-2">
									<Label>GPA tích lũy</Label>
									<Input placeholder="3.2" value="3.2" disabled />
								</div>
							</div>
						</div>

						{/* Thesis Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<BookOpen className="mr-2 h-5 w-5" />
								Thông tin đề tài
							</h3>
							<div className="space-y-2">
								<Label>Tên đề tài dự kiến</Label>
								<Textarea placeholder="Ví dụ: Xây dựng hệ thống quản lý thư viện trực tuyến sử dụng React và Node.js" />
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Lĩnh vực nghiên cứu</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Chọn lĩnh vực nghiên cứu" />
										</SelectTrigger>
										<SelectContent>
											{researchTopics.map((topic, index) => (
												<SelectItem key={index} value={topic}>
													{topic}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>Giảng viên hướng dẫn</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Chọn giảng viên" />
										</SelectTrigger>
										<SelectContent>
											{availableSupervisors.map(supervisor => (
												<SelectItem
													key={supervisor.id}
													value={supervisor.id}
													disabled={
														supervisor.currentTheses >=
														supervisor.maxTheses
													}
												>
													{supervisor.name} ({supervisor.currentTheses}/
													{supervisor.maxTheses})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

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

						{/* File Upload */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center">
								<FileText className="mr-2 h-5 w-5" />
								Đề cương và tài liệu
							</h3>
							<div className="space-y-2">
								<Label>Tải lên đề cương sơ bộ (PDF, DOCX)</Label>
								<div className="flex items-center space-x-2">
									<Input type="file" className="flex-1" />
									<Button variant="outline">
										<Upload className="mr-2 h-4 w-4" /> Tải lên
									</Button>
								</div>
							</div>
						</div>

						<div className="flex justify-end pt-4 space-x-2">
							<Button variant="outline">Hủy bỏ</Button>
							<Button>
								<Save className="mr-2 h-4 w-4" />
								Nộp đơn đăng ký
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 