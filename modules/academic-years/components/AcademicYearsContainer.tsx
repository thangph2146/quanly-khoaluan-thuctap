/**
 * Academic Years Container Component
 * Manages state and actions for academic years
 */
'use client'

import React, { useState } from 'react'
import { AcademicYearList } from './AcademicYearList'
import { AcademicYearForm } from './AcademicYearForm'
import { AcademicYearDetail } from './AcademicYearDetail'
import { useAcademicYears, useAcademicYearActions } from '../hooks'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { PageHeader } from '@/components/common/page-header';
import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AcademicYear, CreateAcademicYearData, UpdateAcademicYearData } from '../types'
import { Button } from '@/components/ui/button'

export function AcademicYearsContainer() {
  const { academicYears, isLoading, refetch } = useAcademicYears()
  const { createAcademicYear, updateAcademicYear, deleteAcademicYear, isCreating, isUpdating, isDeleting } = useAcademicYearActions(refetch)

  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [academicYearToDelete, setAcademicYearToDelete] = useState<AcademicYear | null>(null)
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  // Build params for API (giả định hook hỗ trợ, nếu chưa có sẽ cần cập nhật hook)
  const params = React.useMemo(() => {
    const p: any = { page, limit };
    if (searchTerm.trim()) p.search = searchTerm.trim();
    if (startDate) p.startDate = startDate;
    if (endDate) p.endDate = endDate;
    return p;
  }, [page, limit, searchTerm, startDate, endDate]);

  const handleCreate = () => {
    setSheetMode('create')
    setSelectedAcademicYear(null)
    setSheetOpen(true)
  }

  const handleEdit = (academicYear: AcademicYear) => {
    setSheetMode('edit')
    setSelectedAcademicYear(academicYear)
    setSheetOpen(true)
  }

  const handleView = (academicYear: AcademicYear) => {
    setSelectedAcademicYear(academicYear)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = (academicYear: AcademicYear) => {
    setAcademicYearToDelete(academicYear)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateAcademicYearData | UpdateAcademicYearData) => {
    try {
      if (sheetMode === 'create') {
        await createAcademicYear(data as CreateAcademicYearData)
      } else if (selectedAcademicYear) {
        await updateAcademicYear(selectedAcademicYear.id, data as UpdateAcademicYearData)
      }
      setSheetOpen(false)
      setSelectedAcademicYear(null)
    } catch (error) {
      // Error is handled in the hook
      console.error('Form submission error:', error)
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

  const isFormLoading = isCreating || isUpdating
  const totalPages = Math.ceil((academicYears?.length || 0) / (limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <Input
          placeholder="Tìm kiếm năm học..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <DatePicker
          label="Ngày bắt đầu"
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
            setPage(1);
          }}
          placeholder="Chọn ngày bắt đầu"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <DatePicker
          label="Ngày kết thúc"
          value={endDate}
          onChange={(date) => {
            setEndDate(date);
            setPage(1);
          }}
          placeholder="Chọn ngày kết thúc"
        />
      </div>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý Năm học"
      description="Quản lý các năm học trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Năm học", href: "/academic-years" },
      ]}
      actions={
        <Button onClick={handleCreate} disabled={isCreating}>
          + Thêm năm học
        </Button>
      }
    >
      {/* filterBar is now injected into AcademicYearList, not rendered here */}
      {false && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{/* error */}</AlertDescription>
        </Alert>
      )}
      <AcademicYearList
        academicYears={academicYears}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        filterBar={filterBar}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
      />
      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === 'create' ? 'Tạo năm học mới' : 'Chỉnh sửa năm học'}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === 'create'
                ? 'Điền thông tin để tạo năm học mới cho hệ thống'
                : 'Cập nhật thông tin năm học'
              }
            </SheetDescription>
          </SheetHeader>
          <AcademicYearForm
            academicYear={selectedAcademicYear}
            onSubmit={handleFormSubmit}
            onCancel={() => setSheetOpen(false)}
            isLoading={isFormLoading}
            mode={sheetMode}
          />
        </SheetContent>
      </Sheet>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chi tiết năm học: {selectedAcademicYear?.name}</DialogTitle>
          </DialogHeader>
          {selectedAcademicYear && (
            <div className="overflow-y-auto">
              <AcademicYearDetail academicYear={selectedAcademicYear} />
            </div>
          )}
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
    </PageHeader>
  )
}
