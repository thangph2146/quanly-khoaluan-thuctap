'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Internship } from '@/modules/internship/types'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye } from 'lucide-react'

export const columns: ColumnDef<Internship>[] = [
    {
		accessorKey: 'student.fullName',
		header: ({ column }) => renderSortableHeader(column, 'Sinh viên'),
	},
	{
		accessorKey: 'student.studentCode',
		header: ({ column }) => renderSortableHeader(column, 'Mã SV'),
	},
    {
		accessorKey: 'partner.name',
		header: ({ column }) => renderSortableHeader(column, 'Doanh nghiệp'),
	},
	{
		accessorKey: 'academicYear.name',
		header: ({ column }) => renderSortableHeader(column, 'Niên khóa'),
	},
	{
		accessorKey: 'semester.name',
		header: ({ column }) => renderSortableHeader(column, 'Học kỳ'),
	},
	{
		accessorKey: 'grade',
		header: ({ column }) => renderSortableHeader(column, 'Điểm'),
		cell: ({ row }) => {
			const grade = row.original.grade
			if (grade === null || grade === undefined) {
				return <span className="text-muted-foreground">Chưa có</span>
			}
			return (
				<Badge variant={grade >= 8 ? 'default' : grade >= 6.5 ? 'secondary' : 'destructive'}>
					{grade.toFixed(1)}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'reportUrl',
		header: ({ column }) => renderSortableHeader(column, 'Báo cáo'),
		cell: ({ row }) => {
			const reportUrl = row.original.reportUrl
			if (!reportUrl) {
				return <span className="text-muted-foreground">Chưa nộp</span>
			}
			return (
				<Badge variant="outline">
					Đã nộp
				</Badge>
			)
		},
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
                {
					label: 'Xem chi tiết',
					icon: Eye,
					onClick: (rowData) => console.log('View:', rowData),
				},
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => console.log('Edit:', rowData),
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: (rowData) => console.log('Delete:', rowData),
					variant: 'destructive',
				},
			]),
	},
] 