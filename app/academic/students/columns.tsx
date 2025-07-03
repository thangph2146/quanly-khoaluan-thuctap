'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Student } from '@/modules/academic/types'

export const columns: ColumnDef<Student>[] = [
	{
		id: "stt",
		header: "STT",
		cell: ({ row }) => {
			return <div className="text-center font-medium">{row.index + 1}</div>
		},
	},
	{
		accessorKey: "studentCode",
		header: "Mã sinh viên",
		cell: ({ row }) => {
			return (
				<div className="font-mono text-sm bg-blue-50 px-2 py-1 rounded border">
					{row.getValue("studentCode")}
				</div>
			)
		},
	},
	{
		accessorKey: "fullName",
		header: "Họ và tên",
		cell: ({ row }) => {
			return (
				<div className="font-medium text-gray-900">
					{row.getValue("fullName")}
				</div>
			)
		},
	},
	{
		accessorKey: "dateOfBirth",
		header: "Ngày sinh",
		cell: ({ row }) => {
			const dateOfBirth = row.getValue("dateOfBirth") as string
			const formattedDate = new Date(dateOfBirth).toLocaleDateString('vi-VN')
			return (
				<div className="text-sm text-gray-600">
					{formattedDate}
				</div>
			)
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			return (
				<div className="text-sm text-blue-600">
					{row.getValue("email")}
				</div>
			)
		},
	},
	{
		accessorKey: "phoneNumber",
		header: "Số điện thoại",
		cell: ({ row }) => {
			return (
				<div className="text-sm text-gray-700">
					{row.getValue("phoneNumber")}
				</div>
			)
		},
	},
	{
		id: "actions",
		header: "Thao tác",
		cell: ({ row }) => {
			// This will be replaced with actual action buttons in the main component
			return <div className="text-center">Actions</div>
		},
	},
] 