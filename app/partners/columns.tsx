'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Partner } from '@/modules/partners/types'
import { Edit, Trash2 } from 'lucide-react'

export const columns: ColumnDef<Partner>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => renderSortableHeader(column, 'Tên doanh nghiệp'),
	},
	{
		accessorKey: 'email',
		header: ({ column }) => renderSortableHeader(column, 'Email'),
	},
    {
		accessorKey: 'phoneNumber',
		header: ({ column }) => renderSortableHeader(column, 'Số điện thoại'),
	},
    {
		accessorKey: 'address',
		header: ({ column }) => renderSortableHeader(column, 'Địa chỉ'),
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