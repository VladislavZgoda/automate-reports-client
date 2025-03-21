import { ChevronsUpDown, LogOut, UserRoundCog } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useJwt } from "react-jwt";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

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
            <SidebarMenuButton className="cursor-pointer">
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
              <ThemeToggle />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <button
                type="button"
                className="mb-0.5 cursor-pointer"
                onClick={onLogout}
              >
                Выйти из учётной записи
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
