'use client'

import { type ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/common/page-header"
import { StatisticsCard } from "@/components/common/statistics-card"
import {
	DataTable,
	renderSortableHeader,
} from "@/components/common/data-table"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
	BookOpen, 
	Plus, 
	Edit,
	Eye,
	Trash2,
	CheckCircle,
	Clock,
	AlertCircle,
	XCircle,
	MoreHorizontal
} from "lucide-react"
import { thesisData } from "@/modules/thesis/data"
import { Thesis, ThesisStatus } from "@/modules/thesis/types"
import { StatusType } from "@/modules/common/types"
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ThesisPage() {
	const router = useRouter()
	const breadcrumbs = [
		{ label: "Hệ thống Quản lý", href: "/dashboard" },
		{ label: "Quản lý Khóa luận" }
	]

	const columns: ColumnDef<Thesis>[] = [
		{
			accessorKey: "id",
			header: ({ column }) => renderSortableHeader(column, "Mã KL"),
		},
		{
			accessorKey: "title",
			header: "Tên khóa luận",
			cell: ({ row }) => {
				const thesis = row.original
				return (
					<div className="max-w-[350px]">
						<p className="font-medium truncate">{thesis.title}</p>
						<p className="text-sm text-muted-foreground">
							Học kỳ {thesis.semester}
						</p>
					</div>
				)
			},
		},
		{
			accessorKey: "student",
			header: "Sinh viên",
			cell: ({ row }) => {
				const thesis = row.original
				return (
					<div>
						<p className="font-medium">{thesis.student}</p>
						<p className="text-sm text-muted-foreground">
							{thesis.studentId}
						</p>
					</div>
				)
			},
		},
		{
			accessorKey: "supervisor",
			header: "Giảng viên HD",
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => {
				const status = row.getValue("status") as ThesisStatus
				return <StatusBadge status={status as StatusType} />
			},
		},
		{
			accessorKey: "progress",
			header: "Tiến độ",
			cell: ({ row }) => {
				const progress = row.getValue("progress") as number
				return (
					<div className="flex items-center gap-2 min-w-[120px]">
						<Progress value={progress} className="h-2 w-full" />
						<span className="text-xs font-medium text-muted-foreground">
							{progress}%
						</span>
					</div>
				)
			},
		},
		{
			accessorKey: "deadline",
			header: ({ column }) => renderSortableHeader(column, "Hạn nộp"),
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Mở menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => router.push(`/thesis/${row.original.id}`)}
						>
							<Eye className="mr-2 h-4 w-4" />
							Xem chi tiết
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								router.push(`/thesis/${row.original.id}/edit`)
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
										Hành động này không thể được hoàn tác. Dữ liệu khóa
										luận sẽ bị xóa vĩnh viễn.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Hủy</AlertDialogCancel>
									<AlertDialogAction
										onClick={() =>
											console.log(`Deleting thesis ${row.original.id}`)
										}
									>
										Tiếp tục
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	]

	return (
		<PageHeader
			title="Quản lý Khóa luận"
			description="Quản lý toàn bộ khóa luận sinh viên trong hệ thống"
			breadcrumbs={breadcrumbs}
			actions={
				<Button onClick={() => router.push('/thesis/new')}>
					<Plus className="mr-2 h-4 w-4" />
					Thêm khóa luận mới
				</Button>
			}
		>
			<div className="space-y-4">
				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<StatisticsCard title="Tổng số" value={156} icon={BookOpen} description="khóa luận" />
					<StatisticsCard title="Đang thực hiện" value={89} icon={Clock} description="57% tổng số" variant="success" />
					<StatisticsCard title="Chờ bảo vệ" value={34} icon={AlertCircle} description="22% tổng số" variant="warning" />
					<StatisticsCard title="Hoàn thành" value={28} icon={CheckCircle} description="18% tổng số" />
					<StatisticsCard title="Quá hạn" value={5} icon={XCircle} description="3% tổng số" variant="error" />
				</div>
				
				{/* Data Table */}
				<DataTable
					columns={columns}
					data={thesisData}
					searchableColumn="title"
					searchPlaceholder="Tìm kiếm theo tên KL, SV..."
				/>
			</div>
		</PageHeader>
	)
} 