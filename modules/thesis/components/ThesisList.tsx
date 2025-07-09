/**
 * Thesis List Component
 * Display and manage thesis in table format
 */
import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import type { Thesis } from "../types";
import { Button } from "@/components/ui/button";

interface ThesisListProps {
  theses: Thesis[];
  isLoading: boolean;
  onEdit: (thesis: Thesis) => void;
  onDelete: (thesis: Thesis) => void;
  onView?: (thesis: Thesis) => void;
  /**
   * Optional filter/search bar to inject above the table (e.g. search input, filter controls)
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
  /**
   * Pagination: callback when page changes
   */
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

/**
 * Thesis List Table
 * - Only receives data, loading, and action handlers (edit, delete, view, create)
 * - filterBar can be injected from parent for custom search/filter UI
 */
export function ThesisList({
  theses,
  isLoading,
  onEdit,
  onDelete,
  onView,
  filterBar,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}: ThesisListProps) {
  const columns = [
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium max-w-[300px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "studentName",
      header: "Sinh viên",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">
          {row.getValue("studentName") || "N/A"}
          {row.original.studentCode && (
            <div className="text-xs text-gray-500">
              {row.original.studentCode}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "supervisorName",
      header: "GV Hướng dẫn",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue("supervisorName") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "examinerName",
      header: "GV Phản biện",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue("examinerName") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "academicYearName",
      header: "Năm học",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">
          {row.getValue("academicYearName") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "semesterName",
      header: "Học kỳ",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">{row.getValue("semesterName") || "N/A"}</div>
      ),
    },
    {
      accessorKey: "submissionDate",
      header: "Ngày nộp",
      cell: ({ row }: { row: any }) => {
        const submissionDate = row.getValue("submissionDate");
        return (
          <div className="text-sm">
            {submissionDate
              ? new Date(submissionDate).toLocaleDateString("vi-VN")
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "approved":
              return "default";
            case "pending":
              return "secondary";
            case "rejected":
              return "destructive";
            default:
              return "outline";
          }
        };
        const getStatusLabel = (status: string) => {
          switch (status) {
            case "approved":
              return "Đã phê duyệt";
            case "pending":
              return "Chờ phê duyệt";
            case "rejected":
              return "Từ chối";
            default:
              return "Chưa xác định";
          }
        };
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { original: Thesis } }) => {
        const thesis = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(thesis)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(thesis)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(thesis)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={theses}
        isLoading={isLoading}
        filterBar={filterBar}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        limit={limit}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
