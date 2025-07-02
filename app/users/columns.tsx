'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { User } from '@/modules/users/types'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Trash2 } from 'lucide-react'

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => renderSortableHeader(column, 'Người dùng'),
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </div>
            )
        }
	},
    {
		accessorKey: 'userRoles',
		header: ({ column }) => renderSortableHeader(column, 'Vai trò'),
        cell: ({ row }) => {
            const roles = row.original.userRoles?.map(ur => ur.role.name).join(', ')
            return <Badge variant="outline">{roles || 'N/A'}</Badge>
        }
	},
	{
		accessorKey: 'isActive',
		header: ({ column }) => renderSortableHeader(column, 'Trạng thái'),
        cell: ({ row }) => {
            const isActive = row.original.isActive
            return (
                <Badge className={isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
            )
        }
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => renderSortableHeader(column, 'Ngày tham gia'),
		cell: ({ row }) => {
			return new Date(row.original.createdAt).toLocaleDateString('vi-VN')
		},
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => console.log('Edit:', rowData)
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