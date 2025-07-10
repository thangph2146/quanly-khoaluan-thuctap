/**
 * User Form Component
 * Form for creating and editing users
 */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { User, CreateUserData, UpdateUserData, Role } from '../types'
import { Modal } from '@/components/common'

interface UserFormProps {
  isOpen: boolean
  user?: User | null
  roles: Role[]
  onSubmit: (data: CreateUserData | UpdateUserData) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function UserForm({ isOpen, user, roles, onSubmit, onCancel, isLoading, mode }: UserFormProps) {
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

  // Sync form state when user prop changes (for editing)
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
        isActive: user.isActive,
        keycloakUserId: user.keycloakUserId,
      });
      setSelectedRoleIds(roles.filter(role => user.userRoles?.includes(role.name)).map(role => role.id));
    } else {
      // Reset for create mode
       setFormData({
        name: '',
        email: '',
        avatarUrl: '',
        isActive: true,
        keycloakUserId: crypto.randomUUID(),
      });
      setSelectedRoleIds([]);
    }
  }, [user, roles, isOpen]);


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

  const title = mode === 'create' ? 'Tạo người dùng mới' : 'Cập nhật người dùng'

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
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
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
            </Button>
            <Button 
            type="submit" 
            disabled={isLoading}
            >
            {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo người dùng' : 'Cập nhật'}
            </Button>
        </div>
        </form>
    </Modal>
  )
}
