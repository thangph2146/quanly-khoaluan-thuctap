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
import { ArrowUpDown, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react'
import { TableSkeleton } from './table-skeleton'

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	isLoading?: boolean
	searchableColumn?: string
	searchPlaceholder?: string
	onRowClick?: (row: TData) => void
	// Tree table props
	isTreeTable?: boolean
	getChildren?: (row: TData) => TData[]
	getParentId?: (row: TData) => number | null
	getId?: (row: TData) => number
}

// Helper function to flatten hierarchical tree structure for display
function flattenTreeStructure<TData>(
	data: TData[],
	getId: (item: TData) => number,
	getChildren: (item: TData) => TData[]
): TData[] {
	const result: TData[] = []
	
	// Safety check: ensure data is an array
	if (!Array.isArray(data)) {
		console.warn('DataTable: flattenTreeStructure called with non-array data:', data)
		return []
	}
	
	const flatten = (items: TData[], level: number = 0) => {
		// Safety check: ensure items is an array
		if (!Array.isArray(items)) {
			console.warn('DataTable: flatten called with non-array items:', items)
			return
		}
		
		items.forEach(item => {
			// Add a temporary level property for rendering
			;(item as TData & { _level: number })._level = level
			result.push(item)
			
			// Add children recursively
			const children = getChildren(item)
			if (children && children.length > 0) {
				flatten(children, level + 1)
			}
		})
	}
	
	flatten(data)
	return result
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	searchableColumn,
	searchPlaceholder = 'Tìm kiếm...',
	onRowClick,
	isTreeTable = false,
	getChildren,
	getId,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())

	// Auto-expand root items that have children
	React.useEffect(() => {
		if (isTreeTable && getId && getChildren && Array.isArray(data) && data.length > 0) {
			const rootsWithChildren = data
				.filter(item => getChildren(item).length > 0)
				.map(item => getId(item))
			
			if (rootsWithChildren.length > 0) {
				setExpandedRows(new Set(rootsWithChildren))
			}
		}
	}, [data, isTreeTable, getId, getChildren])

	// Process data for tree structure if needed
	const processedData = React.useMemo(() => {
		// Safety check: ensure data is an array
		const safeData = Array.isArray(data) ? data : []
		
		if (!isTreeTable || !getId || !getChildren) {
			return safeData
		}
		
		// Flatten the tree structure for display
		return flattenTreeStructure(safeData, getId, getChildren)
	}, [data, isTreeTable, getId, getChildren])

	const table = useReactTable({
		data: processedData,
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

	const toggleRowExpansion = (rowId: number) => {
		setExpandedRows(prev => {
			const newSet = new Set(prev)
			if (newSet.has(rowId)) {
				newSet.delete(rowId)
			} else {
				newSet.add(rowId)
			}
			return newSet
		})
	}

	const isRowExpanded = (rowId: number) => expandedRows.has(rowId)

	const getRowLevel = (row: TData): number => {
		if (!isTreeTable) return 0
		
		// Use the temporary _level property added during flattening
		return (row as TData & { _level?: number })._level || 0
	}

	const shouldShowRow = (row: TData): boolean => {
		if (!isTreeTable || !getId) return true
		
		const level = getRowLevel(row)
		if (level === 0) return true // Root items are always shown
		
		// For child items, check if their parent is expanded
		const flattenedData = processedData
		const currentIndex = flattenedData.findIndex(item => getId && getId(item) === getId(row))
		
		// Find the parent (previous item with level - 1)
		for (let i = currentIndex - 1; i >= 0; i--) {
			const potentialParent = flattenedData[i]
			const parentLevel = getRowLevel(potentialParent)
			
			if (parentLevel === level - 1) {
				const parentId = getId(potentialParent)
				return expandedRows.has(parentId)
			}
		}
		
		return false
	}

	const expandAll = () => {
		if (!isTreeTable || !getId || !getChildren) return
		
		const allExpandableIds = processedData
			.filter(item => getChildren(item).length > 0)
			.map(item => getId(item))
		
		setExpandedRows(new Set(allExpandableIds))
	}

	const collapseAll = () => {
		setExpandedRows(new Set())
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				{searchableColumn && (
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
				)}
				{isTreeTable && (
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={expandAll}
							className="text-xs"
						>
							Mở rộng tất cả
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={collapseAll}
							className="text-xs"
						>
							Thu gọn tất cả
						</Button>
					</div>
				)}
			</div>
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
								table.getRowModel().rows
									.filter(row => shouldShowRow(row.original))
									.map(row => {
										const level = getRowLevel(row.original)
										const hasChildren = isTreeTable && getChildren && getChildren(row.original).length > 0
										const rowId = getId ? getId(row.original) : row.index
										const isExpanded = isRowExpanded(rowId)
										
										return (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && 'selected'}
												onClick={() => onRowClick?.(row.original)}
												className={onRowClick ? 'cursor-pointer' : ''}
											>
												{row.getVisibleCells().map((cell, cellIndex) => (
													<TableCell key={cell.id}>
														{cellIndex === 0 && isTreeTable ? (
															<div 
																className="flex items-center"
																style={{ paddingLeft: `${level * 20}px` }}
															>
																{hasChildren && (
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 mr-2"
																		onClick={(e) => {
																			e.stopPropagation()
																			toggleRowExpansion(rowId)
																		}}
																	>
																		{isExpanded ? (
																			<ChevronDown className="h-4 w-4" />
																		) : (
																			<ChevronRight className="h-4 w-4" />
																		)}
																	</Button>
																)}
																{!hasChildren && level > 0 && (
																	<div className="w-6 h-6 mr-2 flex items-center justify-center">
																		<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
																	</div>
																)}
																<div className="flex-1">
																	{flexRender(
																		cell.column.columnDef.cell,
																		cell.getContext(),
																	)}
																</div>
															</div>
														) : (
															flexRender(
																cell.column.columnDef.cell,
																cell.getContext(),
															)
														)}
													</TableCell>
												))}
											</TableRow>
										)
									})
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