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
	SemesterList,
	SemesterForm,
	useSemesters,
	useAcademicYears,
	type Semester,
	type CreateSemesterData,
	type UpdateSemesterData,
} from '@/modules/config'
import { useSemesterActions } from '@/modules/config/hooks/use-semester-actions'

export default function SemestersPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from config module
	const { semesters, isLoading, refetch } = useSemesters()
	const { academicYears } = useAcademicYears()
	const { createSemester, updateSemester, deleteSemester, isCreating, isUpdating, isDeleting } = 
		useSemesterActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedSemester(null)
		setSheetOpen(true)
	}

	const handleEdit = (semester: Semester) => {
		setSheetMode('edit')
		setSelectedSemester(semester)
		setSheetOpen(true)
	}

	const handleDelete = (semester: Semester) => {
		setSelectedSemester(semester)
		setDeleteDialogOpen(true)
	}

	const handleView = (semester: Semester) => {
		setSelectedSemester(semester)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateSemesterData | UpdateSemesterData) => {
		try {
			if (sheetMode === 'create') {
				await createSemester(data as CreateSemesterData)
			} else if (selectedSemester) {
				await updateSemester(selectedSemester.id, data as UpdateSemesterData)
			}
			setSheetOpen(false)
			setSelectedSemester(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedSemester) {
			const success = await deleteSemester(selectedSemester.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedSemester(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Học kỳ"
				description="Quản lý các học kỳ trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Học vụ', href: '/academic' },
					{ label: 'Học kỳ', href: '/academic/semesters' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Semester List */}
			<SemesterList
				semesters={semesters || []}
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
							{sheetMode === 'create' ? 'Tạo học kỳ mới' : 'Chỉnh sửa học kỳ'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo học kỳ mới'
								: 'Cập nhật thông tin học kỳ'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<SemesterForm
							semester={selectedSemester}
							academicYears={academicYears || []}
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
							Bạn có chắc chắn muốn xóa học kỳ &quot;{selectedSemester?.name}&quot; không?
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

			{/* Semester Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết học kỳ</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về học kỳ được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedSemester && (
						<div className="space-y-4">
							<div>
								<strong>Tên học kỳ:</strong> {selectedSemester.name}
							</div>
							<div>
								<strong>Năm học ID:</strong> {selectedSemester.academicYearId}
							</div>
							<div>
								<strong>ID:</strong> {selectedSemester.id}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
