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

type Crumb = {
  name: string;
  href: string;
};

// Recursive function to find page in nested structure
function findPageInHierarchy(
  pages: typeof pagesIndex,
  targetPath: string
): string | null {
  for (const page of pages) {
    // Check exact match
    if (page.url === targetPath) {
      return page.title;
    }

    // Check if this is a dynamic route match
    const pageSegments = page.url.split("/");
    const targetSegments = targetPath.split("/");

    if (pageSegments.length === targetSegments.length) {
      let isMatch = true;
      for (let i = 0; i < pageSegments.length; i++) {
        // Skip dynamic segments (containing brackets)
        if (pageSegments[i].includes("[") && pageSegments[i].includes("]")) {
          continue;
        }
        if (pageSegments[i] !== targetSegments[i]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        return page.title;
      }
    }

    // Recursively search in nested items
    if (page.items && page.items.length > 0) {
      const found = findPageInHierarchy(page.items, targetPath);
      if (found) return found;
    }
  }
  return null;
}

export default function Breadcrumbs() {
  const path = usePathname();
  const pages = path?.split("/") || [];
  pages.shift(); // Remove the first empty element due to leading slash

  const breadcrumbs: Crumb[] = [];
  let pathSoFar = "/dash";

  pages.forEach((page) => {
    if (!page || page === "dash") return;
    pathSoFar += `/${page}`;
    console.log(pathSoFar);

    const pageName = findPageInHierarchy(pagesIndex, pathSoFar);

    if (pageName) {
      breadcrumbs.push({ name: pageName, href: pathSoFar });
    }
  });

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dash">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathSoFar !== "dash" && <BreadcrumbSeparator />}
          </div>
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
