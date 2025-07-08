/**
 * Menus Container Component
 * Manages state and actions for menus
 */
'use client'

import React, { useState } from 'react'
import { MenuList } from './MenuList'
import { MenuForm } from './MenuForm'
import { MenuDetails } from './MenuDetails'
import { useMenus, useMenuActions } from '../hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Menu, CreateMenuData, UpdateMenuData } from '../types'

export function MenusContainer() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

  const { menus, isLoading, refetch } = useMenus()
  const { createMenu, updateMenu, deleteMenu, isCreating, isUpdating, isDeleting } = useMenuActions(refetch)

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
    <>
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
                : 'Cập nhật thông tin menu'}
            </SheetDescription>
          </SheetHeader>
          <MenuForm
            menu={selectedMenu}
            onSubmit={handleFormSubmit}
            onCancel={() => setSheetOpen(false)}
            isLoading={isFormLoading}
            mode={sheetMode}
          />
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa menu này không?
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
    </>
  )
}
