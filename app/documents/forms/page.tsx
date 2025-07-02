'use client'

import { useState } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	FileText,
	Download,
	Search,
	Upload,
	Plus,
	Eye,
	Calendar,
	User,
	MoreHorizontal,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formTemplates, submissions } from '@/modules/forms/data'
import {
	getCategoryColor,
	getStatusColor,
	getSubmissionStatusColor,
} from '@/modules/forms/utils'
import { FormTemplate } from '@/modules/forms/types'
import { useRouter } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DocumentFormsPage() {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('ALL')

	const filteredTemplates: FormTemplate[] = formTemplates.filter(template => {
		const matchesSearch =
			template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.description.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory =
			selectedCategory === 'ALL' || template.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	const activeTemplates = filteredTemplates.filter(t => t.status === 'ACTIVE')
	const archivedTemplates = filteredTemplates.filter(
		t => t.status === 'ARCHIVED'
	)

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/dashboard">
									Hệ thống Quản lý
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/documents">Tài liệu & Mẫu</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Biểu mẫu & Đơn từ</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{/* Header */}
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Biểu mẫu & Đơn từ
							</h1>
							<p className="text-muted-foreground">
								Quản lý các biểu mẫu, đơn từ và theo dõi tình trạng nộp của
								sinh viên
							</p>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								onClick={() => router.push('/documents/forms/new')}
							>
								<Upload className="mr-2 h-4 w-4" />
								Tải lên mẫu mới
							</Button>
							<Button onClick={() => router.push('/documents/forms/new')}>
								<Plus className="mr-2 h-4 w-4" />
								Tạo biểu mẫu
							</Button>
						</div>
					</div>

					{/* Search and Filter */}
					<div className="flex items-center space-x-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Tìm kiếm biểu mẫu..."
								className="pl-10"
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex space-x-2">
							<Badge
								variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
								className="cursor-pointer hover:bg-gray-100"
								onClick={() => setSelectedCategory('ALL')}
							>
								Tất cả ({formTemplates.length})
							</Badge>
							<Badge
								variant={
									selectedCategory === 'THESIS' ? 'default' : 'outline'
								}
								className="cursor-pointer hover:bg-gray-100"
								onClick={() => setSelectedCategory('THESIS')}
							>
								Khóa luận (
								{formTemplates.filter(f => f.category === 'THESIS').length})
							</Badge>
							<Badge
								variant={
									selectedCategory === 'INTERNSHIP' ? 'default' : 'outline'
								}
								className="cursor-pointer hover:bg-gray-100"
								onClick={() => setSelectedCategory('INTERNSHIP')}
							>
								Thực tập (
								{
									formTemplates.filter(f => f.category === 'INTERNSHIP')
										.length
								}
								)
							</Badge>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Tổng biểu mẫu
							</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">24</div>
							<p className="text-xs text-muted-foreground">
								6 mẫu mới tháng này
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đang sử dụng</CardTitle>
							<FileText className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">18</div>
							<p className="text-xs text-muted-foreground">75% tổng số</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Lượt tải xuống
							</CardTitle>
							<Download className="h-4 w-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">1,247</div>
							<p className="text-xs text-muted-foreground">Tháng này</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
							<Upload className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">12</div>
							<p className="text-xs text-muted-foreground">
								Đơn từ chờ xử lý
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="templates" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="templates">
							Biểu mẫu ({activeTemplates.length})
						</TabsTrigger>
						<TabsTrigger value="submissions">
							Đơn từ nộp ({submissions.length})
						</TabsTrigger>
						<TabsTrigger value="archived">
							Lưu trữ ({archivedTemplates.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="templates" className="space-y-4">
						<div className="grid gap-4">
							{activeTemplates.map(template => (
								<Card key={template.id} className="overflow-hidden">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-lg">{template.name}</CardTitle>
												<CardDescription>
													{template.description}
												</CardDescription>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span>Phiên bản: {template.version}</span>
													<span>
														Cập nhật:{' '}
														{new Date(
															template.lastUpdated
														).toLocaleDateString('vi-VN')}
													</span>
													<span>Định dạng: {template.format}</span>
													<span>Kích thước: {template.fileSize}</span>
												</div>
											</div>
											<div className="flex flex-col space-y-2">
												<Badge className={getCategoryColor(template.category)}>
													{template.category === 'THESIS'
														? 'Khóa luận'
														: 'Thực tập'}
												</Badge>
												<Badge className={getStatusColor(template.status)}>
													{template.status === 'ACTIVE'
														? 'Đang sử dụng'
														: 'Lưu trữ'}
												</Badge>
											</div>
											<div className="absolute top-4 right-4">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																router.push(
																	`/documents/forms/${template.id}`
																)
															}
														>
															<Eye className="mr-2 h-4 w-4" />
															Xem chi tiết
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Download className="mr-2 h-4 w-4" />
															Tải xuống
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Required Fields */}
										<div>
											<h4 className="font-medium text-sm mb-2">
												Trường thông tin bắt buộc
											</h4>
											<div className="flex flex-wrap gap-2">
												{template.requiredFields.map(
													(field: string, index: number) => (
														<Badge key={index} variant="outline">
															{field}
														</Badge>
													)
												)}
											</div>
										</div>

										{/* Statistics */}
										<div className="flex items-center justify-between text-sm">
											<span className="flex items-center space-x-1">
												<Download className="h-4 w-4" />
												<span>{template.downloadCount} lượt tải</span>
											</span>
										</div>

										{/* Actions */}
										<div className="flex space-x-2">
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Tải xuống
											</Button>
											<Button variant="outline" size="sm">
												<Eye className="h-4 w-4 mr-2" />
												Xem trước
											</Button>
											<Button variant="outline" size="sm">
												Chỉnh sửa
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="submissions" className="space-y-4">
						<div className="grid gap-4">
							{submissions.map(submission => (
								<Card key={submission.id} className="overflow-hidden">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-lg">
													{submission.formName}
												</CardTitle>
												<CardDescription>
													<div className="flex items-center space-x-4 text-sm">
														<span className="flex items-center space-x-1">
															<User className="h-4 w-4" />
															<span>
																{submission.student.name} (
																{submission.student.code})
															</span>
														</span>
														<span className="flex items-center space-x-1">
															<Calendar className="h-4 w-4" />
															<span>
																Nộp:{' '}
																{new Date(
																	submission.submittedDate
																).toLocaleDateString('vi-VN')}
															</span>
														</span>
													</div>
												</CardDescription>
											</div>
											<Badge
												className={getSubmissionStatusColor(submission.status)}
											>
												{submission.status === 'APPROVED'
													? 'Đã duyệt'
													: submission.status === 'REJECTED'
													? 'Từ chối'
													: 'Chờ duyệt'}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Review Information */}
										{submission.reviewedBy && (
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<p className="font-medium">Người duyệt</p>
													<p className="text-muted-foreground">
														{submission.reviewedBy}
													</p>
												</div>
												<div>
													<p className="font-medium">Ngày duyệt</p>
													<p className="text-muted-foreground">
														{submission.reviewDate
															? new Date(
																	submission.reviewDate
															  ).toLocaleDateString('vi-VN')
															: 'N/A'}
													</p>
												</div>
											</div>
										)}

										{/* Comments */}
										{submission.comments && (
											<div>
												<p className="font-medium text-sm mb-1">Nhận xét</p>
												<p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
													{submission.comments}
												</p>
											</div>
										)}

										{/* Actions */}
										<div className="flex space-x-2">
											<Button variant="outline" size="sm">
												<Eye className="h-4 w-4 mr-2" />
												Xem chi tiết
											</Button>
											{submission.status === 'PENDING' && (
												<>
													<Button
														variant="outline"
														size="sm"
														className="text-green-600"
													>
														Phê duyệt
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="text-red-600"
													>
														Từ chối
													</Button>
												</>
											)}
											<Button variant="outline" size="sm">
												Liên hệ SV
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="archived" className="space-y-4">
						<div className="grid gap-4">
							{archivedTemplates.map(template => (
								<Card
									key={template.id}
									className="overflow-hidden opacity-75"
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-lg">{template.name}</CardTitle>
												<CardDescription>
													{template.description}
												</CardDescription>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span>Phiên bản: {template.version}</span>
													<span>
														Cập nhật:{' '}
														{new Date(
															template.lastUpdated
														).toLocaleDateString('vi-VN')}
													</span>
												</div>
											</div>
											<div className="flex flex-col space-y-2">
												<Badge className={getCategoryColor(template.category)}>
													{template.category === 'THESIS'
														? 'Khóa luận'
														: 'Thực tập'}
												</Badge>
												<Badge className={getStatusColor(template.status)}>
													Lưu trữ
												</Badge>
											</div>
											<div className="absolute top-4 right-4">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																router.push(
																	`/documents/forms/${template.id}`
																)
															}
														>
															<Eye className="mr-2 h-4 w-4" />
															Xem chi tiết
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Download className="mr-2 h-4 w-4" />
															Tải xuống
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between text-sm">
											<span className="flex items-center space-x-1">
												<Download className="h-4 w-4" />
												<span>{template.downloadCount} lượt tải</span>
											</span>
										</div>

										<div className="flex space-x-2">
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Tải xuống
											</Button>
											<Button variant="outline" size="sm">
												Khôi phục
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600"
											>
												Xóa vĩnh viễn
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
} 