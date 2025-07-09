"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { logger } from "@/lib/utils/logger";

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
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const pageSizeOptions = [5, 10, 20, 50, 100];

	// State for expanded rows (tree table)
	const [expandedRowIds, setExpandedRowIds] = React.useState<Set<string | number>>(new Set());
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

	// State for selected rows
	const [selectedRowIds, setSelectedRowIds] = React.useState<Set<string | number>>(new Set());
	const allRowIds = React.useMemo(() => data.map((row) => (getId ? getId(row) : (row as any).id)), [data, getId]);
	const isAllSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedRowIds.has(id));
	const isIndeterminate = selectedRowIds.size > 0 && !isAllSelected;
	const handleSelectAll = () => {
		if (isAllSelected) {
			setSelectedRowIds(new Set());
		} else {
			setSelectedRowIds(new Set(allRowIds));
		}
	};

	// Recursive helper to get all descendant ids for a row (tree table)
	const getAllDescendantIds = React.useCallback(
		(row: TData): (string | number)[] => {
			if (!getChildren) return [];
			const children = getChildren(row) || [];
			let ids: (string | number)[] = [];
			for (const child of children) {
				const childId = getId ? getId(child) : (child as any).id;
				ids.push(childId);
				ids = ids.concat(getAllDescendantIds(child));
			}
			return ids;
		},
		[getChildren, getId]
	);

	const handleSelectRow = (rowId: string | number) => {
		setSelectedRowIds((prev) => {
			const next = new Set(prev);
			// Find the row object by id
			const rowObj = data.find((row) => (getId ? getId(row) : (row as any).id) === rowId);
			if (isTreeTable && getChildren && rowObj) {
				// Get all descendant ids
				const descendantIds = getAllDescendantIds(rowObj);
				if (next.has(rowId)) {
					// Deselect parent and all descendants
					next.delete(rowId);
					descendantIds.forEach((id) => next.delete(id));
				} else {
					// Select parent and all descendants
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
	};

	// Tree rendering helpers
	function renderTreeRows(rows: any[], level = 0): React.ReactNode[] {
		return rows.flatMap((row) => {
			if (!row) return [];
			const rowId = getId ? getId(row.original) : row.id;
			const childrenData = getChildren ? getChildren(row.original) : [];
			// Map children data to row objects
			const childrenRows = childrenData
				.map((child: any) => table.getRowModel().rows.find((r) => getId && getId(r.original) === getId(child)))
				.filter(Boolean);
			const hasChildren = childrenRows.length > 0;
			const isOpen = expandedRowIds.has(rowId);
			// Collapsible row
			const rowCells = [
				<TableCell key={`checkbox-${rowId}`} style={level > 0 ? { paddingLeft: `${level * 1.5}rem` } : {}}>
					<Checkbox
						checked={selectedRowIds.has(rowId)}
						onCheckedChange={() => handleSelectRow(rowId)}
						aria-label="Chọn dòng"
					/>
				</TableCell>,
				...row.getVisibleCells().map((cell: any, idx: number) => (
					<TableCell
						key={cell.id}
						className="whitespace-nowrap"
					>
						{idx === 0 && hasChildren ? (
							<div className="flex items-center gap-1">
								<button
									type="button"
									className="p-0 mr-1 align-middle"
									onClick={() => handleToggleRow(rowId)}
									aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
								>
									<ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
								</button>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</div>
						) : (
							flexRender(cell.column.columnDef.cell, cell.getContext())
						)}
					</TableCell>
				)),
			];
			return [
				<React.Fragment key={rowId}>
					<TableRow>
						{rowCells}
					</TableRow>
					{hasChildren && isOpen && (
						<>{renderTreeRows(childrenRows, level + 1)}</>
					)}
				</React.Fragment>,
			];
		});
	}

	// Add select column to columns
	const columnsWithSelect = React.useMemo(() => [
		{
			id: 'select',
			header: () => (
				<Checkbox
					checked={isAllSelected}
					indeterminate={isIndeterminate}
					onCheckedChange={handleSelectAll}
					aria-label="Chọn tất cả"
				/>
			),
			cell: ({ row }: { row: any }) => {
				const rowId = getId ? getId(row.original) : row.id;
				return (
					<Checkbox
						checked={selectedRowIds.has(rowId)}
						onCheckedChange={() => handleSelectRow(rowId)}
						aria-label="Chọn dòng"
					/>
				);
			},
			size: 32,
		},
		...columns,
	], [columns, isAllSelected, isIndeterminate, selectedRowIds, getId]);

	// Bulk action bar
	const selectedIds = Array.from(selectedRowIds);
	const showBulkActions = selectedIds.length > 0 && (onDeleteMany || onRestoreMany);
	const [isDeleteManyDialogOpen, setIsDeleteManyDialogOpen] = React.useState(false);
	const [isRestoreManyDialogOpen, setIsRestoreManyDialogOpen] = React.useState(false);

	const handleDeleteManyConfirm = () => {
		if (onDeleteMany) onDeleteMany(selectedIds);
		setIsDeleteManyDialogOpen(false);
		setSelectedRowIds(new Set());
	};

	const handleRestoreManyConfirm = () => {
		if (onRestoreMany) onRestoreMany(selectedIds);
		setIsRestoreManyDialogOpen(false);
		setSelectedRowIds(new Set());
	};

	React.useEffect(() => {
		logger.debug("DataTable props", {
			onDeleteMany,
			onRestoreMany,
			data,
			selectedIds,
			showBulkActions,
		}, "DataTable");
	}, [onDeleteMany, onRestoreMany, data, selectedIds, showBulkActions]);

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
							onClick={() => setIsDeleteManyDialogOpen(true)}
						>
							Xóa nhiều
						</Button>
					)}
					{onRestoreMany && (
						<Button
							className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/80"
							onClick={() => setIsRestoreManyDialogOpen(true)}
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
							{columnsWithSelect.map((col, idx) => (
								<TableHead key={col.id || idx} className="whitespace-nowrap">
									{typeof col.header === 'function' ? col.header({} as any) : col.header}
								</TableHead>
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
									<TableRow key={row.id}>
										{columnsWithSelect.map((col, idx) => {
											if (col.id === 'select') {
												const rowId = getId ? getId(row.original) : row.id;
												return (
													<TableCell key={col.id}>
														<Checkbox
															checked={selectedRowIds.has(rowId)}
															onCheckedChange={() => handleSelectRow(rowId)}
															aria-label="Chọn dòng"
														/>
													</TableCell>
												);
											}
											// Render normal cell
											const cell = row.getVisibleCells()[idx - 1];
											return (
												<TableCell key={col.id || idx} className="whitespace-nowrap">
													{cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
												</TableCell>
											);
										})}
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
				{/* Bulk delete confirmation dialog */}
				<AlertDialog open={isDeleteManyDialogOpen} onOpenChange={setIsDeleteManyDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
							<AlertDialogDescription>
								Bạn có chắc chắn muốn xóa {selectedIds.length} mục đã chọn? Hành động này không thể hoàn tác.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setIsDeleteManyDialogOpen(false)}>
								Hủy
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteManyConfirm}
								className="bg-red-600 hover:bg-red-700"
							>
								Xóa
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				{/* Bulk restore confirmation dialog */}
				<AlertDialog open={isRestoreManyDialogOpen} onOpenChange={setIsRestoreManyDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
							<AlertDialogDescription>
								Bạn có chắc chắn muốn khôi phục {selectedIds.length} mục đã chọn?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel onClick={() => setIsRestoreManyDialogOpen(false)}>
								Hủy
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleRestoreManyConfirm}
								className="bg-primary hover:bg-primary/80"
							>
								Khôi phục
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
