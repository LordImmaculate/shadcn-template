"use client";

import { XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useActionState, useEffect, useState } from "react";
import { resendEmailVerification } from "@/actions/edit-profile";
import { toast } from "sonner";

export default function UnverifiedEmail() {
  const [state, action, pending] = useActionState(
    resendEmailVerification,
    undefined
  );
  const [isVisible, setIsVisible] = useState(true);

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

  if (!isVisible) return null;

  return (
    <div className="rounded-md bg-yellow-100 dark:bg-yellow-700 p-4 mb-4 flex items-center justify-between">
      Unverified Email
      <div className="flex items-center gap-2">
        <form action={action}>
          <Button type="submit" variant="outline" disabled={pending}>
            Resend Email
          </Button>
        </form>
        <Button onClick={() => setIsVisible(false)} size="icon" variant="ghost">
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
