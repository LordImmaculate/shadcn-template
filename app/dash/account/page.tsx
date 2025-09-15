"use client";

import { TypographyH2, TypographyH3 } from "@/components/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveChanges } from "./actions";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { PenLine } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Dash() {
  const { data: session } = useSession();
  const [state, action, pending] = useActionState(saveChanges, undefined);
  const [pfpURL, setPfpURL] = useState<string>("/default.jpg");

  useEffect(() => {
    if (session?.user?.image) {
      setPfpURL(`/uploads/${session.user.image}`);
    }
  }, [session?.user?.image]);

  useEffect(() => {
    if (state && state.message)
      switch (state.type) {
        case "success":
          toast.success(state.message);
          break;
        case "info":
          toast.info(state.message);
          break;
        case "error":
          toast.error(state.message);
          break;
      }
  }, [state]);

  return (
    <div>
      <TypographyH2 className="mb-4">Account Management</TypographyH2>
      <div className="rounded-xl bg-card border border-accent relative p-5 w-full">
        <TypographyH3 className="mb-2">User Information</TypographyH3>
        <form className="flex flex-col gap-2" action={action}>
          <div className="flex gap-2 items-center">
            <label className="min-w-20 text-sm" htmlFor="name">
              Name
            </label>
            <Input
              className="w-auto min-w-72"
              defaultValue={session?.user?.name || ""}
              name="name"
              id="name"
              type="text"
              required
            ></Input>
          </div>
          <div className="flex gap-2 items-center">
            <label className="min-w-20 text-sm" htmlFor="email">
              Email
            </label>
            <Input
              className="w-auto min-w-72"
              defaultValue={session?.user?.email || ""}
              name="email"
              id="email"
              type="email"
              required
            ></Input>
          </div>
          <Button type="submit" className="mt-4 w-fit" disabled={pending}>
            Save
          </Button>
          <div className="absolute right-5 top-5 group">
            <Image
              src={pfpURL}
              alt="User Avatar"
              className="h-44 w-44 rounded-xl"
              width={200}
              height={200}
              priority
              placeholder="blur"
              blurDataURL="/default-blur.png"
            />
            {/* <AvatarFallback className="rounded-lg">{initials}</AvatarFallback> */}
            <Input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPfpURL(URL.createObjectURL(file));
                }
              }}
            />
            <Label
              htmlFor="image"
              className={`absolute bottom-2 right-2 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 ${buttonVariants()}`}
            >
              <PenLine />
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
}
