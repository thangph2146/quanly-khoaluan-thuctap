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

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { academicYears } from '@/modules/academic/data'
import { AcademicYear } from '@/modules/academic/types'

// Form Component
const AcademicYearForm = ({
	year,
	onSave,
	onCancel,
}: {
	year?: AcademicYear | null
	onSave: (data: Partial<AcademicYear>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		name: year?.name || '',
		startDate: year?.startDate ? new Date(year.startDate).toISOString().split('T')[0] : '',
		endDate: year?.endDate ? new Date(year.endDate).toISOString().split('T')[0] : '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}
    
    const handleFormSave = () => {
        onSave(formData)
    }

	return (
		<div className="space-y-4 py-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên niên khóa</Label>
				<Input id="name" name="name" value={formData.name} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="startDate">Ngày bắt đầu</Label>
				<Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="endDate">Ngày kết thúc</Label>
				<Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
			</div>
            <SheetFooter>
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleFormSave}>Lưu thay đổi</Button>
            </SheetFooter>
		</div>
	)
}

export default function AcademicYearsPage() {
	const [years, setYears] = useState<AcademicYear[]>(academicYears)
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setEditDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null)

	const handleCreate = (data: Partial<AcademicYear>) => {
		const newYear: AcademicYear = {
			id: Math.max(...years.map(y => y.id), 0) + 1,
			name: data.name!,
			startDate: new Date(data.startDate!).toISOString(),
			endDate: new Date(data.endDate!).toISOString(),
		}
		setYears(prev => [...prev, newYear])
		setCreateDialogOpen(false)
	}

	const handleUpdate = (data: Partial<AcademicYear>) => {
		if (!selectedYear) return
		setYears(prev =>
			prev.map(y => (y.id === selectedYear.id ? { ...y, ...data, startDate: new Date(data.startDate!).toISOString(), endDate: new Date(data.endDate!).toISOString() } : y))
		)
		setEditDialogOpen(false)
		setSelectedYear(null)
	}

	const handleDelete = () => {
		if (!selectedYear) return
		setYears(prev => prev.filter(y => y.id !== selectedYear.id))
		setDeleteDialogOpen(false)
		setSelectedYear(null)
	}

	const openEditDialog = (year: AcademicYear) => {
		setSelectedYear(year)
		setEditDialogOpen(true)
	}

	const openDeleteDialog = (year: AcademicYear) => {
		setSelectedYear(year)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: AcademicYear } }) => {
					const year = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditDialog(year)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(year)}
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
		{ label: 'Niên khóa' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Niên khóa"
				description="Thêm, sửa, xóa và quản lý các niên khóa trong hệ thống"
				breadcrumbs={breadcrumbs}
				actions={
					<Sheet open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
						<SheetTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Thêm Niên khóa
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Thêm niên khóa mới</SheetTitle>
								<SheetDescription>Điền thông tin chi tiết để tạo niên khóa.</SheetDescription>
							</SheetHeader>
							<AcademicYearForm onSave={handleCreate} onCancel={() => setCreateDialogOpen(false)} />
						</SheetContent>
					</Sheet>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={years}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên niên khóa..."
				/>
			</PageHeader>
			
			{/* Edit Sheet */}
			<Sheet open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa niên khóa</SheetTitle>
						<SheetDescription>Cập nhật thông tin cho niên khóa đã chọn.</SheetDescription>
					</SheetHeader>
					<AcademicYearForm year={selectedYear} onSave={handleUpdate} onCancel={() => setEditDialogOpen(false)}/>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Niên khóa &quot;{selectedYear?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedYear(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 