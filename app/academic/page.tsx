'use client'

import React, { FC } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Calendar, Users, Building2 } from 'lucide-react'

const AcademicPage: FC = () => {
	const academicModules = [
		{
			title: 'Quản lý Năm học',
			description: 'Tạo và quản lý thông tin các năm học',
			href: '/academic/academic-years',
			icon: Calendar,
			color: 'bg-blue-50 hover:bg-blue-100',
			iconColor: 'text-blue-600',
		},
		{
			title: 'Quản lý Học kỳ',
			description: 'Tạo và quản lý thông tin các học kỳ',
			href: '/academic/semesters',
			icon: GraduationCap,
			color: 'bg-green-50 hover:bg-green-100',
			iconColor: 'text-green-600',
		},
		{
			title: 'Quản lý Đơn vị',
			description: 'Tạo và quản lý thông tin khoa/viện',
			href: '/academic/departments',
			icon: Building2,
			color: 'bg-purple-50 hover:bg-purple-100',
			iconColor: 'text-purple-600',
		},
		{
			title: 'Quản lý Sinh viên',
			description: 'Tạo và quản lý thông tin sinh viên',
			href: '/academic/students',
			icon: Users,
			color: 'bg-orange-50 hover:bg-orange-100',
			iconColor: 'text-orange-600',
		},
	]

	return (
		<div className="mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Học vụ"
				description="Quản lý các thông tin học vụ trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Học vụ', href: '/academic' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Academic Modules Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
				{academicModules.map((module) => {
					const Icon = module.icon
					return (
						<Link key={module.href} href={module.href}>
							<Card className={`transition-colors duration-200 ${module.color} border-2 hover:border-gray-300`}>
								<CardHeader>
									<div className="flex items-center space-x-4">
										<div className={`p-2 rounded-lg bg-white shadow-sm`}>
											<Icon className={`h-6 w-6 ${module.iconColor}`} />
										</div>
										<div>
											<CardTitle className="text-lg">{module.title}</CardTitle>
											<CardDescription className="text-sm text-gray-600 mt-1">
												{module.description}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
							</Card>
						</Link>
					)
				})}
			</div>

			{/* Quick Stats Section */}
			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Building2 className="h-8 w-8 text-blue-600" />
								<div>
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-gray-600">Khoa</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Calendar className="h-8 w-8 text-green-600" />
								<div>
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-gray-600">Năm học</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<GraduationCap className="h-8 w-8 text-purple-600" />
								<div>
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-gray-600">Học kỳ</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-2">
								<Users className="h-8 w-8 text-orange-600" />
								<div>
									<p className="text-2xl font-bold">0</p>
									<p className="text-sm text-gray-600">Sinh viên</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default AcademicPage
