'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Users, 
  Briefcase,
  Search,
  Plus,
  Eye,
  Edit,
  MessageSquare
} from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for supervisors
const supervisors = [
  {
    id: 'SP001',
    name: 'Nguyễn Văn Minh',
    position: 'Senior Software Engineer',
    company: 'FPT Software',
    department: 'Web Development',
    email: 'minh.nv@fpt.com.vn',
    phone: '0901234567',
    experience: '8 năm',
    specialties: ['React', 'Node.js', 'MongoDB', 'AWS'],
    currentInterns: 3,
    maxInterns: 5,
    rating: 4.8,
    totalInterns: 15,
    completedInterns: 12,
    address: 'Tòa nhà FPT, Quận 7, TP.HCM',
    bio: 'Chuyên gia phát triển web với hơn 8 năm kinh nghiệm. Đã hướng dẫn nhiều sinh viên thực tập thành công.',
    projects: [
      'Hệ thống quản lý bán hàng trực tuyến',
      'Ứng dụng mobile banking',
      'Platform học trực tuyến'
    ],
    availability: 'Sẵn sáng'
  },
  {
    id: 'SP002',
    name: 'Trần Thị Lan',
    position: 'Tech Lead',
    company: 'Viettel Digital',
    department: 'Mobile Development',
    email: 'lan.tt@viettel.com.vn',
    phone: '0912345678',
    experience: '10 năm',
    specialties: ['React Native', 'Flutter', 'iOS', 'Android'],
    currentInterns: 2,
    maxInterns: 4,
    rating: 4.9,
    totalInterns: 20,
    completedInterns: 18,
    address: 'Tòa nhà Viettel, Quận 1, TP.HCM',
    bio: 'Tech Lead với chuyên môn sâu về mobile development. Có kinh nghiệm mentoring và đào tạo nhân sự.',
    projects: [
      'Ứng dụng MyViettel',
      'Super app Viettel Money',
      'Hệ thống IoT cho smart city'
    ],
    availability: 'Sẵn sáng'
  },
  {
    id: 'SP003',
    name: 'Lê Hoàng Nam',
    position: 'Data Scientist',
    company: 'TMA Solutions',
    department: 'AI & Data Analytics',
    email: 'nam.lh@tmasolutions.com',
    phone: '0923456789',
    experience: '6 năm',
    specialties: ['Python', 'Machine Learning', 'TensorFlow', 'Big Data'],
    currentInterns: 1,
    maxInterns: 3,
    rating: 4.7,
    totalInterns: 8,
    completedInterns: 7,
    address: 'Tòa nhà TMA, Quận 3, TP.HCM',
    bio: 'Data Scientist với kinh nghiệm trong AI và machine learning. Đam mê chia sẻ kiến thức với thế hệ trẻ.',
    projects: [
      'Hệ thống recommendation engine',
      'Phân tích dữ liệu khách hàng',
      'Chatbot AI cho customer service'
    ],
    availability: 'Sẵn sáng'
  },
  {
    id: 'SP004',
    name: 'Phạm Minh Đức',
    position: 'DevOps Engineer',
    company: 'VNG Corporation',
    department: 'Infrastructure',
    email: 'duc.pm@vng.com.vn',
    phone: '0934567890',
    experience: '7 năm',
    specialties: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    currentInterns: 4,
    maxInterns: 4,
    rating: 4.6,
    totalInterns: 12,
    completedInterns: 10,
    address: 'Tòa nhà VNG, Quận 7, TP.HCM',
    bio: 'DevOps Engineer với kinh nghiệm triển khai và vận hành hệ thống quy mô lớn.',
    projects: [
      'Hạ tầng cloud cho Zalo',
      'Hệ thống monitoring và alerting',
      'Platform CI/CD tự động'
    ],
    availability: 'Đầy'
  },
  {
    id: 'SP005',
    name: 'Võ Thị Mai',
    position: 'UI/UX Designer',
    company: 'Saigon Technology',
    department: 'Design',
    email: 'mai.vt@saigontech.com',
    phone: '0945678901',
    experience: '5 năm',
    specialties: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    currentInterns: 1,
    maxInterns: 2,
    rating: 4.8,
    totalInterns: 6,
    completedInterns: 6,
    address: 'Tòa nhà Saigon Tech, Quận 1, TP.HCM',
    bio: 'UI/UX Designer với đam mê tạo ra những trải nghiệm người dùng tuyệt vời.',
    projects: [
      'Redesign ứng dụng e-commerce',
      'Design system cho fintech app',
      'UX research cho gaming platform'
    ],
    availability: 'Sẵn sáng'
  }
]

// Mock data for companies
const companies = [
  {
    name: 'FPT Software',
    supervisors: 8,
    activeInterns: 25,
    rating: 4.8,
    address: 'Quận 7, TP.HCM'
  },
  {
    name: 'Viettel Digital',
    supervisors: 6,
    activeInterns: 18,
    rating: 4.6,
    address: 'Quận 1, TP.HCM'
  },
  {
    name: 'TMA Solutions',
    supervisors: 5,
    activeInterns: 15,
    rating: 4.5,
    address: 'Quận 3, TP.HCM'
  },
  {
    name: 'VNG Corporation',
    supervisors: 4,
    activeInterns: 12,
    rating: 4.7,
    address: 'Quận 7, TP.HCM'
  }
]

export default function SupervisorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [selectedSupervisor, setSelectedSupervisor] = useState<typeof supervisors[0] | null>(null)

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.specialties.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCompany = selectedCompany === 'all' || supervisor.company === selectedCompany
    return matchesSearch && matchesCompany
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Sẵn sáng': return 'bg-green-100 text-green-800'
      case 'Đầy': return 'bg-red-100 text-red-800'
      case 'Hạn chế': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Thực tập', href: '/internship' },
		{ label: 'Người hướng dẫn' },
	]

  return (
		<PageHeader
			title="Người hướng dẫn thực tập"
			description="Quản lý và theo dõi thông tin người hướng dẫn tại các doanh nghiệp"
			breadcrumbs={breadcrumbs}
			actions={
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Thêm mentor mới
				</Button>
			}
		>
			<div className="space-y-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Tổng mentor</CardTitle>
							<User className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{supervisors.length}</div>
							<p className="text-xs text-muted-foreground">
								+2 mentor mới tháng này
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Doanh nghiệp</CardTitle>
							<Building className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{companies.length}</div>
							<p className="text-xs text-muted-foreground">
								Đối tác thực tập
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Đang hướng dẫn
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{supervisors.reduce((sum, s) => sum + s.currentInterns, 0)}
							</div>
							<p className="text-xs text-muted-foreground">
								Sinh viên thực tập
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
							<Star className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{(
									supervisors.reduce((sum, s) => sum + s.rating, 0) /
									supervisors.length
								).toFixed(1)}
							</div>
							<p className="text-xs text-muted-foreground">Trên 5 sao</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Tìm kiếm mentor, công ty, kỹ năng..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<select
						value={selectedCompany}
						onChange={e => setSelectedCompany(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md"
					>
						<option value="all">Tất cả công ty</option>
						{companies.map(company => (
							<option key={company.name} value={company.name}>
								{company.name}
							</option>
						))}
					</select>
				</div>

				{/* Main Content */}
				<Tabs defaultValue="supervisors" className="w-full">
					<TabsList>
						<TabsTrigger value="supervisors">Danh sách mentor</TabsTrigger>
						<TabsTrigger value="companies">Doanh nghiệp</TabsTrigger>
					</TabsList>

					<TabsContent value="supervisors" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredSupervisors.map(supervisor => (
								<Card
									key={supervisor.id}
									className="hover:shadow-lg transition-shadow"
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-lg">
													{supervisor.name}
												</CardTitle>
												<CardDescription>
													{supervisor.position}
												</CardDescription>
											</div>
											<Badge
												className={getAvailabilityColor(
													supervisor.availability
												)}
											>
												{supervisor.availability}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<div className="flex items-center text-sm text-muted-foreground">
												<Building className="mr-2 h-4 w-4" />
												{supervisor.company}
											</div>
											<div className="flex items-center text-sm text-muted-foreground">
												<MapPin className="mr-2 h-4 w-4" />
												{supervisor.address}
											</div>
											<div className="flex items-center text-sm text-muted-foreground">
												<Briefcase className="mr-2 h-4 w-4" />
												{supervisor.experience} kinh nghiệm
											</div>
										</div>

										<div className="space-y-2">
											<p className="text-sm font-medium">Chuyên môn:</p>
											<div className="flex flex-wrap gap-1">
												{supervisor.specialties.slice(0, 3).map((skill, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="text-xs"
													>
														{skill}
													</Badge>
												))}
												{supervisor.specialties.length > 3 && (
													<Badge variant="secondary" className="text-xs">
														+{supervisor.specialties.length - 3}
													</Badge>
												)}
											</div>
										</div>

										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center">
												<Star className="mr-1 h-4 w-4 text-yellow-500" />
												<span className="font-medium">{supervisor.rating}</span>
											</div>
											<div className="text-muted-foreground">
												{supervisor.currentInterns}/{supervisor.maxInterns} SV
											</div>
										</div>

										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1"
												onClick={() => setSelectedSupervisor(supervisor)}
											>
												<Eye className="mr-2 h-4 w-4" />
												Xem chi tiết
											</Button>
											<Button variant="outline" size="sm">
												<MessageSquare className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="companies" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							{companies.map((company, index) => (
								<Card key={index}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle className="text-lg">{company.name}</CardTitle>
												<CardDescription>{company.address}</CardDescription>
											</div>
											<div className="flex items-center space-x-1">
												<Star className="h-4 w-4 text-yellow-500" />
												<span className="font-medium">{company.rating}</span>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm text-muted-foreground">Mentor</p>
												<p className="text-2xl font-bold">
													{company.supervisors}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													Thực tập sinh
												</p>
												<p className="text-2xl font-bold">
													{company.activeInterns}
												</p>
											</div>
										</div>
										<div className="mt-4">
											<Button variant="outline" className="w-full">
												Xem chi tiết
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Supervisor Detail Modal */}
				{selectedSupervisor && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-xl">
											{selectedSupervisor.name}
										</CardTitle>
										<CardDescription>
											{selectedSupervisor.position} tại{' '}
											{selectedSupervisor.company}
										</CardDescription>
									</div>
									<Button
										variant="outline"
										onClick={() => setSelectedSupervisor(null)}
									>
										Đóng
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<h4 className="font-medium">Thông tin liên hệ</h4>
										<div className="space-y-1 text-sm">
											<div className="flex items-center">
												<Mail className="mr-2 h-4 w-4 text-muted-foreground" />
												{selectedSupervisor.email}
											</div>
											<div className="flex items-center">
												<Phone className="mr-2 h-4 w-4 text-muted-foreground" />
												{selectedSupervisor.phone}
											</div>
											<div className="flex items-center">
												<MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
												{selectedSupervisor.address}
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<h4 className="font-medium">Thống kê</h4>
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div>
												<p className="text-muted-foreground">Kinh nghiệm</p>
												<p className="font-medium">
													{selectedSupervisor.experience}
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Đánh giá</p>
												<p className="font-medium">
													{selectedSupervisor.rating}/5.0
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Đã hướng dẫn</p>
												<p className="font-medium">
													{selectedSupervisor.totalInterns} SV
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Hoàn thành</p>
												<p className="font-medium">
													{selectedSupervisor.completedInterns} SV
												</p>
											</div>
										</div>
									</div>
								</div>

								<div>
									<h4 className="font-medium mb-2">Giới thiệu</h4>
									<p className="text-sm text-muted-foreground">
										{selectedSupervisor.bio}
									</p>
								</div>

								<div>
									<h4 className="font-medium mb-2">Chuyên môn</h4>
									<div className="flex flex-wrap gap-2">
										{selectedSupervisor.specialties.map((skill, index) => (
											<Badge key={index} variant="secondary">
												{skill}
											</Badge>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium mb-2">Dự án tiêu biểu</h4>
									<ul className="space-y-1 text-sm">
										{selectedSupervisor.projects.map((project, index) => (
											<li key={index} className="flex items-start">
												<span className="mr-2">•</span>
												<span>{project}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="flex space-x-2">
									<Button className="flex-1">
										<MessageSquare className="mr-2 h-4 w-4" />
										Liên hệ
									</Button>
									<Button variant="outline" className="flex-1">
										<Edit className="mr-2 h-4 w-4" />
										Chỉnh sửa
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</PageHeader>
	)
} 