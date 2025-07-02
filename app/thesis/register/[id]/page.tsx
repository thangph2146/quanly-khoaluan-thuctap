'use client'

import { notFound } from 'next/navigation'
import {
	findRegistrationById,
	findSupervisorById,
} from '@/modules/thesis/data'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
	User,
	Mail,
	Phone,
	BookOpen,
	GraduationCap,
	Paperclip,
	Calendar as CalendarIcon,
	Hash,
	Check,
	X,
} from 'lucide-react'
import Link from 'next/link'

const getStatusBadge = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
	switch (status) {
		case 'APPROVED':
			return (
				<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
					<Check className="mr-2 h-4 w-4" />
					Đã duyệt
				</Badge>
			)
		case 'REJECTED':
			return (
				<Badge className="bg-red-100 text-red-800 hover:bg-red-100">
					<X className="mr-2 h-4 w-4" />
					Bị từ chối
				</Badge>
			)
		default:
			return (
				<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
					Đang chờ duyệt
				</Badge>
			)
	}
}

export default function RegistrationDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const registration = findRegistrationById(params.id)

	if (!registration) {
		notFound()
	}

	const supervisor = findSupervisorById(registration.supervisorId)

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Khóa luận', href: '/thesis' },
		{ label: 'Đăng ký Khóa luận', href: '/thesis/register' },
		{ label: `Đơn đăng ký #${registration.id}` },
	]

	return (
		<PageHeader
			title={`Đơn đăng ký #${registration.id}`}
			description="Xem xét và phê duyệt đơn đăng ký khóa luận của sinh viên"
			breadcrumbs={breadcrumbs}
			actions={getStatusBadge(registration.status)}
		>
			<div className="grid md:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<BookOpen className="mr-2" /> Thông tin đề tài
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-semibold">Tên đề tài</h3>
								<p className="text-muted-foreground">
									{registration.proposedTitle}
								</p>
							</div>
							<div>
								<h3 className="font-semibold">Lĩnh vực nghiên cứu</h3>
								<p className="text-muted-foreground">{registration.topic}</p>
							</div>
							<div>
								<h3 className="font-semibold">Đề cương đính kèm</h3>
								<Link
									href={registration.outlineUrl}
									target="_blank"
									className="text-blue-600 hover:underline flex items-center"
								>
									<Paperclip className="mr-2 h-4 w-4" />
									Xem file đề cương
								</Link>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Phản hồi và phê duyệt</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Textarea
								placeholder="Nhập nhận xét hoặc lý do (nếu từ chối)..."
								defaultValue={registration.comments}
								className="min-h-[120px]"
							/>
							<div className="flex justify-end space-x-2">
								<Button variant="destructive">
									<X className="mr-2 h-4 w-4" /> Từ chối
								</Button>
								<Button className="bg-green-600 hover:bg-green-700">
									<Check className="mr-2 h-4 w-4" /> Phê duyệt
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar Info */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<User className="mr-2" /> Thông tin sinh viên
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<InfoItem icon={<Hash />} label="Mã SV" value={registration.studentId} />
							<InfoItem icon={<User />} label="Họ tên" value={registration.studentName} />
							<InfoItem icon={<Mail />} label="Email" value={registration.studentEmail} />
							<InfoItem icon={<Phone />} label="Điện thoại" value={registration.studentPhone} />
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center">
								<GraduationCap className="mr-2" /> Giảng viên hướng dẫn
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{supervisor && (
								<>
									<InfoItem icon={<Hash />} label="Mã GV" value={supervisor.id} />
									<InfoItem icon={<User />} label="Họ tên" value={supervisor.name} />
								</>
							)}
							<InfoItem
								icon={<CalendarIcon />}
								label="Ngày nộp"
								value={registration.submissionDate}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageHeader>
	)
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start">
        <div className="w-6 h-6 mr-3 text-muted-foreground flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
) 