import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function Logo({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <Link
      href="#"
      className={cn(
        "flex items-center gap-2 self-center text-xl font-medium",
        className
      )}
      {...props}
    >
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-4" />
      </div>
      Acme Inc.
    </Link>
  );
}
