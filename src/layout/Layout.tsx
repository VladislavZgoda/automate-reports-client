import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router";
import { ThemeProvider } from "../providers/themeProvider";

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
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children ?? <Outlet />}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
