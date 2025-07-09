import React from 'react';
import { getDeletedDepartments, bulkPermanentDeleteDepartments, permanentDeleteDepartment, bulkRestoreDepartments } from '@/lib/api/departments.api';
import { DataTable } from '@/components/common/data-table';
import type { Department } from '../types';
import { logger } from '@/lib/utils/logger';
import { toast } from '@/components/ui/use-toast';

export function DepartmentDeletedList({
  isLoading,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: {
  isLoading?: boolean;
  filterBar?: React.ReactNode;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}) {
  const [deletedDepartments, setDeletedDepartments] = React.useState<Department[]>([]);
  React.useEffect(() => {
    getDeletedDepartments().then(setDeletedDepartments);
  }, []);

  const columns = [
    { accessorKey: 'name', header: 'Tên đơn vị', cell: ({ row }: { row: { original: Department } }) => <div>{row.original.name}</div> },
    { accessorKey: 'code', header: 'Mã đơn vị', cell: ({ row }: { row: { original: Department } }) => <div>{row.original.code}</div> },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }: { row: { original: Department } }) => (
        <button
          className="text-red-600 hover:underline"
          onClick={() => handlePermanentDelete(row.original)}
          title="Xóa vĩnh viễn"
        >
          Xóa vĩnh viễn
        </button>
      ),
    },
  ];

  // Hàm xóa vĩnh viễn nhiều đơn vị (dùng ở giao diện thùng rác)
  const handlePermanentDeleteMany = async (ids: (string | number)[]) => {
    if (!ids.length) return;
    logger.info('Bắt đầu xóa vĩnh viễn nhiều đơn vị', ids, 'DepartmentDeletedList');
    try {
      await bulkPermanentDeleteDepartments(ids as number[]);
      logger.info('Xóa vĩnh viễn nhiều đơn vị thành công', ids, 'DepartmentDeletedList');
      toast({
        title: 'Xóa vĩnh viễn thành công',
        description: `${ids.length} đơn vị đã bị xóa vĩnh viễn!`,
        variant: 'default',
      });
    } catch (error) {
      logger.error('Lỗi khi xóa vĩnh viễn nhiều đơn vị', error, 'DepartmentDeletedList');
      toast({
        title: 'Lỗi khi xóa vĩnh viễn',
        description: 'Đã xảy ra lỗi khi xóa vĩnh viễn nhiều đơn vị.',
        variant: 'destructive',
      });
    }
  };

  // Hàm xóa vĩnh viễn từng đơn vị (dùng cho nút xóa từng dòng nếu có)
  const handlePermanentDelete = async (dept: Department) => {
    try {
      await permanentDeleteDepartment(dept.id);
      toast({
        title: 'Xóa vĩnh viễn thành công',
        description: `Đơn vị "${dept.name}" đã bị xóa vĩnh viễn!`,
        variant: 'default',
      });
    } catch (error) {
      logger.error('Lỗi khi xóa vĩnh viễn đơn vị', error, 'DepartmentDeletedList');
      toast({
        title: 'Lỗi khi xóa vĩnh viễn',
        description: 'Đã xảy ra lỗi khi xóa vĩnh viễn đơn vị.',
        variant: 'destructive',
      });
    }
  };

  // Hàm khôi phục nhiều đơn vị (dùng ở giao diện thùng rác)
  const handleRestoreMany = async (ids: (string | number)[]) => {
    if (!ids.length) return;
    logger.info('Bắt đầu khôi phục nhiều đơn vị', ids, 'DepartmentDeletedList');
    try {
      await bulkRestoreDepartments(ids as number[]);
      logger.info('Khôi phục nhiều đơn vị thành công', ids, 'DepartmentDeletedList');
      toast({
        title: 'Khôi phục thành công',
        description: `${ids.length} đơn vị đã được khôi phục!`,
        variant: 'default',
      });
      // Sau khi khôi phục, reload lại danh sách
      setDeletedDepartments((prev) => prev.filter((d) => !ids.includes(d.id)));
    } catch (error) {
      logger.error('Lỗi khi khôi phục nhiều đơn vị', error, 'DepartmentDeletedList');
      toast({
        title: 'Lỗi khi khôi phục',
        description: 'Đã xảy ra lỗi khi khôi phục nhiều đơn vị.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DataTable
      columns={columns}
      data={deletedDepartments}
      isLoading={isLoading}
      filterBar={filterBar}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      onRestoreMany={handleRestoreMany}
      onDeleteMany={handlePermanentDeleteMany}
      getId={row => row.id}
    />
  );
}
