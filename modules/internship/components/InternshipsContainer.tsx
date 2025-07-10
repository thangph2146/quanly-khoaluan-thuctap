/**
 * Internships Container Component
 * Manages state and actions for internships
 */
'use client'

import React, { useState } from 'react'
import { InternshipList } from './InternshipList'
import { InternshipForm } from './InternshipForm'
import { InternshipDetails } from './InternshipDetails'
import { useInternships, useInternshipActions } from '../hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Internship, CreateInternshipData, UpdateInternshipData } from '../types'

export function InternshipsContainer() {
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

  const { internships, isLoading, refetch } = useInternships()
  const { createInternship, updateInternship, deleteInternship, isCreating, isUpdating, isDeleting } = useInternshipActions(refetch)

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

  return (
    <>
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
                : 'Cập nhật thông tin thực tập'}
            </SheetDescription>
          </SheetHeader>
          <InternshipForm
            internship={selectedInternship}
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
    </>
  )
}
