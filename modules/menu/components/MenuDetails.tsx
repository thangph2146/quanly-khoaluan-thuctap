/**
 * Menu Details Component
 * Display detailed information about a menu with hierarchy and roles
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Menu as MenuIcon, Link2, Hash, TreePine, Users, List } from 'lucide-react'
import type { Menu } from '../types'

interface MenuDetailsProps {
  menu: Menu
  allMenus?: Menu[] // Để có thể tìm thông tin menu cha
}

export function MenuDetails({ menu, allMenus = [] }: MenuDetailsProps) {
  // Tìm thông tin menu cha - cải thiện logic tìm kiếm
  const findParentMenu = (parentId: number): Menu | null => {
    // Flatten allMenus để tìm kiếm trong tất cả cấp độ
    const flattenMenus = (menus: Menu[]): Menu[] => {
      let result: Menu[] = []
      menus.forEach(m => {
        result.push(m)
        if (m.childMenus && m.childMenus.length > 0) {
          result = result.concat(flattenMenus(m.childMenus))
        }
      })
      return result
    }
    
    const flatMenus = flattenMenus(allMenus)
    const found = flatMenus.find(m => m.id === parentId)
    
    // Debug log
    if (!found && parentId) {
      console.warn(`Parent menu với ID ${parentId} không tìm thấy trong danh sách menus`)
      console.log('Available menus:', flatMenus.map(m => ({ id: m.id, name: m.name })))
    }
    
    return found || null
  }

  const parentMenu = menu.parentId ? findParentMenu(menu.parentId) : null

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MenuIcon className="h-5 w-5" />
                {menu.name}
              </CardTitle>
              <CardDescription className="mt-2">
                ID: {menu.id}
              </CardDescription>
            </div>
            <Badge variant={menu.parentId ? "outline" : "default"}>
              {menu.parentId ? "Sub Menu" : "Root Menu"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Đường dẫn:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs">
                {menu.path}
              </code>
            </div>
            
            {menu.icon && (
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Icon:</span>
                <Badge variant="outline">{menu.icon}</Badge>
              </div>
            )}
            
            <div className="flex items-start gap-2 text-sm">
              <TreePine className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <span className="font-medium">Menu cha:</span>
                <div className="mt-1">
                  {parentMenu ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">#{parentMenu.id}</Badge>
                        <span className="text-sm font-medium">{parentMenu.name}</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          {parentMenu.path}
                        </code>
                        {parentMenu.icon && (
                          <Badge variant="secondary" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {parentMenu.icon}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Thứ tự hiển thị: {parentMenu.displayOrder}
                        {parentMenu.childMenus && parentMenu.childMenus.length > 0 && (
                          <span className="ml-2">• {parentMenu.childMenus.length} menu con</span>
                        )}
                      </div>
                    </div>
                  ) : menu.parentId ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">ID: {menu.parentId} (Không tìm thấy)</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Menu cha có thể đã bị xóa, không có quyền truy cập, hoặc dữ liệu chưa được tải đầy đủ
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Menu gốc (Root Menu)</Badge>
                      <span className="text-xs text-muted-foreground">Đây là menu cấp cao nhất</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Thứ tự hiển thị:</span>
              <Badge variant="outline">{menu.displayOrder}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Child Menus */}
      {menu.childMenus && menu.childMenus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <List className="h-5 w-5" />
              Menu con ({menu.childMenus.length})
            </CardTitle>
            <CardDescription>
              Danh sách các menu con thuộc menu này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {menu.childMenus.map((childMenu) => (
                <div key={childMenu.id} className="border rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{childMenu.id}
                      </Badge>
                      <span className="font-medium">{childMenu.name}</span>
                    </div>
                    <Badge variant="secondary">
                      Thứ tự: {childMenu.displayOrder}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <code className="bg-background px-2 py-1 rounded">
                      {childMenu.path}
                    </code>
                    {childMenu.icon && (
                      <span className="ml-2">• Icon: {childMenu.icon}</span>
                    )}
                  </div>
                  {/* Show nested child menus if any */}
                  {childMenu.childMenus && childMenu.childMenus.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {childMenu.childMenus.length} menu con
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Assignments */}
      {menu.roleMenus && menu.roleMenus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Phân quyền ({menu.roleMenus.length})
            </CardTitle>
            <CardDescription>
              Các vai trò được phép truy cập menu này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {menu.roleMenus.map((roleMenu, index) => (
                <Badge key={index} variant="default">
                  Role ID: {roleMenu.roleId}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Menu con:</span>
              <Badge variant="outline">
                {menu.childMenus?.length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Phân quyền:</span>
              <Badge variant="outline">
                {menu.roleMenus?.length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Cấp độ:</span>
              <Badge variant="outline">
                {menu.parentId ? `Level 2+ (Sub Menu)` : 'Level 1 (Root Menu)'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Có icon:</span>
              <Badge variant="outline">
                {menu.icon ? 'Có' : 'Không'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Path segments:</span>
              <Badge variant="outline">
                {menu.path.split('/').filter(p => p).length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <Badge variant={menu.childMenus && menu.childMenus.length > 0 ? "default" : "secondary"}>
                {menu.childMenus && menu.childMenus.length > 0 ? 'Parent Menu' : 'Leaf Menu'}
              </Badge>
            </div>
            {/* Additional info */}
            <div className="flex justify-between">
              <span>Parent ID:</span>
              <Badge variant="outline">
                {menu.parentId || 'N/A'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Menu ID:</span>
              <Badge variant="outline">
                #{menu.id}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Hierarchy Tree */}
      {(parentMenu || (menu.childMenus && menu.childMenus.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Cây phân cấp Menu
            </CardTitle>
            <CardDescription>
              Hiển thị cấu trúc phân cấp của menu trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Parent level */}
              {parentMenu && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-l-2 border-b-2 border-muted-foreground rounded-bl-sm"></div>
                  <Badge variant="secondary">Parent</Badge>
                  <span className="font-medium">{parentMenu.name}</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    {parentMenu.path}
                  </code>
                </div>
              )}
              
              {/* Current level */}
              <div className="flex items-center gap-2 text-sm bg-primary/10 p-2 rounded">
                <div className="w-4 h-4 border-2 border-primary rounded-sm bg-primary/20"></div>
                <Badge variant="default">Current</Badge>
                <span className="font-bold">{menu.name}</span>
                <code className="bg-background px-1 py-0.5 rounded text-xs">
                  {menu.path}
                </code>
              </div>
              
              {/* Children level */}
              {menu.childMenus && menu.childMenus.length > 0 && (
                <div className="ml-4 space-y-2">
                  {menu.childMenus.map((child, index) => (
                    <div key={child.id} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 border-l-2 ${index === menu.childMenus!.length - 1 ? 'border-b-2 rounded-bl-sm' : 'border-b-2'} border-muted-foreground`}></div>
                      <Badge variant="outline">Child</Badge>
                      <span>{child.name}</span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {child.path}
                      </code>
                      {child.childMenus && child.childMenus.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          +{child.childMenus.length} more
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Path Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cấu trúc đường dẫn</CardTitle>
          <CardDescription>
            Phân tích chi tiết đường dẫn menu và cây phân cấp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Current menu path */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Full path:</span>
              <code className="bg-muted px-2 py-1 rounded">
                {menu.path}
              </code>
            </div>
            
            {/* Path segments */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Segments:</span>
              <div className="flex gap-1">
                {menu.path.split('/').filter(p => p).map((segment, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {segment}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Parent path if exists */}
            {parentMenu && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Parent path:</span>
                <code className="bg-muted px-2 py-1 rounded">
                  {parentMenu.path}
                </code>
              </div>
            )}
            
            {/* Menu hierarchy breadcrumb */}
            {parentMenu && (
              <div className="space-y-2">
                <span className="font-medium text-sm">Hierarchy:</span>
                <div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                  <Badge variant="secondary">{parentMenu.name}</Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="default">{menu.name}</Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empty States */}
      {(!menu.childMenus || menu.childMenus.length === 0) && 
       (!menu.roleMenus || menu.roleMenus.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <TreePine className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Menu này chưa có menu con hoặc phân quyền nào</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
