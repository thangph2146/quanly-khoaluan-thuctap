/**
 * Departments Container Component
 * Manages state and actions for departments
 */
'use client'

import React, { useState } from 'react'
import { DepartmentList } from './DepartmentList'
import { DepartmentForm } from './DepartmentForm'
import { DepartmentDetails } from './DepartmentDetails'
import { useDepartments, useDepartmentActions } from '../hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Department } from '../types'

export function DepartmentsContainer() {
  const { departments, isLoading, refetch } = useDepartments()
  const { createDepartment, updateDepartment, deleteDepartment, isCreating, isUpdating, isDeleting } = useDepartmentActions(refetch)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [departmentToView, setDepartmentToView] = useState<Department | null>(null)

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (department: Department) => {
    setDepartmentToDelete(department)
    setIsDeleteDialogOpen(true)
  }

  const handleView = (department: Department) => {
    setDepartmentToView(department)
    setIsDetailsSheetOpen(true)
  }

  const handleCreateSubmit = async (data: any) => {
    try {
      await createDepartment(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedDepartment) return
    
    try {
      await updateDepartment(selectedDepartment.id, data)
      setIsEditDialogOpen(false)
      setSelectedDepartment(null)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return
    
    const success = await deleteDepartment(departmentToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  return (
    <>
      <DepartmentList
        departments={departments}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Create/Edit Sheet */}
      <Sheet open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={open => {
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        if (!open) setSelectedDepartment(null)
      }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{isCreateDialogOpen ? 'Tạo đơn vị mới' : 'Chỉnh sửa đơn vị'}</SheetTitle>
          </SheetHeader>
          <DepartmentForm
            department={isEditDialogOpen ? selectedDepartment : undefined}
            allDepartments={departments}
            onSubmit={isCreateDialogOpen ? handleCreateSubmit : handleEditSubmit}
            onCancel={() => {
              setIsCreateDialogOpen(false)
              setIsEditDialogOpen(false)
              setSelectedDepartment(null)
            }}
            isLoading={isCreateDialogOpen ? isCreating : isUpdating}
            mode={isCreateDialogOpen ? 'create' : 'edit'}
          />
        </SheetContent>
      </Sheet>

      {/* Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Chi tiết đơn vị</SheetTitle>
          </SheetHeader>
          {departmentToView && (
            <div className="space-y-4">
              <DepartmentDetails department={departmentToView} />
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleEdit(departmentToView)
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleDelete(departmentToView)
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn vị "{departmentToDelete?.name}"? 
              Hành động này không thể hoàn tác và có thể ảnh hưởng đến các đơn vị con.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setDepartmentToDelete(null)
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
