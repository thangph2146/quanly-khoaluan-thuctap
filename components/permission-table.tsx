'use client'

import { useState, useMemo } from 'react'
import { Edit, Trash2, Eye, Search, Shield, Users, Settings, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Permission } from '@/modules/permission/types'
import { cn } from '@/lib/utils'

interface PermissionTableProps {
	permissions: Permission[]
	onEdit: (permission: Permission) => void
	onDelete: (permission: Permission) => void
	onView: (permission: Permission) => void
	isLoading?: boolean
}

export function PermissionTable({ permissions, onEdit, onDelete, onView, isLoading }: PermissionTableProps) {
	const [searchTerm, setSearchTerm] = useState('')

	// Filter permissions based on search term
	const filteredPermissions = useMemo(() => {
		if (!searchTerm.trim()) return permissions

		const searchLower = searchTerm.toLowerCase()
		
		return permissions.filter(permission => 
			permission.name.toLowerCase().includes(searchLower) ||
			permission.module.toLowerCase().includes(searchLower) ||
			(permission.description && permission.description.toLowerCase().includes(searchLower))
		)
	}, [permissions, searchTerm])

	const getModuleIcon = (module: string) => {
		const moduleIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
			'User': Users,
			'Role': Shield,
			'Menu': Settings,
			'Permission': Shield,
			'Thesis': BookOpen,
			'Internship': Briefcase,
			'Partner': Users,
			'Academic': GraduationCap,
			'Student': Users,
			'Department': Settings,
		}
		
		const IconComponent = moduleIconMap[module] || Shield
		return <IconComponent className="h-4 w-4" />
	}

	const getModuleColor = (module: string) => {
		const moduleColorMap: Record<string, string> = {
			'User': 'bg-blue-100 text-blue-800',
			'Role': 'bg-purple-100 text-purple-800',
			'Menu': 'bg-green-100 text-green-800',
			'Permission': 'bg-orange-100 text-orange-800',
			'Thesis': 'bg-red-100 text-red-800',
			'Internship': 'bg-yellow-100 text-yellow-800',
			'Partner': 'bg-indigo-100 text-indigo-800',
			'Academic': 'bg-pink-100 text-pink-800',
			'Student': 'bg-cyan-100 text-cyan-800',
			'Department': 'bg-teal-100 text-teal-800',
		}
		
		return moduleColorMap[module] || 'bg-gray-100 text-gray-800'
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	// Sort permissions by module then by name
	const sortedPermissions = [...filteredPermissions].sort((a, b) => {
		if (a.module !== b.module) {
			return a.module.localeCompare(b.module)
		}
		return a.name.localeCompare(b.name)
	})

	return (
		<div className="space-y-4">
			{/* Search and Controls */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Tìm kiếm permission theo tên, module hoặc mô tả..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[250px]">Tên Permission</TableHead>
							<TableHead className="w-[150px]">Module</TableHead>
							<TableHead className="w-[300px]">Mô tả</TableHead>
							<TableHead className="w-[120px]">Roles sử dụng</TableHead>
							<TableHead className="w-[120px]">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedPermissions.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center py-8 text-gray-500">
									{searchTerm ? 'Không tìm thấy permission nào' : 'Không có permission nào'}
								</TableCell>
							</TableRow>
						) : (
							sortedPermissions.map(permission => (
								<TableRow key={permission.id} className="hover:bg-gray-50 transition-colors">
									<TableCell className="py-3">
										<div className="flex items-center gap-2">
											<Shield className="h-4 w-4 text-blue-500" />
											<span className="font-medium">{permission.name}</span>
										</div>
									</TableCell>
									
									<TableCell>
										<div className="flex items-center gap-2">
											{getModuleIcon(permission.module)}
											<Badge variant="secondary" className={cn(getModuleColor(permission.module))}>
												{permission.module}
											</Badge>
										</div>
									</TableCell>
									
									<TableCell>
										{permission.description ? (
											<span className="text-sm text-gray-600">{permission.description}</span>
										) : (
											<span className="text-gray-400 text-sm italic">Không có mô tả</span>
										)}
									</TableCell>
									
									<TableCell>
										{permission.rolePermissions && permission.rolePermissions.length > 0 ? (
											<Badge variant="outline" className="text-blue-600 border-blue-200">
												{permission.rolePermissions.length} role(s)
											</Badge>
										) : (
											<span className="text-gray-400 text-sm">-</span>
										)}
									</TableCell>
									
									<TableCell>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onView(permission)}
												className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
											>
												<Eye className="h-4 w-4" />
												<span className="sr-only">Xem chi tiết</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onEdit(permission)}
												className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
											>
												<Edit className="h-4 w-4" />
												<span className="sr-only">Chỉnh sửa</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onDelete(permission)}
												className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">Xóa</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Statistics */}
			<div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
				<span>
					Hiển thị {sortedPermissions.length} permission{sortedPermissions.length > 1 ? 's' : ''}
					{searchTerm && ` (lọc từ ${permissions.length} permissions)`}
				</span>
				<span>
					{new Set(permissions.map(p => p.module)).size} module{new Set(permissions.map(p => p.module)).size > 1 ? 's' : ''}
				</span>
			</div>
		</div>
	)
}
