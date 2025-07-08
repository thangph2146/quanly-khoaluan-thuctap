/**
 * User Form Component
 * Form for creating and editing users
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SheetFooter } from '@/components/ui/sheet'
import type { User, CreateUserData, UpdateUserData, Role } from '../types'

interface UserFormProps {
  user?: User | null
  roles: Role[]
  onSubmit: (data: CreateUserData | UpdateUserData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function UserForm({ user, roles, onSubmit, onCancel, isLoading, mode }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
    isActive: user?.isActive ?? true,
    keycloakUserId: user?.keycloakUserId || crypto.randomUUID(),
  })
  
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    user?.userRoles ? 
      roles.filter(role => user.userRoles?.includes(role.name)).map(role => role.id) : 
      []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }))
  }

  const handleRoleChange = (roleId: string) => {
    const id = parseInt(roleId, 10)
    setSelectedRoleIds([id])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, roleIds: selectedRoleIds })
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-1">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL Ảnh đại diện</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <input type="hidden" name="keycloakUserId" value={formData.keycloakUserId} />

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={selectedRoleIds[0]?.toString() || ''}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn một vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Kích hoạt tài khoản</Label>
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
          {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo người dùng' : 'Cập nhật'}
        </Button>
      </SheetFooter>
    </div>
  )
}
