"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./table-skeleton";
import { Label } from "../ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
} from "../ui/pagination";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "../ui/select";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	/**
	 * Optional filter/search bar to render above the table
	 */
	filterBar?: React.ReactNode;
	/**
	 * Pagination: current page (1-based)
	 */
	page?: number;
	/**
	 * Pagination: total number of pages
	 */
	totalPages?: number;
	/**9
	 * Pagination: callback when page changes
	 */
	onPageChange?: (page: number) => void;
	/**
	 * Page size (limit) and handler
	 */
	limit?: number;
	onLimitChange?: (limit: number) => void;
	/** Tree table support */
	isTreeTable?: boolean;
	getId?: (row: TData) => string | number;
	getParentId?: (row: TData) => string | number | null;
	getChildren?: (row: TData) => TData[];
	onDeleteMany?: (ids: (string | number)[]) => void;
	onRestoreMany?: (ids: (string | number)[]) => void;
  deleteButtonText?: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
	filterBar,
	page,
	totalPages,
	onPageChange,
	limit,
	onLimitChange,
	isTreeTable = false,
	getId,
	getParentId,
	getChildren,
	onDeleteMany,
	onRestoreMany,
  deleteButtonText = 'Xóa nhiều',
}: DataTableProps<TData, TValue>) {
	const [expandedRowIds, setExpandedRowIds] = React.useState<Set<string | number>>(new Set());
	const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string | number>>(new Set());

	const allRowIds = React.useMemo(() => data.map((row) => (getId ? getId(row) : (row as TData & { id: string | number }).id)), [data, getId]);
	const isAllSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedRowIds.has(id));

	const handleSelectAll = React.useCallback(() => {
		setSelectedRowIds(() => {
			if (isAllSelected) {
				return new Set();
			} else {
				return new Set(allRowIds);
			}
		});
	}, [isAllSelected, allRowIds]);

	const getAllDescendantIds = React.useCallback(
		(row: TData): (string | number)[] => {
			if (!getChildren) return [];
			const children = getChildren(row) || [];
			let ids: (string | number)[] = [];
			for (const child of children) {
				const childId = getId ? getId(child) : (child as TData & { id: string | number }).id;
				ids.push(childId);
				ids = ids.concat(getAllDescendantIds(child));
			}
			return ids;
		},
		[getChildren, getId]
	);

	const handleSelectRow = React.useCallback((rowId: string | number) => {
		setSelectedRowIds((prev) => {
			const next = new Set(prev);
			const rowObj = data.find((row) => (getId ? getId(row) : (row as TData & { id: string | number }).id) === rowId);

			if (isTreeTable && getChildren && rowObj) {
				const descendantIds = getAllDescendantIds(rowObj);
				if (next.has(rowId)) {
					next.delete(rowId);
					descendantIds.forEach((id) => next.delete(id));
				} else {
					next.add(rowId);
					descendantIds.forEach((id) => next.add(id));
				}
			} else {
				if (next.has(rowId)) {
					next.delete(rowId);
				} else {
					next.add(rowId);
				}
			}
			return next;
		});
	}, [data, getId, isTreeTable, getChildren, getAllDescendantIds]);
	
	const handleToggleRow = (rowId: string | number) => {
		setExpandedRowIds((prev) => {
			const next = new Set(prev);
			if (next.has(rowId)) {
				next.delete(rowId);
			} else {
				next.add(rowId);
			}
			return next;
		});
	};

	const columnsWithSelect: ColumnDef<TData, TValue>[] = React.useMemo(() => [
		{
			id: 'select',
			header: () => (
				<Checkbox
					checked={isAllSelected}
					onCheckedChange={handleSelectAll}
					aria-label="Chọn tất cả"
				/>
			),
			cell: ({ row }) => {
				const rowId = getId ? getId(row.original) : (row.original as { id: string | number }).id;
				return (
					<Checkbox
						checked={selectedRowIds.has(rowId)}
						onCheckedChange={() => handleSelectRow(rowId)}
						aria-label="Chọn dòng"
					/>
				);
			},
		},
		...columns,
	], [columns, isAllSelected, handleSelectAll, selectedRowIds, handleSelectRow, getId]);

	const tableData = React.useMemo(() => {
		if (!isTreeTable || !getChildren) return data;
	
		const flat: TData[] = [];
		const recurse = (items: TData[]) => {
			for (const item of items) {
				flat.push(item);
				const children = getChildren(item);
				if (children?.length) {
					recurse(children);
				}
			}
		};
		recurse(data);
		return flat;
	}, [data, isTreeTable, getChildren]);

	const table = useReactTable({
		data: tableData,
		columns: columnsWithSelect,
		getCoreRowModel: getCoreRowModel(),
	});

	const pageSizeOptions = [5, 10, 20, 50, 100];

	// Recursive rendering function for tree table
	function renderTreeRows(rows: Row<TData>[], level = 0): React.ReactNode[] {
		return rows.flatMap((row) => {
			if (!row) return [];
			const rowId = getId ? getId(row.original) : (row.original as TData & { id: string | number }).id;
			const childrenData = getChildren ? getChildren(row.original) : [];
			const childrenRows = childrenData
				.map((child: TData) => table.getRowModel().rows.find((r) => getId && getId(r.original) === (getId ? getId(child) : (child as TData & { id: string | number }).id)))
				.filter((r): r is Row<TData> => !!r);
			const hasChildren = childrenRows.length > 0;
			const isOpen = expandedRowIds.has(rowId);

			const visibleCells = row.getVisibleCells();

			const renderedCells = visibleCells.map((cell, idx) => {
                const isFirstDataCell = idx === 1; // 0 is select, 1 is the first data column
                return (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                        {isFirstDataCell ? (
                            <div className="flex items-center gap-1" style={{ paddingLeft: `${level * 1.5}rem` }}>
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        className="p-0 mr-1 align-middle"
                                        onClick={() => handleToggleRow(rowId)}
                                        aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
                                    >
                                        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                ) : (
									<span className="w-4 h-4 mr-1 p-0 inline-block" />
								)}
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                    </TableCell>
                );
            });
			
			return [
				<React.Fragment key={rowId}>
					<TableRow data-state={selectedRowIds.has(rowId) ? "selected" : undefined}>
						{renderedCells}
					</TableRow>
					{hasChildren && isOpen && (
						<>{renderTreeRows(childrenRows, level + 1)}</>
					)}
				</React.Fragment>,
			];
		});
	}

	// Bulk action bar
	const selectedIds = Array.from(selectedRowIds);
	const showBulkActions = selectedIds.length > 0 && (onDeleteMany || onRestoreMany);
	
	const handleDeleteManyTrigger = () => {
		if (onDeleteMany) onDeleteMany(selectedIds);
	};

	const handleRestoreManyTrigger = () => {
		if (onRestoreMany) onRestoreMany(selectedIds);
	};

	return (
		<div className="space-y-2">

			{filterBar && (
				<div className="mb-2">
					<h1 className="mb-2 text-lg font-semibold">Bộ lọc dữ liệu</h1>
					{filterBar}
				</div>
			)}
			{showBulkActions && (
				<div className="flex gap-2 items-center p-2 bg-muted rounded border">
					<span>Đã chọn {selectedIds.length} dòng</span>
					{onDeleteMany && (
						<Button
							className="px-3 py-1 rounded bg-destructive text-white hover:bg-destructive/80"
							onClick={handleDeleteManyTrigger}
						>
							{deleteButtonText}
						</Button>
					)}
					{onRestoreMany && (
						<Button
							className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/80"
							onClick={handleRestoreManyTrigger}
						>
							Khôi phục nhiều
						</Button>
					)}
				</div>
			)}

			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							{table.getHeaderGroups().map(headerGroup => (
								<React.Fragment key={headerGroup.id}>
									{headerGroup.headers.map(header => (
										<TableHead key={header.id} className="whitespace-nowrap">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</React.Fragment>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								{columnsWithSelect.map((_, j) => (
									<TableCell key={j}>
										<TableSkeleton columns={1} />
									</TableCell>
								))}
							</TableRow>
						) : table.getRowModel().rows.length > 0 ? (
							isTreeTable && getId && getChildren
								? renderTreeRows(
									table.getRowModel().rows.filter(
										(row) => !getParentId || !getParentId(row.original)
									)
								)
								: table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
                    ))}
									</TableRow>
								))
						) : (
							<TableRow>
								<TableCell
									colSpan={columnsWithSelect.length}
									className="text-center text-muted-foreground"
								>
									Không có dữ liệu
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-start gap-2 mt-4">
				{onLimitChange && (
					<div className="w-full flex items-center justify-start gap-2">
						<Label htmlFor="page-size">Số dòng/trang</Label>
						<Select
							value={String(limit ?? 10)}
							onValueChange={(val) => onLimitChange(Number(val))}
						>
							<SelectTrigger id="page-size" className="min-w-[80px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((opt) => (
									<SelectItem key={opt} value={String(opt)}>
										{opt}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				{typeof page === "number" &&
					typeof totalPages === "number" && page > 1 && (
						<Pagination className="flex items-end justify-end gap-2">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											onPageChange &&
											page &&
											onPageChange(Math.max(1, page - 1))
										}
										aria-disabled={page === 1}
										tabIndex={page === 1 ? -1 : 0}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages || 0 }, (_, i) => (
									<PaginationItem key={i + 1}>
										<PaginationLink
											isActive={page === i + 1}
											onClick={() => onPageChange && onPageChange(i + 1)}
											tabIndex={0}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											onPageChange &&
											page &&
											totalPages &&
											onPageChange(Math.min(totalPages, page + 1))
										}
										aria-disabled={page >= totalPages}
										tabIndex={page >= totalPages ? -1 : 0}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
			</div>
		</div>
	);
}
