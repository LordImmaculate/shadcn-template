"use server";

import { auth } from "@/auth";
import { VerifyEmail } from "@/components/email-templates/verify-email";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";

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
