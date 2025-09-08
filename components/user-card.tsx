import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

export default async function UserCard() {
  const session = await auth();
  if (!session || !session.user) return null;

  if (!session.user.name) session.user.name = "No Name";

  const initials = session.user.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center justify-start text-left gap-3 p-4 bg-background rounded-lg">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={session.user.image} alt="User Avatar" />
          <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{session.user.name}</span>
          <span className="text-sm text-muted-foreground">
            {session.user.email}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full text-left flex items-center justify-between"
            >
              Log out <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
