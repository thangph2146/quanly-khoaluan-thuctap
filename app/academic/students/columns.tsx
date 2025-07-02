'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Student } from '@/modules/academic/types'
import { Edit, Trash2 } from 'lucide-react'

export const columns: ColumnDef<Student>[] = [
	{
		accessorKey: 'fullName',
		header: ({ column }) => renderSortableHeader(column, 'Họ và tên'),
	},
	{
		accessorKey: 'studentCode',
		header: ({ column }) => renderSortableHeader(column, 'MSSV'),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => renderSortableHeader(column, 'Email'),
	},
    {
		accessorKey: 'phoneNumber',
		header: 'Số điện thoại',
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => {
						console.log('Edit:', rowData)
					},
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: (rowData) => {
						console.log('Delete:', rowData)
					},
					variant: 'destructive',
				},
			]),
	},
] 