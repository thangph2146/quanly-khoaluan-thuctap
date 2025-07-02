'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { departments } from '@/modules/academic/data'
import { Department } from '@/modules/academic/types'

// Form Component
const DepartmentForm = ({
	department,
	allDepartments,
	onSave,
	onCancel,
}: {
	department?: Department | null
	allDepartments: Department[]
	onSave: (data: Partial<Department>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		name: department?.name || '',
		code: department?.code || '',
		parentDepartmentId: department?.parentDepartmentId || null,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (value: string) => {
		setFormData(prev => ({ ...prev, parentDepartmentId: value ? Number(value) : null }))
	}
    
    const handleFormSave = () => {
        onSave(formData)
    }

	return (
		<div className="space-y-4 py-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên Khoa/Chuyên ngành</Label>
				<Input id="name" name="name" value={formData.name} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="code">Mã</Label>
				<Input id="code" name="code" value={formData.code} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="parentDepartmentId">Đơn vị cha</Label>
				<Select
					value={formData.parentDepartmentId?.toString() || ''}
					onValueChange={handleSelectChange}
				>
					<SelectTrigger>
						<SelectValue placeholder="Chọn đơn vị cha (nếu có)" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Không có</SelectItem>
						{allDepartments
							.filter(d => d.id !== department?.id) // Prevent self-parenting
							.map(d => (
								<SelectItem key={d.id} value={d.id.toString()}>
									{d.name}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>
            <SheetFooter>
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleFormSave}>Lưu thay đổi</Button>
            </SheetFooter>
		</div>
	)
}

// Main Page Component
export default function DepartmentsPage() {
	const [depts, setDepts] = useState<Department[]>(departments)
	const [isCreateSheetOpen, setCreateSheetOpen] = useState(false)
	const [isEditSheetOpen, setEditSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedDept, setSelectedDept] = useState<Department | null>(null)

	const deptsWithParent = depts.map(d => ({
		...d,
		parentDepartment: d.parentDepartmentId ? depts.find(p => p.id === d.parentDepartmentId) : undefined
	}))

	const handleCreate = (data: Partial<Department>) => {
		const newDept: Department = {
			id: Math.max(...depts.map(d => d.id), 0) + 1,
			name: data.name!,
			code: data.code!,
			parentDepartmentId: data.parentDepartmentId,
		}
		setDepts(prev => [...prev, newDept])
		setCreateSheetOpen(false)
	}

	const handleUpdate = (data: Partial<Department>) => {
		if (!selectedDept) return
		setDepts(prev =>
			prev.map(d => (d.id === selectedDept.id ? { ...d, ...data } : d))
		)
		setEditSheetOpen(false)
		setSelectedDept(null)
	}

	const handleDelete = () => {
		if (!selectedDept) return
		setDepts(prev => prev.filter(y => y.id !== selectedDept.id))
		setDeleteDialogOpen(false)
		setSelectedDept(null)
	}

	const openEditSheet = (dept: Department) => {
		setSelectedDept(dept)
		setEditSheetOpen(true)
	}

	const openDeleteDialog = (dept: Department) => {
		setSelectedDept(dept)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Department } }) => {
					const dept = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditSheet(dept)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(dept)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)
				},
			}
		}
		return col
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý đào tạo', href: '#' },
		{ label: 'Khoa & Chuyên ngành' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Khoa & Chuyên ngành"
				description="Thêm, sửa, xóa và quản lý các khoa và chuyên ngành"
				breadcrumbs={breadcrumbs}
				actions={
                    <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Khoa/Chuyên ngành
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Thêm mới</SheetTitle>
                                <SheetDescription>Điền thông tin chi tiết.</SheetDescription>
                            </SheetHeader>
                            <DepartmentForm allDepartments={depts} onSave={handleCreate} onCancel={() => setCreateSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={deptsWithParent}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên hoặc mã..."
				/>
			</PageHeader>
            
			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa Khoa/Chuyên ngành</SheetTitle>
						<SheetDescription>Cập nhật thông tin.</SheetDescription>
					</SheetHeader>
					<DepartmentForm department={selectedDept} allDepartments={depts} onSave={handleUpdate} onCancel={() => setEditSheetOpen(false)}/>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Khoa &quot;{selectedDept?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedDept(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 