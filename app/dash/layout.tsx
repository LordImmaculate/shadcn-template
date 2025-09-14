import { auth } from "@/auth";
import { AppSidebar } from "@/app/dash/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import Breadcrumbs from "./breadcrumbs";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/theme-toggle";

export default async function DashLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) return redirect("/auth/sign-in");

  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumbs />
          <ThemeToggle className="ml-auto" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 m-auto min-w-5xl mt-7">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
