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

// Import from menu module
import {
	MenuList,
	MenuForm,
	MenuDetails,
	useMenus,
	useMenuActions,
	type Menu,
	type CreateMenuData,
	type UpdateMenuData,
} from '@/modules/menu'

export default function MenuPage() {
	// States for UI components
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	// Use custom hooks from menu module
	const { menus, isLoading, refetch } = useMenus()
	const { createMenu, updateMenu, deleteMenu, isCreating, isUpdating, isDeleting } = 
		useMenuActions(refetch)

	// Event handlers
	const handleCreate = () => {
		setSheetMode('create')
		setSelectedMenu(null)
		setSheetOpen(true)
	}

	const handleEdit = (menu: Menu) => {
		setSheetMode('edit')
		setSelectedMenu(menu)
		setSheetOpen(true)
	}

	const handleDelete = (menu: Menu) => {
		setSelectedMenu(menu)
		setDeleteDialogOpen(true)
	}

	const handleView = (menu: Menu) => {
		setSelectedMenu(menu)
		setDetailsDialogOpen(true)
	}

	// Form submission handlers
	const handleFormSubmit = async (data: CreateMenuData | UpdateMenuData) => {
		try {
			if (sheetMode === 'create') {
				await createMenu(data as CreateMenuData)
			} else if (selectedMenu) {
				await updateMenu(selectedMenu.id, data as UpdateMenuData)
			}
			setSheetOpen(false)
			setSelectedMenu(null)
		} catch (error) {
			// Error handling is done in the hook
			console.error('Form submission error:', error)
		}
	}

	const handleDeleteConfirm = async () => {
		if (selectedMenu) {
			const success = await deleteMenu(selectedMenu.id)
			if (success) {
				setDeleteDialogOpen(false)
				setSelectedMenu(null)
			}
		}
	}

	const isFormLoading = isCreating || isUpdating

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Menu"
				description="Quản lý các menu và quyền truy cập trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Menu', href: '/menu' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Menu List */}
			<MenuList
				menus={menus || []}
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
							{sheetMode === 'create' ? 'Tạo menu mới' : 'Chỉnh sửa menu'}
						</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' 
								? 'Điền thông tin để tạo menu mới'
								: 'Cập nhật thông tin menu'
							}
						</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<MenuForm
							menu={selectedMenu}
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
							Bạn có chắc chắn muốn xóa menu &quot;{selectedMenu?.name}&quot; không?
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

			{/* Menu Details Dialog */}
			<Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Chi tiết menu</DialogTitle>
						<DialogDescription>
							Thông tin chi tiết về menu được chọn
						</DialogDescription>
					</DialogHeader>
					{selectedMenu && (
						<MenuDetails menu={selectedMenu} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}
