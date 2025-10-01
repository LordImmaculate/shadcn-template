import { redirect } from "next/navigation";
import Form from "./form";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { changeUserRole } from "./actions";
import RoleSelector from "./role-selector";

async function deleteUser(userId: string) {
  "use server";

  // Security: Verify authentication and authorization
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No active session");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Security: Prevent self-deletion
  if (userId === session.user.id) {
    throw new Error("Cannot delete your own account");
  }

  // Security: Verify target user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!targetUser) {
    throw new Error("User not found");
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

  redirect("/dash/admin/user?success=1&text=User%20deleted%20successfully");
}

export default async function Dash({
  params
}: {
  params: Promise<{ user: string }>;
}) {
  const session = await auth();

  const userCheck = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  if (!session || !userCheck || userCheck.role !== "ADMIN") {
    redirect("/dash");
  }

  const { user: userID } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userID }
  });

  if (!user) {
    return <div className="p-4">User not found</div>;
  }

  // This page is just to get the data of the user and then pass it to the client component, so the loading is way smoother.
  return (
    <>
      <Form
        userID={userID}
        name={user.name || ""}
        email={user.email || ""}
        pfpURLServer={user.image ? `/uploads/${user.image}` : "/default.jpg"}
      />
      {userID === session?.user?.id ? null : (
        <div className="flex flex-row justify-end gap-2 mt-4">
          <RoleSelector user={user} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this account and remove their data from the servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteUser.bind(null, userID)}>
                  <AlertDialogAction type="submit">Continue</AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
