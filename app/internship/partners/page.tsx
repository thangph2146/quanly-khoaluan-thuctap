'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, MapPin, Users, Briefcase, Star, Phone, Mail, Globe, Search, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common'

// Mock data for internship partners
const partners = [
  {
    id: 'DN001',
    name: 'FPT Software',
    description: 'Công ty phần mềm hàng đầu Việt Nam, chuyên phát triển giải pháp công nghệ cho thị trường quốc tế.',
    address: 'Tòa FPT, Cầu Giấy, Hà Nội',
    website: 'https://www.fpt-software.com',
    contact: {
      person: 'Nguyễn Văn Manager',
      email: 'manager@fpt.com.vn',
      phone: '024-1234-5678'
    },
    rating: 4.8,
    totalStudents: 45,
    activePositions: 8,
    status: 'ACTIVE',
    partnership: {
      startDate: '2020-01-15',
      type: 'STRATEGIC',
      renewalDate: '2025-01-15'
    },
    positions: [
      {
        id: 'POS001',
        title: 'Frontend Developer Intern',
        department: 'Web Development',
        slots: 3,
        filled: 2,
        requirements: ['ReactJS', 'TypeScript', 'HTML/CSS'],
        duration: '3 tháng',
        allowance: '3,000,000 VNĐ/tháng'
      },
      {
        id: 'POS002',
        title: 'Backend Developer Intern',
        department: 'Backend Development',
        slots: 2,
        filled: 1,
        requirements: ['Java', 'Spring Boot', 'MySQL'],
        duration: '3 tháng',
        allowance: '3,500,000 VNĐ/tháng'
      },
      {
        id: 'POS003',
        title: 'Mobile App Developer Intern',
        department: 'Mobile Development',
        slots: 3,
        filled: 0,
        requirements: ['Flutter', 'React Native', 'Firebase'],
        duration: '3 tháng',
        allowance: '3,200,000 VNĐ/tháng'
      }
    ]
  },
  {
    id: 'DN002',
    name: 'Viettel Digital',
    description: 'Công ty công nghệ số của Tập đoàn Viettel, tiên phong trong chuyển đổi số và giải pháp IoT.',
    address: '41 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội',
    website: 'https://vietteldigital.vn',
    contact: {
      person: 'Trần Thị Director',
      email: 'director@viettel.com.vn',
      phone: '024-2345-6789'
    },
    rating: 4.6,
    totalStudents: 32,
    activePositions: 5,
    status: 'ACTIVE',
    partnership: {
      startDate: '2019-08-20',
      type: 'STRATEGIC',
      renewalDate: '2024-08-20'
    },
    positions: [
      {
        id: 'POS004',
        title: 'DevOps Engineer Intern',
        department: 'Infrastructure',
        slots: 2,
        filled: 1,
        requirements: ['Docker', 'Kubernetes', 'AWS/Azure'],
        duration: '4 tháng',
        allowance: '4,000,000 VNĐ/tháng'
      },
      {
        id: 'POS005',
        title: 'Data Analyst Intern',
        department: 'Data Science',
        slots: 2,
        filled: 0,
        requirements: ['Python', 'SQL', 'Power BI'],
        duration: '3 tháng',
        allowance: '3,800,000 VNĐ/tháng'
      },
      {
        id: 'POS006',
        title: 'IoT Developer Intern',
        department: 'IoT Solutions',
        slots: 1,
        filled: 1,
        requirements: ['Arduino', 'Raspberry Pi', 'MQTT'],
        duration: '4 tháng',
        allowance: '3,500,000 VNĐ/tháng'
      }
    ]
  },
  {
    id: 'DN003',
    name: 'TMA Solutions',
    description: 'Công ty phát triển phần mềm uy tín với hơn 25 năm kinh nghiệm, phục vụ khách hàng toàn cầu.',
    address: '15 Quang Trung, Gò Vấp, TP.HCM',
    website: 'https://www.tmasolutions.com',
    contact: {
      person: 'Lê Văn CEO',
      email: 'ceo@tma.com.vn',
      phone: '028-3456-7890'
    },
    rating: 4.7,
    totalStudents: 28,
    activePositions: 4,
    status: 'ACTIVE',
    partnership: {
      startDate: '2021-03-10',
      type: 'STANDARD',
      renewalDate: '2024-03-10'
    },
    positions: [
      {
        id: 'POS007',
        title: 'QA Tester Intern',
        department: 'Quality Assurance',
        slots: 2,
        filled: 1,
        requirements: ['Manual Testing', 'Automation Testing', 'Selenium'],
        duration: '3 tháng',
        allowance: '2,800,000 VNĐ/tháng'
      },
      {
        id: 'POS008',
        title: 'UI/UX Designer Intern',
        department: 'Design',
        slots: 1,
        filled: 0,
        requirements: ['Figma', 'Adobe XD', 'Photoshop'],
        duration: '3 tháng',
        allowance: '3,000,000 VNĐ/tháng'
      },
      {
        id: 'POS009',
        title: 'Business Analyst Intern',
        department: 'Business Analysis',
        slots: 1,
        filled: 1,
        requirements: ['Requirements Analysis', 'Documentation', 'Agile'],
        duration: '4 tháng',
        allowance: '3,200,000 VNĐ/tháng'
      }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'INACTIVE': return 'bg-red-100 text-red-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPartnershipTypeColor = (type: string) => {
  switch (type) {
    case 'STRATEGIC': return 'bg-purple-100 text-purple-800'
    case 'STANDARD': return 'bg-blue-100 text-blue-800'
    case 'TRIAL': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function InternshipPartnersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Thực tập', href: '/internship' },
		{ label: 'Đối tác thực tập' },
	]

  return (
    <PageHeader
			title="Đối tác thực tập"
			description="Quản lý các doanh nghiệp đối tác và vị trí thực tập có sẵn"
			breadcrumbs={breadcrumbs}
			actions={
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Thêm đối tác
				</Button>
			}
		>
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đối tác</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 tháng này</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">21</div>
              <p className="text-xs text-muted-foreground">87.5% tổng số</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vị trí mở</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">45</div>
              <p className="text-xs text-muted-foreground">Sẵn sàng tiếp nhận</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sinh viên thực tập</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">Đang thực tập</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm đối tác..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Partners List */}
        <div className="grid gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl">{partner.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{partner.rating}</span>
                      </div>
                    </div>
                    <CardDescription>{partner.description}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{partner.address}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{partner.website}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                    <Badge className={getPartnershipTypeColor(partner.partnership.type)}>
                      {partner.partnership.type === 'STRATEGIC' ? 'Chiến lược' : 
                       partner.partnership.type === 'STANDARD' ? 'Tiêu chuẩn' : 'Thử nghiệm'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{partner.totalStudents}</div>
                    <p className="text-muted-foreground">Tổng SV thực tập</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{partner.activePositions}</div>
                    <p className="text-muted-foreground">Vị trí đang mở</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {partner.positions.reduce((sum, pos) => sum + pos.filled, 0)}
                    </div>
                    <p className="text-muted-foreground">SV hiện tại</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{partner.contact.person}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{partner.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{partner.contact.email}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Hợp tác từ: {new Date(partner.partnership.startDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                {/* Recent Positions Preview */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Vị trí nổi bật</h4>
                  <div className="grid gap-2">
                    {partner.positions.slice(0, 2).map((position) => (
                      <div key={position.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{position.title}</p>
                          <p className="text-xs text-muted-foreground">{position.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {position.filled}/{position.slots} slots
                          </p>
                          <p className="text-xs text-muted-foreground">{position.allowance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPartner(partner.id)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button variant="outline" size="sm">
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" size="sm">
                    Liên hệ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View */}
        {selectedPartner && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết đối tác</CardTitle>
                <Button variant="outline" onClick={() => setSelectedPartner(null)}>
                  Đóng
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const partner = partners.find(p => p.id === selectedPartner)
                if (!partner) return null

                return (
                  <Tabs defaultValue="positions" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="positions">Vị trí thực tập</TabsTrigger>
                      <TabsTrigger value="partnership">Thông tin hợp tác</TabsTrigger>
                      <TabsTrigger value="students">Sinh viên</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="positions" className="space-y-4">
                      <div className="space-y-4">
                        {partner.positions.map((position) => (
                          <div key={position.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{position.title}</h4>
                                <p className="text-sm text-muted-foreground">{position.department}</p>
                              </div>
                              <Badge variant={position.filled < position.slots ? "default" : "secondary"}>
                                {position.filled}/{position.slots} slots
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <p className="font-medium">Thời gian</p>
                                <p className="text-muted-foreground">{position.duration}</p>
                              </div>
                              <div>
                                <p className="font-medium">Trợ cấp</p>
                                <p className="text-muted-foreground">{position.allowance}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-sm mb-2">Yêu cầu kỹ năng</p>
                              <div className="flex flex-wrap gap-2">
                                {position.requirements.map((req, index) => (
                                  <Badge key={index} variant="outline">{req}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="partnership" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Loại hợp tác</h4>
                          <Badge className={getPartnershipTypeColor(partner.partnership.type)}>
                            {partner.partnership.type === 'STRATEGIC' ? 'Chiến lược' : 
                             partner.partnership.type === 'STANDARD' ? 'Tiêu chuẩn' : 'Thử nghiệm'}
                          </Badge>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Ngày bắt đầu</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(partner.partnership.startDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Ngày gia hạn</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(partner.partnership.renewalDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Đánh giá</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{partner.rating}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="students" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Danh sách sinh viên thực tập sẽ được hiển thị ở đây</p>
                        <p className="text-sm">Tổng cộng: {partner.totalStudents} sinh viên đã thực tập</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </PageHeader>
  )
} 