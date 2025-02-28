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
  const { accessToken, onLogout } = useAuth();
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
              <button type="button" className="mb-0.5" onClick={onLogout}>
                Выйти из учётной записи
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
