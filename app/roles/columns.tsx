'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Role } from '@/modules/roles/types'
import { getRoleDisplayName, getRoleColor } from '@/modules/roles/utils'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Users } from 'lucide-react'

export const columns: ColumnDef<Role>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => renderSortableHeader(column, 'Tên vai trò'),
		cell: ({ row }) => {
			const role = row.original
			return (
				<Badge variant="outline" className={getRoleColor(role.name)}>
					{getRoleDisplayName(role.name)}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'description',
		header: ({ column }) => renderSortableHeader(column, 'Mô tả'),
		cell: ({ row }) => {
			const description = row.original.description
			return (
				<div className="max-w-[300px]">
					<p className="text-sm text-muted-foreground line-clamp-2">
						{description || 'Chưa có mô tả'}
					</p>
				</div>
			)
		},
	},
	{
		id: 'userCount',
		header: 'Số lượng người dùng',
		cell: ({ row }) => {
			const userCount = row.original.userRoles?.length || 0
			return (
				<div className="flex items-center space-x-2">
					<Users className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm font-medium">{userCount}</span>
				</div>
			)
		},
	},
	{
		id: 'actions',
		header: 'Thao tác',
		cell: ({ row }) =>
			renderActionsCell(row, [
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => {
						// This will be handled by the parent component
						console.log('Edit role:', rowData)
					},
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: (rowData) => {
						// This will be handled by the parent component
						console.log('Delete role:', rowData)
					},
					variant: 'destructive',
				},
			]),
	},
] 