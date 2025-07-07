'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, FolderOpen, Link, TreePine, Grid3X3 } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuTree, MenuPreview } from '@/components/menu-tree'
import { MenuTable } from '@/components/menu-table'
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
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

import { DataTable } from '@/components/common/data-table'
import { getColumns } from './columns'
import { Menu, CreateMenuData } from '@/modules/menu/types'
import {
	createMenu,
	deleteMenu,
	getMenus,
	getAllMenusFlat,
	updateMenu,
} from '@/lib/api/menus.api'

// Main Page Component
export default function MenusPage() {
	const [menus, setMenus] = useState<Menu[]>([])
	const [allMenusFlat, setAllMenusFlat] = useState<Menu[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false)
	const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
	const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')
	const { toast } = useToast()

	// Fetch data from API
	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true)
			const [menusData, allMenusData] = await Promise.all([
				getMenus(),
				getAllMenusFlat(),
			])
			
			setMenus(Array.isArray(menusData) ? menusData : [])
			setAllMenusFlat(Array.isArray(allMenusData) ? allMenusData : [])
		} catch (error: unknown) {
			console.error('Failed to fetch data:', error)
			setMenus([])
			setAllMenusFlat([])
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

	const handleCreate = async (data: CreateMenuData) => {
		try {
			setIsLoading(true)
			await createMenu(data)
			toast({
				title: 'Thành công',
				description: 'Menu đã được tạo thành công.',
			})
			fetchData()
			setSheetOpen(false)
		} catch (error: unknown) {
			console.error('Failed to create menu:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể tạo menu.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdate = async (data: CreateMenuData) => {
		if (!selectedMenu) return
		try {
			await updateMenu(selectedMenu.id, data)
			toast({
				title: 'Thành công',
				description: 'Menu đã được cập nhật thành công.',
			})
			fetchData()
			setSheetOpen(false)
			setSelectedMenu(null)
		} catch (error: unknown) {
			console.error('Failed to update menu:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể cập nhật menu.',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedMenu) return
		try {
			await deleteMenu(selectedMenu.id)
			toast({
				title: 'Thành công',
				description: 'Menu đã được xóa thành công.',
			})
			fetchData()
			setDeleteDialogOpen(false)
			setSelectedMenu(null)
		} catch (error: unknown) {
			console.error('Failed to delete menu:', error)
			toast({
				title: 'Lỗi',
				description: error instanceof Error ? error.message : 'Không thể xóa menu.',
				variant: 'destructive',
			})
		}
	}

	const openSheet = (mode: 'create' | 'edit', menu?: Menu) => {
		setSheetMode(mode)
		setSelectedMenu(menu || null)
		setSheetOpen(true)
	}

	const openDeleteDialog = (menu: Menu) => {
		setSelectedMenu(menu)
		setDeleteDialogOpen(true)
	}

	const openDetailsDialog = (menu: Menu) => {
		setSelectedMenu(menu)
		setDetailsDialogOpen(true)
	}

	// Flatten menu structure for table display
	const flattenMenus = (menus: Menu[], level = 0): Menu[] => {
		let result: Menu[] = []
		
		menus.forEach(menu => {
			// Add level information for display
			const menuWithLevel = { ...menu, level }
			result.push(menuWithLevel)
			
			// Add children recursively
			if (menu.childMenus && menu.childMenus.length > 0) {
				result = result.concat(flattenMenus(menu.childMenus, level + 1))
			}
		})
		
		return result
	}

	const flatMenus = flattenMenus(menus)

	const dynamicColumns = getColumns({
		onView: openDetailsDialog,
		onEdit: (menu) => openSheet('edit', menu),
		onDelete: openDeleteDialog,
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Menu' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Menu"
				description="Quản lý cấu trúc menu và điều hướng của hệ thống."
				breadcrumbs={breadcrumbs}
				actions={
					<Button onClick={() => openSheet('create')}>
						<Plus className="h-4 w-4 mr-2" />
						Thêm menu
					</Button>
				}
			>
				<Tabs defaultValue="tree" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="tree" className="flex items-center gap-2">
							<TreePine className="h-4 w-4" />
							Tree View
						</TabsTrigger>
						<TabsTrigger value="table" className="flex items-center gap-2">
							<Grid3X3 className="h-4 w-4" />
							Table View
						</TabsTrigger>
						<TabsTrigger value="preview" className="flex items-center gap-2">
							<FolderOpen className="h-4 w-4" />
							Preview
						</TabsTrigger>
					</TabsList>

					<TabsContent value="tree" className="space-y-4">
						<div className="border rounded-lg p-4 bg-white">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-gray-700">Menu Structure</h3>
								<Badge variant="outline">
									{menus.length} menu{menus.length > 1 ? 's' : ''}
								</Badge>
							</div>
							{isLoading ? (
								<div className="flex items-center justify-center p-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
								</div>
							) : (
								<MenuTree 
									menus={menus}
									selectedMenuId={selectedMenu?.id}
									onMenuSelect={openDetailsDialog}
									onMenuEdit={(menu) => openSheet('edit', menu)}
									onMenuDelete={openDeleteDialog}
								/>
							)}
						</div>
					</TabsContent>

					<TabsContent value="table" className="space-y-4">
						<MenuTable 
							menus={menus}
							isLoading={isLoading}
							onEdit={(menu) => openSheet('edit', menu)}
							onDelete={openDeleteDialog}
							onView={openDetailsDialog}
						/>
					</TabsContent>

					<TabsContent value="preview" className="space-y-4">
						<MenuPreview menus={menus} />
					</TabsContent>
				</Tabs>
			</PageHeader>

			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-lg">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm menu mới' : 'Chỉnh sửa menu'}</SheetTitle>
						<SheetDescription>
							{sheetMode === 'create' ? 'Điền thông tin để thêm một menu mới.' : 'Cập nhật thông tin cho menu đã chọn.'}
						</SheetDescription>
					</SheetHeader>
					<MenuForm
						menu={sheetMode === 'edit' ? selectedMenu : null}
						parentMenus={allMenusFlat.filter(m => !m.parentId)} // Only root menus can be parents
						onSave={sheetMode === 'create' ? handleCreate : handleUpdate}
						onCancel={() => setSheetOpen(false)}
					/>
				</SheetContent>
			</Sheet>

			{/* Menu Details Dialog */}
			<MenuDetails
				menu={selectedMenu}
				isOpen={isDetailsDialogOpen}
				onClose={() => {
					setDetailsDialogOpen(false)
					setSelectedMenu(null)
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Thao tác này không thể hoàn tác. Menu &quot;{selectedMenu?.name}&quot; sẽ bị xóa vĩnh viễn khỏi hệ thống.
							{selectedMenu?.childMenus && selectedMenu.childMenus.length > 0 && (
								<span className="text-red-600 font-medium">
									<br />Cảnh báo: Menu này có {selectedMenu.childMenus.length} menu con sẽ bị xóa theo.
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
const MenuForm = ({
	menu,
	parentMenus,
	onSave,
	onCancel,
}: {
	menu?: Menu | null
	parentMenus: Menu[]
	onSave: (data: CreateMenuData) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState<CreateMenuData>({
		name: menu?.name || '',
		path: menu?.path || '',
		icon: menu?.icon || '',
		displayOrder: menu?.displayOrder || 0,
		parentId: menu?.parentId || null,
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Vui lòng nhập tên menu'
		}

		if (!formData.path.trim()) {
			newErrors.path = 'Vui lòng nhập đường dẫn'
		} else if (!formData.path.startsWith('/')) {
			newErrors.path = 'Đường dẫn phải bắt đầu bằng /'
		}

		if (formData.displayOrder < 0) {
			newErrors.displayOrder = 'Thứ tự hiển thị phải >= 0'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'displayOrder') {
			setFormData((prev: CreateMenuData) => ({ ...prev, [name]: parseInt(value) || 0 }))
		} else {
			setFormData((prev: CreateMenuData) => ({ ...prev, [name]: value }))
		}
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSelectChange = (name: string, value: string) => {
		if (name === 'parentId') {
			setFormData((prev: CreateMenuData) => ({ ...prev, [name]: value === 'null' ? null : parseInt(value) }))
		}
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleFormSave = () => {
		if (validateForm()) {
			onSave(formData)
		}
	}

	return (
		<div className="space-y-4 p-4">
			<div className="space-y-2">
				<Label htmlFor="name">Tên menu</Label>
				<Input
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Nhập tên menu"
					className={errors.name ? 'border-red-500' : ''}
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="path">Đường dẫn</Label>
				<Input
					id="path"
					name="path"
					value={formData.path}
					onChange={handleChange}
					placeholder="/dashboard, /users, ..."
					className={errors.path ? 'border-red-500' : ''}
				/>
				{errors.path && <p className="text-sm text-red-500">{errors.path}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="icon">Icon (tùy chọn)</Label>
				<Input
					id="icon"
					name="icon"
					value={formData.icon}
					onChange={handleChange}
					placeholder="dashboard, users, settings, ..."
					className={errors.icon ? 'border-red-500' : ''}
				/>
				{errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
				<Input
					id="displayOrder"
					name="displayOrder"
					type="number"
					min="0"
					value={formData.displayOrder}
					onChange={handleChange}
					className={errors.displayOrder ? 'border-red-500' : ''}
				/>
				{errors.displayOrder && <p className="text-sm text-red-500">{errors.displayOrder}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="parentId">Menu cha (tùy chọn)</Label>
				<Select
					value={formData.parentId?.toString() || 'null'}
					onValueChange={(value) => handleSelectChange('parentId', value)}
				>
					<SelectTrigger className={`w-full ${errors.parentId ? 'border-red-500' : ''}`}>
						<SelectValue placeholder="Chọn menu cha" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="null">Không có (Menu gốc)</SelectItem>
						{parentMenus.map((parentMenu) => (
							<SelectItem key={parentMenu.id} value={parentMenu.id.toString()}>
								{parentMenu.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.parentId && <p className="text-sm text-red-500">{errors.parentId}</p>}
			</div>

			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>Hủy</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}

const MenuDetails = ({
	menu,
	isOpen,
	onClose,
}: {
	menu: Menu | null
	isOpen: boolean
	onClose: () => void
}) => {
	if (!menu) return null

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Chi tiết menu</DialogTitle>
					<DialogDescription>
						Thông tin chi tiết về menu
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">ID</Label>
						<div className="text-sm">{menu.id}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Tên menu</Label>
						<div className="text-sm font-medium">{menu.name}</div>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Đường dẫn</Label>
						<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono block">
							{menu.path}
						</code>
					</div>
					{menu.icon && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Icon</Label>
							<div className="text-sm">{menu.icon}</div>
						</div>
					)}
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Thứ tự hiển thị</Label>
						<Badge variant="outline">{menu.displayOrder}</Badge>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-medium text-gray-500">Loại</Label>
						<Badge variant={menu.parentId ? 'secondary' : 'default'}>
							{menu.parentId ? 'Submenu' : 'Menu chính'}
						</Badge>
					</div>
					{menu.childMenus && menu.childMenus.length > 0 && (
						<div className="space-y-2">
							<Label className="text-sm font-medium text-gray-500">Menu con</Label>
							<div className="space-y-1">
								{menu.childMenus.map((child) => (
									<div key={child.id} className="flex items-center gap-2 text-sm">
										<Link className="h-3 w-3 text-gray-400" />
										<span>{child.name}</span>
										<code className="text-xs text-gray-500">{child.path}</code>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
