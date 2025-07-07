'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Edit, Trash2, Eye, Search, Shield, Users, Settings, BookOpen, Briefcase, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Permission } from '@/modules/permission/types'
import { cn } from '@/lib/utils'

interface PermissionModuleViewProps {
	permissions: Permission[]
	modules: string[]
	onEdit: (permission: Permission) => void
	onDelete: (permission: Permission) => void
	onView: (permission: Permission) => void
	isLoading?: boolean
}

export function PermissionModuleView({ permissions, modules, onEdit, onDelete, onView, isLoading }: PermissionModuleViewProps) {
	const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules))
	const [searchTerm, setSearchTerm] = useState('')

	const toggleExpand = (module: string) => {
		const newExpanded = new Set(expandedModules)
		if (newExpanded.has(module)) {
			newExpanded.delete(module)
		} else {
			newExpanded.add(module)
		}
		setExpandedModules(newExpanded)
	}

	const expandAll = () => {
		setExpandedModules(new Set(modules))
	}

	const collapseAll = () => {
		setExpandedModules(new Set())
	}

	// Filter and group permissions by module
	const groupedPermissions = useMemo(() => {
		let filteredPermissions = permissions

		if (searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase()
			filteredPermissions = permissions.filter(permission => 
				permission.name.toLowerCase().includes(searchLower) ||
				permission.module.toLowerCase().includes(searchLower) ||
				(permission.description && permission.description.toLowerCase().includes(searchLower))
			)
		}

		const grouped = filteredPermissions.reduce((acc, permission) => {
			if (!acc[permission.module]) {
				acc[permission.module] = []
			}
			acc[permission.module].push(permission)
			return acc
		}, {} as Record<string, Permission[]>)

		// Sort permissions within each module
		Object.keys(grouped).forEach(module => {
			grouped[module].sort((a, b) => a.name.localeCompare(b.name))
		})

		return grouped
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
		return <IconComponent className="h-5 w-5" />
	}

	const getModuleColor = (module: string) => {
		const moduleColorMap: Record<string, string> = {
			'User': 'bg-blue-100 text-blue-800 border-blue-200',
			'Role': 'bg-purple-100 text-purple-800 border-purple-200',
			'Menu': 'bg-green-100 text-green-800 border-green-200',
			'Permission': 'bg-orange-100 text-orange-800 border-orange-200',
			'Thesis': 'bg-red-100 text-red-800 border-red-200',
			'Internship': 'bg-yellow-100 text-yellow-800 border-yellow-200',
			'Partner': 'bg-indigo-100 text-indigo-800 border-indigo-200',
			'Academic': 'bg-pink-100 text-pink-800 border-pink-200',
			'Student': 'bg-cyan-100 text-cyan-800 border-cyan-200',
			'Department': 'bg-teal-100 text-teal-800 border-teal-200',
		}
		
		return moduleColorMap[module] || 'bg-gray-100 text-gray-800 border-gray-200'
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	const sortedModules = Object.keys(groupedPermissions).sort()

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
				
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={expandAll}
						className="text-blue-600 hover:bg-blue-50"
					>
						<ChevronDown className="h-4 w-4 mr-1" />
						Mở rộng tất cả
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={collapseAll}
						className="text-orange-600 hover:bg-orange-50"
					>
						<ChevronRight className="h-4 w-4 mr-1" />
						Thu gọn tất cả
					</Button>
				</div>
			</div>

			{/* Module Cards */}
			<div className="grid gap-4">
				{sortedModules.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						{searchTerm ? 'Không tìm thấy permission nào' : 'Không có permission nào'}
					</div>
				) : (
					sortedModules.map(module => {
						const modulePermissions = groupedPermissions[module]
						const isExpanded = expandedModules.has(module)
						
						return (
							<Card key={module} className={cn('transition-all duration-200', getModuleColor(module))}>
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 hover:bg-white/20"
												onClick={() => toggleExpand(module)}
											>
												{isExpanded ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												)}
											</Button>
											{getModuleIcon(module)}
											<span className="text-lg font-semibold">{module}</span>
											<Badge variant="secondary" className="bg-white/20 text-current">
												{modulePermissions.length} permission{modulePermissions.length > 1 ? 's' : ''}
											</Badge>
										</div>
									</CardTitle>
								</CardHeader>
								
								{isExpanded && (
									<CardContent className="pt-0">
										<div className="grid gap-2">
											{modulePermissions.map(permission => (
												<div
													key={permission.id}
													className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/20"
												>
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<Shield className="h-4 w-4 text-current" />
															<span className="font-medium">{permission.name}</span>
															{permission.rolePermissions && permission.rolePermissions.length > 0 && (
																<Badge variant="outline" className="text-xs bg-white/20 border-white/30">
																	{permission.rolePermissions.length} role{permission.rolePermissions.length > 1 ? 's' : ''}
																</Badge>
															)}
														</div>
														{permission.description && (
															<p className="text-sm text-current/70">{permission.description}</p>
														)}
													</div>
													
													<div className="flex items-center gap-1 ml-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => onView(permission)}
															className="h-8 w-8 p-0 hover:bg-white/20"
														>
															<Eye className="h-4 w-4" />
															<span className="sr-only">Xem chi tiết</span>
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => onEdit(permission)}
															className="h-8 w-8 p-0 hover:bg-white/20"
														>
															<Edit className="h-4 w-4" />
															<span className="sr-only">Chỉnh sửa</span>
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => onDelete(permission)}
															className="h-8 w-8 p-0 hover:bg-red-200 hover:text-red-600"
														>
															<Trash2 className="h-4 w-4" />
															<span className="sr-only">Xóa</span>
														</Button>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								)}
							</Card>
						)
					})
				)}
			</div>

			{/* Statistics */}
			<div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
				<span>
					{sortedModules.length} module{sortedModules.length > 1 ? 's' : ''} với tổng cộng {permissions.length} permission{permissions.length > 1 ? 's' : ''}
					{searchTerm && ` (đang lọc)`}
				</span>
				<span>
					{expandedModules.size} module đang mở rộng
				</span>
			</div>
		</div>
	)
}
