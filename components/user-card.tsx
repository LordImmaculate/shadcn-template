import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { BadgeCheck, ChevronsUpDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { isMobile } from "@/lib/server-utils";
import Image from "next/image";
import { prisma } from "@/prisma";

export default async function UserCard() {
  const mobile = await isMobile();
  const session = await auth();
  if (!session || !session.user) return null;

  if (!session.user.name) session.user.name = "No Name";
  const imageURL = session.user.image
    ? `/uploads/${session.user.image}`
    : "/default-pfp.png";

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) return null;

  const initials = session.user.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center justify-start text-left gap-3 p-2 hover:bg-accent data-[state=open]:bg-sidebar-accent rounded-lg">
        <Avatar className="h-8 w-8 rounded-lg">
          <Image
            src={imageURL}
            alt="User Avatar"
            width={48}
            height={48}
            priority
          />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm truncate max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis">
            {session.user.name}
          </span>
          <span className="text-xs truncate max-w-[160px] overflow-hidden whitespace-nowrap text-ellipsis">
            {session.user.email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 w-(--radix-dropdown-menu-trigger-width)"
        side={mobile ? "top" : "right"}
        align="end"
      >
        <DropdownMenuItem>
          <Link href="/dash/account" className="flex items-center gap-2">
            <BadgeCheck />
            Account Management
          </Link>
        </DropdownMenuItem>
        {user.role === "ADMIN" && (
          <DropdownMenuItem>
            <Link href="/dash/admin" className="flex items-center gap-2">
              <Settings />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full text-left flex items-center gap-2"
            >
              <LogOut />
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
