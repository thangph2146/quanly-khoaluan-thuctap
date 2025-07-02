'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Internship } from '@/modules/internship/types'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye } from 'lucide-react'

type GetColumnsOptions = {
	onEdit: (internship: Internship) => void
	onDelete: (internship: Internship) => void
	onView: (internship: Internship) => void
}

export const getColumns = ({ onEdit, onDelete, onView }: GetColumnsOptions): ColumnDef<Internship>[] => [
    {
		accessorFn: row => row.student.fullName,
		id: 'studentFullName',
		header: ({ column }) => renderSortableHeader(column, 'Sinh viên'),
	},
	{
		accessorFn: row => row.student.studentCode,
		id: 'studentStudentCode',
		header: ({ column }) => renderSortableHeader(column, 'Mã SV'),
	},
    {
		accessorFn: row => row.partner.name,
		id: 'partnerName',
		header: ({ column }) => renderSortableHeader(column, 'Doanh nghiệp'),
	},
	{
		accessorFn: row => row.academicYear.name,
		id: 'academicYearName',
		header: ({ column }) => renderSortableHeader(column, 'Niên khóa'),
	},
	{
		accessorFn: row => row.semester.name,
		id: 'semesterName',
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
					onClick: onView,
				},
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: onEdit,
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: onDelete,
					variant: 'destructive',
				},
			]),
	},
] 