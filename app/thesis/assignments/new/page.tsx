'use client'

import { useRouter } from 'next/navigation'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { thesisData } from '@/modules/thesis/data'
import { findThesisById } from '@/modules/thesis/data'
import { useState } from 'react'
import Link from 'next/link'
import { Thesis } from '@/modules/thesis/types'

const assignmentSchema = z.object({
	thesisId: z.string({ required_error: 'Vui lòng chọn khóa luận.' }),
	title: z.string().min(10, 'Tên nhiệm vụ phải có ít nhất 10 ký tự.'),
	description: z.string().min(20, 'Mô tả phải có ít nhất 20 ký tự.'),
	category: z.string().min(1, 'Vui lòng nhập danh mục.'),
	priority: z.enum(['Thấp', 'Trung bình', 'Cao']),
	dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
		message: 'Ngày hết hạn không hợp lệ.',
	}),
	estimatedHours: z.coerce.number().positive('Số giờ ước tính phải là số dương.'),
})

type AssignmentFormValues = z.infer<typeof assignmentSchema>

export default function NewAssignmentPage() {
	const router = useRouter()
	const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null)

	const form = useForm<AssignmentFormValues>({
		resolver: zodResolver(assignmentSchema),
		defaultValues: {
			priority: 'Trung bình',
		},
	})

	function onSubmit(data: AssignmentFormValues) {
		console.log(data)
		// Here you would typically call an API to save the new assignment
		// e.g., await api.createAssignment(data)
		alert('Tạo nhiệm vụ thành công!')
		router.push('/thesis/assignments')
	}

	const handleThesisChange = (thesisId: string) => {
		const thesis = findThesisById(thesisId)
		setSelectedThesis(thesis || null)
		form.setValue('thesisId', thesisId)
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận', href: '/thesis' },
		{ label: 'Phân công nhiệm vụ', href: '/thesis/assignments' },
		{ label: 'Tạo nhiệm vụ mới' },
	]

	return (
		<PageHeader
			title="Tạo nhiệm vụ mới"
			description="Giao một công việc mới cho sinh viên trong quá trình làm khóa luận."
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
										Điền các thông tin cơ bản của nhiệm vụ được giao.
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
													<Input placeholder="Ví dụ: Viết chương 1 - Tổng quan" {...field} />
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
													<Textarea
														placeholder="Mô tả các yêu cầu, mục tiêu cần đạt được..."
														className="min-h-[120px]"
														{...field}
													/>
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
													<Input placeholder="Ví dụ: Báo cáo, Lập trình..." {...field} />
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
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Chọn độ ưu tiên" />
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
													<Input type="number" placeholder="0" {...field} />
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
										Chọn khóa luận để tự động điền thông tin sinh viên và giảng viên.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="thesisId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Khóa luận</FormLabel>
												<Select onValueChange={handleThesisChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Chọn một khóa luận" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{thesisData.map(thesis => (
															<SelectItem key={thesis.id} value={thesis.id}>{thesis.title}</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									{selectedThesis && (
										<div className="text-sm p-4 bg-muted/50 rounded-lg space-y-2">
											<p><strong>Sinh viên:</strong> {selectedThesis.student}</p>
											<p><strong>Giảng viên:</strong> {selectedThesis.supervisor}</p>
											<Link href={`/thesis/${selectedThesis.id}`} className="text-blue-600 hover:underline text-xs" target="_blank">
												Xem chi tiết khóa luận
											</Link>
										</div>
									)}
								</CardContent>
							</Card>

							<div className="flex justify-end gap-2">
								<Button variant="outline" type="button" onClick={() => router.back()}>
									Hủy
								</Button>
								<Button type="submit">Lưu nhiệm vụ</Button>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</PageHeader>
	)
} 