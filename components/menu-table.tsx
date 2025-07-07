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
				"hover:bg-gray-50",
				level > 0 && "bg-gray-25"
			)}>
				<TableCell className="py-3">
					<div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
						{hasChildren ? (
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={() => toggleExpand(menu.id)}
							>
								{isExpanded ? (
									<ChevronDown className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
						) : (
							<div className="h-6 w-6" />
						)}
						
						{hasChildren ? (
							<FolderOpen className="h-4 w-4 text-blue-500" />
						) : (
							<Link className="h-4 w-4 text-gray-500" />
						)}
						
						<span className="font-medium">{menu.name}</span>
						
						{hasChildren && (
							<Badge variant="secondary" className="text-xs">
								{menu.childMenus?.length} items
							</Badge>
						)}
					</div>
				</TableCell>
				
				<TableCell>
					<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
						{menu.path}
					</code>
				</TableCell>
				
				<TableCell>
					{menu.icon ? (
						<div className="flex items-center gap-2">
							<DynamicIcon name={menu.icon} size={16} />
							<span className="text-sm">{menu.icon}</span>
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
					<Badge variant={level === 0 ? 'default' : 'secondary'}>
						{level === 0 ? 'Menu chính' : 'Submenu'}
					</Badge>
				</TableCell>
				
				<TableCell>
					{hasChildren ? (
						<Badge variant="outline">{menu.childMenus?.length} menu con</Badge>
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
							className="h-8 w-8 p-0"
						>
							<Eye className="h-4 w-4" />
							<span className="sr-only">Xem chi tiết</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEdit(menu)}
							className="h-8 w-8 p-0"
						>
							<Edit className="h-4 w-4" />
							<span className="sr-only">Chỉnh sửa</span>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDelete(menu)}
							className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
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
			{/* Search input */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				<Input
					placeholder="Tìm kiếm menu theo tên, đường dẫn hoặc icon..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10"
				/>
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
		</div>
	)
}
