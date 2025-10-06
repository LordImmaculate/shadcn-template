import { auth } from "@/auth";
import Form from "./form";
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
import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export default async function Dash() {
  const session = await auth();

  async function deleteAccount() {
    "use server";
    const session = await auth();
    if (!session?.user?.id) {
      console.error("Unauthorized: No active session");
      redirect("/dash/account?success=0&text=Unauthorized");
    }

    try {
      await prisma.user.delete({
        where: { id: session.user.id }
      });
      redirect("/");
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        return;
      }
      console.error("Error deleting account:", error);
      redirect("/dash/account/?success=0&text=Failed%20to%20delete%20account");
    }

    // Redirect to homepage after account deletion
  }

  // This page is just to get the data of the user and then pass it to the client component, so the loading is way smoother.
  return (
    <>
      <Form
        userID={session?.user?.id || ""}
        name={session?.user?.name || ""}
        email={session?.user?.email || ""}
        pfpURLServer={session?.user?.image || "/default.jpg"}
      />
      <div className="flex flex-row justify-end gap-2 mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action={deleteAccount}>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
