/**
 * Semesters Container Component
 * Manages state and actions for semesters
 */
'use client'

import React, { useState } from 'react'
import { SemesterList } from './SemesterList'
import { SemesterForm } from './SemesterForm'
import { useSemesters, useSemesterActions } from '../hooks'
import { useAcademicYears } from '@/modules/academic-years/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Semester } from '../types'

export function SemestersContainer() {
  const { semesters, isLoading, refetch } = useSemesters()
  const { academicYears } = useAcademicYears()
  const { createSemester, updateSemester, deleteSemester, isCreating, isUpdating, isDeleting } = useSemesterActions(refetch)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(null)

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (semester: Semester) => {
    setSemesterToDelete(semester)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateSubmit = async (data: any) => {
    try {
      await createSemester(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedSemester) return
    
    try {
      await updateSemester(selectedSemester.id, data)
      setIsEditDialogOpen(false)
      setSelectedSemester(null)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!semesterToDelete) return
    
    const success = await deleteSemester(semesterToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setSemesterToDelete(null)
    }
  }

  return (
    <>
      <SemesterList
        semesters={semesters}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Sheet */}
      <Sheet open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={open => {
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        if (!open) setSelectedSemester(null)
      }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{isCreateDialogOpen ? 'Tạo học kỳ mới' : 'Chỉnh sửa học kỳ'}</SheetTitle>
          </SheetHeader>
          <SemesterForm
            semester={isEditDialogOpen ? selectedSemester : undefined}
            academicYears={academicYears}
            onSubmit={isCreateDialogOpen ? handleCreateSubmit : handleEditSubmit}
            onCancel={() => {
              setIsCreateDialogOpen(false)
              setIsEditDialogOpen(false)
              setSelectedSemester(null)
            }}
            isLoading={isCreateDialogOpen ? isCreating : isUpdating}
            mode={isCreateDialogOpen ? 'create' : 'edit'}
          />
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa học kỳ "{semesterToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setSemesterToDelete(null)
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
