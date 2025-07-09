/**
 * User List Component
 * Display and manage users in table format
 */
import React from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import type { User } from "../types";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView?: (user: User) => void;
}

export function UserList({
  users,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  onView,
}: UserListProps) {
  const columns = [
    {
      accessorKey: "name",
      header: "Họ và tên",
      cell: ({ row }: { row: any }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "userRoles",
      header: "Vai trò",
      cell: ({ row }: { row: any }) => {
        const userRoles = row.getValue("userRoles") as string[] | undefined;
        return (
          <div className="flex flex-wrap gap-1">
            {userRoles && userRoles.length > 0 ? (
              userRoles.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                Chưa có vai trò
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }: { row: any }) => {
        const isActive = row.getValue("isActive");
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Kích hoạt" : "Vô hiệu hóa"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onView(user)}
                title="Xem chi tiết"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(user)}
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(user)}
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
      <div className="flex justify-end items-center">
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
      />
    </div>
  );
}
