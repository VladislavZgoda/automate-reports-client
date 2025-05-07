import {
  FileMinus,
  FilePlus,
  FileSliders,
  FileSpreadsheet,
  Home,
  Rows3,
  Sheet,
  Table,
} from "lucide-react";

import { Link, useLocation } from "react-router";
import UserNav from "../../src/components/UserNav";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Главная",
    url: "/",
    icon: Home,
  },
  {
    title: "Экспорт Sims Client",
    url: "/matritca-export",
    icon: Sheet,
  },
  {
    title: "ОДПУ",
    url: "/odpy",
    icon: Table,
  },
  {
    title: "Юридические лица П2",
    url: "/legal-entities",
    icon: Rows3,
  },
  {
    title: "ВИП",
    url: "/vip",
    icon: FileSpreadsheet,
  },
  {
    title: "Микрогенерация",
    url: "/microgeneration",
    icon: FilePlus,
  },
  {
    title: "Не загруженные 25",
    url: "/private-not-transferred",
    icon: FileMinus,
  },
  {
    title: "Изменить однозонные NP7x",
    url: "/one-zone-meters",
    icon: FileSliders,
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Обработка отчётов</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    asChild
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
