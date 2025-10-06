import { headers } from "next/headers";
import { mkdir, readdir } from "node:fs/promises";

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

export async function checkUserFolder(userID: string) {
  const userFolder = `./public/uploads/${userID}`;
  await readdir(userFolder).catch(async (err) => {
    if (err.code === "ENOENT") {
      // Create folder
      try {
        await mkdir(userFolder, { recursive: true });
      } catch (e) {
        console.error("Error creating user folder:", e);
      }
    } else {
      console.error("Error reading user folder:", err);
    }
  });
  return userFolder;
}
