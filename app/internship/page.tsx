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

// Import from internship module
import {
	InternshipList,
	InternshipForm,
	InternshipDetails,
	useInternships,
	useInternshipActions,
	type Internship,
	type CreateInternshipData,
	type UpdateInternshipData,
} from '@/modules/internship'

// Import from other modules for form data
import { useUsers } from '@/modules/users/hooks'
import { type User } from '@/modules/users/types'
import { usePartners } from '@/modules/partners/hooks'
import { type Partner } from '@/modules/partners/types'
import { useAcademicYears } from '@/modules/academic-years/hooks'
import { type AcademicYear } from '@/modules/academic-years/types'
import { useSemesters } from '@/modules/semesters/hooks'
import { type Semester } from '@/modules/semesters/types'

export default function InternshipPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from internship module
	const { internships, isLoading, refetch } = useInternships()
	const { createInternship, updateInternship, deleteInternship, isCreating, isUpdating, isDeleting } = 
		useInternshipActions(refetch)

	// Data for form
	const { users } = useUsers()
	const { partners } = usePartners()
	const { academicYears } = useAcademicYears()
	const { semesters } = useSemesters()

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedInternship(null)
		setSheetOpen(true)
	}

	const handleEdit = (internship: Internship) => {
		setSheetMode('edit')
		setSelectedInternship(internship)
		setSheetOpen(true)
	}

	const handleDelete = (internship: Internship) => {
		setSelectedInternship(internship)
		setDeleteDialogOpen(true)
	}

	const handleView = (internship: Internship) => {
		setSelectedInternship(internship)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateInternshipData | UpdateInternshipData) => {
		try {
			if (sheetMode === 'create') {
				await createInternship(data as CreateInternshipData)
			} else if (selectedInternship) {
				await updateInternship(selectedInternship.id, data as UpdateInternshipData)
			}
			setSheetOpen(false)
			setSelectedInternship(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedInternship) {
			const success = await deleteInternship(selectedInternship.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedInternship(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	// Transform data for form
	const formStudents = users?.map((user: User) => ({
		id: user.id?.toString() || '',
		name: user.name || '',
		studentId: user.email || '',
	})) || []

	const formPartners = partners?.map((partner: Partner) => ({
		id: partner.id?.toString() || '',
		name: partner.name || '',
	})) || []

	const formAcademicYears = academicYears?.map((year: AcademicYear) => ({
		id: year.id?.toString() || '',
		name: year.name || '',
	})) || []

	const formSemesters = semesters?.map((semester: Semester) => ({
		id: semester.id?.toString() || '',
		name: semester.name || '',
	})) || []

	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Thực tập"
				description="Quản lý các đợt thực tập sinh viên trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Thực tập', href: '/internship' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Internship List */}
			<InternshipList
				internships={internships || []}
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
							{sheetMode === 'create' ? 'Tạo thực tập mới' : 'Chỉnh sửa thực tập'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo thực tập mới'
								: 'Cập nhật thông tin thực tập'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<InternshipForm
							internship={selectedInternship}
							students={formStudents}
							partners={formPartners}
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
							Bạn có chắc chắn muốn xóa thực tập này không?
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

			{/* Internship Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết thực tập</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về thực tập được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedInternship && (
						<InternshipDetails internship={selectedInternship} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
