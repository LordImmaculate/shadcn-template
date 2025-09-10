import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function Logo({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <span className=" font-medium">Acme Inc.</span>
    </div>
  );
}
