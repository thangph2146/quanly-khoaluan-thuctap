/**
 * Student List Component
 */
import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { DataTable } from '@/components/common/data-table';
import type { Student, StudentListProps } from '../types';

export function StudentList({
  students,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDeleteMany,
  ...props
}: StudentListProps & {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  filterBar?: React.ReactNode;
}) {
  const columns = [
    {
      accessorKey: 'studentCode',
      header: 'Mã sinh viên',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="font-mono text-sm font-medium">{row.original.studentCode}</div>
      ),
    },
    {
      accessorKey: 'fullName',
      header: 'Họ và tên',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="font-medium">{row.original.fullName}</div>
      ),
    },
    {
      accessorKey: 'dateOfBirth',
      header: 'Ngày sinh',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="text-sm">
          {new Date(row.original.dateOfBirth).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="text-sm text-gray-600">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Số điện thoại',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="text-sm text-gray-600">{row.original.phoneNumber}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Student } }) => {
        const student = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(student)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <UpdateButton
              module="Student"
              variant="outline"
              size="icon"
              onClick={() => onEdit(student)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton
              module="Student"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(student)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </DeleteButton>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={students || []}
      isLoading={isLoading}
      onDeleteMany={onDeleteMany}
      getId={(student: Student) => student.id}
      {...props}
    />
  );
}
