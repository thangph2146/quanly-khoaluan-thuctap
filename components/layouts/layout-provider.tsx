"use client";

import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MenuProvider } from "@/hooks/useMenus";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
        <Toaster />
      </SidebarProvider>
    </MenuProvider>
  );
}
