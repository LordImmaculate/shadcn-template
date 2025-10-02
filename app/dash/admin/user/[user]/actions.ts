"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { profileSchema } from "@/schemas/profile-schema";
import { Role } from "@prisma/client";
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

export async function changeUserRole(id: string, role: Role) {
  const session = await auth();

  if (!session || !session.user || !session.user.email)
    redirect("/auth/sign-in");

  if (id === session.user.id) {
    return { type: "error", message: "You cannot change your own role." };
  }

  const authenticatedUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!authenticatedUser || authenticatedUser.role !== "ADMIN")
    redirect("/dash");

  try {
    await prisma.user.update({
      where: { id },
      data: { role }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return { type: "error", message: "Role update failed" };
  }

  revalidatePath("/dash/admin/user");
  return { type: "success", message: "Role updated successfully!" };
}

export async function deleteUser(userId: string) {
  "use server";

  // Security: Verify authentication and authorization
  const session = await auth();
  if (!session?.user?.id) {
    console.log("Error: No active session");
    redirect(`/dash/admin/user/${userId}?success=0&text=Unauthorized`);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    console.log("Error: Unauthorized deletion attempt");
    redirect(`/dash/admin/user/${userId}?success=0&text=Unauthorized`);
  }

  // Security: Prevent self-deletion
  if (userId === session.user.id) {
    console.log("Error: Admin attempted to delete their own account");
    redirect(
      `/dash/admin/user/${userId}?success=0&text=You%20cannot%20delete%20your%20own%20account`
    );
  }

  // Security: Verify target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!targetUser) {
    console.error("Error: User not found");
    redirect(`/dash/admin/user/${userId}?success=0&text=User%20not%20found`);
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    redirect(
      `/dash/admin/user/${userId}?success=0&text=Failed%20to%20delete%20user`
    );
  }

  redirect("/dash/admin/user?success=1&text=User%20deleted%20successfully!");
}
