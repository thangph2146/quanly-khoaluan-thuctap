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
import { useToast } from '@/components/ui/use-toast'

import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { AcademicYear } from '@/modules/academic/types'
import { AcademicYearsApi } from '@/lib/api/academic-years.api'

// Form Component
const AcademicYearForm = ({
	year,
	onSave,
	onCancel,
	isSubmitting = false,
}: {
	year?: AcademicYear | null
	onSave: (data: Partial<AcademicYear>) => void
	onCancel: () => void
	isSubmitting?: boolean
}) => {
	const [formData, setFormData] = useState({
		name: year?.name || '',
		startDate: year?.startDate ? new Date(year.startDate).toISOString().split('T')[0] : '',
		endDate: year?.endDate ? new Date(year.endDate).toISOString().split('T')[0] : '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

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

		if (!formData.name.trim()) {
			newErrors.name = 'Tên niên khóa không được để trống'
		}

		if (!formData.startDate) {
			newErrors.startDate = 'Ngày bắt đầu không được để trống'
		}

		if (!formData.endDate) {
			newErrors.endDate = 'Ngày kết thúc không được để trống'
		}

		if (formData.startDate && formData.endDate) {
			const startDate = new Date(formData.startDate)
			const endDate = new Date(formData.endDate)
			if (startDate >= endDate) {
				newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
			}
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
				<Label htmlFor="name">Tên niên khóa</Label>
				<Input 
					id="name" 
					name="name" 
					value={formData.name} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: 2023-2024"
					className={errors.name ? 'border-red-500' : ''}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="startDate">Ngày bắt đầu</Label>
				<Input 
					id="startDate" 
					name="startDate" 
					type="date" 
					value={formData.startDate} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Chọn ngày bắt đầu"
					className={`w-full ${errors.startDate ? 'border-red-500' : ''}`}
				/>
				{errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="endDate">Ngày kết thúc</Label>
				<Input 
					id="endDate" 
					name="endDate" 
					type="date" 
					value={formData.endDate} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Chọn ngày kết thúc"
					className={`w-full ${errors.endDate ? 'border-red-500' : ''}`}
				/>
				{errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
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

export default function AcademicYearsPage() {
	const [years, setYears] = useState<AcademicYear[]>([])
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setEditDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isViewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()

	// Fetch data from API
	useEffect(() => {
		loadAcademicYears()
	}, [])

	const loadAcademicYears = async () => {
		try {
			setIsLoading(true)
			const data = await AcademicYearsApi.getAll()
			setYears(data)
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải danh sách năm học',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreate = async (data: Partial<AcademicYear>) => {
		try {
			setIsSubmitting(true)
			const newYear: Omit<AcademicYear, 'id'> = {
				name: data.name!,
				startDate: new Date(data.startDate!).toISOString(),
				endDate: new Date(data.endDate!).toISOString(),
			}
			const createdYear = await AcademicYearsApi.create(newYear)
			setYears(prev => [...prev, createdYear])
			setCreateDialogOpen(false)
			toast({
				title: 'Thành công',
				description: 'Tạo năm học mới thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo năm học mới',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdate = async (data: Partial<AcademicYear>) => {
		if (!selectedYear) return
		
		try {
			setIsSubmitting(true)
			const updatedYear: AcademicYear = {
				...selectedYear,
				name: data.name!,
				startDate: new Date(data.startDate!).toISOString(),
				endDate: new Date(data.endDate!).toISOString(),
			}
			await AcademicYearsApi.update(selectedYear.id, updatedYear)
			setYears(prev =>
				prev.map(y => (y.id === selectedYear.id ? updatedYear : y))
			)
			setEditDialogOpen(false)
			setSelectedYear(null)
			toast({
				title: 'Thành công',
				description: 'Cập nhật năm học thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật năm học',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async () => {
		if (!selectedYear) return
		
		try {
			setIsSubmitting(true)
			await AcademicYearsApi.delete(selectedYear.id)
			setYears(prev => prev.filter(y => y.id !== selectedYear.id))
			setDeleteDialogOpen(false)
			setSelectedYear(null)
			toast({
				title: 'Thành công',
				description: 'Xóa năm học thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa năm học',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const openViewDialog = (year: AcademicYear) => {
		setSelectedYear(year)
		setViewDialogOpen(true)
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
								onClick={() => openViewDialog(year)}
								title="Xem chi tiết"
							>
								<Eye className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditDialog(year)}
								title="Chỉnh sửa"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(year)}
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
							<AcademicYearForm 
								onSave={handleCreate} 
								onCancel={() => setCreateDialogOpen(false)}
								isSubmitting={isSubmitting}
							/>
						</SheetContent>
					</Sheet>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={years}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên niên khóa..."
					isLoading={isLoading}
				/>
			</PageHeader>
			
			{/* View Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="sm:max-w-[500px] p-0">
					<DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
						<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<Eye className="h-5 w-5 text-blue-600" />
							Chi tiết niên khóa
						</DialogTitle>
						<DialogDescription className="text-gray-600 mt-1">
							Thông tin chi tiết về niên khóa đã chọn
						</DialogDescription>
					</DialogHeader>
					{selectedYear && (
						<div className="p-6 space-y-6">
							{/* Academic Year Name */}
							<div className="text-center pb-4 border-b">
								<h3 className="text-2xl font-bold text-gray-900 mb-1">
									{selectedYear.name}
								</h3>
								<p className="text-sm text-gray-500">Niên khóa học</p>
							</div>
							
							{/* Date Information Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="bg-green-50 rounded-lg p-4 border border-green-200">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<label className="text-sm font-medium text-green-800">Ngày bắt đầu</label>
									</div>
									<p className="text-lg font-semibold text-green-900">
										{new Date(selectedYear.startDate).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric'
										})}
									</p>
									<p className="text-xs text-green-600 mt-1">
										{new Date(selectedYear.startDate).toLocaleDateString('vi-VN', {
											weekday: 'long',
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
								</div>
								
								<div className="bg-red-50 rounded-lg p-4 border border-red-200">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-red-500 rounded-full"></div>
										<label className="text-sm font-medium text-red-800">Ngày kết thúc</label>
									</div>
									<p className="text-lg font-semibold text-red-900">
										{new Date(selectedYear.endDate).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric'
										})}
									</p>
									<p className="text-xs text-red-600 mt-1">
										{new Date(selectedYear.endDate).toLocaleDateString('vi-VN', {
											weekday: 'long',
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</p>
								</div>
							</div>
							
							{/* Duration Information */}
							<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
								<div className="flex items-center justify-between">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											<label className="text-sm font-medium text-blue-800">Thời gian học</label>
										</div>
										<p className="text-2xl font-bold text-blue-900">
											{Math.ceil((new Date(selectedYear.endDate).getTime() - new Date(selectedYear.startDate).getTime()) / (1000 * 60 * 60 * 24))}
											<span className="text-sm font-normal ml-1">ngày</span>
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-blue-600">
											≈ {Math.round((new Date(selectedYear.endDate).getTime() - new Date(selectedYear.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44))} tháng
										</p>
										<p className="text-sm text-blue-600">
											≈ {Math.round((new Date(selectedYear.endDate).getTime() - new Date(selectedYear.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10} năm
										</p>
									</div>
								</div>
							</div>
							
							{/* Status Badge */}
							<div className="flex justify-center">
								<div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
									new Date() >= new Date(selectedYear.startDate) && new Date() <= new Date(selectedYear.endDate)
										? 'bg-green-100 text-green-800 border border-green-300'
										: new Date() < new Date(selectedYear.startDate)
										? 'bg-blue-100 text-blue-800 border border-blue-300'
										: 'bg-gray-100 text-gray-800 border border-gray-300'
								}`}>
									{new Date() >= new Date(selectedYear.startDate) && new Date() <= new Date(selectedYear.endDate)
										? '🟢 Đang diễn ra'
										: new Date() < new Date(selectedYear.startDate)
										? '🔵 Sắp bắt đầu'
										: '⚫ Đã kết thúc'
									}
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Sheet */}
			<Sheet open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa niên khóa</SheetTitle>
						<SheetDescription>Cập nhật thông tin cho niên khóa đã chọn.</SheetDescription>
					</SheetHeader>
					<AcademicYearForm 
						year={selectedYear} 
						onSave={handleUpdate} 
						onCancel={() => setEditDialogOpen(false)}
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
							Hành động này không thể được hoàn tác. Niên khóa &quot;{selectedYear?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedYear(null)} disabled={isSubmitting}>
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