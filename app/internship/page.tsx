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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Building2,
	Plus,
	Search,
	Filter,
	MoreHorizontal,
	Edit,
	Eye,
	Trash2,
	Download,
	User,
	Calendar,
	CheckCircle,
	Clock,
	AlertCircle,
	XCircle,
	MapPin,
	Star,
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data cho thực tập
const internshipsData = [
	{
		id: 'TT001',
		title: 'Thực tập phát triển Web tại FPT Software',
		student: 'Nguyễn Thị A',
		studentId: '20210001',
		company: 'FPT Software',
		position: 'Frontend Developer',
		supervisor: 'ThS. Trần Văn B',
		companySupervisor: 'Nguyễn Đức C',
		status: 'IN_PROGRESS',
		startDate: '2024-06-01',
		endDate: '2024-08-30',
		location: 'Hà Nội',
		salary: '5,000,000 VNĐ',
		rating: 4.5,
	},
	{
		id: 'TT002',
		title: 'Thực tập Data Science tại Viettel',
		student: 'Lê Văn D',
		studentId: '20210002',
		company: 'Viettel Digital',
		position: 'Data Analyst',
		supervisor: 'TS. Phạm Thị E',
		companySupervisor: 'Hoàng Văn F',
		status: 'COMPLETED',
		startDate: '2024-05-15',
		endDate: '2024-08-15',
		location: 'TP.HCM',
		salary: '6,000,000 VNĐ',
		rating: 5.0,
	},
	{
		id: 'TT003',
		title: 'Thực tập Mobile App tại VNG Corporation',
		student: 'Trần Thị G',
		studentId: '20210003',
		company: 'VNG Corporation',
		position: 'Mobile Developer',
		supervisor: 'ThS. Vũ Minh H',
		companySupervisor: 'Đỗ Thị I',
		status: 'PENDING_EVALUATION',
		startDate: '2024-06-15',
		endDate: '2024-09-15',
		location: 'TP.HCM',
		salary: '7,000,000 VNĐ',
		rating: 0,
	},
	{
		id: 'TT004',
		title: 'Thực tập DevOps tại TechComBank',
		student: 'Bùi Văn K',
		studentId: '20210004',
		company: 'Techcombank',
		position: 'DevOps Engineer',
		supervisor: 'TS. Ngô Thị L',
		companySupervisor: 'Phan Văn M',
		status: 'APPROVED',
		startDate: '2024-07-01',
		endDate: '2024-09-30',
		location: 'Hà Nội',
		salary: '8,000,000 VNĐ',
		rating: 0,
	},
	{
		id: 'TT005',
		title: 'Thực tập AI/ML tại VNPT Technology',
		student: 'Đinh Thị N',
		studentId: '20210005',
		company: 'VNPT Technology',
		position: 'AI Engineer',
		supervisor: 'PGS. Lê Văn O',
		companySupervisor: 'Trịnh Thị P',
		status: 'CANCELLED',
		startDate: '2024-06-01',
		endDate: '2024-08-31',
		location: 'Đà Nẵng',
		salary: '6,500,000 VNĐ',
		rating: 0,
	},
]

const getStatusBadge = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return (
				<Badge variant="outline" className="text-blue-600 border-blue-600">
					Đã phê duyệt
				</Badge>
			)
		case 'IN_PROGRESS':
			return (
				<Badge
					variant="outline"
					className="text-green-600 border-green-600"
				>
					Đang thực tập
				</Badge>
			)
		case 'PENDING_EVALUATION':
			return (
				<Badge
					variant="outline"
					className="text-yellow-600 border-yellow-600"
				>
					Chờ đánh giá
				</Badge>
			)
		case 'COMPLETED':
			return (
				<Badge
					variant="outline"
					className="text-emerald-600 border-emerald-600"
				>
					Hoàn thành
				</Badge>
			)
		case 'CANCELLED':
			return (
				<Badge variant="outline" className="text-red-600 border-red-600">
					Đã hủy
				</Badge>
			)
		default:
			return <Badge variant="outline">Không xác định</Badge>
	}
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return <CheckCircle className="h-4 w-4 text-blue-600" />
		case 'IN_PROGRESS':
			return <Clock className="h-4 w-4 text-green-600" />
		case 'PENDING_EVALUATION':
			return <AlertCircle className="h-4 w-4 text-yellow-600" />
		case 'COMPLETED':
			return <CheckCircle className="h-4 w-4 text-emerald-600" />
		case 'CANCELLED':
			return <XCircle className="h-4 w-4 text-red-600" />
		default:
			return <Clock className="h-4 w-4 text-gray-600" />
	}
}

const renderStars = (rating: number) => {
	return Array.from({ length: 5 }, (_, i) => (
		<Star
			key={i}
			className={`h-4 w-4 ${
				i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
			}`}
		/>
	))
}

export default function InternshipPage() {
	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Thực tập' },
	]

	return (
		<PageHeader
			title="Quản lý Thực tập"
			description="Quản lý toàn bộ chương trình thực tập sinh viên"
			breadcrumbs={breadcrumbs}
			actions={
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Đăng ký thực tập mới
				</Button>
			}
		>
			<div className="space-y-4">
				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng số</CardTitle>
							<Building2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">89</div>
							<p className="text-xs text-muted-foreground">thực tập</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Đang thực tập
							</CardTitle>
							<Clock className="h-4 w-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">67</div>
							<p className="text-xs text-muted-foreground">75% tổng số</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Chờ đánh giá
							</CardTitle>
							<AlertCircle className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">15</div>
							<p className="text-xs text-muted-foreground">17% tổng số</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
							<CheckCircle className="h-4 w-4 text-emerald-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-emerald-600">7</div>
							<p className="text-xs text-muted-foreground">8% tổng số</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Doanh nghiệp
							</CardTitle>
							<Building2 className="h-4 w-4 text-purple-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-600">24</div>
							<p className="text-xs text-muted-foreground">đối tác</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters and Search */}
				<Card>
					<CardHeader>
						<CardTitle>Danh sách Thực tập</CardTitle>
						<CardDescription>
							Quản lý và theo dõi tiến độ các chương trình thực tập
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2 mb-4">
							<div className="relative flex-1">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Tìm kiếm theo tên thực tập, sinh viên, công ty..."
									className="pl-8"
								/>
							</div>
							<Button variant="outline">
								<Filter className="mr-2 h-4 w-4" />
								Bộ lọc
							</Button>
							<Button variant="outline">
								<Download className="mr-2 h-4 w-4" />
								Xuất Excel
							</Button>
						</div>

						{/* Table */}
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Mã TT</TableHead>
										<TableHead>Thông tin thực tập</TableHead>
										<TableHead>Sinh viên</TableHead>
										<TableHead>Công ty</TableHead>
										<TableHead>Trạng thái</TableHead>
										<TableHead>Thời gian</TableHead>
										<TableHead>Đánh giá</TableHead>
										<TableHead className="text-right">Thao tác</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{internshipsData.map(internship => (
										<TableRow key={internship.id}>
											<TableCell className="font-medium">
												{internship.id}
											</TableCell>
											<TableCell>
												<div className="max-w-[300px]">
													<p className="font-medium truncate">
														{internship.title}
													</p>
													<p className="text-sm text-muted-foreground">
														{internship.position}
													</p>
													<div className="flex items-center space-x-1 mt-1">
														<MapPin className="h-3 w-3 text-muted-foreground" />
														<span className="text-xs text-muted-foreground">
															{internship.location}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<User className="h-4 w-4 text-muted-foreground" />
													<div>
														<p className="font-medium">{internship.student}</p>
														<p className="text-sm text-muted-foreground">
															{internship.studentId}
														</p>
														<p className="text-xs text-muted-foreground">
															HD: {internship.supervisor}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{internship.company}</p>
													<p className="text-sm text-muted-foreground">
														Mentor: {internship.companySupervisor}
													</p>
													<p className="text-xs text-green-600 font-medium">
														{internship.salary}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													{getStatusIcon(internship.status)}
													{getStatusBadge(internship.status)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<div>
														<p className="text-sm">{internship.startDate}</p>
														<p className="text-sm text-muted-foreground">
															đến {internship.endDate}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												{internship.rating > 0 ? (
													<div className="flex items-center space-x-1">
														<div className="flex">
															{renderStars(internship.rating)}
														</div>
														<span className="text-sm font-medium">
															{internship.rating}
														</span>
													</div>
												) : (
													<span className="text-sm text-muted-foreground">
														Chưa đánh giá
													</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<span className="sr-only">Mở menu</span>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Thao tác</DropdownMenuLabel>
														<DropdownMenuItem>
															<Eye className="mr-2 h-4 w-4" />
															Xem chi tiết
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="mr-2 h-4 w-4" />
															Chỉnh sửa
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Star className="mr-2 h-4 w-4" />
															Đánh giá
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="text-red-600">
															<Trash2 className="mr-2 h-4 w-4" />
															Xóa
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-sm text-muted-foreground">
								Hiển thị 1-5 trong tổng số 89 thực tập
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="outline" size="sm">
									Trước
								</Button>
								<Button variant="outline" size="sm">
									1
								</Button>
								<Button variant="outline" size="sm">
									2
								</Button>
								<Button variant="outline" size="sm">
									3
								</Button>
								<Button variant="outline" size="sm">
									Sau
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 