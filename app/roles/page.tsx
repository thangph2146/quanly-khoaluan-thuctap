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

// Import from roles module
import {
	RoleList,
	RoleForm,
	RoleDetails,
	useRoles,
	useRoleActions,
	type Role,
	type CreateRoleRequest,
	type UpdateRoleRequest,
	getRoleDisplayName,
} from '@/modules/roles'

export default function RolesPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedRole, setSelectedRole] = useState<Role | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from roles module
	const { roles, isLoading, refetch } = useRoles()
	const { createRole, updateRole, deleteRole, isCreating, isUpdating, isDeleting } = 
		useRoleActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedRole(null)
		setSheetOpen(true)
	}

	const handleEdit = (role: Role) => {
		setSheetMode('edit')
		setSelectedRole(role)
		setSheetOpen(true)
	}

	const handleDelete = (role: Role) => {
		setSelectedRole(role)
		setDeleteDialogOpen(true)
	}

	const handleView = (role: Role) => {
		setSelectedRole(role)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateRoleRequest | UpdateRoleRequest) => {
		try {
			if (sheetMode === 'create') {
				await createRole(data as CreateRoleRequest)
			} else if (selectedRole) {
				await updateRole(selectedRole.id, data as UpdateRoleRequest)
			}
			setSheetOpen(false)
			setSelectedRole(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedRole) {
			const success = await deleteRole(selectedRole.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedRole(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Vai trò"
				description="Quản lý các vai trò và quyền hạn trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Vai trò', href: '/roles' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Role List */}
			<RoleList
				roles={roles}
				isLoading={isLoading}
				onCreate={handleCreate}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onView={handleView}
			/>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-md">
					<SheetHeader>
						<SheetTitle>
							{sheetMode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo vai trò mới cho hệ thống'
								: 'Cập nhật thông tin vai trò'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<RoleForm
							role={selectedRole}
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
							Bạn có chắc chắn muốn xóa vai trò &quot;{selectedRole && getRoleDisplayName(selectedRole.name)}&quot; không?
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

			{/* Role Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết vai trò</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về vai trò được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedRole && (
						<RoleDetails role={selectedRole} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
