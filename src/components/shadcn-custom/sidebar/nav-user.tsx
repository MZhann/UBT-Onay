"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string; // может быть blob:, http или пустым
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const fallbackAvatar = "/assets/images/decoration/avatar.png";

  const isValidAvatar =
    typeof user.avatar === "string" &&
    (user.avatar.startsWith("blob:") || user.avatar.startsWith("http"));

  const avatarSrc = isValidAvatar ? user.avatar : fallbackAvatar;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="ml-[0.27rem] data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg overflow-hidden">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = fallbackAvatar;
                  }}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight text-white">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg overflow-hidden">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackAvatar;
                    }}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
