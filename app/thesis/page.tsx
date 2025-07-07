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

// Import from thesis module
import {
	ThesisList,
	ThesisForm,
	ThesisDetails,
	useTheses,
	useThesisActions,
	type Thesis,
	type CreateThesisData,
	type UpdateThesisData,
} from '@/modules/thesis'
import { useUsers } from '@/modules/users/hooks'
// Import from other modules for form data
import { useAcademicYears, useSemesters } from '@/modules/config/hooks'

export default function ThesisPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from thesis module
	const { theses, isLoading, refetch } = useTheses()
	const { createThesis, updateThesis, deleteThesis, isCreating, isUpdating, isDeleting } = 
		useThesisActions(refetch)

	// Data for form
	const { users } = useUsers()
	const { academicYears } = useAcademicYears()
	const { semesters } = useSemesters()

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedThesis(null)
		setSheetOpen(true)
	}

	const handleEdit = (thesis: Thesis) => {
		setSheetMode('edit')
		setSelectedThesis(thesis)
		setSheetOpen(true)
	}

	const handleDelete = (thesis: Thesis) => {
		setSelectedThesis(thesis)
		setDeleteDialogOpen(true)
	}

	const handleView = (thesis: Thesis) => {
		setSelectedThesis(thesis)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateThesisData | UpdateThesisData) => {
		try {
			if (sheetMode === 'create') {
				await createThesis(data as CreateThesisData)
			} else if (selectedThesis) {
				await updateThesis(selectedThesis.id, data as UpdateThesisData)
			}
			setSheetOpen(false)
			setSelectedThesis(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedThesis) {
			const success = await deleteThesis(selectedThesis.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedThesis(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	// Transform data for form
	const formStudents = users?.map((user: any) => ({
		id: user.id?.toString() || '',
		name: user.name || '',
		studentId: user.email || '',
	})) || []

	const formAcademicYears = academicYears?.map(year => ({
		id: year.id?.toString() || '',
		name: year.name || '',
	})) || []

	const formSemesters = semesters?.map(semester => ({
		id: semester.id?.toString() || '',
		name: semester.name || '',
	})) || []

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Khóa luận"
				description="Quản lý các khóa luận tốt nghiệp trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Khóa luận', href: '/thesis' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Thesis List */}
			<ThesisList
				theses={theses || []}
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
							{sheetMode === 'create' ? 'Tạo khóa luận mới' : 'Chỉnh sửa khóa luận'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo khóa luận mới'
								: 'Cập nhật thông tin khóa luận'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<ThesisForm
							thesis={selectedThesis}
							students={formStudents}
							academicYears={formAcademicYears}
							semesters={formSemesters}
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
							Bạn có chắc chắn muốn xóa khóa luận &quot;{selectedThesis?.title}&quot; không?
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

			{/* Thesis Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết khóa luận</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về khóa luận được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedThesis && (
						<ThesisDetails thesis={selectedThesis} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
