'use client'

import { useState } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { BookOpen, Download, Search, Eye, Calendar, User, Plus } from 'lucide-react'
import { guidelines } from '@/modules/guidelines/data'
import { getCategoryColor, getCategoryText } from '@/modules/guidelines/utils'
import { Guideline, GuidelineCategory } from '@/modules/guidelines/types'

export default function GuidelinesPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<
		GuidelineCategory | 'ALL'
	>('ALL')

	const filteredGuidelines = guidelines.filter(g => {
		const matchesSearch =
			g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			g.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

		const matchesCategory =
			selectedCategory === 'ALL' || g.category === selectedCategory

		return matchesSearch && matchesCategory
	})

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/dashboard">
									Hệ thống Quản lý
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/documents">
									Tài liệu & Mẫu
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Hướng dẫn & Quy định</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{/* Header */}
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Hướng dẫn & Quy định
							</h1>
							<p className="text-muted-foreground">
								Kho tài liệu, hướng dẫn và quy định chính thức của hệ thống.
							</p>
						</div>
						<div className="flex space-x-2">
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Thêm tài liệu mới
							</Button>
						</div>
					</div>

					{/* Search and Filter */}
					<div className="flex items-center space-x-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Tìm kiếm tài liệu..."
								className="pl-10"
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex space-x-2">
							<Button
								variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
								onClick={() => setSelectedCategory('ALL')}
							>
								Tất cả
							</Button>
							<Button
								variant={
									selectedCategory === 'THESIS_PROCESS'
										? 'default'
										: 'outline'
								}
								onClick={() => setSelectedCategory('THESIS_PROCESS')}
							>
								Khóa luận
							</Button>
							<Button
								variant={
									selectedCategory === 'INTERNSHIP_PROCESS'
										? 'default'
										: 'outline'
								}
								onClick={() => setSelectedCategory('INTERNSHIP_PROCESS')}
							>
								Thực tập
							</Button>
							<Button
								variant={
									selectedCategory === 'GENERAL_REGULATION'
										? 'default'
										: 'outline'
								}
								onClick={() => setSelectedCategory('GENERAL_REGULATION')}
							>
								Quy định chung
							</Button>
						</div>
					</div>
				</div>

				{/* Guidelines Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredGuidelines.map((guideline: Guideline) => (
						<Card key={guideline.id} className="flex flex-col">
							<CardHeader>
								<div className="flex items-center justify-between mb-2">
									<Badge
										variant="outline"
										className={getCategoryColor(guideline.category)}
									>
										{getCategoryText(guideline.category)}
									</Badge>
									<span className="text-xs text-muted-foreground">
										v{guideline.version}
									</span>
								</div>
								<CardTitle>{guideline.title}</CardTitle>
								<CardDescription>{guideline.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex-grow space-y-4">
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span className="flex items-center">
										<User className="mr-1.5 h-4 w-4" /> {guideline.author}
									</span>
									<span className="flex items-center">
										<Calendar className="mr-1.5 h-4 w-4" />{' '}
										{new Date(guideline.lastUpdated).toLocaleDateString(
											'vi-VN'
										)}
									</span>
								</div>
								<div className="flex flex-wrap gap-2">
									{guideline.tags.map((tag: string, index: number) => (
										<Badge key={index} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
							<div className="p-6 pt-0 flex gap-2">
								<Button size="sm" className="flex-1">
									<Download className="h-4 w-4 mr-2" />
									Tải về
								</Button>
								<Button size="sm" variant="outline" className="flex-1">
									<Eye className="h-4 w-4 mr-2" />
									Xem chi tiết
								</Button>
							</div>
						</Card>
					))}
				</div>

				{filteredGuidelines.length === 0 && (
					<div className="text-center py-16">
						<BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Không tìm thấy tài liệu
						</h3>
						<p className="text-muted-foreground">
							Hãy thử với từ khóa hoặc bộ lọc khác.
						</p>
					</div>
				)}
			</div>
		</>
	)
} 