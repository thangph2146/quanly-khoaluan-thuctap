/**
 * Departments Container Component
 * Manages state and actions for departments
 */
'use-client'

import React, { useState, useCallback, useMemo } from 'react'
import { DepartmentList } from './DepartmentList'
import { DepartmentForm } from './DepartmentForm'
import { DepartmentDetails } from './DepartmentDetails'
import { DepartmentDeletedList } from './DepartmentDeletedList'
import { useDepartments, useDepartmentActions } from '../hooks'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/common';
import type { Department, CreateDepartmentData, UpdateDepartmentData } from '../types'
import { logger } from '@/lib/utils/logger'

const flattenDepartmentsForForm = (departments: Department[]): Department[] => {
  const flatList: Department[] = [];
  const recurse = (depts: Department[]) => {
    for (const dept of depts) {
      flatList.push(dept);
      if (dept.childDepartments && dept.childDepartments.length > 0) {
        recurse(dept.childDepartments);
      }
    }
  };
  recurse(departments);
  return flatList;
};

export function DepartmentsContainer() {
  const { departments, setDepartments, isLoading, refetch } = useDepartments()
  const { createDepartment, updateDepartment, deleteDepartment, isCreating, isUpdating, isDeleting } = useDepartmentActions(refetch)
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [departmentToView, setDepartmentToView] = useState<Department | null>(null)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const allDepartmentsForForm = useMemo(() => flattenDepartmentsForForm(departments), [departments]);
  const totalPages = Math.ceil((departments?.length || 0) / (limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2 justify-between">
        <Label htmlFor="search">Tìm kiếm</Label>
        <Input
          placeholder="Tìm kiếm đơn vị..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );

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

  const handleCreateSubmit = useCallback(async (data: CreateDepartmentData) => {
    try {
      await createDepartment(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      logger.error('Failed to create department', error)
    }
  }, [createDepartment])

  const handleEditSubmit = useCallback(async (data: UpdateDepartmentData) => {
    if (!selectedDepartment) return
    
    try {
      await updateDepartment(selectedDepartment.id, data)
      setIsEditDialogOpen(false)
      setSelectedDepartment(null)
    } catch (error) {
      logger.error('Failed to update department', error)
    }
  }, [selectedDepartment, updateDepartment])

  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return
    
    const success = await deleteDepartment(departmentToDelete.id)
    if (success) {
      const removeRecursively = (depts: Department[], id: number): Department[] => {
        return depts
          .filter(dept => dept.id !== id)
          .map(dept => ({
            ...dept,
            childDepartments: dept.childDepartments ? removeRecursively(dept.childDepartments, id) : []
          }));
      };
      setDepartments(prev => removeRecursively(prev, departmentToDelete.id));
      setIsDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const handleCancel = useCallback(() => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedDepartment(null)
  }, [])

  return (
    <PageHeader
      title="Quản lý Đơn vị"
      description="Quản lý các đơn vị trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Đơn vị", href: "/departments" },
      ]}
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={isCreating}>
            + Thêm đơn vị
          </Button>
          <Button variant={showDeleted ? 'default' : 'outline'} onClick={() => setShowDeleted((v) => !v)}>
            {showDeleted ? 'Danh sách hoạt động' : 'Xem thùng rác'}
          </Button>
        </div>
      }
    >
      {showDeleted ? (
        <DepartmentDeletedList
          isLoading={isLoading}
          filterBar={filterBar}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={setLimit}
        />
      ) : (
        <DepartmentList
          departments={departments}
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
      )}

      {/* Create/Edit Modal */}
      <DepartmentForm
        isOpen={isCreateDialogOpen || isEditDialogOpen}
        title={isCreateDialogOpen ? 'Tạo đơn vị mới' : 'Chỉnh sửa đơn vị'}
        department={isEditDialogOpen ? selectedDepartment : undefined}
        allDepartments={allDepartmentsForForm}
        onSubmit={isCreateDialogOpen ? handleCreateSubmit : handleEditSubmit}
        onCancel={handleCancel}
        isLoading={isCreateDialogOpen ? isCreating : isUpdating}
        mode={isCreateDialogOpen ? 'create' : 'edit'}
      />

      {/* Details Modal */}
      <DepartmentDetails
        isOpen={isDetailsSheetOpen}
        onClose={() => setIsDetailsSheetOpen(false)}
        department={departmentToView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn vị &quot;{departmentToDelete?.name}&quot;? 
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
    </PageHeader>
  )
}
