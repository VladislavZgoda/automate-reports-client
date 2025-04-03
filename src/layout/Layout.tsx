import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function Layout() {
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
        <SidebarTrigger className="ml-[-2px]" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
