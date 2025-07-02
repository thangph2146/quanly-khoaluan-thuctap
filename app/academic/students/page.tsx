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
import { students } from '@/modules/academic/data'
import { Student } from '@/modules/academic/types'

// Form Component
const StudentForm = ({
	student,
	onSave,
	onCancel,
}: {
	student?: Student | null
	onSave: (data: Partial<Student>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		fullName: student?.fullName || '',
		studentCode: student?.studentCode || '',
		email: student?.email || '',
		phoneNumber: student?.phoneNumber || '',
		dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
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
				<Label htmlFor="fullName">Họ và tên</Label>
				<Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="studentCode">Mã số sinh viên</Label>
				<Input id="studentCode" name="studentCode" value={formData.studentCode} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="phoneNumber">Số điện thoại</Label>
				<Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
			</div>
			<div className="space-y-2">
				<Label htmlFor="dateOfBirth">Ngày sinh</Label>
				<Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
			</div>
            <SheetFooter>
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
                <Button onClick={handleFormSave}>Lưu thay đổi</Button>
            </SheetFooter>
		</div>
	)
}

// Main Page Component
export default function StudentsPage() {
	const [studentData, setStudentData] = useState<Student[]>(students)
	const [isCreateSheetOpen, setCreateSheetOpen] = useState(false)
	const [isEditSheetOpen, setEditSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

	const handleCreate = (data: Partial<Student>) => {
		const newStudent: Student = {
			id: Math.max(...studentData.map(s => s.id), 0) + 1,
			fullName: data.fullName!,
			studentCode: data.studentCode!,
			email: data.email!,
			phoneNumber: data.phoneNumber!,
			dateOfBirth: new Date(data.dateOfBirth!).toISOString(),
		}
		setStudentData(prev => [...prev, newStudent])
		setCreateSheetOpen(false)
	}

	const handleUpdate = (data: Partial<Student>) => {
		if (!selectedStudent) return
		setStudentData(prev =>
			prev.map(s => (s.id === selectedStudent.id ? { ...s, ...data } : s))
		)
		setEditSheetOpen(false)
		setSelectedStudent(null)
	}

	const handleDelete = () => {
		if (!selectedStudent) return
		setStudentData(prev => prev.filter(s => s.id !== selectedStudent.id))
		setDeleteDialogOpen(false)
		setSelectedStudent(null)
	}

	const openEditSheet = (student: Student) => {
		setSelectedStudent(student)
		setEditSheetOpen(true)
	}

	const openDeleteDialog = (student: Student) => {
		setSelectedStudent(student)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Student } }) => {
					const student = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditSheet(student)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(student)}
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
		{ label: 'Sinh viên' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Sinh viên"
				description="Thêm, sửa, xóa và quản lý thông tin sinh viên"
				breadcrumbs={breadcrumbs}
				actions={
                    <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Sinh viên
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Thêm sinh viên mới</SheetTitle>
                                <SheetDescription>Điền thông tin chi tiết.</SheetDescription>
                            </SheetHeader>
                            <StudentForm onSave={handleCreate} onCancel={() => setCreateSheetOpen(false)} />
                        </SheetContent>
                    </Sheet>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={studentData}
					searchableColumn="fullName"
					searchPlaceholder="Tìm theo tên, MSSV, email..."
				/>
			</PageHeader>
            
			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa thông tin sinh viên</SheetTitle>
						<SheetDescription>Cập nhật thông tin.</SheetDescription>
					</SheetHeader>
					<StudentForm student={selectedStudent} onSave={handleUpdate} onCancel={() => setEditSheetOpen(false)}/>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Sinh viên &quot;{selectedStudent?.fullName}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedStudent(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 