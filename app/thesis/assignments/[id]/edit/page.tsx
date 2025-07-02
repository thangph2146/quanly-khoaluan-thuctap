'use client'

import { useRouter, notFound } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { findAssignmentById } from '@/modules/thesis/data'
import Link from 'next/link'

const assignmentSchema = z.object({
	title: z.string().min(10, 'Tên nhiệm vụ phải có ít nhất 10 ký tự.'),
	description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự.'),
	category: z.string().min(1, 'Vui lòng nhập danh mục.'),
	priority: z.enum(['Thấp', 'Trung bình', 'Cao']),
	dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
		message: 'Ngày hết hạn không hợp lệ.',
	}),
	estimatedHours: z.coerce
		.number()
		.positive('Số giờ ước tính phải là số dương.'),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

export default function EditAssignmentPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const assignment = findAssignmentById(params.id)

	if (!assignment) {
		notFound()
	}

	const form = useForm<AssignmentFormValues>({
		resolver: zodResolver(assignmentSchema),
		defaultValues: {
			title: assignment.title,
			description: assignment.description,
			category: assignment.category,
			priority: assignment.priority,
			dueDate: assignment.dueDate,
			estimatedHours: assignment.estimatedHours,
		},
	})

	function onSubmit(data: AssignmentFormValues) {
		console.log({ ...assignment, ...data })
		// Here you would typically call an API to update the assignment
		// e.g., await api.updateAssignment(assignment.id, data)
		alert('Cập nhật nhiệm vụ thành công!')
		router.push('/thesis/assignments')
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Phân công nhiệm vụ', href: '/thesis/assignments' },
		{ label: assignment.title }, // Should link back to detail view
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa nhiệm vụ"
			description={`Cập nhật thông tin cho nhiệm vụ: "${assignment.title}"`}
			breadcrumbs={breadcrumbs}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid md:grid-cols-3 gap-8">
						<div className="md:col-span-2 space-y-8">
							<Card>
								<CardHeader>
									<CardTitle>Chi tiết nhiệm vụ</CardTitle>
									<CardDescription>
										Chỉnh sửa các thông tin cơ bản của nhiệm vụ.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tên nhiệm vụ</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Mô tả chi tiết</FormLabel>
												<FormControl>
													<Textarea className="min-h-[120px]" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Phân loại và Thời hạn</CardTitle>
								</CardHeader>
								<CardContent className="grid sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Danh mục</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="priority"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Độ ưu tiên</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Thấp">Thấp</SelectItem>
														<SelectItem value="Trung bình">Trung bình</SelectItem>
														<SelectItem value="Cao">Cao</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="dueDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ngày hết hạn</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="estimatedHours"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Số giờ ước tính</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-8">
							<Card>
								<CardHeader>
									<CardTitle>Đối tượng</CardTitle>
									<CardDescription>
										Thông tin sinh viên và giảng viên của nhiệm vụ này.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2 text-sm">
									<p>
										<strong>Khóa luận:</strong> {assignment.thesis.title}
									</p>
									<p>
										<strong>Sinh viên:</strong> {assignment.student.name} (
										{assignment.student.code})
									</p>
									<p>
										<strong>Giảng viên:</strong> {assignment.supervisor.name}
									</p>
									<Link
										href={`/thesis/${assignment.thesis.id}`}
										className="text-blue-600 hover:underline text-xs"
										target="_blank"
									>
										Xem chi tiết khóa luận
									</Link>
								</CardContent>
							</Card>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									type="button"
									onClick={() => router.back()}
								>
									Hủy
								</Button>
								<Button type="submit">Lưu thay đổi</Button>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</PageHeader>
	)
} 