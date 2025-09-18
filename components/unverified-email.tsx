"use client";

import { XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function UnverifiedEmail() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="rounded-md bg-yellow-100 dark:bg-yellow-700 p-4 mb-4 flex items-center justify-between">
      Unverified Email
      <Button onClick={() => setIsVisible(false)} size="icon" variant="ghost">
        <XIcon className="size-4" />
      </Button>
    </div>
  );
}
