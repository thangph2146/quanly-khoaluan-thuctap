'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, FolderOpen, Link, Edit, Trash2, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Menu } from '@/modules/menu/types'
import { DynamicIcon } from '@/lib/utils/icons'
import { cn } from '@/lib/utils'

interface MenuTableProps {
	menus: Menu[]
	onEdit: (menu: Menu) => void
	onDelete: (menu: Menu) => void
	onView: (menu: Menu) => void
	isLoading?: boolean
}

export function MenuTable({ menus, onEdit, onDelete, onView, isLoading }: MenuTableProps) {
	const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set())
	const [searchTerm, setSearchTerm] = useState('')

	const toggleExpand = (menuId: number) => {
		const newExpanded = new Set(expandedMenus)
		if (newExpanded.has(menuId)) {
			newExpanded.delete(menuId)
		} else {
			newExpanded.add(menuId)
		}
		setExpandedMenus(newExpanded)
	}

	const expandAll = () => {
		const allMenuIds = new Set<number>()
		const collectMenuIds = (menus: Menu[]) => {
			menus.forEach(menu => {
				if (menu.childMenus && menu.childMenus.length > 0) {
					allMenuIds.add(menu.id)
					collectMenuIds(menu.childMenus)
				}
			})
		}
		collectMenuIds(menus)
		setExpandedMenus(allMenuIds)
	}

	const collapseAll = () => {
		setExpandedMenus(new Set())
	}

	// Filter menus based on search term
	const filteredMenus = useMemo(() => {
		if (!searchTerm.trim()) return menus

		const searchLower = searchTerm.toLowerCase()
		
		const filterMenuRecursive = (menu: Menu): Menu | null => {
			// Check if current menu matches search
			const menuMatches = menu.name.toLowerCase().includes(searchLower) ||
								menu.path.toLowerCase().includes(searchLower) ||
								(menu.icon && menu.icon.toLowerCase().includes(searchLower))

			// Filter children
			const filteredChildren = menu.childMenus?.map(child => filterMenuRecursive(child)).filter(Boolean) as Menu[] || []

			// Include menu if it matches or has matching children
			if (menuMatches || filteredChildren.length > 0) {
				return {
					...menu,
					childMenus: filteredChildren
				}
			}

			return null
		}

		return menus.map(menu => filterMenuRecursive(menu)).filter(Boolean) as Menu[]
	}, [menus, searchTerm])

	const renderMenuRow = (menu: Menu, level: number = 0) => {
		const hasChildren = menu.childMenus && menu.childMenus.length > 0
		const isExpanded = expandedMenus.has(menu.id)
		const indent = level * 24

		const rows = []

		// Main menu row
		rows.push(
			<TableRow key={menu.id} className={cn(
				"hover:bg-gray-50 transition-colors",
				level > 0 && "bg-gray-25/50",
				level > 1 && "bg-gray-25/80"
			)}>
				<TableCell className="py-3">
					<div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
						{hasChildren ? (
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0 hover:bg-blue-100 transition-colors"
								onClick={() => toggleExpand(menu.id)}
							>
								{isExpanded ? (
									<ChevronDown className="h-4 w-4 text-blue-600" />
								) : (
									<ChevronRight className="h-4 w-4 text-blue-600" />
								)}
							</Button>
						) : (
							<div className="h-6 w-6 flex items-center justify-center">
								<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
							</div>
						)}
						
						{hasChildren ? (
							<FolderOpen className="h-4 w-4 text-blue-500" />
						) : (
							<Link className="h-4 w-4 text-gray-500" />
						)}
						
						<span className={cn(
							"font-medium",
							level === 0 && "text-gray-900",
							level > 0 && "text-gray-700"
						)}>{menu.name}</span>
						
						{hasChildren && (
							<Badge variant="secondary" className="text-xs ml-2">
								{menu.childMenus?.length}
							</Badge>
						)}
					</div>
				</TableCell>
				
				<TableCell>
					<code className={cn(
						"bg-gray-100 px-2 py-1 rounded text-sm font-mono",
						level > 0 && "bg-gray-50 text-gray-600"
					)}>
						{menu.path}
					</code>
				</TableCell>
				
				<TableCell>
					{menu.icon ? (
						<div className="flex items-center gap-2">
							<DynamicIcon name={menu.icon} size={16} />
							<span className="text-sm text-gray-600">{menu.icon}</span>
						</div>
					) : (
						<span className="text-gray-400 text-sm">Không có</span>
					)}
				</TableCell>
				
				<TableCell>
					<Badge variant="outline" className="font-mono">
						{menu.displayOrder}
					</Badge>
				</TableCell>
				
				<TableCell>
					<Badge variant={level === 0 ? 'default' : 'secondary'} className={cn(
						level === 0 && "bg-blue-100 text-blue-800",
						level > 0 && "bg-green-100 text-green-800"
					)}>
						{level === 0 ? 'Menu chính' : `Submenu (L${level})`}
					</Badge>
				</TableCell>
				
				<TableCell>
					{hasChildren ? (
						<Badge variant="outline" className="text-blue-600 border-blue-200">
							{menu.childMenus?.length} menu con
						</Badge>
					) : (
						<span className="text-gray-400 text-sm">-</span>
					)}
				</TableCell>
				
				<TableCell>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onView(menu)}
							className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
						>
							<Eye className="h-4 w-4" />
							<span className="sr-only">Xem chi tiết</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEdit(menu)}
							className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
						>
							<Edit className="h-4 w-4" />
							<span className="sr-only">Chỉnh sửa</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDelete(menu)}
							className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
						>
							<Trash2 className="h-4 w-4" />
							<span className="sr-only">Xóa</span>
						</Button>
					</div>
				</TableCell>
			</TableRow>
		)

		// Child menu rows (if expanded)
		if (hasChildren && isExpanded) {
			menu.childMenus
				?.sort((a, b) => a.displayOrder - b.displayOrder)
				.forEach(child => {
					rows.push(...renderMenuRow(child, level + 1))
				})
		}

		return rows
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	// Sort root menus by display order
	const sortedMenus = [...filteredMenus].sort((a, b) => a.displayOrder - b.displayOrder)

	return (
		<div className="space-y-4">
			{/* Search and Controls */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Tìm kiếm menu theo tên, đường dẫn hoặc icon..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={expandAll}
						className="text-blue-600 hover:bg-blue-50"
					>
						<ChevronDown className="h-4 w-4 mr-1" />
						Mở rộng tất cả
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={collapseAll}
						className="text-orange-600 hover:bg-orange-50"
					>
						<ChevronRight className="h-4 w-4 mr-1" />
						Thu gọn tất cả
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[300px]">Tên Menu</TableHead>
							<TableHead className="w-[200px]">Đường dẫn</TableHead>
							<TableHead className="w-[120px]">Icon</TableHead>
							<TableHead className="w-[100px]">Thứ tự</TableHead>
							<TableHead className="w-[120px]">Loại</TableHead>
							<TableHead className="w-[120px]">Menu con</TableHead>
							<TableHead className="w-[120px]">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedMenus.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8 text-gray-500">
									{searchTerm ? 'Không tìm thấy menu nào' : 'Không có menu nào'}
								</TableCell>
							</TableRow>
						) : (
							sortedMenus.map(menu => renderMenuRow(menu))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Statistics */}
			<div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
				<span>
					Hiển thị {sortedMenus.length} menu{sortedMenus.length > 1 ? 's' : ''}
					{searchTerm && ` (lọc từ ${menus.length} menu)`}
				</span>
				<span>
					{expandedMenus.size} menu đang mở rộng
				</span>
			</div>
		</div>
	)
}
