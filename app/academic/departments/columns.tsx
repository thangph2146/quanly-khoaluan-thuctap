'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Department } from '@/modules/academic/types'
import { Edit, Trash2 } from 'lucide-react'

export const columns: ColumnDef<Department>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => renderSortableHeader(column, 'Tên Khoa/Chuyên ngành'),
	},
	{
		accessorKey: 'code',
		header: ({ column }) => renderSortableHeader(column, 'Mã'),
	},
	{
		accessorKey: 'parentDepartment.name',
		header: ({ column }) => renderSortableHeader(column, 'Đơn vị cha'),
        cell: ({ row }) => row.original.parentDepartment?.name || 'N/A',
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => {
						// Placeholder for edit logic
						console.log('Edit:', rowData)
					},
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: (rowData) => {
						// Placeholder for delete logic
						console.log('Delete:', rowData)
					},
					variant: 'destructive',
				},
			]),
	},
] 