/**
 * Menu List Component
 * Display and manage menus in hierarchical tree table format
 */
import React from 'react'
import { Plus, Edit, Trash2, Eye, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateButton, UpdateButton, DeleteButton } from '@/components/common/ProtectedButton';
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Menu } from '../types'

interface MenuListProps {
  menus: Menu[]
  isLoading: boolean
  onCreate: () => void
  onEdit: (menu: Menu) => void
  onDelete: (menu: Menu) => void
  onView?: (menu: Menu) => void
}

// Flatten menu hierarchy for table display
function flattenMenus(menus: Menu[], level = 0): Array<Menu & { level: number; hasChildren: boolean }> {
  const flattened: Array<Menu & { level: number; hasChildren: boolean }> = []
  
  menus.forEach(menu => {
    const hasChildren = menu.childMenus && menu.childMenus.length > 0
    flattened.push({ ...menu, level, hasChildren: hasChildren || false })
    
    if (menu.childMenus) {
      flattened.push(...flattenMenus(menu.childMenus, level + 1))
    }
  })
  
  return flattened
}

export function MenuList({ menus, isLoading, onCreate, onEdit, onDelete, onView }: MenuListProps) {
  const flattenedMenus = flattenMenus(menus)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đang tải...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Đang tải dữ liệu menu...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách Menu</CardTitle>
        <CreateButton module="Menu" onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm menu
        </CreateButton>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên menu</TableHead>
              <TableHead>Đường dẫn</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="text-center">Thứ tự</TableHead>
              <TableHead className="text-center">Cấp độ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flattenedMenus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Chưa có menu nào
                </TableCell>
              </TableRow>
            ) : (
              flattenedMenus.map((menu) => (
                <TableRow key={menu.id} className={menu.level > 0 ? 'bg-muted/20' : ''}>
                  <TableCell>
                    <div className="flex items-center">
                      <div style={{ paddingLeft: `${menu.level * 24}px` }} className="flex items-center">
                        {menu.hasChildren ? (
                          <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : menu.level > 0 ? (
                          <div className="w-4 h-4 mr-2" />
                        ) : null}
                        <span className={`font-medium ${menu.level > 0 ? 'text-sm' : ''}`}>
                          {menu.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {menu.path}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {menu.icon || 'Không có'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {menu.displayOrder}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={menu.level === 0 ? 'default' : 'outline'}>
                      {menu.level === 0 ? 'Root' : `Level ${menu.level}`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {onView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(menu)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <UpdateButton
                        module="Menu"
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(menu)}
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </UpdateButton>
                      <DeleteButton
                        module="Menu"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(menu)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </DeleteButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
