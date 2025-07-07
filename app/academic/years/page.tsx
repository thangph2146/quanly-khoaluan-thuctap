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

// Import from config module
import {
	AcademicYearList,
	AcademicYearForm,
	useAcademicYears,
	type AcademicYear,
	type CreateAcademicYearData,
	type UpdateAcademicYearData,
} from '@/modules/config'
import { useAcademicYearActions } from '@/modules/config/hooks/use-academic-year-actions'

export default function AcademicYearsPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from config module
	const { academicYears, isLoading, refetch } = useAcademicYears()
	const { createAcademicYear, updateAcademicYear, deleteAcademicYear, isCreating, isUpdating, isDeleting } = 
		useAcademicYearActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedAcademicYear(null)
		setSheetOpen(true)
	}

	const handleEdit = (academicYear: AcademicYear) => {
		setSheetMode('edit')
		setSelectedAcademicYear(academicYear)
		setSheetOpen(true)
	}

	const handleDelete = (academicYear: AcademicYear) => {
		setSelectedAcademicYear(academicYear)
		setDeleteDialogOpen(true)
	}

	const handleView = (academicYear: AcademicYear) => {
		setSelectedAcademicYear(academicYear)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateAcademicYearData | UpdateAcademicYearData) => {
		try {
			if (sheetMode === 'create') {
				await createAcademicYear(data as CreateAcademicYearData)
			} else if (selectedAcademicYear) {
				await updateAcademicYear(selectedAcademicYear.id, data as UpdateAcademicYearData)
			}
			setSheetOpen(false)
			setSelectedAcademicYear(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedAcademicYear) {
			const success = await deleteAcademicYear(selectedAcademicYear.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedAcademicYear(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Năm học"
				description="Quản lý các năm học trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Học vụ', href: '/academic' },
					{ label: 'Năm học', href: '/academic/years' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Academic Year List */}
			<AcademicYearList
				academicYears={academicYears || []}
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
							{sheetMode === 'create' ? 'Tạo năm học mới' : 'Chỉnh sửa năm học'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo năm học mới'
								: 'Cập nhật thông tin năm học'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<AcademicYearForm
							academicYear={selectedAcademicYear}
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
							Bạn có chắc chắn muốn xóa năm học &quot;{selectedAcademicYear?.name}&quot; không?
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

			{/* Academic Year Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết năm học</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về năm học được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedAcademicYear && (
						<div className="space-y-4">
							<div>
								<strong>Tên năm học:</strong> {selectedAcademicYear.name}
							</div>
							<div>
								<strong>ID:</strong> {selectedAcademicYear.id}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
