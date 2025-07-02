'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
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
	MoreHorizontal,
	Edit,
	Eye,
	Trash2,
	CheckCircle,
	Clock,
	XCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { internshipsData } from '@/modules/internship/data'
import { getStatusBadge, renderStars } from '@/modules/internship/utils'
import { useRouter } from 'next/navigation'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function InternshipPage() {
	const router = useRouter()

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
				<Button onClick={() => router.push('/internship/new')}>
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
								Hoàn thành
							</CardTitle>
							<CheckCircle className="h-4 w-4 text-emerald-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-emerald-600">15</div>
							<p className="text-xs text-muted-foreground">17% tổng số</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Chờ đánh giá
							</CardTitle>
							<Clock className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">5</div>
							<p className="text-xs text-muted-foreground">5% tổng số</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
							<XCircle className="h-4 w-4 text-red-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">2</div>
							<p className="text-xs text-muted-foreground">3% tổng số</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Danh sách Thực tập</CardTitle>
						<CardDescription>
							Dưới đây là danh sách các đợt thực tập của sinh viên.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tên công việc</TableHead>
									<TableHead>Sinh viên</TableHead>
									<TableHead>Công ty</TableHead>
									<TableHead>Trạng thái</TableHead>
									<TableHead>Đánh giá</TableHead>
									<TableHead>
										<span className="sr-only">Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{internshipsData.map(internship => (
									<TableRow key={internship.id}>
										<TableCell className="font-medium">
											<div className="font-medium">{internship.title}</div>
											<div className="text-sm text-muted-foreground">
												{internship.position}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium">{internship.student}</div>
											<div className="text-sm text-muted-foreground">
												{internship.studentId}
											</div>
										</TableCell>
										<TableCell>{internship.company}</TableCell>
										<TableCell>
											{getStatusBadge(internship.status)}
										</TableCell>
										<TableCell>
											<div className="flex items-center">
												{renderStars(internship.rating)}
											</div>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														aria-haspopup="true"
														size="icon"
														variant="ghost"
													>
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">Toggle menu</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() =>
															router.push(
																`/internship/${internship.id}`,
															)
														}
													>
														<Eye className="mr-2 h-4 w-4" />
														Xem chi tiết
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															router.push(
																`/internship/${internship.id}/edit`,
															)
														}
													>
														<Edit className="mr-2 h-4 w-4" />
														Chỉnh sửa
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<DropdownMenuItem
																onSelect={e => e.preventDefault()}
																className="text-red-600"
															>
																<Trash2 className="mr-2 h-4 w-4" />
																Xóa
															</DropdownMenuItem>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Bạn có chắc chắn muốn xóa?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Hành động này không thể được hoàn
																	tác. Dữ liệu thực tập sẽ bị xóa
																	vĩnh viễn.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Hủy</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		console.log(
																			`Deleting internship ${internship.id}`,
																		)
																	}
																>
																	Tiếp tục
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 