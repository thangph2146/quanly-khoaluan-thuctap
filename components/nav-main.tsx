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
import type { NavItem } from '@/modules/config/types'
import { hasPermission } from '@/modules/auth/utils'
import { User } from '@/modules/auth/types'

export function NavMain({ items, user }: { items: NavItem[]; user: User }) {
	const pathname = usePathname()

	const checkActive = (url: string) => pathname === url

	return (
		<SidebarMenu>
			{items
				.filter((item) => hasPermission(user, item.permission))
				.map((item, index) => (
					<SidebarMenuItem key={index}>
						{item.items &&
						item.items.filter((subItem) =>
							hasPermission(user, subItem.permission)
						).length > 0 ? (
							<SidebarGroup>
								<SidebarMenuButton
									isActive={item.items.some((subItem) =>
										checkActive(subItem.url)
									)}
								>
									<item.icon />
									<span>{item.title}</span>
								</SidebarMenuButton>
								<SidebarMenuSub>
									{item.items
										.filter((subItem) =>
											hasPermission(user, subItem.permission)
										)
										.map((subItem, subIndex) => (
											<SidebarMenuSubItem key={subIndex}>
												<SidebarMenuSubButton
													href={subItem.url}
													isActive={checkActive(subItem.url)}
												>
													{subItem.title}
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
								</SidebarMenuSub>
							</SidebarGroup>
						) : !item.items ? (
							<SidebarMenuButton
								asChild
								isActive={checkActive(item.url)}
							>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						) : null}
					</SidebarMenuItem>
				))}
		</SidebarMenu>
	)
}
