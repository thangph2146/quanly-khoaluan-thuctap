/**
 * Students Container Component
 * Manages state and actions for students
 */
'use client'

import React, { useState } from 'react'
import { StudentList } from './StudentList'
import { StudentForm } from './StudentForm'
import { StudentDetails } from './StudentDetails'
import { useStudents, useStudentActions } from '../hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Student } from '../types'

export function StudentsContainer() {
  const { students, isLoading, refetch } = useStudents()
  const { createStudent, updateStudent, deleteStudent, isCreating, isUpdating, isDeleting } = useStudentActions(refetch)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [studentToView, setStudentToView] = useState<Student | null>(null)

  const handleCreate = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteDialogOpen(true)
  }

  const handleView = (student: Student) => {
    setStudentToView(student)
    setIsDetailsSheetOpen(true)
  }

  const handleCreateSubmit = async (data: any) => {
    try {
      await createStudent(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleEditSubmit = async (data: any) => {
    if (!selectedStudent) return
    
    try {
      await updateStudent(selectedStudent.id, data)
      setIsEditDialogOpen(false)
      setSelectedStudent(null)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return
    
    const success = await deleteStudent(studentToDelete.id)
    if (success) {
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  return (
    <>
      <StudentList
        students={students}
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
            <DialogTitle>Tạo sinh viên mới</DialogTitle>
          </DialogHeader>
          <StudentForm
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
            <DialogTitle>Chỉnh sửa sinh viên</DialogTitle>
          </DialogHeader>
          <StudentForm
            student={selectedStudent}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setSelectedStudent(null)
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
            <SheetTitle>Chi tiết sinh viên</SheetTitle>
          </SheetHeader>
          {studentToView && (
            <div className="space-y-4">
              <StudentDetails student={studentToView} />
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleEdit(studentToView)
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsSheetOpen(false)
                    handleDelete(studentToView)
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
              Bạn có chắc chắn muốn xóa sinh viên "{studentToDelete?.fullName}" (MSV: {studentToDelete?.studentCode})? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setStudentToDelete(null)
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
