"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Department } from "@/modules/academic/types"

export const columns: ColumnDef<Department>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "code",
    header: "Mã đơn vị",
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {row.getValue("code")}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Tên đơn vị",
    cell: ({ row }) => {
      const department = row.original
      return (
        <div className="font-medium">{department.name}</div>
      )
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: () => {
      // This will be replaced with actual action buttons in the main component
      return <div className="text-center">Actions</div>
    },
  },
] 