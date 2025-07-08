"use client";

import React from "react";
import { PageHeader } from "@/components/common";
import { UnifiedLecturersContainer } from "@/modules/lecturers/components";

export default function LecturersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 p-4">
      <PageHeader
        title="Quản lý Giảng viên"
        description="Thêm, sửa, xóa và quản lý danh sách giảng viên của Khoa/Đơn vị trong hệ thống"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giảng viên", href: "/academic/lecturers" },
        ]}
      >
        <div></div>
      </PageHeader>
      <UnifiedLecturersContainer
        showDepartmentFilter={true}
        showDepartmentInfo={true}
      />
    </div>
  );
}
