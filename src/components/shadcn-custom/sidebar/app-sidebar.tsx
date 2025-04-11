"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  House,
  NotepadText,
  SearchSlash,
  Trophy,
  LockKeyhole,
} from "lucide-react";
import { NavMain } from "@/components/shadcn-custom/sidebar/nav-main";
import { NavUser } from "@/components/shadcn-custom/sidebar/nav-user";
import { getCurrentUser } from "@/store/slices/userSlice";
import { getProfilePhoto } from "@/api/user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const { name, surname, email } = useSelector(
    (state: RootState) => state.user
  );

  const [avatarUrl, setAvatarUrl] = useState<string>(
    "/assets/images/profile-pics/robot-avatar.png"
  );
  useEffect(() => {
    dispatch(getCurrentUser());

    const fetchAvatar = async () => {
      try {
        if(!window) return;
        const accessToken = window.localStorage.getItem("accessToken");
        const blob = await getProfilePhoto(accessToken as string);

        if (blob) {
          const objectUrl = URL.createObjectURL(blob);
          setAvatarUrl(objectUrl);

          // Очистка URL после размонтирования
          return () => URL.revokeObjectURL(objectUrl);
        } else {
          setAvatarUrl("/assets/images/profile-pics/robot-avatar.png");
        }
      } catch (err) {
        console.error("Failed to load avatar", err);
        setAvatarUrl("/assets/images/profile-pics/robot-avatar.png");
      }
    };

    fetchAvatar();

    return () => {
      // Cleanup the avatar URL if it was created
      URL.revokeObjectURL(avatarUrl);
    };
  }, [dispatch]);

  const data = {
    user: {
      name: `${name} ${surname}` || "Loading...",
      email: email || "no email",
      avatar: avatarUrl,
    },
    navMain: [
      { title: "Home page", url: "/", icon: House },
      { title: "UTB tests", url: "/ubt-tests", icon: NotepadText },
      { title: "Mistake Bank", url: "/mistake-bank", icon: SearchSlash },
      { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
      { title: "Admin page", url: "/admin", icon: LockKeyhole },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/"}>
          <div className="text-white font-bold text-2xl pl-3 pt-3">
            UBT-Onay
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
