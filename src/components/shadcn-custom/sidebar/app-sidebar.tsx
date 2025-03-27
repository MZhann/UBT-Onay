"use client";

import React, { useEffect } from "react";
// import Image from "next/image";
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

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // const userName = name || surname ? `${name} ${surname}` : "Loading...";

  const data = {
    user: {
      name: `${name} ${surname}` || "Loading...",
      email: email || "no email",
      avatar: "/assets/images/profile-pics/robot-avatar.png",
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
        {/* {loading ? <h1>Loading...</h1> : <NavUser user={data.user} />} */}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
