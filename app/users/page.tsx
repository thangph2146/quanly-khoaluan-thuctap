'use client'

import { useState } from 'react'
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
import { users, roles } from '@/modules/users/data'
import { User, Role } from '@/modules/users/types'

// Form Component
const UserForm = ({
	user,
	allRoles,
	onSave,
	onCancel,
}: {
	user?: User | null
	allRoles: Role[]
	onSave: (data: Partial<User>, selectedRoleIds: number[]) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		avatarUrl: user?.avatarUrl || '',
		isActive: user?.isActive ?? true,
	})
	const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
        user?.userRoles?.map(ur => ur.roleId) || []
    );

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

	const handleRoleChange = (roleId: string) => {
        const id = parseInt(roleId, 10);
        // For simplicity, this example only supports one role.
        // For multi-role selection, you would manage an array of IDs.
        setSelectedRoleIds([id]);
    };
    
    const handleFormSave = () => {
        onSave(formData, selectedRoleIds)
    }

	return (
		<div className="space-y-4 py-4">
			<div className="space-y-2">
				<Label htmlFor="name">Họ và tên</Label>
				<Input id="name" name="name" value={formData.name} onChange={handleChange} />
			</div>
            <div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
			</div>
            <div className="space-y-2">
				<Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
				<Input id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
			</div>
            <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={selectedRoleIds[0]?.toString() || ''} onValueChange={handleRoleChange}>
                    <SelectTrigger><SelectValue placeholder="Chọn một vai trò" /></SelectTrigger>
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
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Kích hoạt tài khoản</Label>
            </div>
            <SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleFormSave}>Lưu thay đổi</Button>
            </SheetFooter>
		</div>
	)
}

// Main Page Component
export default function UsersPage() {
	const [userData, setUserData] = useState<User[]>(users)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	const handleCreate = (data: Partial<User>, selectedRoleIds: number[]) => {
		const newUser: User = {
			id: Math.max(...userData.map(u => u.id), 0) + 1,
            keycloakUserId: `uuid-placeholder-${Math.random()}`,
			...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userRoles: selectedRoleIds.map((roleId: number) => ({
                userId: Math.max(...userData.map(u => u.id), 0) + 1,
                roleId: roleId,
                role: roles.find((r: Role) => r.id === roleId)!,
            })),
		} as User
		setUserData(prev => [...prev, newUser])
		setSheetOpen(false)
	}

	const handleUpdate = (data: Partial<User>, selectedRoleIds: number[]) => {
		if (!selectedUser) return
		setUserData(prev =>
			prev.map(u => {
                if (u.id === selectedUser.id) {
                    const updatedUser = { ...u, ...data, updatedAt: new Date().toISOString() };
                    updatedUser.userRoles = selectedRoleIds.map((roleId: number) => ({
                        userId: u.id,
                        roleId: roleId,
                        role: roles.find((r: Role) => r.id === roleId)!,
                        user: updatedUser
                    }));
                    return updatedUser;
                }
                return u;
            })
		)
		setSheetOpen(false)
		setSelectedUser(null)
	}

	const handleDelete = () => {
		if (!selectedUser) return
		setUserData(prev => prev.filter(u => u.id !== selectedUser.id))
		setDeleteDialogOpen(false)
		setSelectedUser(null)
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
							<Button variant="outline" size="icon" onClick={() => openSheet('edit', user)}>
								<Edit className="h-4 w-4" />
							</Button>
							<Button variant="destructive" size="icon" onClick={() => openDeleteDialog(user)}>
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
					data={userData}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên, email..."
				/>
			</PageHeader>
            
			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}</SheetTitle>
						<SheetDescription>
                            {sheetMode === 'create' ? 'Điền thông tin để tạo một tài khoản mới.' : 'Cập nhật thông tin cho tài khoản đã chọn.'}
                        </SheetDescription>
					</SheetHeader>
					<UserForm 
                        user={sheetMode === 'edit' ? selectedUser : null} 
                        allRoles={roles}
                        onSave={sheetMode === 'create' ? handleCreate : handleUpdate} 
                        onCancel={() => setSheetOpen(false)}
                    />
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Người dùng &quot;{selectedUser?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedUser(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 