'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Menu } from '@/modules/menu/types'
import { getMenus } from '@/modules/menu/api/menus.api'

interface MenuContextType {
	menus: Menu[]
	isLoading: boolean
	error: string | null
	refreshMenus: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

// Default menu items to ensure menu page is always available
const defaultMenuItems: Menu[] = [
	{
		id: -1,
		name: 'Menu',
		path: '/admin/menu',
		icon: 'menu',
		displayOrder: 999,
		parentId: null
	}
]

export function MenuProvider({ children }: { children: React.ReactNode }) {
	const [menus, setMenus] = useState<Menu[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchMenus = async () => {
		try {
			setIsLoading(true)
			setError(null)
			const menusData = await getMenus()
			const menusArray = Array.isArray(menusData) ? menusData : []
			
			// Ensure menu page is always available
			const hasMenuPage = menusArray.some(menu => menu.path === '/admin/menu')
			
			if (!hasMenuPage) {
				// Add default menu items if not present
				const combinedMenus = [...menusArray, ...defaultMenuItems]
				setMenus(combinedMenus)
			} else {
				setMenus(menusArray)
			}
		} catch (err) {
			console.error('Failed to fetch menus:', err)
			setError(err instanceof Error ? err.message : 'Không thể tải menu')
			// Even on error, ensure menu page is available for admin access
			setMenus(defaultMenuItems)
		} finally {
			setIsLoading(false)
		}
	}

	const refreshMenus = async () => {
		await fetchMenus()
	}

	useEffect(() => {
		fetchMenus()
	}, [])

	const value: MenuContextType = {
		menus,
		isLoading,
		error,
		refreshMenus,
	}

	return (
		<MenuContext.Provider value={value}>
			{children}
		</MenuContext.Provider>
	)
}

export function useMenus() {
	const context = useContext(MenuContext)
	if (context === undefined) {
		throw new Error('useMenus must be used within a MenuProvider')
	}
	return context
}

// Helper function to convert menus to navigation items
export interface NavItem {
	id: number
	name: string
	href: string
	icon?: string
	children?: NavItem[]
}

export function convertMenusToNavItems(menus: Menu[]): NavItem[] {
	return menus
		.sort((a, b) => a.displayOrder - b.displayOrder) // Sort by display order
		.map(menu => ({
			id: menu.id,
			name: menu.name,
			href: menu.path,
			icon: menu.icon,
			children: menu.childMenus && menu.childMenus.length > 0 
				? convertMenusToNavItems(menu.childMenus)
				: undefined
		}))
}
