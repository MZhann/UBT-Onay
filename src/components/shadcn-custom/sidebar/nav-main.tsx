"use client";

import React from "react";
// import {  } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarSeparator,
} from "@/components/ui/sidebar";
// import { ChevronDown, ChevronRight, GraduationCap } from "lucide-react";
// import {
  // Collapsible,
  // CollapsibleContent,
  // CollapsibleTrigger,
// } from "@/components/ui/collapsible";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title}
            className={clsx(
              pathname === item.url &&
                "bg-myindigo text-white text-lg rounded-md"
            , 'text-white')}
          >
            <Link href={item.url}>
              <SidebarMenuButton tooltip={item.title}>
                <p>{item.icon && <item.icon />}</p>
                <span className="text-base font-thin">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      
      </SidebarMenu>
    </SidebarGroup>
  );
}
