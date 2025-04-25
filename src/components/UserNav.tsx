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

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import logoutRequest from "../api/auth/logout/logoutRequest";
import authTokenStore from "../store/authTokenStore";
import ThemeToggle from "./ThemeToggle";

interface JwtPayload {
  payload?: {
    userName: string;
  };
}

export default function UserNav() {
  const navigate = useNavigate();
  const accessToken = authTokenStore.getState().accessToken;
  const decodedToken = jwtDecode<JwtPayload>(accessToken);

  const onLogout = async () => {
    try {
      await logoutRequest(accessToken);
    } catch (error) {
      console.log(error);
    }

    authTokenStore.getState().reset();
    await navigate("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="cursor-pointer">
              <UserRoundCog /> {decodedToken.payload?.userName}
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
