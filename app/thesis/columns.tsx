'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Thesis } from '@/modules/thesis/types'
import { Edit, Trash2, Eye } from 'lucide-react'

type GetColumnsOptions = {
	onEdit: (thesis: Thesis) => void
	onDelete: (thesis: Thesis) => void
	onView: (thesis: Thesis) => void
}

export const getColumns = ({ onEdit, onDelete, onView }: GetColumnsOptions): ColumnDef<Thesis>[] => {
	console.log('getColumns called with options:', { onEdit, onDelete, onView })
	
	return [
	{
		accessorKey: 'title',
		header: ({ column }) => renderSortableHeader(column, 'Tên đề tài'),
        cell: ({ row }) => {
            return <p className="font-medium max-w-xs truncate">{row.original.title}</p>
        }
	},
    {
		accessorFn: row => {
			console.log('Student accessor - row:', row)
			return row.student?.fullName || 'N/A'
		},
		id: 'studentFullName',
		header: ({ column }) => renderSortableHeader(column, 'Sinh viên'),
	},
	{
		accessorFn: row => row.student?.studentCode || 'N/A',
		id: 'studentCode',
		header: ({ column }) => renderSortableHeader(column, 'Mã SV'),
	},
	{
		accessorFn: row => row.academicYear?.name || 'N/A',
		id: 'academicYearName',
		header: ({ column }) => renderSortableHeader(column, 'Niên khóa'),
	},
	{
		accessorFn: row => row.semester?.name || 'N/A',
		id: 'semesterName',
		header: ({ column }) => renderSortableHeader(column, 'Học kỳ'),
	},
	{
		accessorKey: 'submissionDate',
		header: ({ column }) => renderSortableHeader(column, 'Hạn nộp'),
		cell: ({ row }) => {
			const date = new Date(row.original.submissionDate)
			// Check if date is valid
			if (isNaN(date.getTime())) {
				return 'Không hợp lệ'
			}
			return date.toLocaleDateString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
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
			]		),
	},
] 
}