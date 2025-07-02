'use client'

import { notFound, useRouter } from 'next/navigation'
import { thesisData } from '@/modules/thesis/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Edit,
	User,
	Calendar as CalendarIcon,
	FileText,
	Tag,
} from 'lucide-react'

export default function ThesisDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const thesis = thesisData.find(t => t.id.toString() === params.id)

	if (!thesis) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: thesis.title || 'Chi tiết' },
	]

	return (
		<PageHeader
			title="Chi tiết Khóa luận"
			description="Thông tin chi tiết về khóa luận đã chọn"
			breadcrumbs={breadcrumbs}
			actions={
				<Button onClick={() => router.push(`/thesis/${thesis.id}/edit`)}>
					<Edit className="mr-2 h-4 w-4" />
					Chỉnh sửa
				</Button>
			}
		>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>{thesis.title}</CardTitle>
						<CardDescription>
							Mã số: {thesis.id}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
						<div className="flex items-center">
							<User className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Sinh viên thực hiện
								</p>
								<p className="font-medium">
									{thesis.student.fullName} ({thesis.student.studentCode})
								</p>
							</div>
						</div>

						<div className="flex items-center">
							<Tag className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Học kỳ</p>
								<p className="font-medium">
									{thesis.semester.name} - {thesis.academicYear.name}
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Ngày nộp bài
								</p>
								<p className="font-medium">
									{new Date(thesis.submissionDate).toLocaleDateString(
										'vi-VN'
									)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Tệp đính kèm và Tài liệu</CardTitle>
						<CardDescription>
							Các tệp liên quan đến quá trình thực hiện khóa luận.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between p-2 border rounded-md">
								<div className="flex items-center">
									<FileText className="w-5 h-5 mr-3 text-muted-foreground" />
									<p>Báo cáo tiến độ tuần 10.pdf</p>
								</div>
								<Button variant="outline" size="sm">
									Tải xuống
								</Button>
							</div>
							<div className="flex items-center justify-between p-2 border rounded-md">
								<div className="flex items-center">
									<FileText className="w-5 h-5 mr-3 text-muted-foreground" />
									<p>Mã nguồn dự án version 1.0.zip</p>
								</div>
								<Button variant="outline" size="sm">
									Tải xuống
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 