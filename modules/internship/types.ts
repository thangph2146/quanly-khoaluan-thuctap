import { AcademicYear } from "@/modules/academic-years/types";
import { Semester } from "@/modules/semesters/types";
import { User } from "@/modules/users/types";

// Based on Partner.cs
export interface Partner {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

// Based on Internship.cs - updated to use User instead of Student
export interface Internship {
  id: number;
  studentId: number;
  student: User;
  partnerId: number;
  partner: Partner;
  academicYearId: number;
  academicYear: AcademicYear;
  semesterId: number;
  semester: Semester;
  reportUrl?: string | null;
  grade?: number | null;
}

// Internship Status enum
export type InternshipStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PENDING_EVALUATION"
  | "APPROVED"
  | "CANCELLED";

// Create and Update types for internship
export interface CreateInternshipData {
  title: string;
  description?: string;
  studentId: number;
  partnerId: number;
  academicYearId: number;
  semesterId: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface UpdateInternshipData {
  title?: string;
  description?: string;
  studentId?: number;
  partnerId?: number;
  academicYearId?: number;
  semesterId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}
