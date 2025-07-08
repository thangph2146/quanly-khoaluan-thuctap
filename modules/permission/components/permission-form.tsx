/**
 * Permission Form Component
 * Form for creating and editing permissions
 */
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { PERMISSION_CONSTANTS } from '../constants'
import type { Permission, CreatePermissionData, UpdatePermissionData } from '../types'

// Validation schema
const permissionSchema = z.object({
	name: z
		.string()
		.min(1, PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_REQUIRED)
		.max(100, PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_TOO_LONG)
		.regex(
			PERMISSION_CONSTANTS.VALIDATION.NAME.PATTERN,
			PERMISSION_CONSTANTS.MESSAGES.VALIDATION.NAME_INVALID
		),
	module: z
		.string()
		.min(1, PERMISSION_CONSTANTS.MESSAGES.VALIDATION.MODULE_REQUIRED)
		.max(50, PERMISSION_CONSTANTS.MESSAGES.VALIDATION.MODULE_TOO_LONG),
	description: z
		.string()
		.max(500, PERMISSION_CONSTANTS.MESSAGES.VALIDATION.DESCRIPTION_TOO_LONG)
		.optional(),
})

type PermissionFormData = z.infer<typeof permissionSchema>

interface PermissionFormProps {
	permission?: Permission | null
	modules: string[]
	onSubmit: (data: CreatePermissionData | UpdatePermissionData) => Promise<void>
	onCancel: () => void
	isLoading?: boolean
	mode: 'create' | 'edit'
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
	permission,
	modules,
	onSubmit,
	onCancel,
	isLoading = false,
	mode,
}) => {
	const form = useForm<PermissionFormData>({
		resolver: zodResolver(permissionSchema),
		defaultValues: {
			name: permission?.name || '',
			module: permission?.module || '',
			description: permission?.description || '',
		},
	})

	const handleSubmit = async (data: PermissionFormData) => {
		await onSubmit(data)
	}

	const handleNameChange = (value: string) => {
		// Auto-format name to uppercase with underscores
		const formatted = value.toUpperCase().replace(/\s+/g, '_')
		form.setValue('name', formatted)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tên Permission</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="VD: CREATE_USER, MANAGE_ROLES"
									onChange={(e) => {
										handleNameChange(e.target.value)
									}}
								/>
							</FormControl>
							<FormDescription>
								Tên permission phải viết hoa và chỉ chứa chữ cái, số và dấu gạch dưới
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="module"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Module</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Chọn module" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{modules.map((module) => (
										<SelectItem key={module} value={module}>
											{module}
										</SelectItem>
									))}
									<SelectItem value="Custom">Custom</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								Chọn module mà permission này thuộc về
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.watch('module') === 'Custom' && (
					<div className="space-y-2">
						<Label htmlFor="customModule">Module tùy chỉnh</Label>
						<Input
							id="customModule"
							placeholder="Nhập tên module mới"
							onChange={(e) => {
								form.setValue('module', e.target.value)
							}}
						/>
					</div>
				)}

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mô tả (tùy chọn)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Mô tả chi tiết về permission này..."
									rows={3}
								/>
							</FormControl>
							<FormDescription>
								Mô tả chi tiết về chức năng của permission
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end space-x-2">
					<Button type="button" variant="outline" onClick={onCancel}>
						Hủy
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Tạo' : 'Cập nhật'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
