"use client"

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
	SidebarGroup,
} from '@/components/ui/sidebar'
import { Menu } from '@/modules/menu/types'
import { DynamicIcon } from '@/lib/utils/icons'
import { useMenus } from '@/hooks/useMenus'

export function NavMain() {
	const { menus, isLoading } = useMenus()
	const pathname = usePathname()

	const checkActive = (url: string) => pathname === url

	// Show loading state if menus are being loaded
	if (isLoading) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton disabled>
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
						<span>Đang tải menu...</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	// Filter menus based on permissions and build navigation
	const buildNavigation = (menuItems: Menu[]): React.ReactNode[] => {
		return menuItems
			.filter(() => {
				// Check if user has permission for this menu
				// For now, we'll assume all menus are accessible
				// You can implement permission checking here based on your requirements
				return true
			})
			.sort((a, b) => a.displayOrder - b.displayOrder) // Sort by display order
			.map((menu) => {
				// Check if this menu has child menus
				const hasChildren = menu.childMenus && menu.childMenus.length > 0

				if (hasChildren) {
					// Sort child menus by display order
					const sortedChildren = menu.childMenus ? menu.childMenus.sort((a, b) => a.displayOrder - b.displayOrder) : []
					
					// Parent menu with children
					return (
						<SidebarMenuItem key={menu.id}>
							<SidebarGroup>
								<SidebarMenuButton
									isActive={sortedChildren.some((child) =>
										checkActive(child.path)
									)}
								>
									<DynamicIcon name={menu.icon} size={16} />
									<span>{menu.name}</span>
								</SidebarMenuButton>
								<SidebarMenuSub>
									{sortedChildren
										.filter(() => true) // Add permission check here if needed
										.map((child) => (
											<SidebarMenuSubItem key={child.id}>
												<SidebarMenuSubButton
													href={child.path}
													isActive={checkActive(child.path)}
												>
													<span>{child.name}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
								</SidebarMenuSub>
							</SidebarGroup>
						</SidebarMenuItem>
					)
				} else {
					// Single menu item
					return (
						<SidebarMenuItem key={menu.id}>
							<SidebarMenuButton
								asChild
								isActive={checkActive(menu.path)}
							>
								<Link href={menu.path}>
									<DynamicIcon name={menu.icon} size={16} />
									<span>{menu.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				}
			})
	}

	return (
		<SidebarMenu>
			{buildNavigation(menus)}
		</SidebarMenu>
	)
}
