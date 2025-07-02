'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
	renderSortableHeader,
	renderActionsCell,
} from '@/components/common/data-table'
import { Thesis } from '@/modules/thesis/types'
import { Edit, Trash2, Eye } from 'lucide-react'

export const columns: ColumnDef<Thesis>[] = [
	{
		accessorKey: 'title',
		header: ({ column }) => renderSortableHeader(column, 'Tên đề tài'),
        cell: ({ row }) => {
            return <p className="font-medium max-w-xs truncate">{row.original.title}</p>
        }
	},
    {
		accessorFn: row => row.student.fullName,
		id: 'studentFullName',
		header: ({ column }) => renderSortableHeader(column, 'Sinh viên'),
	},
	{
		accessorFn: row => row.student.studentCode,
		id: 'studentStudentCode',
		header: ({ column }) => renderSortableHeader(column, 'Mã SV'),
	},
	{
		accessorFn: row => row.academicYear.name,
		id: 'academicYearName',
		header: ({ column }) => renderSortableHeader(column, 'Niên khóa'),
	},
	{
		accessorFn: row => row.semester.name,
		id: 'semesterName',
		header: ({ column }) => renderSortableHeader(column, 'Học kỳ'),
	},
	{
		accessorKey: 'submissionDate',
		header: ({ column }) => renderSortableHeader(column, 'Hạn nộp'),
		cell: ({ row }) => {
			return new Date(row.original.submissionDate).toLocaleDateString('vi-VN')
		},
	},
	{
		id: 'actions',
		cell: ({ row }) =>
			renderActionsCell(row, [
                {
					label: 'Xem chi tiết',
					icon: Eye,
					onClick: (rowData) => console.log('View:', rowData),
				},
				{
					label: 'Chỉnh sửa',
					icon: Edit,
					onClick: (rowData) => console.log('Edit:', rowData),
				},
				{
					label: 'Xóa',
					icon: Trash2,
					onClick: (rowData) => console.log('Delete:', rowData),
					variant: 'destructive',
				},
			]),
	},
] 