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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
	Search,
	Users,
	UserCheck,
	Clock,
	Calendar,
	Eye,
	Edit,
} from 'lucide-react'
import { internshipData } from '@/modules/internship/data'
import { getInternshipStatusVariant } from '@/modules/internship/utils'
import { Internship } from '@/modules/internship/types'

export default function ActiveInternshipsPage() {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredInternships = internshipData.filter(
		internship =>
			internship.student.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			internship.student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			internship.company.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const stats = {
		total: internshipData.length,
		completed: internshipData.filter(i => i.status === 'COMPLETED').length,
		inProgress: internshipData.filter(i => i.status === 'IN_PROGRESS').length,
	}

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
								<BreadcrumbLink href="/internship">Thực tập</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Danh sách thực tập</BreadcrumbPage>
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
								Danh sách Thực tập
							</h1>
							<p className="text-muted-foreground">
								Theo dõi và quản lý các kỳ thực tập đang diễn ra của sinh
								viên.
							</p>
						</div>
						<Button>Đăng ký thực tập mới</Button>
					</div>

					{/* Search and Stats */}
					<div className="flex items-center justify-between">
						<div className="flex-1 relative max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Tìm kiếm sinh viên, công ty..."
								className="pl-10"
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center text-sm">
								<Users className="h-5 w-5 mr-2 text-blue-500" />
								<span>Tổng số: {stats.total} SV</span>
							</div>
							<div className="flex items-center text-sm">
								<UserCheck className="h-5 w-5 mr-2 text-green-500" />
								<span>Hoàn thành: {stats.completed} SV</span>
							</div>
							<div className="flex items-center text-sm">
								<Clock className="h-5 w-5 mr-2 text-yellow-500" />
								<span>Đang thực tập: {stats.inProgress} SV</span>
							</div>
						</div>
					</div>
				</div>

				{/* Internships Table */}
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Sinh viên</TableHead>
									<TableHead>Công ty thực tập</TableHead>
									<TableHead>Giáo viên hướng dẫn</TableHead>
									<TableHead>Thời gian</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead>Hành động</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredInternships.map((internship: Internship) => (
									<TableRow key={internship.id}>
										<TableCell>
											<div className="font-medium">
												{internship.student.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{internship.student.id}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">
												{internship.company.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{internship.company.address}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">
												{internship.supervisor.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{internship.supervisor.email}
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center">
												<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
												<span>
													{internship.startDate} - {internship.endDate}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={getInternshipStatusVariant(
													internship.status
												)}
											>
												{internship.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex space-x-2">
												<Button variant="outline" size="sm">
													<Eye className="h-4 w-4" />
												</Button>
												<Button variant="outline" size="sm">
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
			</div>
		</>
	)
} 