import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateButton, DeleteButton } from "@/components/common/ProtectedButton";
import { DataTable } from "@/components/common/data-table";
import type { Partner } from "../types";
import { Badge } from "@/components/ui/badge";

interface PartnerListProps {
  partners: Partner[];
  isLoading: boolean;
  onEdit: (partner: Partner) => void;
  onView: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  filterBar?: React.ReactNode;
}

export const PartnerList: React.FC<PartnerListProps> = ({
  partners,
  isLoading,
  onEdit,
  onView,
  onDelete,
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  filterBar,
}) => {
  const columns = [
    {
      accessorKey: "name",
      header: "Tên đối tác",
      cell: ({ row }: { row: { original: Partner } }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "Số điện thoại",
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }: { row: { original: Partner } }) => (
        <Badge variant={row.original.isActive ? "default" : "destructive"}>
          {row.original.isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { original: Partner } }) => {
        const partner = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onView(partner)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <UpdateButton
              module="Partner"
              variant="outline"
              size="icon"
              onClick={() => onEdit(partner)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </UpdateButton>
            <DeleteButton
              module="Partner"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(partner)}
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
      data={partners || []}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      limit={limit}
      onLimitChange={onLimitChange}
      filterBar={filterBar}
    />
  );
};
