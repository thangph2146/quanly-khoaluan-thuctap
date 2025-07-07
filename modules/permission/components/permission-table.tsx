/**
 * Permission Table Component
 * Table view for displaying permissions
 */
import React from 'react'
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getModuleColor } from '../utils/formatting'
import type { Permission } from '../types'

interface PermissionTableProps {
	permissions: Permission[]
	onEdit: (permission: Permission) => void
	onDelete: (permission: Permission) => void
	onView: (permission: Permission) => void
	sortBy: 'name' | 'module'
	sortOrder: 'asc' | 'desc'
	onSort: (field: string) => void
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
	permissions,
	onEdit,
	onDelete,
	onView,
	sortBy,
	sortOrder,
	onSort,
}) => {
	const getSortIcon = (field: string) => {
		if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />
		return sortOrder === 'asc' ? '↑' : '↓'
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Danh sách Permissions</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]">STT</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => onSort('name')}
										className="h-auto p-0 font-semibold"
									>
										Tên Permission
										{getSortIcon('name')}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => onSort('module')}
										className="h-auto p-0 font-semibold"
									>
										Module
										{getSortIcon('module')}
									</Button>
								</TableHead>
								<TableHead>Mô tả</TableHead>
								<TableHead className="text-right">Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{permissions.map((permission, index) => (
								<TableRow key={permission.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>
										<div className="font-medium">{permission.name}</div>
									</TableCell>
									<TableCell>
										<Badge className={getModuleColor(permission.module)}>
											{permission.module}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="max-w-[200px] truncate">
											{permission.description || 'Không có mô tả'}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Mở menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Hành động</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => onView(permission)}>
													<Eye className="mr-2 h-4 w-4" />
													Xem chi tiết
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => onEdit(permission)}>
													<Edit className="mr-2 h-4 w-4" />
													Chỉnh sửa
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => onDelete(permission)}
													className="text-red-600"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Xóa
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
