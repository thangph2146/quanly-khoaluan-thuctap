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
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'

export default function InternshipEditPage({
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
		{
			label: `Thực tập của ${internship.student.fullName}`,
			href: `/internship/${internship.id}`,
		},
		{ label: 'Chỉnh sửa' },
	]

	return (
		<PageHeader
			title="Chỉnh sửa Thực tập"
			description="Cập nhật thông tin cho chương trình thực tập"
			breadcrumbs={breadcrumbs}
		>
			<Card>
				<CardHeader>
					<CardTitle>Thông tin Thực tập</CardTitle>
					<CardDescription>
						Chỉnh sửa thông tin và nhấn lưu để cập nhật.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Read-only fields */}
						<div>
							<label className="text-sm font-medium">Sinh viên</label>
							<Input
								defaultValue={internship.student.fullName}
								disabled
							/>
						</div>
						<div>
							<label className="text-sm font-medium">Công ty</label>
							<Input
								defaultValue={internship.partner.name}
								disabled
							/>
						</div>
						<div>
							<label className="text-sm font-medium">Học kỳ</label>
							<Input
								defaultValue={`${internship.semester.name} - ${internship.academicYear.name}`}
								disabled
							/>
						</div>
						<div className="h-10"></div> {/* Spacer */}
						{/* Editable fields */}
						<div>
							<label className="text-sm font-medium">
								Điểm thực tập (Thang 10)
							</label>
							<Input
								type="number"
								defaultValue={internship.grade ?? ''}
								min="0"
								max="10"
								step="0.1"
								placeholder="Chưa có điểm"
							/>
						</div>
						<div>
							<label className="text-sm font-medium">
								Đường dẫn báo cáo
							</label>
							<Input
								defaultValue={internship.reportUrl ?? ''}
								placeholder="https://example.com/report.pdf"
							/>
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