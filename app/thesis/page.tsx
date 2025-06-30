'use client'

import { type ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/common/page-header"
import { StatisticsCard } from "@/components/common/statistics-card"
import {
	DataTable,
	renderSortableHeader,
	renderActionsCell,
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
	XCircle
} from "lucide-react"
import { thesesData, statusMap } from "@/modules/thesis/data"
import { Thesis, ThesisStatus } from "@/modules/thesis/types"

export default function ThesisPage() {
	const breadcrumbs = [
		{ label: "Hệ thống Quản lý", href: "/dashboard" },
		{ label: "Quản lý Khóa luận" }
	]

	const tableActions = [
		{
			label: "Xem chi tiết",
			icon: Eye,
			onClick: (row: Thesis) => console.log('view', row.id),
		},
		{
			label: "Chỉnh sửa",
			icon: Edit,
			onClick: (row: Thesis) => console.log('edit', row.id),
		},
		{
			label: "Xóa",
			icon: Trash2,
			onClick: (row: Thesis) => console.log('delete', row.id),
			variant: 'destructive' as const,
		},
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
				return <StatusBadge status={statusMap[status] ?? "inactive"} />
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
			id: "actions",
			cell: ({ row }) => renderActionsCell(row, tableActions),
		},
	]

	return (
		<PageHeader
			title="Quản lý Khóa luận"
			description="Quản lý toàn bộ khóa luận sinh viên trong hệ thống"
			breadcrumbs={breadcrumbs}
			actions={
				<Button>
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
					data={thesesData}
					searchableColumn="title"
					searchPlaceholder="Tìm kiếm theo tên KL, SV..."
				/>
			</div>
		</PageHeader>
	)
} 