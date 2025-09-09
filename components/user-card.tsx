import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";

export default async function UserCard() {
  const session = await auth();
  if (!session || !session.user) return null;

  if (!session.user.name) session.user.name = "No Name";
  if (!session.user.image) session.user.image = undefined;

  const initials = session.user.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center justify-start text-left gap-3 p-2 hover:bg-accent data-[state=open]:bg-sidebar-accent rounded-lg">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={session.user.image} alt="User Avatar" />
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
        side="right"
        align="end"
      >
        <DropdownMenuItem>
          <Link href="/dash/account" className="flex items-center gap-2">
            <BadgeCheck />
            Account Management
          </Link>
        </DropdownMenuItem>
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
