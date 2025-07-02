'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Thesis } from '@/modules/thesis/types'
import { Edit, Trash2, Eye } from 'lucide-react'

export const columns: ColumnDef<Thesis>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => renderSortableHeader(column, 'Tên đề tài'),
        cell: ({ row }) => {
            return <p className="font-medium max-w-xs truncate">{row.original.title}</p>
        }
	},
    {
		accessorKey: 'student.fullName',
		header: ({ column }) => renderSortableHeader(column, 'Sinh viên'),
	},
	{
		accessorKey: 'student.studentCode',
		header: ({ column }) => renderSortableHeader(column, 'Mã SV'),
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
		accessorKey: 'submissionDate',
		header: ({ column }) => renderSortableHeader(column, 'Hạn nộp'),
		cell: ({ row }) => {
			return new Date(row.original.submissionDate).toLocaleDateString('vi-VN')
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