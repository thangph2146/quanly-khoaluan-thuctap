/**
 * Academic Years Container Component
 * Manages state and actions for academic years
 */
'use client'

import React, { useState } from 'react'
import { AcademicYearList } from './AcademicYearList'
import { AcademicYearForm } from './AcademicYearForm'
import { useAcademicYears, useAcademicYearActions } from '../hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { AcademicYear } from '../types'

export function AcademicYearsContainer() {
  const { academicYears, isLoading, refetch } = useAcademicYears()
  const { createAcademicYear, updateAcademicYear, deleteAcademicYear, isCreating, isUpdating, isDeleting } = useAcademicYearActions(refetch)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [academicYearToDelete, setAcademicYearToDelete] = useState<AcademicYear | null>(null)

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (academicYear: AcademicYear) => {
    setSelectedAcademicYear(academicYear)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (academicYear: AcademicYear) => {
    setAcademicYearToDelete(academicYear)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateSubmit = async (data: any) => {
    try {
      await createAcademicYear(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedAcademicYear) return
    
    try {
      await updateAcademicYear(selectedAcademicYear.id, data)
      setIsEditDialogOpen(false)
      setSelectedAcademicYear(null)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!academicYearToDelete) return
    
    const success = await deleteAcademicYear(academicYearToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setAcademicYearToDelete(null)
    }
  }

  return (
    <>
      <AcademicYearList
        academicYears={academicYears}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo năm học mới</DialogTitle>
          </DialogHeader>
          <AcademicYearForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa năm học</DialogTitle>
          </DialogHeader>
          <AcademicYearForm
            academicYear={selectedAcademicYear}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setSelectedAcademicYear(null)
            }}
            isLoading={isUpdating}
            mode="edit"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa năm học "{academicYearToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setAcademicYearToDelete(null)
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
