'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Semester } from '@/modules/config/types'

export const columns: ColumnDef<Semester>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-8 px-2 lg:px-3"
				>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="font-mono text-xs">{row.getValue('id')}</div>,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-8 px-2 lg:px-3"
				>
					Tên học kỳ
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'academicYear',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-8 px-2 lg:px-3"
				>
					Năm học
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const academicYear = row.original.academicYear
			return <div className="text-sm">{academicYear?.name || 'N/A'}</div>
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: () => {
			return <div>Actions will be handled by parent component</div>
		},
	},
]
