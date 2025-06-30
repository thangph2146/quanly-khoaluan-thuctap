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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
	FileText,
	Download,
	Calendar,
	Filter,
	BarChart3,
	TrendingUp,
	Users,
	Eye,
	Plus
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	reportTemplates,
	generatedReports,
	reportStats,
} from '@/modules/reports/data'
import {
	getCategoryColor,
	getStatusColor,
	getFrequencyText,
} from '@/modules/reports/utils'
import { ReportTemplate, GeneratedReport } from '@/modules/reports/types'

export default function ReportsPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('ALL')


	const filteredTemplates: ReportTemplate[] = reportTemplates.filter(template => {
		const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 template.description.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	const filteredReports: GeneratedReport[] = generatedReports.filter(report =>
		report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
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
							<BreadcrumbItem>
								<BreadcrumbPage>Báo cáo</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Quản lý Báo cáo</h1>
						<p className="text-muted-foreground">
							Tạo và quản lý các báo cáo thống kê hệ thống
						</p>
					</div>
					<div className="flex gap-2">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Tạo báo cáo mới
						</Button>
						<Button variant="outline">
							<Calendar className="h-4 w-4 mr-2" />
							Lập lịch báo cáo
						</Button>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng báo cáo</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.totalReports}</div>
							<p className="text-xs text-muted-foreground">
								+12% so với tháng trước
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tháng này</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.thisMonth}</div>
							<p className="text-xs text-muted-foreground">
								+8% so với tháng trước
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tự động</CardTitle>
							<BarChart3 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.automated}</div>
							<p className="text-xs text-muted-foreground">
								57% tổng số báo cáo
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Thủ công</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.manual}</div>
							<p className="text-xs text-muted-foreground">
								43% tổng số báo cáo
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Thời gian TB</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.avgGenerationTime}</div>
							<p className="text-xs text-muted-foreground">
								-15% so với tháng trước
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Lượt tải</CardTitle>
							<Download className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{reportStats.totalDownloads}</div>
							<p className="text-xs text-muted-foreground">
								+25% so với tháng trước
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="templates" className="space-y-4">
					<TabsList>
						<TabsTrigger value="templates">Mẫu báo cáo</TabsTrigger>
						<TabsTrigger value="generated">Báo cáo đã tạo</TabsTrigger>
						<TabsTrigger value="scheduled">Lịch báo cáo</TabsTrigger>
						<TabsTrigger value="analytics">Phân tích</TabsTrigger>
					</TabsList>

					{/* Report Templates Tab */}
					<TabsContent value="templates" className="space-y-4">
						{/* Filters */}
						<div className="flex items-center space-x-4">
							<div className="flex-1">
								<Input
									placeholder="Tìm kiếm mẫu báo cáo..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="max-w-sm"
								/>
							</div>
							<Select value={selectedCategory} onValueChange={setSelectedCategory}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Chọn danh mục" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">Tất cả danh mục</SelectItem>
									<SelectItem value="THESIS">Khóa luận</SelectItem>
									<SelectItem value="INTERNSHIP">Thực tập</SelectItem>
									<SelectItem value="FACULTY">Giảng viên</SelectItem>
									<SelectItem value="PARTNERS">Đối tác</SelectItem>
									<SelectItem value="FINANCIAL">Tài chính</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Templates Grid */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredTemplates.map((template) => (
								<Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
									<CardHeader>
										<div className="flex items-center justify-between">
											<Badge variant="secondary" className={getCategoryColor(template.category)}>
												{template.category}
											</Badge>
											<Badge variant="outline" className={getStatusColor(template.status)}>
												{template.status}
											</Badge>
										</div>
										<CardTitle className="text-lg">{template.name}</CardTitle>
										<CardDescription>{template.description}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center text-sm text-muted-foreground">
												<Calendar className="h-4 w-4 mr-2" />
												Tần suất: {getFrequencyText(template.frequency)}
											</div>
											<div className="flex items-center text-sm text-muted-foreground">
												<FileText className="h-4 w-4 mr-2" />
												Tạo gần nhất: {template.lastGenerated}
											</div>
											<div className="flex flex-wrap gap-1">
												{template.formats.map((format: string) => (
													<Badge key={format} variant="outline" className="text-xs">
														{format}
													</Badge>
												))}
											</div>
											<div className="flex gap-2 pt-2">
												<Button size="sm" className="flex-1">
													<Eye className="h-4 w-4 mr-2" />
													Xem chi tiết
												</Button>
												<Button size="sm" variant="outline" className="flex-1">
													<Download className="h-4 w-4 mr-2" />
													Tạo báo cáo
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Generated Reports Tab */}
					<TabsContent value="generated" className="space-y-4">
						<div className="flex items-center space-x-4">
							<Input
								placeholder="Tìm kiếm báo cáo..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="max-w-sm"
							/>
							<Button variant="outline">
								<Filter className="h-4 w-4 mr-2" />
								Lọc
							</Button>
						</div>

						<Card>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Tên báo cáo</TableHead>
										<TableHead>Ngày tạo</TableHead>
										<TableHead>Người tạo</TableHead>
										<TableHead>Định dạng</TableHead>
										<TableHead>Kích thước</TableHead>
										<TableHead>Lượt tải</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Thao tác</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredReports.map((report) => (
										<TableRow key={report.id}>
											<TableCell className="font-medium">{report.name}</TableCell>
											<TableCell>{report.generatedDate}</TableCell>
											<TableCell>{report.generatedBy}</TableCell>
											<TableCell>
												<Badge variant="outline">{report.format}</Badge>
											</TableCell>
											<TableCell>{report.fileSize}</TableCell>
											<TableCell>{report.downloadCount}</TableCell>
											<TableCell>
												<Badge className={getStatusColor(report.status)}>
													{report.status}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button size="sm" variant="outline">
														<Eye className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="outline">
														<Download className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Card>
					</TabsContent>

					{/* Scheduled Reports Tab */}
					<TabsContent value="scheduled" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Lịch báo cáo tự động</CardTitle>
								<CardDescription>
									Quản lý các báo cáo được tạo tự động theo lịch
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
									<h3 className="text-lg font-semibold mb-2">Chưa có lịch báo cáo</h3>
									<p className="text-muted-foreground mb-4">
										Tạo lịch báo cáo tự động để tiết kiệm thời gian
									</p>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Tạo lịch báo cáo
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Analytics Tab */}
					<TabsContent value="analytics" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Báo cáo theo danh mục</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm">Khóa luận</span>
											<span className="text-sm font-medium">45%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
										</div>
										
										<div className="flex items-center justify-between">
											<span className="text-sm">Thực tập</span>
											<span className="text-sm font-medium">30%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
										</div>
										
										<div className="flex items-center justify-between">
											<span className="text-sm">Giảng viên</span>
											<span className="text-sm font-medium">15%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
										</div>
										
										<div className="flex items-center justify-between">
											<span className="text-sm">Khác</span>
											<span className="text-sm font-medium">10%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-orange-600 h-2 rounded-full" style={{ width: '10%' }}></div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Xu hướng tạo báo cáo</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm">Tháng 10</span>
											<span className="text-sm font-medium">18 báo cáo</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Tháng 11</span>
											<span className="text-sm font-medium">22 báo cáo</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Tháng 12</span>
											<span className="text-sm font-medium">28 báo cáo</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Tháng 1</span>
											<span className="text-sm font-medium">24 báo cáo</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
} 