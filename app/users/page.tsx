'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import {
	createUser,
	deleteUser,
	getRoles,
	getUsers,
	updateUser,
} from '@/lib/api/users.api'
import { User, Role } from '@/modules/users/types'
import { useToast } from '@/components/ui/use-toast'

// Form Component
const UserForm = ({
	user,
	allRoles,
	onSave,
	onCancel,
}: {
	user?: User | null
	allRoles: Role[]
	onSave: (
		data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userRoles'>,
		selectedRoleIds: number[],
	) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		avatarUrl: user?.avatarUrl || '',
		isActive: user?.isActive ?? true,
		keycloakUserId: user?.keycloakUserId || crypto.randomUUID(),
	})
	const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
		user?.userRoles ? 
			// Convert role names back to IDs if editing existing user
			allRoles.filter(role => user.userRoles?.includes(role.name)).map(role => role.id) : 
			[]
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSwitchChange = (checked: boolean) => {
		setFormData(prev => ({ ...prev, isActive: checked }))
	}

	const handleRoleChange = (roleId: string) => {
		const id = parseInt(roleId, 10)
		setSelectedRoleIds([id])
	}

	const handleFormSave = () => {
		onSave(formData, selectedRoleIds)
	}

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Họ và tên</Label>
				<Input
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
				<Input
					id="avatarUrl"
					name="avatarUrl"
					value={formData.avatarUrl}
					onChange={handleChange}
					placeholder="https://example.com/avatar.jpg"
				/>
			</div>
			{/* KeycloakUserId is hidden - auto-generated */}
			<input type="hidden" name="keycloakUserId" value={formData.keycloakUserId} />
			<div className="space-y-2">
				<Label htmlFor="role">Vai trò</Label>
				<Select
					value={selectedRoleIds[0]?.toString() || ''}
					onValueChange={handleRoleChange}
				>
					<SelectTrigger>
						<SelectValue placeholder="Chọn một vai trò" />
					</SelectTrigger>
					<SelectContent>
						{allRoles.map(role => (
							<SelectItem key={role.id} value={role.id.toString()}>
								{role.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center space-x-2">
				<Switch
					id="isActive"
					checked={formData.isActive}
					onCheckedChange={handleSwitchChange}
				/>
				<Label htmlFor="isActive">Kích hoạt tài khoản</Label>
			</div>
			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>
					Hủy
				</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}

// Main Page Component
export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([])
	const [roles, setRoles] = useState<Role[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	const fetchUsersAndRoles = async () => {
		try {
			setIsLoading(true)
			const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()])
			setUsers(usersData)
			setRoles(Array.isArray(rolesData) ? rolesData : [])
		} catch (error) {
			console.error('Failed to fetch data:', error)
			toast({
				title: 'Lỗi',
				description: 'Không thể tải dữ liệu người dùng và vai trò.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUsersAndRoles()
	}, [])

	const handleCreate = async (
		data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userRoles'>,
		selectedRoleIds: number[],
	) => {
		try {
			await createUser({ ...data, roleIds: selectedRoleIds })
			toast({
				title: 'Thành công',
				description: 'Người dùng đã được tạo thành công.',
			})
			fetchUsersAndRoles()
			setSheetOpen(false)
		} catch (error: any) {
			console.error('Failed to create user:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể tạo người dùng.',
				variant: 'destructive',
			})
		}
	}

	const handleUpdate = async (
		data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'userRoles'>, 
		selectedRoleIds: number[]
	) => {
		if (!selectedUser) return
		try {
			await updateUser(selectedUser.id, { ...data, roleIds: selectedRoleIds })
			toast({
				title: 'Thành công',
				description: 'Người dùng đã được cập nhật thành công.',
			})
			fetchUsersAndRoles()
			setSheetOpen(false)
			setSelectedUser(null)
		} catch (error: any) {
			console.error('Failed to update user:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể cập nhật người dùng.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedUser) return
		try {
			await deleteUser(selectedUser.id)
			toast({
				title: 'Thành công',
				description: 'Người dùng đã được xóa thành công.',
			})
			fetchUsersAndRoles()
			setDeleteDialogOpen(false)
			setSelectedUser(null)
		} catch (error: any) {
			console.error('Failed to delete user:', error)
			toast({
				title: 'Lỗi',
				description: error.message || 'Không thể xóa người dùng.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', user?: User) => {
		setSheetMode(mode)
		setSelectedUser(user || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (user: User) => {
		setSelectedUser(user)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: User } }) => {
					const user = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openSheet('edit', user)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(user)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)
				},
			}
		}
		return col
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Người dùng' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Người dùng"
				description="Thêm, sửa, xóa và quản lý tài khoản người dùng trong hệ thống."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm người dùng
					</Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={users}
					isLoading={isLoading}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên..."
				/>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>
							{sheetMode === 'create'
								? 'Tạo tài khoản mới'
								: 'Chỉnh sửa tài khoản'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create'
								? 'Điền thông tin để tạo một tài khoản mới.'
								: 'Cập nhật thông tin cho tài khoản đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					<UserForm
						user={sheetMode === 'edit' ? selectedUser : null}
						allRoles={Array.isArray(roles) ? roles : []}
						onSave={sheetMode === 'create' ? handleCreate : handleUpdate}
						onCancel={() => setSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Tài khoản của người dùng{' '}
							<strong>{selectedUser?.name}</strong> sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedUser(null)}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 