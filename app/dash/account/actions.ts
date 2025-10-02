"use server";

import { auth } from "@/auth";
import { VerifyEmail } from "@/components/email-templates/verify-email";
import { prisma } from "@/prisma";
import { profileSchema } from "@/schemas/profile-schema";
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

  const validatedFields = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image")
  });

  if (!validatedFields.success)
    return {
      type: "error",
      message: "Your form has errors."
    };

  const { name, email, image } = validatedFields.data;

  if (image && !image.includes("uploads") && !image.includes("default")) {
    const base64Data = image.split(",")[1];

    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${session.user.email.replace(/[@.]/g, "_")}_pfp_${Date.now()}.jpg`;
    const compressedImageBuffer = await sharp(buffer)
      .resize(800) // Resize the image
      .jpeg({ quality: 80 }) // Compress as JPEG with 80% quality
      .toBuffer();
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: fileName }
    });
    Bun.write(`./public/uploads/${fileName}`, compressedImageBuffer);
  }

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

  if (email === session.user.email) {
    revalidatePath("/dash/account");
    return { type: "success", message: "Saved!" };
  }

  const changeCode = Math.floor(100000 + Math.random() * 900000);

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { email, emailVerificationCode: changeCode, emailVerified: null }
    });
  } catch {
    return { type: "error", message: "Update failed" };
  }

  // Update both name and email
  const resend = new Resend(process.env.AUTH_RESEND_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "Change of Email Requested",
    react: VerifyEmail({
      name: name || "User",
      oldEmail: session.user.email,
      newEmail: email,
      code: changeCode
    })
  });

  if (error) {
    console.error("RESEND:", error.name, error.message);
    return {
      type: "error",
      message: "An error occured whilst sending your verification email."
    };
  }

  revalidatePath("/dash/account");
  return { type: "info", message: "Email change requested" };
}
