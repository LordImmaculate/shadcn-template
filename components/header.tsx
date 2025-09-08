import { buttonVariants } from "./ui/button";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Logo from "./logo";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <Logo />
      <div className="flex items-center gap-4">
        {!session ? (
          <Link
            href="/auth/sign-in"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign In
          </Link>
        ) : (
          <Link href="/dash" className={buttonVariants({ variant: "outline" })}>
            Account Management
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
