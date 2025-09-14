"use client";

import { TypographyH2, TypographyH3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveChanges } from "./actions";
import { useSession } from "next-auth/react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Dash() {
  const { data: session } = useSession();

  const [state, action, pending] = useActionState(saveChanges, undefined);

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
      <div className="rounded-xl bg-card border border-accent  p-5 w-full">
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
            ></Input>
          </div>
          <Button type="submit" className="mt-4 w-fit">
            Save
          </Button>
          {/* {pending && <div>Saving...</div>} */}
        </form>
      </div>
    </div>
  );
}
