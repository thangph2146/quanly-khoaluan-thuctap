"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MenuProvider } from "@/hooks/useMenus";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MenuProvider>
        <main>{children}</main>
        <Toaster />
      </MenuProvider>
    );
  }

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
