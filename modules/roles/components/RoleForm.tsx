/**
 * Role Form Component
 * Form for creating and editing roles
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SheetFooter } from '@/components/ui/sheet'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types'

interface RoleFormProps {
  role?: Role | null
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function RoleForm({ role, onSubmit, onCancel, isLoading, mode }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên vai trò</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên vai trò"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả vai trò"
              rows={3}
            />
          </div>
        </form>
      </ScrollArea>

      {/* Form Actions - Fixed at bottom */}
      <SheetFooter className="p-4 border-t bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo vai trò' : 'Cập nhật'}
        </Button>
      </SheetFooter>
    </div>
  )
}
