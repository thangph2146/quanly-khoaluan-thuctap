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
import { Department } from '@/modules/academic/types'
import { DepartmentsApi } from '@/lib/api/departments.api'

// Form Component
const DepartmentForm = ({
	department,
	allDepartments,
	onSave,
	onCancel,
	isSubmitting = false,
}: {
	department?: Department | null
	allDepartments: Department[]
	onSave: (data: Partial<Department>) => void
	onCancel: () => void
	isSubmitting?: boolean
}) => {
	const [formData, setFormData] = useState({
		name: department?.name || '',
		code: department?.code || '',
		parentDepartmentId: department?.parentDepartmentId || null,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Reset form when department changes (for edit mode) or when form is opened for create
	useEffect(() => {
		setFormData({
			name: department?.name || '',
			code: department?.code || '',
			parentDepartmentId: department?.parentDepartmentId || null,
		})
		setErrors({})
	}, [department])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (value: string) => {
		setFormData(prev => ({ ...prev, parentDepartmentId: value === 'none' ? null : Number(value) }))
		if (errors.parentDepartmentId) {
			setErrors(prev => ({ ...prev, parentDepartmentId: '' }))
		}
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Tên đơn vị không được để trống'
		}

		if (!formData.code.trim()) {
			newErrors.code = 'Mã đơn vị không được để trống'
		}

		// Check for duplicate code (excluding current department if editing)
		const existingDept = allDepartments.find(d => 
			d.code.toLowerCase() === formData.code.toLowerCase() && 
			d.id !== department?.id
		)
		if (existingDept) {
			newErrors.code = 'Mã đơn vị đã tồn tại'
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
				<Label htmlFor="name">Tên đơn vị</Label>
				<Input 
					id="name" 
					name="name" 
					value={formData.name} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: Khoa Công nghệ thông tin"
					className={errors.name ? 'border-red-500' : ''}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="code">Mã đơn vị</Label>
				<Input 
					id="code" 
					name="code" 
					value={formData.code} 
					onChange={handleChange}
					disabled={isSubmitting}
					placeholder="Ví dụ: CNTT"
					className={errors.code ? 'border-red-500' : ''}
				/>
				{errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="parentDepartmentId">Đơn vị cha</Label>
				<Select
					value={formData.parentDepartmentId?.toString() || 'none'}
					onValueChange={handleSelectChange}
					disabled={isSubmitting}
				>
					<SelectTrigger className={`w-full ${errors.parentDepartmentId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn đơn vị cha (nếu có)" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">Không có</SelectItem>
						{allDepartments
							.filter(d => d.id !== department?.id) // Prevent self-parenting
							.map(d => (
								<SelectItem key={d.id} value={d.id.toString()}>
									{d.name} ({d.code})
								</SelectItem>
							))}
					</SelectContent>
				</Select>
				{errors.parentDepartmentId && <p className="text-sm text-red-500">{errors.parentDepartmentId}</p>}
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
export default function DepartmentsPage() {
	const [departments, setDepartments] = useState<Department[]>([])
	const [isCreateSheetOpen, setCreateSheetOpen] = useState(false)
	const [isEditSheetOpen, setEditSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isViewDialogOpen, setViewDialogOpen] = useState(false)
	const [selectedDept, setSelectedDept] = useState<Department | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()

	// Fetch data from API
	useEffect(() => {
		loadDepartments()
	}, [])

	const loadDepartments = async () => {
		try {
			setIsLoading(true)
			const data = await DepartmentsApi.getAll()
			setDepartments(data)
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải danh sách đơn vị',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreate = async (data: Partial<Department>) => {
		try {
			setIsSubmitting(true)
			const newDept: Omit<Department, 'id'> = {
				name: data.name!,
				code: data.code!,
				parentDepartmentId: data.parentDepartmentId,
			}
			await DepartmentsApi.create(newDept)
			// Refresh the entire department list to get updated relationships
			await loadDepartments()
			setCreateSheetOpen(false)
			toast({
				title: 'Thành công',
				description: 'Tạo đơn vị mới thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo đơn vị mới',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdate = async (data: Partial<Department>) => {
		if (!selectedDept) return
		
		try {
			setIsSubmitting(true)
			const updatedDept: Department = {
				...selectedDept,
				name: data.name!,
				code: data.code!,
				parentDepartmentId: data.parentDepartmentId,
			}
			await DepartmentsApi.update(selectedDept.id, updatedDept)
			// Refresh the entire department list to get updated relationships
			await loadDepartments()
			setEditSheetOpen(false)
			setSelectedDept(null)
			toast({
				title: 'Thành công',
				description: 'Cập nhật đơn vị thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật đơn vị',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async () => {
		if (!selectedDept) return
		
		try {
			setIsSubmitting(true)
			await DepartmentsApi.delete(selectedDept.id)
			// Refresh the entire department list to get updated relationships
			await loadDepartments()
			setDeleteDialogOpen(false)
			setSelectedDept(null)
			toast({
				title: 'Thành công',
				description: 'Xóa đơn vị thành công',
			})
		} catch (error) {
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa đơn vị',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const openViewDialog = (dept: Department) => {
		setSelectedDept(dept)
		setViewDialogOpen(true)
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
								onClick={() => openViewDialog(dept)}
								title="Xem chi tiết"
							>
								<Eye className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => openEditSheet(dept)}
								title="Chỉnh sửa"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="icon"
								onClick={() => openDeleteDialog(dept)}
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
		{ label: 'Đơn vị / Khoa' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Đơn vị / Khoa"
				description="Thêm, sửa, xóa và quản lý các đơn vị, khoa trong hệ thống"
				breadcrumbs={breadcrumbs}
				actions={
                    <Sheet open={isCreateSheetOpen} onOpenChange={setCreateSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Đơn vị
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Thêm đơn vị mới</SheetTitle>
                                <SheetDescription>Điền thông tin chi tiết để tạo đơn vị.</SheetDescription>
                            </SheetHeader>
                            <DepartmentForm 
								allDepartments={departments} 
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
					data={departments}
					searchableColumn="name"
					searchPlaceholder="Tìm theo tên hoặc mã đơn vị..."
					isLoading={isLoading}
					isTreeTable={true}
					getId={(dept: Department) => dept.id}
					getParentId={(dept: Department) => dept.parentDepartmentId || null}
					getChildren={(dept: Department) => dept.childDepartments || []}
				/>
			</PageHeader>
            
			{/* View Dialog */}
			<Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="sm:max-w-[500px] p-0">
					<DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
						<DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<Eye className="h-5 w-5 text-green-600" />
							Chi tiết đơn vị
						</DialogTitle>
						<DialogDescription className="text-gray-600 mt-1">
							Thông tin chi tiết về đơn vị đã chọn
						</DialogDescription>
					</DialogHeader>
					{selectedDept && (
						<div className="p-6 space-y-6">
							{/* Department Name */}
							<div className="text-center pb-4 border-b">
								<h3 className="text-2xl font-bold text-gray-900 mb-1">
									{selectedDept.name}
								</h3>
								<p className="text-sm text-gray-500">Mã: {selectedDept.code}</p>
							</div>
							
							{/* Department Information */}
							<div className="space-y-4">
								<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										<label className="text-sm font-medium text-blue-800">Thông tin cơ bản</label>
									</div>
									<div className="space-y-2">
										<p className="text-sm">
											<span className="font-medium">Tên đơn vị:</span> {selectedDept.name}
										</p>
										<p className="text-sm">
											<span className="font-medium">Mã đơn vị:</span> {selectedDept.code}
										</p>
									</div>
								</div>
								
								{selectedDept.parentDepartment && (
									<div className="bg-green-50 rounded-lg p-4 border border-green-200">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 bg-green-500 rounded-full"></div>
											<label className="text-sm font-medium text-green-800">Đơn vị cha</label>
										</div>
										<p className="text-sm">
											{selectedDept.parentDepartment.name} ({selectedDept.parentDepartment.code})
										</p>
									</div>
								)}
								
								{selectedDept.childDepartments && selectedDept.childDepartments.length > 0 && (
									<div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
											<label className="text-sm font-medium text-purple-800">Đơn vị con</label>
										</div>
										<div className="space-y-1">
											{selectedDept.childDepartments.map(child => (
												<p key={child.id} className="text-sm">
													• {child.name} ({child.code})
												</p>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Sheet */}
			<Sheet open={isEditSheetOpen} onOpenChange={setEditSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Chỉnh sửa đơn vị</SheetTitle>
						<SheetDescription>Cập nhật thông tin cho đơn vị đã chọn.</SheetDescription>
					</SheetHeader>
					<DepartmentForm 
						department={selectedDept} 
						allDepartments={departments} 
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
							Hành động này không thể được hoàn tác. Đơn vị &quot;{selectedDept?.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedDept(null)} disabled={isSubmitting}>
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