'use client'

import { notFound, useRouter } from 'next/navigation'
import { findThesisById, statusMap } from '@/modules/thesis/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/common/status-badge'
import {
	Edit,
	User,
	BookUser,
	Calendar as CalendarIcon,
	FileText,
	TrendingUp,
	Tag,
} from 'lucide-react'

export default function ThesisDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const thesis = findThesisById(params.id)

	if (!thesis) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: thesis.title },
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
							<StatusBadge
								status={statusMap[thesis.status] ?? 'inactive'}
							/>
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
									{thesis.student} ({thesis.studentId})
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<BookUser className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Giảng viên hướng dẫn
								</p>
								<p className="font-medium">{thesis.supervisor}</p>
							</div>
						</div>
						<div className="flex items-center">
							<Tag className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Học kỳ</p>
								<p className="font-medium">{thesis.semester}</p>
							</div>
						</div>
						<div className="flex items-center">
							<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Ngày đăng ký</p>
								<p className="font-medium">{thesis.registrationDate}</p>
							</div>
						</div>
						<div className="flex items-center">
							<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Hạn nộp</p>
								<p className="font-medium">{thesis.deadline}</p>
							</div>
						</div>
						<div className="flex items-center col-span-full">
							<TrendingUp className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Tiến độ</p>
								<div className="flex items-center gap-2 mt-1">
									<Progress value={thesis.progress} className="h-2 w-48" />
									<span className="text-sm font-medium">
										{thesis.progress}%
									</span>
								</div>
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