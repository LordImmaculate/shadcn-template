"use server";

import { auth } from "@/auth";
import { VerifyEmail } from "@/components/email-templates/verify-email";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import sharp from "sharp";

type SaveChangesResult = {
  type: "success" | "info" | "error";
  message: string;
};

export async function saveChanges(
  currentState: SaveChangesResult | undefined,
  formData: FormData
): Promise<SaveChangesResult> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/auth/sign-in");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const pfp = formData.get("image") as File;

  if (!name || !email) {
    return { type: "error", message: "Name and email are required" };
  }

  if (email.length > 255) {
    return { type: "error", message: "Email is too long" };
  }

  if (name.length > 100) {
    return { type: "error", message: "Name is too long" };
  }

  if (pfp && pfp.size > 5 * 1024 * 1024) {
    return { type: "error", message: "Profile picture is too large" };
  }

  if (
    pfp &&
    pfp.size > 0 &&
    !["image/jpeg", "image/png", "image/gif"].includes(pfp.type)
  ) {
    return { type: "error", message: "Invalid profile picture format" };
  }

  if (pfp && pfp.size > 0) {
    const buffer = Buffer.from(await pfp.arrayBuffer());
    const fileName = `${session.user.email.replace(/[@.]/g, "_")}_pfp_${Date.now()}.jpg`;
    const compressedImageBuffer = await sharp(buffer)
      .resize(800) // Optional: resize the image
      .jpeg({ quality: 80 }) // Compress as JPEG with 80% quality
      .toBuffer();
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: fileName }
    });
    Bun.write(`./public/uploads/${fileName}`, compressedImageBuffer);
  }

  if (email === session.user.email) {
    // Only update name
    try {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { name }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return { type: "error", message: "Update failed" };
    }
    return { type: "success", message: "Saved!" };
  }

  const changeCode = Math.floor(100000 + Math.random() * 900000);

  // Update both name and email
  const resend = new Resend(process.env.AUTH_RESEND_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: session.user.email,
    subject: "Change of Email Requested",
    react: VerifyEmail({
      name: name || "User",
      oldEmail: session.user.email,
      newEmail: email,
      code: changeCode
    })
  });

  // await prisma.user.update({
  //   where: { email: session.user.email },
  //   data: { name, email }
  // });

  revalidatePath("/dash/account");
  return { type: "info", message: "Email change requested" };
}
