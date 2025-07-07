// Based on Menu.cs model
export interface Menu {
	id: number
	name: string
	path: string
	icon?: string
	displayOrder: number
	parentId?: number | null
	parent?: Menu | null
	childMenus?: Menu[]
	roleMenus?: RoleMenu[]
}

// Based on RoleMenu.cs model
export interface RoleMenu {
	roleId: number
	menuId: number
	role?: any // Reference to Role type
	menu?: Menu
}

// DTO for creating menu
export interface CreateMenuData {
	name: string
	path: string
	icon?: string
	displayOrder: number
	parentId?: number | null
}

// DTO for updating menu
export interface UpdateMenuData {
	name?: string
	path?: string
	icon?: string
	displayOrder?: number
	parentId?: number | null
}

// Menu tree structure for rendering
export interface MenuTreeItem extends Menu {
	children?: MenuTreeItem[]
	level?: number
}
