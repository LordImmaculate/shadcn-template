import { Atom } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/" className="flex flex-row items-center gap-1">
        <Atom />
        <h1 className="text-3xl">Acme</h1>
      </Link>
      <div>
        <Button>Sign In</Button>
      </div>
    </header>
  );
}
