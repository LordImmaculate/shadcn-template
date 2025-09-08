"use client";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  const pathname = usePathname();

  if (pathname === "/auth/sign-in") return null;

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
          <Link
            href="/auth/sign-in"
            className={buttonVariants({ variant: "outline" })}
          >
            Account Management
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
