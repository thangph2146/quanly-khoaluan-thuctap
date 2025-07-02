'use client'

import { notFound, useRouter } from 'next/navigation'
import { findInternshipById } from '@/modules/internship/data'
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

export default function InternshipEditPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const internship = findInternshipById(params.id)

	if (!internship) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Thực tập', href: '/internship' },
		{ label: internship.title, href: `/internship/${internship.id}` },
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
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Tên công việc</label>
							<Textarea
								defaultValue={internship.title}
								className="min-h-[100px]"
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<InputGroup>
								<Label>Sinh viên</Label>
								<Input defaultValue={internship.student} />
							</InputGroup>
							<InputGroup>
								<Label>Mã sinh viên</Label>
								<Input defaultValue={internship.studentId} disabled />
							</InputGroup>
							<InputGroup>
								<Label>Công ty</Label>
								<Input defaultValue={internship.company} />
							</InputGroup>
							<InputGroup>
								<Label>Vị trí</Label>
								<Input defaultValue={internship.position} />
							</InputGroup>
							<InputGroup>
								<Label>GV Hướng dẫn</Label>
								<Input defaultValue={internship.supervisor} />
							</InputGroup>
							<InputGroup>
								<Label>Người HD tại công ty</Label>
								<Input defaultValue={internship.companySupervisor} />
							</InputGroup>
							<InputGroup>
								<Label>Địa điểm</Label>
								<Input defaultValue={internship.location} />
							</InputGroup>
							<InputGroup>
								<Label>Ngày bắt đầu</Label>
								<Input type="date" defaultValue={internship.startDate} />
							</InputGroup>
							<InputGroup>
								<Label>Ngày kết thúc</Label>
								<Input type="date" defaultValue={internship.endDate} />
							</InputGroup>
							<InputGroup>
								<Label>Mức lương</Label>
								<Input defaultValue={internship.salary} />
							</InputGroup>
							<InputGroup>
								<Label>Đánh giá (0-5)</Label>
								<Input
									type="number"
									defaultValue={internship.rating}
									min="0"
									max="5"
									step="0.1"
								/>
							</InputGroup>
							<InputGroup>
								<Label>Trạng thái</Label>
								<Select defaultValue={internship.status}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
										<SelectItem value="IN_PROGRESS">
											Đang thực tập
										</SelectItem>
										<SelectItem value="PENDING_EVALUATION">
											Chờ đánh giá
										</SelectItem>
										<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
										<SelectItem value="CANCELLED">Đã hủy</SelectItem>
									</SelectContent>
								</Select>
							</InputGroup>
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

const InputGroup = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => <div className={`space-y-2 ${className}`}>{children}</div>

const Label = ({ children }: { children: React.ReactNode }) => (
	<label className="text-sm font-medium">{children}</label>
) 