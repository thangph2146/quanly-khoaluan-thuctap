'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, FolderOpen, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Menu } from '@/modules/menu/types'
import { DynamicIcon } from '@/lib/utils/icons'
import { cn } from '@/lib/utils'

interface MenuTreeProps {
	menus: Menu[]
	onMenuSelect?: (menu: Menu) => void
	onMenuEdit?: (menu: Menu) => void
	onMenuDelete?: (menu: Menu) => void
	selectedMenuId?: number
}

export function MenuTree({ 
	menus, 
	onMenuSelect, 
	onMenuEdit, 
	onMenuDelete, 
	selectedMenuId 
}: MenuTreeProps) {
	const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set())

	const toggleExpand = (menuId: number) => {
		const newExpanded = new Set(expandedMenus)
		if (newExpanded.has(menuId)) {
			newExpanded.delete(menuId)
		} else {
			newExpanded.add(menuId)
		}
		setExpandedMenus(newExpanded)
	}

	const renderMenuItem = (menu: Menu, level: number = 0) => {
		const hasChildren = menu.childMenus && menu.childMenus.length > 0
		const isExpanded = expandedMenus.has(menu.id)
		const isSelected = selectedMenuId === menu.id

		return (
			<div key={menu.id} className="menu-item">
				<div 
					className={cn(
						"flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors",
						isSelected && "bg-blue-50 border border-blue-200",
						"group"
					)}
					style={{ paddingLeft: `${level * 20 + 8}px` }}
					onClick={() => onMenuSelect?.(menu)}
				>
					{hasChildren ? (
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 hover:bg-gray-200"
							onClick={(e) => {
								e.stopPropagation()
								toggleExpand(menu.id)
							}}
						>
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</Button>
					) : (
						<div className="h-6 w-6 flex items-center justify-center">
							<Link className="h-3 w-3 text-gray-400" />
						</div>
					)}

					<div className="flex items-center gap-2 flex-1">
						{menu.icon && (
							<DynamicIcon name={menu.icon} size={16} className="text-gray-500" />
						)}
						<span className="font-medium text-gray-900">{menu.name}</span>
						<Badge variant="outline" className="text-xs">
							{menu.displayOrder}
						</Badge>
					</div>

					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0"
							onClick={(e) => {
								e.stopPropagation()
								onMenuEdit?.(menu)
							}}
						>
							<span className="sr-only">Edit</span>
							<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="m18 2 4 4-14 14H4v-4L18 2z" />
							</svg>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
							onClick={(e) => {
								e.stopPropagation()
								onMenuDelete?.(menu)
							}}
						>
							<span className="sr-only">Delete</span>
							<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 6h18" />
								<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
								<path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
							</svg>
						</Button>
					</div>
				</div>

				<div className="ml-4 text-xs text-gray-500">
					<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
						{menu.path}
					</code>
				</div>

				{hasChildren && isExpanded && (
					<div className="mt-1">
						{menu.childMenus
							?.sort((a, b) => a.displayOrder - b.displayOrder)
							.map(child => renderMenuItem(child, level + 1))}
					</div>
				)}
			</div>
		)
	}

	// Sort menus by displayOrder
	const sortedMenus = [...menus].sort((a, b) => a.displayOrder - b.displayOrder)

	return (
		<div className="space-y-1">
			{sortedMenus.map(menu => renderMenuItem(menu))}
		</div>
	)
}

// Menu preview component to show how the menu will look in navigation
export function MenuPreview({ menus }: { menus: Menu[] }) {
	const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set())

	const toggleExpand = (menuId: number) => {
		const newExpanded = new Set(expandedMenus)
		if (newExpanded.has(menuId)) {
			newExpanded.delete(menuId)
		} else {
			newExpanded.add(menuId)
		}
		setExpandedMenus(newExpanded)
	}

	const renderNavItem = (menu: Menu, level: number = 0) => {
		const hasChildren = menu.childMenus && menu.childMenus.length > 0
		const isExpanded = expandedMenus.has(menu.id)

		return (
			<div key={menu.id} className="nav-item">
				<div 
					className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
					style={{ paddingLeft: `${level * 16}px` }}
					onClick={() => hasChildren && toggleExpand(menu.id)}
				>
					{hasChildren && (
						<span className="text-gray-400">
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</span>
					)}
					
					{menu.icon && (
						<DynamicIcon name={menu.icon} size={16} className="text-gray-600" />
					)}
					
					<span className="text-sm font-medium text-gray-700">{menu.name}</span>
				</div>

				{hasChildren && isExpanded && (
					<div className="ml-2">
						{menu.childMenus
							?.sort((a, b) => a.displayOrder - b.displayOrder)
							.map(child => renderNavItem(child, level + 1))}
					</div>
				)}
			</div>
		)
	}

	// Sort menus by displayOrder
	const sortedMenus = [...menus].sort((a, b) => a.displayOrder - b.displayOrder)

	return (
		<div className="border rounded-lg p-4 bg-gray-50">
			<h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
				<FolderOpen className="h-4 w-4" />
				Preview Navigation
			</h3>
			<div className="space-y-1 bg-white p-3 rounded border">
				{sortedMenus.map(menu => renderNavItem(menu))}
			</div>
		</div>
	)
}
