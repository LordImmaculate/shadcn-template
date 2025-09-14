"use client";

import { toast } from "sonner";

export default function Dash() {
  return (
    <button onClick={() => toast("Client Button Clicked")}>
      Client Button
    </button>
  );
}
