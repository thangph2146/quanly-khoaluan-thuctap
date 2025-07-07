'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Menu } from '@/modules/menu/types'
import { Edit, Trash2, Eye, FolderOpen, Link } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type GetColumnsOptions = {
	onEdit: (menu: Menu) => void
	onDelete: (menu: Menu) => void
	onView: (menu: Menu) => void
}

export const getColumns = ({ onEdit, onDelete, onView }: GetColumnsOptions): ColumnDef<Menu>[] => {
	return [
		{
			accessorKey: 'name',
			header: ({ column }) => renderSortableHeader(column, 'Tên Menu'),
			cell: ({ row }) => {
				const menu = row.original
				const hasChildren = menu.childMenus && menu.childMenus.length > 0
				
				return (
					<div className="flex items-center gap-2">
						{hasChildren ? (
							<FolderOpen className="h-4 w-4 text-blue-500" />
						) : (
							<Link className="h-4 w-4 text-gray-500" />
						)}
						<span className="font-medium">{menu.name}</span>
						{hasChildren && (
							<Badge variant="secondary" className="text-xs">
								{menu.childMenus?.length} items
							</Badge>
						)}
					</div>
				)
			}
		},
		{
			accessorKey: 'path',
			header: ({ column }) => renderSortableHeader(column, 'Đường dẫn'),
			cell: ({ row }) => {
				return (
					<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
						{row.original.path}
					</code>
				)
			}
		},
		{
			accessorKey: 'icon',
			header: ({ column }) => renderSortableHeader(column, 'Icon'),
			cell: ({ row }) => {
				const icon = row.original.icon
				return icon ? (
					<div className="flex items-center gap-2">
						<span className="text-sm">{icon}</span>
					</div>
				) : (
					<span className="text-gray-400 text-sm">Không có</span>
				)
			}
		},
		{
			accessorKey: 'displayOrder',
			header: ({ column }) => renderSortableHeader(column, 'Thứ tự'),
			cell: ({ row }) => {
				return (
					<Badge variant="outline" className="font-mono">
						{row.original.displayOrder}
					</Badge>
				)
			}
		},
		{
			accessorFn: row => row.parentId ? 'Submenu' : 'Menu chính',
			id: 'menuType',
			header: ({ column }) => renderSortableHeader(column, 'Loại'),
			cell: ({ row }) => {
				const isParent = !row.original.parentId
				return (
					<Badge variant={isParent ? 'default' : 'secondary'}>
						{isParent ? 'Menu chính' : 'Submenu'}
					</Badge>
				)
			}
		},
		{
			id: 'childrenCount',
			header: 'Menu con',
			cell: ({ row }) => {
				const childCount = row.original.childMenus?.length || 0
				return childCount > 0 ? (
					<Badge variant="outline">{childCount} menu con</Badge>
				) : (
					<span className="text-gray-400 text-sm">-</span>
				)
			}
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
}
