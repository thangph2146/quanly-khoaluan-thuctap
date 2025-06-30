'use client'

import { useState } from 'react'
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Download,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  monthlyData,
  overviewStats,
  recentActivities,
  departmentStats,
  supervisorPerformance,
  companyStats,
} from '@/modules/analytics/data'
import {
  getActivityIcon,
  getCompletionRateColor,
} from '@/modules/analytics/utils'
import { PageHeader } from '@/components/common'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_SEMESTER')
  const [selectedDepartment, setSelectedDepartment] = useState('ALL')

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Thống kê & Phân tích' },
	]

  return (
		<PageHeader
			title="Thống kê & Phân tích"
			description="Tổng quan về hoạt động khóa luận và thực tập"
			breadcrumbs={breadcrumbs}
			actions={
				<div className="flex space-x-2">
					<Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Chọn kỳ học" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="THIS_SEMESTER">Học kỳ này</SelectItem>
							<SelectItem value="LAST_SEMESTER">Học kỳ trước</SelectItem>
							<SelectItem value="THIS_YEAR">Năm học này</SelectItem>
							<SelectItem value="LAST_YEAR">Năm học trước</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={selectedDepartment}
						onValueChange={setSelectedDepartment}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Chọn bộ môn" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">Tất cả bộ môn</SelectItem>
							<SelectItem value="CNTT">Công nghệ Thông tin</SelectItem>
							<SelectItem value="KTPM">Kỹ thuật Phần mềm</SelectItem>
							<SelectItem value="ATTT">An toàn Thông tin</SelectItem>
							<SelectItem value="KHMT">Khoa học Máy tính</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Làm mới
					</Button>
					<Button>
						<Download className="mr-2 h-4 w-4" />
						Xuất báo cáo
					</Button>
				</div>
			}
		>
			<div className="flex flex-1 flex-col gap-4">
				{/* Overview Stats */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{overviewStats.totalStudents}</div>
							<p className="text-xs text-muted-foreground">
								<TrendingUp className="inline h-3 w-3 mr-1" />
								+5.2% so với kỳ trước
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Khóa luận</CardTitle>
							<BookOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{overviewStats.totalTheses}</div>
							<p className="text-xs text-muted-foreground">
								<TrendingUp className="inline h-3 w-3 mr-1" />
								+12.5% so với kỳ trước
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Thực tập</CardTitle>
							<Briefcase className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{overviewStats.totalInternships}</div>
							<p className="text-xs text-muted-foreground">
								<TrendingUp className="inline h-3 w-3 mr-1" />
								+8.7% so với kỳ trước
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Điểm TB khóa luận</CardTitle>
							<Award className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{overviewStats.avgThesisGrade}</div>
							<p className="text-xs text-muted-foreground">
								<TrendingUp className="inline h-3 w-3 mr-1" />
								+0.3 điểm so với kỳ trước
							</p>
						</CardContent>
					</Card>
					
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Dự án đang thực hiện</CardTitle>
							<Activity className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{overviewStats.activeProjects}</div>
							<p className="text-xs text-muted-foreground">
								<Clock className="inline h-3 w-3 mr-1" />
								{overviewStats.pendingApprovals} chờ phê duyệt
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content Tabs */}
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Tổng quan</TabsTrigger>
						<TabsTrigger value="departments">Theo bộ môn</TabsTrigger>
						<TabsTrigger value="supervisors">Giảng viên</TabsTrigger>
						<TabsTrigger value="companies">Doanh nghiệp</TabsTrigger>
						<TabsTrigger value="trends">Xu hướng</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							{/* Monthly Progress Chart */}
							<Card>
								<CardHeader>
									<CardTitle>Tiến độ theo tháng</CardTitle>
									<CardDescription>Số lượng dự án mới và hoàn thành</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{monthlyData.map((data, index) => (
											<div key={index} className="space-y-2">
												<div className="flex items-center justify-between text-sm">
													<span>{data.month}</span>
													<span className="text-muted-foreground">
														{data.theses + data.internships} dự án
													</span>
												</div>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
														<span className="text-xs">Khóa luận: {data.theses}</span>
													</div>
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														<span className="text-xs">Thực tập: {data.internships}</span>
													</div>
													<div className="flex items-center gap-2">
														<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
														<span className="text-xs">Hoàn thành: {data.completed}</span>
													</div>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div 
														className="bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 h-2 rounded-full" 
														style={{ width: `${(data.completed / 50) * 100}%` }}
													></div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Recent Activities */}
							<Card>
								<CardHeader>
									<CardTitle>Hoạt động gần đây</CardTitle>
									<CardDescription>Các sự kiện và cập nhật mới nhất</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{recentActivities.map((activity, index) => (
											<div key={index} className="flex items-start space-x-3">
												<div className="flex-shrink-0 mt-0.5">
													{getActivityIcon(activity.type)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-900">
														{activity.message}
													</p>
													<div className="flex items-center space-x-2 text-xs text-gray-500">
														<span>{activity.user}</span>
														<span>•</span>
														<span>{activity.time}</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Completion Status */}
						<div className="grid gap-4 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Tỷ lệ hoàn thành khóa luận</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm">Hoàn thành</span>
											<span className="text-sm font-medium">
												{Math.round((overviewStats.completedTheses / overviewStats.totalTheses) * 100)}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div 
												className="bg-blue-600 h-2 rounded-full" 
												style={{ width: `${(overviewStats.completedTheses / overviewStats.totalTheses) * 100}%` }}
											></div>
										</div>
										<p className="text-xs text-muted-foreground">
											{overviewStats.completedTheses}/{overviewStats.totalTheses} khóa luận
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Tỷ lệ hoàn thành thực tập</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm">Hoàn thành</span>
											<span className="text-sm font-medium">
												{Math.round((overviewStats.completedInternships / overviewStats.totalInternships) * 100)}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div 
												className="bg-green-600 h-2 rounded-full" 
												style={{ width: `${(overviewStats.completedInternships / overviewStats.totalInternships) * 100}%` }}
											></div>
										</div>
										<p className="text-xs text-muted-foreground">
											{overviewStats.completedInternships}/{overviewStats.totalInternships} thực tập
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Hiệu suất tổng thể</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm">Điểm trung bình</span>
											<span className="text-sm font-medium">8.35</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div className="bg-purple-600 h-2 rounded-full" style={{ width: '83.5%' }}></div>
										</div>
										<p className="text-xs text-muted-foreground">
											Tăng 0.25 điểm so với kỳ trước
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Departments Tab */}
					<TabsContent value="departments" className="space-y-4">
						<div className="grid gap-4">
							{departmentStats.map((dept, index) => (
								<Card key={index}>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between">
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">{dept.name}</h3>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span>{dept.students} sinh viên</span>
													<span>{dept.theses} khóa luận</span>
													<span>{dept.internships} thực tập</span>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold">{dept.theses + dept.internships}</div>
												<p className="text-xs text-muted-foreground">Tổng dự án</p>
											</div>
										</div>
										<div className="mt-4 space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span>Khóa luận</span>
												<span>{Math.round((dept.theses / (dept.theses + dept.internships)) * 100)}%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className={`${dept.color} h-2 rounded-full`}
													style={{ width: `${(dept.theses / (dept.theses + dept.internships)) * 100}%` }}
												></div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Supervisors Tab */}
					<TabsContent value="supervisors" className="space-y-4">
						<div className="grid gap-4">
							{supervisorPerformance.map((supervisor, index) => (
								<Card key={index}>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between">
											<div className="space-y-2">
												<div className="flex items-center space-x-2">
													<h3 className="text-lg font-semibold">{supervisor.name}</h3>
													<Badge variant="secondary">{supervisor.department}</Badge>
												</div>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span>{supervisor.theses} khóa luận</span>
													<span>Điểm TB: {supervisor.avgGrade}</span>
													<span className={getCompletionRateColor(supervisor.completionRate)}>
														Tỷ lệ HT: {supervisor.completionRate}%
													</span>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold">{supervisor.avgGrade}</div>
												<p className="text-xs text-muted-foreground">Điểm trung bình</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Companies Tab */}
					<TabsContent value="companies" className="space-y-4">
						<div className="grid gap-4">
							{companyStats.map((company, index) => (
								<Card key={index}>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between">
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">{company.name}</h3>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span>{company.students} sinh viên</span>
													<span>{company.positions} vị trí</span>
													<span>Đánh giá: {company.avgRating}⭐</span>
													<span className={getCompletionRateColor(company.completionRate)}>
														Hoàn thành: {company.completionRate}%
													</span>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold">{company.avgRating}</div>
												<p className="text-xs text-muted-foreground">Điểm đánh giá</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Trends Tab */}
					<TabsContent value="trends" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Xu hướng tăng trưởng</CardTitle>
									<CardDescription>So sánh với các kỳ học trước</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm">Số lượng khóa luận</span>
											<div className="flex items-center space-x-2">
												<TrendingUp className="h-4 w-4 text-green-600" />
												<span className="text-sm font-medium text-green-600">+12.5%</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Số lượng thực tập</span>
											<div className="flex items-center space-x-2">
												<TrendingUp className="h-4 w-4 text-green-600" />
												<span className="text-sm font-medium text-green-600">+8.7%</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Điểm trung bình</span>
											<div className="flex items-center space-x-2">
												<TrendingUp className="h-4 w-4 text-green-600" />
												<span className="text-sm font-medium text-green-600">+3.6%</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Tỷ lệ hoàn thành</span>
											<div className="flex items-center space-x-2">
												<TrendingDown className="h-4 w-4 text-red-600" />
												<span className="text-sm font-medium text-red-600">-2.1%</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Dự báo kỳ tới</CardTitle>
									<CardDescription>Ước tính dựa trên xu hướng hiện tại</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm">Khóa luận dự kiến</span>
											<span className="text-sm font-medium">175 dự án</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Thực tập dự kiến</span>
											<span className="text-sm font-medium">97 dự án</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Sinh viên tham gia</span>
											<span className="text-sm font-medium">1,310 sinh viên</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Đối tác mới</span>
											<span className="text-sm font-medium">3-5 công ty</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</PageHeader>
	)
} 