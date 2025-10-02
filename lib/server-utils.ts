import { headers } from "next/headers";

export async function isMobile() {
  const userAgent = (await headers()).get("user-agent");
  if (!userAgent) return false;

  // A simple regex to detect common mobile devices
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export async function getCurrentURL() {
  const url = (await headers()).get("x-pathname");
  if (!url) return "";

  return url;
}
