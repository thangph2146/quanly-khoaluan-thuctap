/**
 * Roles Container Component
 * Manages state and actions for roles
 */
'use client'

import React, { useState } from 'react'
import { RoleList } from './RoleList'
import { RoleForm } from './RoleForm'
import { RoleDetails } from './RoleDetails'
import { useRoles, useRoleActions } from '../hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types'

export function RolesContainer() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

  const { roles, isLoading, refetch } = useRoles()
  const { createRole, updateRole, deleteRole, isCreating, isUpdating, isDeleting } = useRoleActions(refetch)

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
    <>
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
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === 'create'
                ? 'Điền thông tin để tạo vai trò mới'
                : 'Cập nhật thông tin vai trò'}
            </SheetDescription>
          </SheetHeader>
          <RoleForm
            role={selectedRole}
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
              Bạn có chắc chắn muốn xóa vai trò này không?
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
    </>
  )
}
