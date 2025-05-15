"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-12">
      <Button onClick={() => alert("Hallo")}>Hallo </Button>
    </div>
  );
}
