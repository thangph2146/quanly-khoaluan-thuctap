'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
	Users,
	UserPlus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	ShieldCheck,
	UserCheck,
	UserX,
} from 'lucide-react'
import { users } from '@/modules/users/data'
import { getRoleText, getStatusVariant } from '@/modules/users/utils'
import { User } from '@/modules/users/types'
import { DataTable } from '@/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader } from '@/components/common'
import { useRouter } from 'next/navigation'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function UsersPage() {
	const router = useRouter()
	const columns: ColumnDef<User>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value: boolean | 'indeterminate') =>
						table.toggleAllPageRowsSelected(!!value)
					}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value: boolean | 'indeterminate') =>
						row.toggleSelected(!!value)
					}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'name',
			header: 'Người dùng',
			cell: ({ row }) => {
				const user = row.original
				return (
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="grid gap-0.5">
							<span className="font-medium">{user.name}</span>
							<span className="text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
					</div>
				)
			},
		},
		{
			accessorKey: 'role',
			header: 'Vai trò',
			cell: ({ row }) => {
				const role = row.getValue('role') as User['role']
				return <Badge variant="outline">{getRoleText(role)}</Badge>
			},
		},
		{
			accessorKey: 'status',
			header: 'Trạng thái',
			cell: ({ row }) => {
				const status = row.getValue('status') as User['status']
				return <Badge variant={getStatusVariant(status)}>{status}</Badge>
			},
		},
		{
			accessorKey: 'department',
			header: 'Khoa/Phòng ban',
		},
		{
			accessorKey: 'lastLogin',
			header: 'Lần cuối truy cập',
			cell: ({ row }) => {
				const date = new Date(row.getValue('lastLogin'))
				return <div>{date.toLocaleString('vi-VN')}</div>
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Hành động</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => router.push(`/users/${user.id}`)}
							>
								<Eye className="mr-2 h-4 w-4" />
								Xem chi tiết
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => router.push(`/users/${user.id}/edit`)}
							>
								<Edit className="mr-2 h-4 w-4" />
								Chỉnh sửa
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<UserCheck className="mr-2 h-4 w-4" />
								Kích hoạt
							</DropdownMenuItem>
							<DropdownMenuItem>
								<UserX className="mr-2 h-4 w-4" />
								Vô hiệu hóa
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem
										onSelect={e => e.preventDefault()}
										className="text-red-600"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Xóa
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Bạn có chắc chắn muốn xóa?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Hành động này không thể được hoàn tác. Dữ liệu
											của người dùng sẽ bị xóa vĩnh viễn.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Hủy</AlertDialogCancel>
										<AlertDialogAction
											onClick={() =>
												console.log(`Deleting user ${user.id}`)
											}
										>
											Tiếp tục
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]

	const totalUsers = users.length
	const totalLecturers = users.filter(u => u.role === 'LECTURER').length
	const totalStudents = users.filter(u => u.role === 'STUDENT').length
	const totalAdmins = users.filter(u => u.role === 'ADMIN').length

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Người dùng' },
	]

	return (
		<PageHeader
			title="Quản lý Người dùng"
			description="Quản lý sinh viên, giảng viên và quản trị viên hệ thống"
			breadcrumbs={breadcrumbs}
			actions={
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Thêm người dùng
				</Button>
			}
		>
			<div className="space-y-4">
				{/* Summary Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng số</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalUsers}</div>
							<p className="text-xs text-muted-foreground">
								Người dùng trong hệ thống
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Giảng viên
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalLecturers}</div>
							<p className="text-xs text-muted-foreground">
								Tài khoản giảng viên
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Sinh viên</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalStudents}</div>
							<p className="text-xs text-muted-foreground">
								Tài khoản sinh viên
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Quản trị viên
							</CardTitle>
							<ShieldCheck className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalAdmins}</div>
							<p className="text-xs text-muted-foreground">
								Tài khoản quản trị
							</p>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Danh sách người dùng</CardTitle>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={users} />
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 