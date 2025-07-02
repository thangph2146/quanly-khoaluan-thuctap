import { CouncilMember, DefenseRoom, DefenseSchedule } from "@/modules/thesis/types";

// Mock defense rooms
export const defenseRooms: DefenseRoom[] = [
  {
    id: 'ROOM301',
    name: 'Phòng 301 - Tòa A',
    capacity: 30,
    equipment: ['Projector', 'Microphone', 'Computer']
  },
  {
    id: 'ROOM302',
    name: 'Phòng 302 - Tòa A',
    capacity: 25,
    equipment: ['Smart Board', 'Sound System']
  }
];

// Mock council members
export const councilMembers: CouncilMember[] = [
  {
    id: 'CM001',
    name: 'PGS.TS. Nguyễn Văn Chủ tịch',
    title: 'Phó Giáo sư, Tiến sĩ',
    role: 'CHAIR',
    department: 'Khoa Công nghệ Thông tin'
  },
  {
    id: 'CM002',
    name: 'TS. Lê Thị Thư ký',
    title: 'Tiến sĩ',
    role: 'SECRETARY',
    department: 'Khoa Công nghệ Thông tin'
  },
  {
    id: 'CM003',
    name: 'TS. Phạm Văn Thành viên',
    title: 'Tiến sĩ',
    role: 'MEMBER',
    department: 'Khoa Công nghệ Thông tin'
  }
];

// Mock defense schedules
export const defenseSchedules: DefenseSchedule[] = [
  {
    id: 'DEF001',
    thesis: {
      id: 'TH001',
      title: 'Ứng dụng AI trong chẩn đoán y tế',
      student: {
        id: 'ST001',
        name: 'Nguyễn Văn An',
        studentCode: '20IT001'
      }
    },
    room: defenseRooms[0],
    dateTime: '2024-06-15T08:00:00',
    duration: 45,
    councilMembers: [councilMembers[0], councilMembers[1], councilMembers[2]],
    status: 'SCHEDULED'
  },
  {
    id: 'DEF002',
    thesis: {
      id: 'TH002',
      title: 'Hệ thống quản lý thư viện thông minh',
      student: {
        id: 'ST002',
        name: 'Lê Thị Cẩm',
        studentCode: '20IT002'
      }
    },
    room: defenseRooms[1],
    dateTime: '2024-06-20T09:00:00',
    duration: 45,
    councilMembers: [councilMembers[0], councilMembers[1]],
    status: 'COMPLETED'
  }
];
