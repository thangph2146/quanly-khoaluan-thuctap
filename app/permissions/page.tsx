'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Shield, Settings, Users, BookOpen, GraduationCap, Briefcase, Grid3X3 } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionTable } from '@/components/permission-table'
import { PermissionModuleView } from '@/components/permission-module-view'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

import { Permission, CreatePermissionData, UpdatePermissionData } from '@/modules/permission/types'
import {
	createPermission,
	deletePermission,
	getPermissions,
	getModules,
	updatePermission,
} from '@/lib/api/permissions.api'

// Main Page Component
export default function PermissionsPage() {
	const [permissions, setPermissions] = useState<Permission[]>([])
	const [modules, setModules] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	// Fetch data from API
	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true)
			const [permissionsData, modulesData] = await Promise.all([
				getPermissions(),
				getModules(),
			])
			
			setPermissions(Array.isArray(permissionsData) ? permissionsData : [])
			setModules(Array.isArray(modulesData) ? modulesData : [])
		} catch (error: unknown) {
			console.error('Failed to fetch data:', error)
			setPermissions([])
			setModules([])
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tải dữ liệu.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}, [toast])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleCreate = async (data: CreatePermissionData) => {
		try {
			await createPermission(data)
			setSheetOpen(false)
			toast({
				title: 'Thành công',
				description: 'Tạo permission mới thành công.',
			})
			await fetchData()
		} catch (error: unknown) {
			console.error('Failed to create permission:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo permission mới.',
				variant: 'destructive',
			})
		}
	}

	const handleUpdate = async (data: CreatePermissionData | UpdatePermissionData) => {
		if (!selectedPermission) return
		try {
			await updatePermission(selectedPermission.id, data as UpdatePermissionData)
			setSheetOpen(false)
			toast({
				title: 'Thành công',
				description: 'Cập nhật permission thành công.',
			})
			await fetchData()
		} catch (error: unknown) {
			console.error('Failed to update permission:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật permission.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedPermission) return
		try {
			await deletePermission(selectedPermission.id)
			setDeleteDialogOpen(false)
			setSelectedPermission(null)
			toast({
				title: 'Thành công',
				description: 'Xóa permission thành công.',
			})
			await fetchData()
		} catch (error: unknown) {
			console.error('Failed to delete permission:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa permission.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', permission?: Permission) => {
		setSheetMode(mode)
		setSelectedPermission(permission || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (permission: Permission) => {
		setSelectedPermission(permission)
		setDeleteDialogOpen(true)
	}

	const openDetailsDialog = (permission: Permission) => {
		setSelectedPermission(permission)
		setDetailsDialogOpen(true)
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Permissions' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Permissions"
				description="Quản lý các quyền và phân quyền trong hệ thống."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm permission
					</Button>
				}
			>
				<Tabs defaultValue="table" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="table" className="flex items-center gap-2">
							<Grid3X3 className="h-4 w-4" />
							Table View
						</TabsTrigger>
						<TabsTrigger value="modules" className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							Module View
						</TabsTrigger>
					</TabsList>

					<TabsContent value="table" className="space-y-4">
						<PermissionTable 
							permissions={permissions}
							isLoading={isLoading}
							onEdit={(permission: Permission) => openSheet('edit', permission)}
							onDelete={openDeleteDialog}
							onView={openDetailsDialog}
						/>
					</TabsContent>

					<TabsContent value="modules" className="space-y-4">
						<PermissionModuleView 
							permissions={permissions}
							modules={modules}
							isLoading={isLoading}
							onEdit={(permission: Permission) => openSheet('edit', permission)}
							onDelete={openDeleteDialog}
							onView={openDetailsDialog}
						/>
					</TabsContent>
				</Tabs>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm permission mới' : 'Chỉnh sửa permission'}</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' ? 'Điền thông tin để thêm một permission mới.' : 'Cập nhật thông tin cho permission đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					<PermissionForm
						permission={sheetMode === 'edit' ? selectedPermission : null}
						modules={modules}
						onSave={sheetMode === 'create' ? handleCreate : handleUpdate}
						onCancel={() => setSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* Permission Details Dialog */}
			<PermissionDetails
				permission={selectedPermission}
				isOpen={isDetailsDialogOpen}
				onClose={() => {
					setDetailsDialogOpen(false)
					setSelectedPermission(null)
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Thao tác này không thể hoàn tác. Permission &quot;{selectedPermission?.name}&quot; sẽ bị xóa vĩnh viễn khỏi hệ thống.
							{selectedPermission?.rolePermissions && selectedPermission.rolePermissions.length > 0 && (
								<span className="text-red-600 font-medium">
									<br />Cảnh báo: Permission này đang được sử dụng bởi {selectedPermission.rolePermissions.length} role(s).
								</span>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

// Form Component
const PermissionForm = ({
	permission,
	modules,
	onSave,
	onCancel,
}: {
	permission?: Permission | null
	modules: string[]
	onSave: (data: CreatePermissionData | UpdatePermissionData) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState<CreatePermissionData>({
		name: permission?.name || '',
		description: permission?.description || '',
		module: permission?.module || '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Vui lòng nhập tên permission'
		}

		if (!formData.module.trim()) {
			newErrors.module = 'Vui lòng chọn module'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData((prev: CreatePermissionData) => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev: CreatePermissionData) => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleFormSave = () => {
		if (validateForm()) {
			onSave(formData)
		}
	}

	const moduleOptions = [
		...modules,
		'User', 'Role', 'Menu', 'Permission', 'Thesis', 'Internship', 'Partner', 'Academic', 'Student', 'Department'
	].filter((value, index, self) => self.indexOf(value) === index)

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên permission</Label>
				<Input
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Nhập tên permission (VD: users:create, users:read)"
					className={errors.name ? 'border-red-500' : ''}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Mô tả (tùy chọn)</Label>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Nhập mô tả cho permission..."
					className={errors.description ? 'border-red-500' : ''}
					rows={3}
				/>
				{errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="module">Module</Label>
				<Select
					value={formData.module}
					onValueChange={(value) => handleSelectChange('module', value)}
				>
					<SelectTrigger className={`w-full ${errors.module ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn module" />
					</SelectTrigger>
					<SelectContent>
						{moduleOptions.map((module) => (
							<SelectItem key={module} value={module}>
								{module}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.module && <p className="text-sm text-red-500">{errors.module}</p>}
			</div>

			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}

const PermissionDetails = ({
	permission,
	isOpen,
	onClose,
}: {
	permission: Permission | null
	isOpen: boolean
	onClose: () => void
}) => {
	if (!permission) return null

	const getModuleIcon = (module: string) => {
		const moduleIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
			'User': Users,
			'Role': Shield,
			'Menu': Settings,
			'Permission': Shield,
			'Thesis': BookOpen,
			'Internship': Briefcase,
			'Partner': Users,
			'Academic': GraduationCap,
			'Student': Users,
			'Department': Settings,
		}
		
		const IconComponent = moduleIconMap[module] || Shield
		return <IconComponent className="h-4 w-4" />
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Chi tiết permission</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về permission
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">ID</Label>
						<div className="text-sm">{permission.id}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Tên permission</Label>
						<div className="text-sm font-medium">{permission.name}</div>
					</div>
					{permission.description && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Mô tả</Label>
							<div className="text-sm">{permission.description}</div>
						</div>
					)}
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Module</Label>
						<div className="flex items-center gap-2">
							{getModuleIcon(permission.module)}
							<Badge variant="outline">{permission.module}</Badge>
						</div>
					</div>
					{permission.rolePermissions && permission.rolePermissions.length > 0 && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Được sử dụng bởi</Label>
							<div className="text-sm text-blue-600">
								{permission.rolePermissions.length} role(s)
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
