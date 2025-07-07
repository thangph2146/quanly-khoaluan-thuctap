/**
 * Permission Module View Component
 * Displays permissions grouped by module
 */
import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Edit, Trash2, Eye, Shield, Users, BookOpen, Briefcase, Settings, Building, Calendar, Clock, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { groupPermissionsByModule } from '../utils/formatting'
import type { Permission } from '../types'

interface PermissionModuleViewProps {
	permissions: Permission[]
	onEdit: (permission: Permission) => void
	onDelete: (permission: Permission) => void
	onView: (permission: Permission) => void
}

export const PermissionModuleView: React.FC<PermissionModuleViewProps> = ({
	permissions,
	onEdit,
	onDelete,
	onView,
}) => {
	const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
	
	const groupedPermissions = groupPermissionsByModule(permissions)

	const toggleModule = (module: string) => {
		const newExpanded = new Set(expandedModules)
		if (newExpanded.has(module)) {
			newExpanded.delete(module)
		} else {
			newExpanded.add(module)
		}
		setExpandedModules(newExpanded)
	}

	const getModuleIcon = (module: string) => {
		const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
			User: Users,
			Role: Shield,
			Permission: Shield,
			Menu: Settings,
			Thesis: BookOpen,
			Internship: Briefcase,
			Student: GraduationCap,
			Partner: Users,
			Department: Building,
			AcademicYear: Calendar,
			Semester: Clock,
		}
		return icons[module] || Shield
	}

	const getModuleColor = (module: string) => {
		const colors: Record<string, string> = {
			User: 'bg-blue-100 text-blue-800 border-blue-200',
			Role: 'bg-green-100 text-green-800 border-green-200',
			Permission: 'bg-purple-100 text-purple-800 border-purple-200',
			Menu: 'bg-orange-100 text-orange-800 border-orange-200',
			Thesis: 'bg-red-100 text-red-800 border-red-200',
			Internship: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			Student: 'bg-indigo-100 text-indigo-800 border-indigo-200',
			Partner: 'bg-pink-100 text-pink-800 border-pink-200',
			Department: 'bg-teal-100 text-teal-800 border-teal-200',
			AcademicYear: 'bg-lime-100 text-lime-800 border-lime-200',
			Semester: 'bg-cyan-100 text-cyan-800 border-cyan-200',
		}
		return colors[module] || 'bg-gray-100 text-gray-800 border-gray-200'
	}

	return (
		<div className="space-y-4">
			{Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
				const isExpanded = expandedModules.has(module)
				const ModuleIcon = getModuleIcon(module)
				
				return (
					<Card key={module} className={`transition-all duration-200 ${getModuleColor(module)}`}>
						<Collapsible open={isExpanded} onOpenChange={() => toggleModule(module)}>
							<CollapsibleTrigger asChild>
								<CardHeader className="cursor-pointer hover:bg-black/5 transition-colors">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<ModuleIcon className="h-5 w-5" />
											<div>
												<CardTitle className="text-lg">{module}</CardTitle>
												<CardDescription>
													{modulePermissions.length} permissions
												</CardDescription>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant="secondary" className="bg-white/50">
												{modulePermissions.length}
											</Badge>
											{isExpanded ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</div>
									</div>
								</CardHeader>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<CardContent className="pt-0">
									<div className="grid gap-3">
										{modulePermissions.map((permission) => (
											<div
												key={permission.id}
												className="flex items-center justify-between p-3 bg-white rounded-lg border"
											>
												<div className="flex-1">
													<div className="flex items-center gap-3">
														<div className="font-medium text-sm">
															{permission.name}
														</div>
														<Badge variant="outline" className="text-xs">
															ID: {permission.id}
														</Badge>
													</div>
													{permission.description && (
														<div className="text-xs text-muted-foreground mt-1">
															{permission.description}
														</div>
													)}
												</div>
												<div className="flex items-center gap-1">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onView(permission)}
														className="h-8 w-8 p-0"
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onEdit(permission)}
														className="h-8 w-8 p-0"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onDelete(permission)}
														className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</CollapsibleContent>
						</Collapsible>
					</Card>
				)
			})}
		</div>
	)
}
