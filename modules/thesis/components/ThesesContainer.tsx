/**
 * Thesis Container Component
 * Manages state and actions for thesis
 */
'use client'

import React, { useState } from 'react'
import { ThesisList } from './ThesisList'
import { ThesisForm } from './ThesisForm'
import { ThesisDetails } from './ThesisDetails'
import { useTheses, useThesisActions } from '../hooks'
import { useStudents } from '@/modules/students/hooks'
import { useAcademicYears } from '@/modules/academic-years/hooks'
import { useSemesters } from '@/modules/semesters/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Thesis } from '../types'

export function ThesesContainer() {
  const { theses, isLoading, refetch } = useTheses()
  const { createThesis, updateThesis, deleteThesis, isCreating, isUpdating, isDeleting } = useThesisActions(refetch)
  
  // Data for forms
  const { students } = useStudents()
  const { academicYears } = useAcademicYears()
  const { semesters } = useSemesters()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [thesisToDelete, setThesisToDelete] = useState<Thesis | null>(null)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [thesisToView, setThesisToView] = useState<Thesis | null>(null)

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (thesis: Thesis) => {
    setSelectedThesis(thesis)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (thesis: Thesis) => {
    setThesisToDelete(thesis)
    setIsDeleteDialogOpen(true)
  }

  const handleView = (thesis: Thesis) => {
    setThesisToView(thesis)
    setIsDetailsSheetOpen(true)
  }

  const handleCreateSubmit = async (data: any) => {
    try {
      await createThesis(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedThesis) return
    
    try {
      await updateThesis(selectedThesis.id, data)
      setIsEditDialogOpen(false)
      setSelectedThesis(null)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!thesisToDelete) return
    
    const success = await deleteThesis(thesisToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setThesisToDelete(null)
    }
  }

  // Transform data for form
  const formStudents = students?.map((student: any) => ({
    id: student.id?.toString() || '',
    name: student.fullName || '',
    studentId: student.studentCode || '',
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
    <>
      <ThesisList
        theses={theses}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo khóa luận mới</DialogTitle>
          </DialogHeader>
          <ThesisForm
            students={formStudents}
            academicYears={formAcademicYears}
            semesters={formSemesters}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khóa luận</DialogTitle>
          </DialogHeader>
          <ThesisForm
            thesis={selectedThesis}
            students={formStudents}
            academicYears={formAcademicYears}
            semesters={formSemesters}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setSelectedThesis(null)
            }}
            isLoading={isUpdating}
            mode="edit"
          />
        </DialogContent>
      </Dialog>

      {/* Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Chi tiết khóa luận</SheetTitle>
          </SheetHeader>
          {thesisToView && (
            <div className="space-y-4">
              <ThesisDetails thesis={thesisToView} />
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleEdit(thesisToView)
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleDelete(thesisToView)
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
              Bạn có chắc chắn muốn xóa khóa luận "{thesisToDelete?.title}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setThesisToDelete(null)
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
