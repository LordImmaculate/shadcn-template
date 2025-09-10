"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { pagesIndex } from "./pages-index";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type Crumb = {
  name: string;
  href: string;
};

export default function Breadcrumbs() {
  const path = usePathname();
  const pages = path?.split("/") || [];
  pages.shift(); // Remove the first empty element due to leading slash
  console.log(pages);

  const breadcrumbs: Crumb[] = [];
  let pathSoFar = "/dash";

  pages.forEach((page) => {
    if (!page || page === "dash") return;
    pathSoFar += `/${page}`;
    console.log(pathSoFar);
    let pageName;

    pagesIndex.forEach((page) => {
      if (page.url === pathSoFar) {
        pageName = page.title;
      }
    });

    if (pageName) {
      breadcrumbs.push({ name: pageName, href: pathSoFar });
    }
  });

  return (
    <>
      {pathSoFar !== "/dash" && (
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <div
                key={index}
                className="flex items-center gap-3"
                suppressHydrationWarning
              >
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
