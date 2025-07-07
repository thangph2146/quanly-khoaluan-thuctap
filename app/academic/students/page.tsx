'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { Student } from '@/modules/academic/types'
import { StudentsApi } from '@/lib/api/students.api'

// Form Component
const StudentForm = ({
	student,
	onSave,
	onCancel,
	isSubmitting = false,
}: {
	student?: Student | null
	onSave: (data: Partial<Student>) => void
	onCancel: () => void
	isSubmitting?: boolean
}) => {
	const [formData, setFormData] = useState({
		fullName: student?.fullName || '',
		studentCode: student?.studentCode || '',
		email: student?.email || '',
		phoneNumber: student?.phoneNumber || '',
		dateOfBirth: student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Reset form when student changes
	useEffect(() => {
		if (student) {
			setFormData({
				fullName: student.fullName || '',
				studentCode: student.studentCode || '',
				email: student.email || '',
				phoneNumber: student.phoneNumber || '',
				dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
			})
		} else {
			setFormData({
				fullName: '',
				studentCode: '',
				email: '',
				phoneNumber: '',
				dateOfBirth: '',
			})
		}
		setErrors({})
	}, [student])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.fullName.trim()) {
			newErrors.fullName = 'Họ và tên không được để trống'
		}

		if (!formData.studentCode.trim()) {
			newErrors.studentCode = 'Mã sinh viên không được để trống'
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email không được để trống'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email không hợp lệ'
		}

		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = 'Số điện thoại không được để trống'
		}

		if (!formData.dateOfBirth) {
			newErrors.dateOfBirth = 'Ngày sinh không được để trống'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}
    
    const handleFormSave = () => {
		if (validateForm()) {
			onSave(formData)
		}
    }

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="fullName">Họ và tên</Label>
				<Input 
					id="fullName" 
					name="fullName" 
					value={formData.fullName} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: Nguyễn Văn A"
					className={errors.fullName ? 'border-red-500' : ''}
				/>
				{errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="studentCode">Mã số sinh viên</Label>
				<Input 
					id="studentCode" 
					name="studentCode" 
					value={formData.studentCode} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: SV001"
					className={errors.studentCode ? 'border-red-500' : ''}
				/>
				{errors.studentCode && <p className="text-sm text-red-500">{errors.studentCode}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input 
					id="email" 
					name="email" 
					type="email" 
					value={formData.email} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: student@university.edu.vn"
					className={errors.email ? 'border-red-500' : ''}
				/>
				{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="phoneNumber">Số điện thoại</Label>
				<Input 
					id="phoneNumber" 
					name="phoneNumber" 
					value={formData.phoneNumber} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: 0123456789"
					className={errors.phoneNumber ? 'border-red-500' : ''}
				/>
				{errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="dateOfBirth">Ngày sinh</Label>
				<Input 
					id="dateOfBirth" 
					name="dateOfBirth" 
					type="date" 
					value={formData.dateOfBirth} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Chọn ngày sinh"
					className={`w-full inline ${errors.dateOfBirth ? 'border-red-500' : ''}`}
				/>
				{errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
			</div>
            <SheetFooter>
				<Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
					Hủy
				</Button>
                <Button onClick={handleFormSave} disabled={isSubmitting}>
					{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
				</Button>
            </SheetFooter>
		</div>
	)
}

// Main Page Component
export default function StudentsPage() {
	const [students, setStudents] = useState<Student[]>([])
	const [isCreateSheetOpen, setCreateSheetOpen] = useState(false)
	const [isEditSheetOpen, setEditSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isViewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()

	// Fetch data from API
	const loadStudents = useCallback(async () => {
		try {
			setIsLoading(true)
			const data = await StudentsApi.getAll()
			setStudents(data)
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải danh sách sinh viên',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}, [toast])

	useEffect(() => {
		loadStudents()
	}, [loadStudents])

	const handleCreate = async (data: Partial<Student>) => {
		try {
			setIsSubmitting(true)
			const newStudent: Omit<Student, 'id'> = {
				fullName: data.fullName!,
				studentCode: data.studentCode!,
				email: data.email!,
				phoneNumber: data.phoneNumber!,
				dateOfBirth: new Date(data.dateOfBirth!).toISOString(),
			}
			await StudentsApi.create(newStudent)
			await loadStudents() // Refresh data
			setCreateSheetOpen(false)
			toast({
				title: 'Thành công',
				description: 'Tạo sinh viên mới thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo sinh viên mới',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdate = async (data: Partial<Student>) => {
		if (!selectedStudent) return
		
		try {
			setIsSubmitting(true)
			const updatedStudent: Student = {
				...selectedStudent,
				fullName: data.fullName!,
				studentCode: data.studentCode!,
				email: data.email!,
				phoneNumber: data.phoneNumber!,
				dateOfBirth: new Date(data.dateOfBirth!).toISOString(),
			}
			await StudentsApi.update(selectedStudent.id, updatedStudent)
			await loadStudents() // Refresh data
			setEditSheetOpen(false)
			setSelectedStudent(null)
			toast({
				title: 'Thành công',
				description: 'Cập nhật sinh viên thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật sinh viên',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async () => {
		if (!selectedStudent) return
		
		try {
			setIsSubmitting(true)
			await StudentsApi.delete(selectedStudent.id)
			await loadStudents() // Refresh data
			setDeleteDialogOpen(false)
			setSelectedStudent(null)
			toast({
				title: 'Thành công',
				description: 'Xóa sinh viên thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa sinh viên',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const openViewDialog = (student: Student) => {
		setSelectedStudent(student)
		setViewDialogOpen(true)
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
								onClick={() => openViewDialog(student)}
								title="Xem chi tiết"
							>
								<Eye className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditSheet(student)}
								title="Chỉnh sửa"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(student)}
								title="Xóa"
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
				description="Thêm, sửa, xóa và quản lý thông tin sinh viên trong hệ thống"
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
                                <SheetDescription>Điền thông tin chi tiết để tạo sinh viên mới.</SheetDescription>
                            </SheetHeader>
                            <StudentForm 
								onSave={handleCreate} 
								onCancel={() => setCreateSheetOpen(false)}
								isSubmitting={isSubmitting}
							/>
                        </SheetContent>
                    </Sheet>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={students}
					searchableColumn="fullName"
					searchPlaceholder="Tìm theo tên hoặc mã sinh viên..."
					isLoading={isLoading}
				/>
			</PageHeader>
            
			{/* View Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="sm:max-w-[500px] p-0">
					<DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
						<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<Eye className="h-5 w-5 text-blue-600" />
							Chi tiết sinh viên
						</DialogTitle>
						<DialogDescription className="text-gray-600 mt-1">
							Thông tin chi tiết về sinh viên đã chọn
						</DialogDescription>
					</DialogHeader>
					{selectedStudent && (
						<div className="p-6 space-y-6">
							{/* Student Name */}
							<div className="text-center pb-4 border-b">
								<h3 className="text-2xl font-bold text-gray-900 mb-1">
									{selectedStudent.fullName}
								</h3>
								<p className="text-sm text-gray-500">MSSV: {selectedStudent.studentCode}</p>
							</div>
							
							{/* Student Information */}
							<div className="space-y-4">
								<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										<label className="text-sm font-medium text-blue-800">Thông tin cơ bản</label>
									</div>
									<div className="space-y-2">
										<p className="text-sm">
											<span className="font-medium">Họ và tên:</span> {selectedStudent.fullName}
										</p>
										<p className="text-sm">
											<span className="font-medium">Mã sinh viên:</span> {selectedStudent.studentCode}
										</p>
										<p className="text-sm">
											<span className="font-medium">Ngày sinh:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString('vi-VN')}
										</p>
									</div>
								</div>
								
								<div className="bg-green-50 rounded-lg p-4 border border-green-200">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<label className="text-sm font-medium text-green-800">Thông tin liên hệ</label>
									</div>
									<div className="space-y-2">
										<p className="text-sm">
											<span className="font-medium">Email:</span> {selectedStudent.email}
										</p>
										<p className="text-sm">
											<span className="font-medium">Số điện thoại:</span> {selectedStudent.phoneNumber}
										</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa sinh viên</SheetTitle>
						<SheetDescription>Cập nhật thông tin cho sinh viên đã chọn.</SheetDescription>
					</SheetHeader>
					<StudentForm 
						student={selectedStudent} 
						onSave={handleUpdate} 
						onCancel={() => setEditSheetOpen(false)}
						isSubmitting={isSubmitting}
					/>
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
						<AlertDialogCancel onClick={() => setSelectedStudent(null)} disabled={isSubmitting}>
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
							{isSubmitting ? 'Đang xóa...' : 'Xóa'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
