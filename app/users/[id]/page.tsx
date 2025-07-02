'use client'

import { findUserById } from '@/modules/users/data'
import { notFound, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getRoleText, getStatusVariant } from '@/modules/users/utils'
import { Separator } from '@/components/ui/separator'
import {
	Mail,
	Phone,
	Calendar as CalendarIcon,
	MapPin,
	User as UserIcon,
	GraduationCap,
	Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UserDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const user = findUserById(params.id)

	if (!user) {
		notFound()
	}

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Quản lý Người dùng', href: '/users' },
		{ label: user.name },
	]

	return (
		<PageHeader
			title="Chi tiết người dùng"
			description={`Thông tin chi tiết về ${user.name}`}
			breadcrumbs={breadcrumbs}
			actions={
				<Button onClick={() => router.push(`/users/${user.id}/edit`)}>
					<Edit className="mr-2 h-4 w-4" />
					Chỉnh sửa
				</Button>
			}
		>
			<Card>
				<CardHeader className="flex flex-row items-center space-x-4">
					<Avatar className="h-24 w-24">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<CardTitle className="text-2xl">{user.name}</CardTitle>
						<div className="flex items-center space-x-2">
							<Badge variant="outline">{getRoleText(user.role)}</Badge>
							<Badge variant={getStatusVariant(user.status)}>
								{user.status}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">Thông tin cá nhân</h3>
							<div className="flex items-center">
								<Mail className="h-4 w-4 mr-3 text-muted-foreground" />
								<span className="text-sm">{user.email}</span>
							</div>
							<div className="flex items-center">
								<Phone className="h-4 w-4 mr-3 text-muted-foreground" />
								<span className="text-sm">{user.phone}</span>
							</div>
							<div className="flex items-center">
								<MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
								<span className="text-sm">{user.address}</span>
							</div>
							{user.dateOfBirth && (
								<div className="flex items-center">
									<CalendarIcon className="h-4 w-4 mr-3 text-muted-foreground" />
									<span className="text-sm">
										{new Date(user.dateOfBirth).toLocaleDateString(
											'vi-VN'
										)}
									</span>
								</div>
							)}
						</div>
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">Thông tin học vụ</h3>
							<div className="flex items-center">
								<GraduationCap className="h-4 w-4 mr-3 text-muted-foreground" />
								<span className="text-sm">{user.department}</span>
							</div>
							{user.role === 'STUDENT' && (
								<div className="flex items-center">
									<UserIcon className="h-4 w-4 mr-3 text-muted-foreground" />
									<span className="text-sm">
										Mã sinh viên: {user.studentId}
									</span>
								</div>
							)}
							{user.role === 'LECTURER' && (
								<div className="flex items-center">
									<UserIcon className="h-4 w-4 mr-3 text-muted-foreground" />
									<span className="text-sm">
										Mã giảng viên: {user.employeeId}
									</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</PageHeader>
	)
} 