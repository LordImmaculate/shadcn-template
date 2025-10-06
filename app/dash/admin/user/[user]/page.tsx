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
import RoleSelector from "./role-selector";
import { checkAuthAdmin } from "@/lib/check-auth";
import { deleteUser } from "../../../../../actions/edit-profile";

export default async function Dash({
  params
}: {
  params: Promise<{ user: string }>;
}) {
  const session = await auth();
  if (!checkAuthAdmin(session)) redirect("/dash");

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
        pfpURLServer={user.image || "/default.jpg"}
      />
      {userID === session?.user?.id ? null : (
        <div className="flex flex-row justify-end gap-2 mt-4">
          <div className="flex flex-row gap-2 items-center">
            <label htmlFor="role">Role:</label>
            <RoleSelector user={user} />
          </div>
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
                  <AlertDialogAction type="submit" asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
