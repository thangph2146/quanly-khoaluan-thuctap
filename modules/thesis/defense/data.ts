import { CouncilMember, DefenseRoom, DefenseSchedule } from "@/modules/thesis/types";

// Mock data for thesis defense
export const defenseSchedules: DefenseSchedule[] = [
  {
    id: 'DEF001',
    thesis: {
      id: 'TH001',
      title: 'Ứng dụng AI trong chẩn đoán y tế',
      student: {
        name: 'Nguyễn Văn An',
        code: '20IT001',
        email: 'an.nv@student.edu.vn'
      },
      supervisor: 'TS. Trần Thị Bình'
    },
    date: '2024-06-15',
    time: '08:00',
    duration: 45,
    room: 'Phòng 301 - Tòa A',
    status: 'SCHEDULED',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: true, approved: true },
      presentation: { submitted: true, approved: false },
      summary: { submitted: false, approved: false }
    },
    result: null
  },
  {
    id: 'DEF002',
    thesis: {
      id: 'TH002',
      title: 'Hệ thống quản lý thư viện thông minh',
      student: {
        name: 'Lê Thị Cẩm',
        code: '20IT002',
        email: 'cam.lt@student.edu.vn'
      },
      supervisor: 'PGS.TS. Phạm Văn Dũng'
    },
    date: '2024-06-20',
    time: '09:00',
    duration: 45,
    room: 'Phòng 302 - Tòa A',
    status: 'PENDING_APPROVAL',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: false, approved: false },
      presentation: { submitted: false, approved: false },
      summary: { submitted: false, approved: false }
    },
    result: null
  },
  {
    id: 'DEF003',
    thesis: {
      id: 'TH003',
      title: 'Phân tích dữ liệu lớn với Hadoop và Spark',
      student: {
        name: 'Hoàng Minh Đức',
        code: '20IT003',
        email: 'duc.hm@student.edu.vn'
      },
      supervisor: 'TS. Lê Văn Giang'
    },
    date: '2024-05-25',
    time: '14:00',
    duration: 45,
    room: 'Phòng 303 - Tòa A',
    status: 'COMPLETED',
    council: {
      chairman: 'PGS.TS. Nguyễn Văn Chủ tịch',
      secretary: 'TS. Lê Thị Thư ký',
      members: [
        'TS. Phạm Văn Thành viên 1',
        'TS. Hoàng Thị Thành viên 2',
        'ThS. Trần Văn Thành viên 3'
      ]
    },
    documents: {
      thesis: { submitted: true, approved: true },
      presentation: { submitted: true, approved: true },
      summary: { submitted: true, approved: true }
    },
    result: {
      grade: 8.5,
      classification: 'GOOD',
      chairman_score: 8.5,
      secretary_score: 8.0,
      member_scores: [8.5, 9.0, 8.0],
      comments: 'Sinh viên thể hiện tốt kiến thức chuyên môn, trình bày rõ ràng và trả lời câu hỏi thuyết phục.',
      recommendations: 'Tiếp tục nghiên cứu sâu hơn về tối ưu hóa hiệu suất xử lý dữ liệu lớn.'
    }
  }
]

export const councilMembers: CouncilMember[] = [
  {
    id: 'CM001',
    name: 'PGS.TS. Nguyễn Văn Chủ tịch',
    title: 'Phó Giáo sư - Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Trí tuệ nhân tạo, Machine Learning',
    role: 'CHAIRMAN',
    experience: 15,
    defensesCount: 45
  },
  {
    id: 'CM002',
    name: 'TS. Lê Thị Thư ký',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Hệ thống thông tin, Cơ sở dữ liệu',
    role: 'SECRETARY',
    experience: 8,
    defensesCount: 32
  },
  {
    id: 'CM003',
    name: 'TS. Phạm Văn Thành viên 1',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Kỹ thuật phần mềm, Kiểm thử phần mềm',
    role: 'MEMBER',
    experience: 10,
    defensesCount: 38
  },
  {
    id: 'CM004',
    name: 'TS. Hoàng Thị Thành viên 2',
    title: 'Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'An toàn thông tin, Mật mã học',
    role: 'MEMBER',
    experience: 12,
    defensesCount: 41
  },
  {
    id: 'CM005',
    name: 'ThS. Trần Văn Thành viên 3',
    title: 'Thạc sĩ',
    department: 'Khoa Công nghệ Thông tin',
    specialization: 'Mạng máy tính, IoT',
    role: 'MEMBER',
    experience: 6,
    defensesCount: 25
  }
]

export const rooms: DefenseRoom[] = [
  { id: 'R301', name: 'Phòng 301 - Tòa A', capacity: 50, equipment: ['Projector', 'Microphone', 'Whiteboard'] },
  { id: 'R302', name: 'Phòng 302 - Tòa A', capacity: 40, equipment: ['Projector', 'Sound System'] },
  { id: 'R303', name: 'Phòng 303 - Tòa A', capacity: 30, equipment: ['Projector', 'Whiteboard'] },
  { id: 'R401', name: 'Phòng 401 - Tòa B', capacity: 60, equipment: ['Projector', 'Microphone', 'Camera'] }
]

export const findDefenseScheduleById = (id: string) => {
  return defenseSchedules.find(d => d.id === id)
} 