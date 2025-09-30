"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { profileSchema } from "@/schemas/profile-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  if (!session || !session.user || !session.user.email)
    redirect("/auth/sign-in");

  const authenticatedUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!authenticatedUser) redirect("/auth/sign-in");

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

  const id = formData.get("userID");
  if (!id || typeof id !== "string") {
    return { type: "error", message: "Invalid user ID." };
  }

  const { name, email, image } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) return { type: "error", message: "User not found." };

  if (image && !image.includes("uploads") && !image.includes("default")) {
    const base64Data = image.split(",")[1];

    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${user.email.replace(/[@.]/g, "_")}_pfp_${Date.now()}.jpg`;
    const compressedImageBuffer = await sharp(buffer)
      .resize(800) // Resize the image
      .jpeg({ quality: 80 }) // Compress as JPEG with 80% quality
      .toBuffer();
    await prisma.user.update({
      where: { id },
      data: { image: fileName }
    });
    Bun.write(`./public/uploads/${fileName}`, compressedImageBuffer);
  }

  try {
    await prisma.user.update({
      where: { id },
      data: { name, email }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return { type: "error", message: "Update failed" };
  }

  revalidatePath("/dash/admin/user");
  return { type: "success", message: "Changes saved!" };
}
