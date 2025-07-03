'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { AcademicYear } from '@/modules/academic/types'
import { Eye, Edit, Trash2 } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AcademicYear>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => renderSortableHeader(column, 'Tên niên khóa'),
	},
	{
		accessorKey: 'startDate',
		header: ({ column }) => renderSortableHeader(column, 'Ngày bắt đầu'),
		cell: ({ row }) => {
			return new Date(row.original.startDate).toLocaleDateString('vi-VN')
		},
	},
	{
		accessorKey: 'endDate',
		header: ({ column }) => renderSortableHeader(column, 'Ngày kết thúc'),
		cell: ({ row }) => {
			return new Date(row.original.endDate).toLocaleDateString('vi-VN')
		},
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
				{
					label: 'Xem chi tiết',
					icon: Eye,
					onClick: () => {}, // Will be handled by parent component
				},
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: () => {}, // Will be handled by parent component
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: () => {}, // Will be handled by parent component
					variant: 'destructive',
				},
			]),
	},
] 