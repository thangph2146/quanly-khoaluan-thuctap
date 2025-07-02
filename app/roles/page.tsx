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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import {
	createRole,
	deleteRole,
	getRoles,
	updateRole,
} from '@/lib/api/roles.api'
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/modules/roles/types'
import { getRoleDisplayName } from '@/modules/roles/utils'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'

// Tạo hai props riêng biệt cho RoleForm
type RoleFormCreateProps = {
	role?: null
	onSave: (data: CreateRoleRequest) => void
	onCancel: () => void
}
type RoleFormEditProps = {
	role: Role
	onSave: (data: UpdateRoleRequest) => void
	onCancel: () => void
}

type RoleFormProps = RoleFormCreateProps | RoleFormEditProps

const RoleForm = (props: RoleFormProps) => {
	const { role, onSave, onCancel } = props
	const [formData, setFormData] = useState({
		name: role?.name || '',
		description: role?.description || '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleFormSave = () => {
		onSave(formData)
	}

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên vai trò</Label>
				<Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Mô tả</Label>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Mô tả vai trò và quyền hạn..."
					rows={3}
				/>
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
export default function RolesPage() {
	const [roles, setRoles] = useState<Role[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedRole, setSelectedRole] = useState<Role | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	const fetchRoles = async () => {
		try {
			setIsLoading(true)
			const rolesData = await getRoles()
			setRoles(rolesData)
		} catch (error) {
			console.error('Failed to fetch roles:', error)
			toast({
				title: 'Lỗi',
				description: 'Không thể tải dữ liệu vai trò.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchRoles()
	}, [])

	const handleCreate = async (data: CreateRoleRequest) => {
		try {
			await createRole(data)
			toast({
				title: 'Thành công',
				description: 'Vai trò đã được tạo thành công.',
			})
			fetchRoles()
			setSheetOpen(false)
		} catch (error) {
			console.error('Failed to create role:', error)
			toast({
				title: 'Lỗi',
				description: 'Không thể tạo vai trò.',
				variant: 'destructive',
			})
		}
	}

	const handleUpdate = async (data: UpdateRoleRequest) => {
		if (!selectedRole) return
		try {
			await updateRole(selectedRole.id, data)
			toast({
				title: 'Thành công',
				description: 'Vai trò đã được cập nhật thành công.',
			})
			fetchRoles()
			setSheetOpen(false)
			setSelectedRole(null)
		} catch (error) {
			console.error('Failed to update role:', error)
			toast({
				title: 'Lỗi',
				description: 'Không thể cập nhật vai trò.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedRole) return
		try {
			await deleteRole(selectedRole.id)
			toast({
				title: 'Thành công',
				description: 'Vai trò đã được xóa thành công.',
			})
			fetchRoles()
			setDeleteDialogOpen(false)
			setSelectedRole(null)
		} catch (error) {
			console.error('Failed to delete role:', error)
			toast({
				title: 'Lỗi',
				description: 'Không thể xóa vai trò.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', role?: Role) => {
		setSheetMode(mode)
		setSelectedRole(role || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (role: Role) => {
		setSelectedRole(role)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Role } }) => {
					const role = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openSheet('edit', role)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(role)}
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
		{ label: 'Vai trò' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Vai trò"
				description="Thêm, sửa, xóa và quản lý các vai trò trong hệ thống."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm vai trò
					</Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={roles}
					isLoading={isLoading}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên vai trò..."
				/>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>
							{sheetMode === 'create'
								? 'Tạo vai trò mới'
								: 'Chỉnh sửa vai trò'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create'
								? 'Điền thông tin để tạo vai trò mới.'
								: 'Cập nhật thông tin cho vai trò đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					{sheetMode === 'create' ? (
						<RoleForm
							role={null}
							onSave={handleCreate}
							onCancel={() => setSheetOpen(false)}
						/>
					) : (
						<RoleForm
							role={selectedRole as Role}
							onSave={handleUpdate}
							onCancel={() => setSheetOpen(false)}
						/>
					)}
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
							Hành động này không thể được hoàn tác. Vai trò{' '}
							<strong>{selectedRole && getRoleDisplayName(selectedRole.name)}</strong> sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedRole(null)}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 