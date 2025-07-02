'use client'

import { notFound, useRouter } from 'next/navigation'
import { findInternshipById } from '@/modules/internship/data'
import { getStatusBadge, renderStars } from '@/modules/internship/utils'
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
	Briefcase,
	UserCheck,
	Calendar as CalendarIcon,
	MapPin,
	DollarSign,
	Star,
} from 'lucide-react'

export default function InternshipDetailsPage({
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
		{ label: internship.title },
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
						<CardTitle>{internship.title}</CardTitle>
						<CardDescription>
							{getStatusBadge(internship.status)}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
						<div className="flex items-center">
							<User className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Sinh viên</p>
								<p className="font-medium">
									{internship.student} ({internship.studentId})
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<Building2 className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Công ty</p>
								<p className="font-medium">{internship.company}</p>
							</div>
						</div>
						<div className="flex items-center">
							<Briefcase className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Vị trí</p>
								<p className="font-medium">{internship.position}</p>
							</div>
						</div>
						<div className="flex items-center">
							<UserCheck className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									GV Hướng dẫn
								</p>
								<p className="font-medium">{internship.supervisor}</p>
							</div>
						</div>
						<div className="flex items-center">
							<UserCheck className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Người HD tại công ty
								</p>
								<p className="font-medium">
									{internship.companySupervisor}
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Địa điểm</p>
								<p className="font-medium">{internship.location}</p>
							</div>
						</div>
						<div className="flex items-center">
							<CalendarIcon className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Thời gian thực tập
								</p>
								<p className="font-medium">
									{internship.startDate} - {internship.endDate}
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<DollarSign className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Mức lương</p>
								<p className="font-medium">{internship.salary}</p>
							</div>
						</div>
						<div className="flex items-center">
							<Star className="w-5 h-5 mr-3 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Đánh giá</p>
								<div className="flex items-center">
									{renderStars(internship.rating)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageHeader>
	)
} 