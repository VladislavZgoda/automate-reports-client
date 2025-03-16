import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const sidebarState = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sidebar_state="))
    ?.split("=")[1];

  let defaultOpen: boolean;

  if (typeof sidebarState === "undefined") {
    defaultOpen = true;
  } else {
    defaultOpen = sidebarState === "true";
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="mt-1.5">
        <SidebarTrigger />
        {children ?? <Outlet />}
      </main>
    </SidebarProvider>
  );
}
