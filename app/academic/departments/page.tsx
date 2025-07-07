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

// Import from departments module
import {
	DepartmentList,
	DepartmentForm,
	useDepartments,
	useDepartmentActions,
	type Department,
	type CreateDepartmentData,
	type UpdateDepartmentData,
} from '@/modules/departments'

export default function DepartmentsPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from config module
	const { departments, isLoading, refetch } = useDepartments()
	const { createDepartment, updateDepartment, deleteDepartment, isCreating, isUpdating, isDeleting } = 
		useDepartmentActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedDepartment(null)
		setSheetOpen(true)
	}

	const handleEdit = (department: Department) => {
		setSheetMode('edit')
		setSelectedDepartment(department)
		setSheetOpen(true)
	}

	const handleDelete = (department: Department) => {
		setSelectedDepartment(department)
		setDeleteDialogOpen(true)
	}

	const handleView = (department: Department) => {
		setSelectedDepartment(department)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateDepartmentData | UpdateDepartmentData) => {
		try {
			if (sheetMode === 'create') {
				await createDepartment(data as CreateDepartmentData)
			} else if (selectedDepartment) {
				await updateDepartment(selectedDepartment.id, data as UpdateDepartmentData)
			}
			setSheetOpen(false)
			setSelectedDepartment(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedDepartment) {
			const success = await deleteDepartment(selectedDepartment.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedDepartment(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Khoa"
				description="Quản lý các khoa trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Học vụ', href: '/academic' },
					{ label: 'Khoa', href: '/academic/departments' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Department List */}
			<DepartmentList
				departments={departments || []}
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
							{sheetMode === 'create' ? 'Tạo khoa mới' : 'Chỉnh sửa khoa'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo khoa mới'
								: 'Cập nhật thông tin khoa'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<DepartmentForm
							department={selectedDepartment}
							allDepartments={departments || []}
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
							Bạn có chắc chắn muốn xóa khoa &quot;{selectedDepartment?.name}&quot; không?
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

			{/* Department Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết khoa</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về khoa được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedDepartment && (
						<div className="space-y-4">
							<div>
								<strong>Tên khoa:</strong> {selectedDepartment.name}
							</div>
							<div>
								<strong>Mã khoa:</strong> {selectedDepartment.code}
							</div>
							<div>
								<strong>ID:</strong> {selectedDepartment.id}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
} 