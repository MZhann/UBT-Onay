import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const pageNames: { [key: string]: string } = {
  assistants: "Main Page",
  company: "Schedule",
  settings: "Tasks",
  billing: "Grades",
  hr: "ИИ Рекрутер",
  orders: "Заказы",
  "quiz-results": "Quiz Results",
};

// 🔥 custom redirects
const breadcrumbRedirects: { [key: string]: string } = {
  "quiz-results": "/profile",
};

export default function BreadCrumbs() {
  const path = usePathname();

  let currentLink = "";
  const crumbs = path ? path.split("/").filter(Boolean) : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          currentLink += `/${crumb}`;

          // 👇 override href if exists
          const href =
            breadcrumbRedirects[crumb] ?? currentLink;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>
                  {pageNames[crumb] || crumb}
                </BreadcrumbLink>
              </BreadcrumbItem>

              {index < crumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
