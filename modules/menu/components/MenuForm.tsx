/**
 * Menu Form Component
 * Form for creating and editing menus
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Menu, CreateMenuData, UpdateMenuData } from '../types'

interface MenuFormProps {
  menu?: Menu | null
  onSubmit: (data: CreateMenuData | UpdateMenuData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function MenuForm({
  menu,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    icon: '',
    parentId: '',
    displayOrder: 0,
  })

  useEffect(() => {
    if (menu && mode === 'edit') {
      setFormData({
        name: menu.name || '',
        path: menu.path || '',
        icon: menu.icon || '',
        parentId: menu.parentId?.toString() || '',
        displayOrder: menu.displayOrder || 0,
      })
    }
  }, [menu, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      parentId: formData.parentId ? parseInt(formData.parentId) : null,
    }
    onSubmit(submitData)
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên menu *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nhập tên menu"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="path">Đường dẫn *</Label>
        <Input
          id="path"
          value={formData.path}
          onChange={(e) => handleChange('path', e.target.value)}
          placeholder="Nhập đường dẫn (vd: /dashboard)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => handleChange('icon', e.target.value)}
          placeholder="Nhập tên icon (vd: dashboard)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Menu cha</Label>
        <Select 
          value={formData.parentId} 
          onValueChange={(value) => handleChange('parentId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn menu cha (để trống nếu là menu gốc)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Không có menu cha</SelectItem>
            {/* TODO: Add parent menu options */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
        <Input
          id="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
          placeholder="Nhập thứ tự hiển thị"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  )
}
