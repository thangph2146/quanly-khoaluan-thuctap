/**
 * Role Form Component
 * Form for creating and editing roles
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/common'
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../types'

interface RoleFormProps {
  isOpen: boolean
  role?: Role | null
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => void
  onCancel: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export function RoleForm({ isOpen, role, onSubmit, onCancel, isLoading, mode }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (isOpen) {
        setFormData({
            name: role?.name || '',
            description: role?.description || '',
        })
    }
  }, [isOpen, role])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const title = mode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò';

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onCancel}
      title={title}
      className="sm:max-w-lg"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Hủy
            </Button>
            <Button 
                type="submit" 
                disabled={isLoading}
            >
                {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo vai trò' : 'Cập nhật'}
            </Button>
         </div>
        </form>
    </Modal>
  )
}
