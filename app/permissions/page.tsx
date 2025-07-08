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

// Import from permission module
import {
	PermissionList,
	PermissionForm,
	PermissionDetails,
	usePermissions,
	usePermissionActions,
	type Permission,
	type CreatePermissionData,
	type UpdatePermissionData,
} from '@/modules/permission'

export default function PermissionsPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from permission module
	const { permissions, modules, isLoading, refetch } = usePermissions()
	const { createPermission, updatePermission, deletePermission, isCreating, isUpdating, isDeleting } = 
		usePermissionActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedPermission(null)
		setSheetOpen(true)
	}

	const handleEdit = (permission: Permission) => {
		setSheetMode('edit')
		setSelectedPermission(permission)
		setSheetOpen(true)
	}

	const handleDelete = (permission: Permission) => {
		setSelectedPermission(permission)
		setDeleteDialogOpen(true)
	}

	const handleView = (permission: Permission) => {
		setSelectedPermission(permission)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreatePermissionData | UpdatePermissionData) => {
		try {
			if (sheetMode === 'create') {
				await createPermission(data as CreatePermissionData)
			} else if (selectedPermission) {
				await updatePermission(selectedPermission.id, data as UpdatePermissionData)
			}
			setSheetOpen(false)
			setSelectedPermission(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedPermission) {
			const success = await deletePermission(selectedPermission.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedPermission(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Permissions"
				description="Quản lý các quyền truy cập trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Permissions', href: '/permissions' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Permission List */}
			<PermissionList
				permissions={permissions}
				modules={modules}
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
							{sheetMode === 'create' ? 'Tạo Permission mới' : 'Chỉnh sửa Permission'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo permission mới cho hệ thống'
								: 'Cập nhật thông tin permission'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<PermissionForm
							permission={selectedPermission}
							modules={modules}
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
							Bạn có chắc chắn muốn xóa permission &quot;{selectedPermission?.name}&quot; không?
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

			{/* Permission Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết Permission</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về permission được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedPermission && (
						<PermissionDetails permission={selectedPermission} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
