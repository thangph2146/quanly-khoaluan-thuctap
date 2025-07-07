/**
 * Menu Details Component
 * Display detailed information about a menu
 */
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Menu as MenuIcon, Link2, Hash, TreePine } from 'lucide-react'
import type { Menu } from '../types'

interface MenuDetailsProps {
  menu: Menu
}

export function MenuDetails({ menu }: MenuDetailsProps) {
  return (
    <div className="space-y-4">
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
            <Badge variant="default">
              Menu
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Đường dẫn:</span>
              <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                {menu.path}
              </span>
            </div>
            
            {menu.icon && (
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Icon:</span>
                <span>{menu.icon}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <TreePine className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Menu cha:</span>
              <span>
                {menu.parentId ? (
                  <Badge variant="outline">ID: {menu.parentId}</Badge>
                ) : (
                  <Badge variant="secondary">Menu gốc</Badge>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Thứ tự hiển thị:</span>
              <Badge variant="outline">{menu.displayOrder}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
