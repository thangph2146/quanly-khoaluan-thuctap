'use client'

import { notFound, useRouter } from 'next/navigation'
import { findThesisById } from '@/modules/thesis/data'
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
import { Save } from 'lucide-react'

export default function ThesisEditPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const thesis = findThesisById(params.id)

	if (!thesis) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: thesis.title, href: `/thesis/${thesis.id}` },
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa Khóa luận"
			description="Cập nhật thông tin cho khóa luận"
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Khóa luận</CardTitle>
					<CardDescription>
						Chỉnh sửa thông tin và nhấn lưu để cập nhật.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Tên khóa luận</label>
							<Textarea
								defaultValue={thesis.title}
								className="min-h-[100px]"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium">Sinh viên</label>
								<Input defaultValue={thesis.student} />
							</div>
							<div>
								<label className="text-sm font-medium">Mã sinh viên</label>
								<Input defaultValue={thesis.studentId} disabled />
							</div>
							<div>
								<label className="text-sm font-medium">
									Giảng viên hướng dẫn
								</label>
								<Input defaultValue={thesis.supervisor} />
							</div>
							<div>
								<label className="text-sm font-medium">Học kỳ</label>
								<Input defaultValue={thesis.semester} />
							</div>
							<div>
								<label className="text-sm font-medium">Ngày đăng ký</label>
								<Input type="date" defaultValue={thesis.registrationDate} />
							</div>
							<div>
								<label className="text-sm font-medium">Hạn nộp</label>
								<Input type="date" defaultValue={thesis.deadline} />
							</div>
							<div>
								<label className="text-sm font-medium">Trạng thái</label>
								<Select defaultValue={thesis.status}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="IN_PROGRESS">
											Đang thực hiện
										</SelectItem>
										<SelectItem value="PENDING_DEFENSE">
											Chờ bảo vệ
										</SelectItem>
										<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
										<SelectItem value="OVERDUE">Quá hạn</SelectItem>
										<SelectItem value="APPROVED">Đã duyệt</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium">
									Tiến độ (%)
								</label>
								<Input
									type="number"
									defaultValue={thesis.progress}
									min="0"
									max="100"
								/>
							</div>
						</div>
					</div>
					<div className="flex justify-end pt-4">
						<Button onClick={() => router.back()}>
							<Save className="mr-2 h-4 w-4" />
							Lưu thay đổi
						</Button>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
} 