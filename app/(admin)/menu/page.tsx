"use client";

import React from "react";
import { PageHeader } from "@/components/common";
import { MenusContainer } from "@/modules/menu/components";

export default function MenuPage() {
  return (
    <div className="w-full mx-auto py-6 space-y-6 p-4">
      {/* Page Header */}
      <PageHeader
        title="Quản lý Menu"
        description="Quản lý các menu trong hệ thống"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Menu", href: "/menu" },
        ]}
      >
        <div></div>
      </PageHeader>

      {/* Menu Container */}
      <MenusContainer />
    </div>
  );
}
