'use client'

import { useState, useEffect } from 'react'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { Semester, AcademicYear } from '@/modules/config/types'
import { SemestersApi, CreateSemesterData } from '@/lib/api/semesters.api'
import { AcademicYearsApi } from '@/lib/api/academic-years.api'

// Form Component
const SemesterForm = ({
	semester,
	academicYears,
	onSave,
	onCancel,
	isSubmitting = false,
}: {
	semester?: Semester | null
	academicYears: AcademicYear[]
	onSave: (data: CreateSemesterData) => void
	onCancel: () => void
	isSubmitting?: boolean
}) => {
	const [formData, setFormData] = useState({
		name: semester?.name || '',
		academicYearId: semester?.academicYearId || 0,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Reset form when semester changes
	useEffect(() => {
		if (semester) {
			setFormData({
				name: semester.name || '',
				academicYearId: semester.academicYearId || 0,
			})
		} else {
			setFormData({
				name: '',
				academicYearId: academicYears.length > 0 ? academicYears[0].id : 0,
			})
		}
		setErrors({})
	}, [semester, academicYears])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (value: string) => {
		setFormData(prev => ({ ...prev, academicYearId: parseInt(value) }))
		if (errors.academicYearId) {
			setErrors(prev => ({ ...prev, academicYearId: '' }))
		}
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Tên học kỳ không được để trống'
		}

		if (formData.academicYearId <= 0) {
			newErrors.academicYearId = 'Vui lòng chọn năm học'
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
				<Label htmlFor="name">Tên học kỳ</Label>
				<Input 
					id="name" 
					name="name" 
					value={formData.name} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: Học kỳ 1"
					className={errors.name ? 'border-red-500' : ''}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>
			
			<div className="space-y-2">
				<Label htmlFor="academicYearId">Năm học</Label>
				<Select
					value={formData.academicYearId > 0 ? formData.academicYearId.toString() : ''}
					onValueChange={handleSelectChange}
					disabled={isSubmitting}
				>
					<SelectTrigger className={`w-full ${errors.academicYearId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn năm học" />
					</SelectTrigger>
					<SelectContent>
						{academicYears.map((year) => (
							<SelectItem key={year.id} value={year.id.toString()}>
								{year.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId}</p>}
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
export default function SemestersPage() {
	const [semesters, setSemesters] = useState<Semester[]>([])
	const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
	const [isCreateSheetOpen, setCreateSheetOpen] = useState(false)
	const [isEditSheetOpen, setEditSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isViewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()

	// Fetch data from API
	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setIsLoading(true)
			const [semestersData, academicYearsData] = await Promise.all([
				SemestersApi.getAll(),
				AcademicYearsApi.getAll(),
			])
			setSemesters(semestersData)
			setAcademicYears(academicYearsData)
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải dữ liệu',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreate = async (data: CreateSemesterData) => {
		try {
			setIsSubmitting(true)
			// Only send the required data, without academicYear object
			const semesterData = {
				name: data.name,
				academicYearId: data.academicYearId
			}
			await SemestersApi.create(semesterData)
			await loadData()
			setCreateSheetOpen(false)
			toast({
				title: 'Thành công',
				description: 'Tạo học kỳ mới thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo học kỳ mới',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdate = async (data: CreateSemesterData) => {
		if (!selectedSemester) return
		
		try {
			setIsSubmitting(true)
			await SemestersApi.update(selectedSemester.id, data)
			await loadData()
			setEditSheetOpen(false)
			setSelectedSemester(null)
			toast({
				title: 'Thành công',
				description: 'Cập nhật học kỳ thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật học kỳ',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async () => {
		if (!selectedSemester) return
		
		try {
			setIsSubmitting(true)
			await SemestersApi.delete(selectedSemester.id)
			await loadData()
			setDeleteDialogOpen(false)
			setSelectedSemester(null)
			toast({
				title: 'Thành công',
				description: 'Xóa học kỳ thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa học kỳ',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const openViewDialog = (semester: Semester) => {
		setSelectedSemester(semester)
		setViewDialogOpen(true)
	}

	const openEditSheet = (semester: Semester) => {
		setSelectedSemester(semester)
		setEditSheetOpen(true)
	}

	const openDeleteDialog = (semester: Semester) => {
		setSelectedSemester(semester)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Semester } }) => {
					const semester = row.original
					return (
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => openViewDialog(semester)}
								title="Xem chi tiết"
							>
								<Eye className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditSheet(semester)}
								title="Chỉnh sửa"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(semester)}
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
		{ label: 'Học kỳ' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Học kỳ"
				description="Thêm, sửa, xóa và quản lý các học kỳ trong hệ thống"
				breadcrumbs={breadcrumbs}
				actions={
					<Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
						<SheetTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Thêm Học kỳ
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Thêm học kỳ mới</SheetTitle>
								<SheetDescription>Điền thông tin chi tiết để tạo học kỳ.</SheetDescription>
							</SheetHeader>
							<SemesterForm 
								academicYears={academicYears}
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
					data={semesters}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên học kỳ..."
					isLoading={isLoading}
				/>
			</PageHeader>
			
			{/* View Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="sm:max-w-[500px] p-0">
					<DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
						<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<Eye className="h-5 w-5 text-blue-600" />
							Chi tiết học kỳ
						</DialogTitle>
						<DialogDescription className="text-gray-600 mt-1">
							Thông tin chi tiết về học kỳ đã chọn
						</DialogDescription>
					</DialogHeader>
					{selectedSemester && (
						<div className="p-6 space-y-4">
							<div className="text-center pb-4 border-b">
								<h3 className="text-2xl font-bold text-gray-900 mb-1">
									{selectedSemester.name}
								</h3>
								<p className="text-sm text-gray-500">Học kỳ</p>
							</div>
							
							<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<label className="text-sm font-medium text-blue-800">Thông tin cơ bản</label>
								</div>
								<div className="space-y-2">
									<p className="text-sm">
										<span className="font-medium">Tên học kỳ:</span> {selectedSemester.name}
									</p>
									<p className="text-sm">
										<span className="font-medium">Năm học:</span> {selectedSemester.academicYear?.name}
									</p>
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
						<SheetTitle>Chỉnh sửa học kỳ</SheetTitle>
						<SheetDescription>Cập nhật thông tin cho học kỳ đã chọn.</SheetDescription>
					</SheetHeader>
					<SemesterForm 
						semester={selectedSemester} 
						academicYears={academicYears}
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
							Hành động này không thể được hoàn tác. Học kỳ &quot;{selectedSemester?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedSemester(null)} disabled={isSubmitting}>
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
