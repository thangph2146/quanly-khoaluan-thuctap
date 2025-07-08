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

// Import from partners module
import {
	PartnerList,
	PartnerForm,
	PartnerDetails,
	usePartners,
	usePartnerActions,
	type Partner,
	type CreatePartnerData,
	type UpdatePartnerData,
} from '@/modules/partners'

export default function PartnersPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from partners module
	const { partners, isLoading, refetch } = usePartners()
	const { createPartner, updatePartner, deletePartner, isCreating, isUpdating, isDeleting } = 
		usePartnerActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedPartner(null)
		setSheetOpen(true)
	}

	const handleEdit = (partner: Partner) => {
		setSheetMode('edit')
		setSelectedPartner(partner)
		setSheetOpen(true)
	}

	const handleDelete = (partner: Partner) => {
		setSelectedPartner(partner)
		setDeleteDialogOpen(true)
	}

	const handleView = (partner: Partner) => {
		setSelectedPartner(partner)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreatePartnerData | UpdatePartnerData) => {
		try {
			if (sheetMode === 'create') {
				await createPartner(data as CreatePartnerData)
			} else if (selectedPartner) {
				await updatePartner(selectedPartner.id, data as UpdatePartnerData)
			}
			setSheetOpen(false)
			setSelectedPartner(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedPartner) {
			const success = await deletePartner(selectedPartner.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedPartner(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Đối tác"
				description="Quản lý các đối tác doanh nghiệp trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Đối tác', href: '/partners' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Partner List */}
			<PartnerList
				partners={partners || []}
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
							{sheetMode === 'create' ? 'Tạo đối tác mới' : 'Chỉnh sửa đối tác'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo đối tác mới'
								: 'Cập nhật thông tin đối tác'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<PartnerForm
							partner={selectedPartner}
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
							Bạn có chắc chắn muốn xóa đối tác &quot;{selectedPartner?.name}&quot; không?
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

			{/* Partner Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết đối tác</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về đối tác được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedPartner && (
						<PartnerDetails partner={selectedPartner} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
