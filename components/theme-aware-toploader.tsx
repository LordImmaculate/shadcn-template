"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";

export function ThemeAwareTopLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NextTopLoader color="#000" showSpinner={false} />;
  }

  const isDark = resolvedTheme === "dark";

  return <NextTopLoader color={isDark ? "#fff" : "#000"} showSpinner={false} />;
}
