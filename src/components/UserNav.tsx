import { UserRoundCog, ChevronsUpDown, LogOut } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useAuth from "../hooks/useAuth";
import { useJwt } from "react-jwt";

type JwtPayload = {
  payload?: {
    userName: string;
  };
};

export default function UserNav() {
  const { accessToken } = useAuth();
  const { decodedToken } = useJwt(accessToken);

  const jwtPayload = decodedToken as JwtPayload;
  const userName = jwtPayload?.payload?.userName;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <UserRoundCog /> {userName}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            className="w-[--radix-popper-anchor-width]"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem>
              <LogOut />
              <span className="mb-0.5">Выйти из учётной записи</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
