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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'

// Helper to format date to YYYY-MM-DD for input[type="date"]
const formatDateForInput = (dateString: string) => {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	return `${year}-${month}-${day}`
}

export default function ThesisEditPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const thesis = thesisData.find(t => t.id.toString() === params.id)

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
								<Input
									defaultValue={thesis.student.fullName}
									disabled
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Mã sinh viên</label>
								<Input
									defaultValue={thesis.student.studentCode}
									disabled
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Học kỳ</label>
								<Input
									defaultValue={`${thesis.semester.name} - ${thesis.academicYear.name}`}
									disabled
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Ngày nộp</label>
								<Input
									type="date"
									defaultValue={formatDateForInput(thesis.submissionDate)}
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