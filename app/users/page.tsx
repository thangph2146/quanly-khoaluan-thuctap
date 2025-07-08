'use client'

import React, { useState } from 'react'
import { PageHeader } from '@/components/common'
import {
	Sheet,
	SheetContent,
	SheetDescription,
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

// Import from users module
import {
	UserList,
	UserForm,
	UserDetails,
	useUsers,
	useRoles,
	useUserActions,
	type User,
	type CreateUserData,
	type UpdateUserData,
} from '@/modules/users'

export default function UsersPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from users module
	const { users, isLoading, refetch } = useUsers()
	const { roles } = useRoles()
	const { createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } = 
		useUserActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedUser(null)
		setSheetOpen(true)
	}

	const handleEdit = (user: User) => {
		setSheetMode('edit')
		setSelectedUser(user)
		setSheetOpen(true)
	}

	const handleDelete = (user: User) => {
		setSelectedUser(user)
		setDeleteDialogOpen(true)
	}

	const handleView = (user: User) => {
		setSelectedUser(user)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
		try {
			if (sheetMode === 'create') {
				await createUser(data as CreateUserData)
			} else if (selectedUser) {
				await updateUser(selectedUser.id, data as UpdateUserData)
			}
			setSheetOpen(false)
			setSelectedUser(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedUser) {
			const success = await deleteUser(selectedUser.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedUser(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Người dùng"
				description="Thêm, sửa, xóa và quản lý tài khoản người dùng trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Người dùng', href: '/users' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* User List */}
			<UserList
				users={users}
				isLoading={isLoading}
				onCreate={handleCreate}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onView={handleView}
			/>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>
							{sheetMode === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo một tài khoản mới'
								: 'Cập nhật thông tin cho tài khoản đã chọn'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<UserForm
							user={selectedUser}
							roles={roles}
							onSubmit={handleFormSubmit}
							onCancel={() => setSheetOpen(false)}
							isLoading={isFormLoading}
							mode={sheetMode}
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa tài khoản của người dùng &quot;{selectedUser?.name}&quot; không?
							Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-600 hover:bg-red-700"
							disabled={isDeleting}
						>
							{isDeleting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* User Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết người dùng</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về người dùng được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedUser && (
						<UserDetails user={selectedUser} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
