"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ToastSender() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const text = searchParams.get("text");

  useEffect(() => {
    if (success === "1" && text) {
      toast.success(text);
      router.replace(window.location.pathname);
    } else if (success === "0" && text) {
      toast.error(text);
      router.replace(window.location.pathname);
    }
  }, [success, text, router]);

  return null;
}
