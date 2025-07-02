'use client'

import { notFound, useRouter } from 'next/navigation'
import { internshipsData } from '@/modules/internship/data'
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
	Building2,
	Calendar as CalendarIcon,
	FileText,
	GraduationCap,
} from 'lucide-react'

export default function InternshipDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const internship = internshipsData.find(i => i.id.toString() === params.id)

	if (!internship) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Thực tập', href: '/internship' },
		{ label: `Chi tiết thực tập của ${internship.student.fullName}` },
	]

	return (
		<PageHeader
			title="Chi tiết Thực tập"
			description="Thông tin chi tiết về chương trình thực tập đã chọn"
			breadcrumbs={breadcrumbs}
			actions={
				<Button
					onClick={() => router.push(`/internship/${internship.id}/edit`)}
				>
					<Edit className="mr-2 h-4 w-4" />
					Chỉnh sửa
				</Button>
			}
		>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>
							Thực tập tại {internship.partner.name}
						</CardTitle>
						<CardDescription>Mã số: {internship.id}</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
						<div className="flex items-center">
							<User className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Sinh viên</p>
								<p className="font-medium">
									{internship.student.fullName} (
									{internship.student.studentCode})
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<Building2 className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Công ty/Đối tác
								</p>
								<p className="font-medium">{internship.partner.name}</p>
							</div>
						</div>
						<div className="flex items-center">
							<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Năm học - Học kỳ
								</p>
								<p className="font-medium">
									{internship.academicYear.name} -{' '}
									{internship.semester.name}
								</p>
							</div>
						</div>

						{internship.grade !== null && internship.grade !== undefined && (
							<div className="flex items-center">
								<GraduationCap className="w-5 h-5 mr-3 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Điểm số</p>
									<p className="font-medium">
										{internship.grade.toFixed(1)}
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
				{internship.reportUrl && (
					<Card>
						<CardHeader>
							<CardTitle>Báo cáo</CardTitle>
							<CardDescription>
								Báo cáo cuối kỳ của sinh viên.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between p-2 border rounded-md">
								<div className="flex items-center">
									<FileText className="w-5 h-5 mr-3 text-muted-foreground" />
									<p>Tải báo cáo của sinh viên</p>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										window.open(internship.reportUrl, '_blank')
									}
								>
									Tải xuống
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</PageHeader>
	)
} 