'use client'

import * as React from 'react'
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type Column,
	type Row,
} from '@tanstack/react-table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { TableSkeleton } from './table-skeleton'

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	isLoading?: boolean
	searchableColumn?: string
	searchPlaceholder?: string
	onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	searchableColumn,
	searchPlaceholder = 'Tìm kiếm...',
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	return (
		<div className="space-y-4">
			{searchableColumn && (
				<div className="flex items-center">
					<Input
						placeholder={searchPlaceholder}
						value={
							(table.getColumn(searchableColumn)?.getFilterValue() as string) ??
							''
						}
						onChange={(event) =>
							table
								.getColumn(searchableColumn)
								?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				</div>
			)}
			{isLoading ? (
				<TableSkeleton columns={columns.length} />
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
													  )}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
										onClick={() => onRowClick?.(row.original)}
										className={onRowClick ? 'cursor-pointer' : ''}
									>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										Không có dữ liệu.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Trang trước
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Trang sau
				</Button>
			</div>
		</div>
	)
}

// Helper for sortable headers
export const renderSortableHeader = <TData, TValue>(
	column: Column<TData, TValue>,
	label: string,
) => {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			{label}
			<ArrowUpDown className="ml-2 h-4 w-4" />
		</Button>
	)
}

// Helper for action cells
export const renderActionsCell = <TData,>(
	row: Row<TData>,
	actions: {
		label: string
		icon?: React.ComponentType<{ className?: string }>
		onClick: (row: TData) => void
		variant?: 'default' | 'destructive'
	}[],
) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Mở menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{actions.map((action, index) => (
					<DropdownMenuItem
						key={index}
						onClick={e => {
							e.stopPropagation() // Prevent row click event
							action.onClick(row.original)
						}}
						className={
							action.variant === 'destructive' ? 'text-destructive' : ''
						}
					>
						{action.icon && <action.icon className="mr-2 h-4 w-4" />}
						{action.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}